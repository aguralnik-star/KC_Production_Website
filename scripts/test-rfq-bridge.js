const DEFAULT_URL = 'http://localhost:3000/api/rfq-bridge';

const samplePayload = {
  companyName: 'Test Manufacturing Inc',
  contactName: 'John Smith',
  email: 'john.smith@example.com',
  phone: '555-555-1212',
  projectType: 'CNC Machining',
  material: '6061 Aluminum',
  quantity: 100,
  deadline: '2026-06-15',
  message: 'RFQ Bridge Validation Test',
  sourcePage: '/rfq',
};

async function main() {
  const targetUrl = process.env.RFQ_BRIDGE_TEST_URL || DEFAULT_URL;

  console.log(`Testing RFQ bridge at ${targetUrl}`);

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(samplePayload),
    });

    const bodyText = await response.text();
    let body;

    try {
      body = JSON.parse(bodyText);
    } catch {
      body = { raw: bodyText };
    }

    if (response.ok) {
      console.log('SUCCESS');
      console.log(JSON.stringify(body, null, 2));
      process.exit(0);
    }

    console.error('FAILURE');
    console.error(`Status: ${response.status}`);
    console.error(JSON.stringify(body, null, 2));
    process.exit(1);
  } catch (error) {
    console.error('FAILURE');
    console.error(error instanceof Error ? error.message : error);
    console.error('');
    console.error('Tip: run `npx vercel dev` locally, or set RFQ_BRIDGE_TEST_URL to a deployed endpoint.');
    process.exit(1);
  }
}

main();
