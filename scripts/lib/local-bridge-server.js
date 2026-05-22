import http from 'node:http';
import handler from '../../api/rfq-bridge.js';

function createRequestAdapter(nodeReq, bodyBuffer) {
  const headers = { ...nodeReq.headers };

  return {
    method: nodeReq.method,
    headers,
    socket: { remoteAddress: nodeReq.socket.remoteAddress },
    body: bodyBuffer.length ? JSON.parse(bodyBuffer.toString('utf8')) : undefined,
    async *[Symbol.asyncIterator]() {
      if (bodyBuffer.length) {
        yield bodyBuffer;
      }
    },
  };
}

function createResponseAdapter(nodeRes) {
  const adapter = {
    statusCode: 200,
    setHeader(name, value) {
      nodeRes.setHeader(name, value);
    },
    status(code) {
      adapter.statusCode = code;
      return adapter;
    },
    json(body) {
      adapter.statusCode = adapter.statusCode || 200;
      nodeRes.statusCode = adapter.statusCode;
      nodeRes.setHeader('Content-Type', 'application/json');
      nodeRes.end(JSON.stringify(body));
    },
    end(body) {
      nodeRes.statusCode = adapter.statusCode || 200;
      nodeRes.end(body);
    },
  };

  return adapter;
}

export function startLocalBridgeServer(port = 3000) {
  const server = http.createServer(async (nodeReq, nodeRes) => {
    const chunks = [];

    nodeReq.on('data', (chunk) => chunks.push(chunk));
    nodeReq.on('end', async () => {
      const bodyBuffer = Buffer.concat(chunks);
      const req = createRequestAdapter(nodeReq, bodyBuffer);
      const res = createResponseAdapter(nodeRes);

      try {
        await handler(req, res);
      } catch (error) {
        console.error('[local-bridge-server] handler error:', error instanceof Error ? error.message : error);
        if (!nodeRes.headersSent) {
          nodeRes.statusCode = 500;
          nodeRes.setHeader('Content-Type', 'application/json');
          nodeRes.end(JSON.stringify({ ok: false, success: false, message: 'Internal server error.' }));
        }
      }
    });
  });

  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(port, '127.0.0.1', () => {
      resolve({
        port,
        url: `http://127.0.0.1:${port}`,
        close: () =>
          new Promise((closeResolve, closeReject) => {
            server.close((error) => (error ? closeReject(error) : closeResolve()));
          }),
      });
    });
  });
}
