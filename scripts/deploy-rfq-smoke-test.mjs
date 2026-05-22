import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('ENV: MISSING VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const payload = {
  p_name: 'Launch Test',
  p_company: 'K&C Production Validation',
  p_email: 'launch.validation@kcdesignmfg.com',
  p_phone: null,
  p_project_type: 'CNC Machining',
  p_material: 'Aluminum',
  p_quantity: '10',
  p_timeline: '2-3 weeks',
  p_notes: 'Production deployment validation test',
};

const { data: rfqRows, error: insertError } = await supabase.rpc('submit_public_rfq', payload);
if (insertError) {
  console.log('RFQ_INSERT: FAIL', insertError.message);
  process.exit(1);
}

const rfq = Array.isArray(rfqRows) ? rfqRows[0] : rfqRows;
console.log('RFQ_INSERT: PASS');
console.log('REFERENCE:', rfq.reference_number);
console.log('RFQ_ID:', rfq.id);

const pdfContent = Buffer.from('%PDF-1.1\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF');
const filePath = `rfq/${rfq.id}/${Date.now()}-deploy-test.pdf`;
const { error: uploadError } = await supabase.storage.from('rfq-files').upload(filePath, pdfContent, {
  contentType: 'application/pdf',
  upsert: false,
});

if (uploadError) {
  console.log('FILE_UPLOAD: FAIL', uploadError.message);
  process.exit(1);
}
console.log('FILE_UPLOAD: PASS');

const { error: fileMetaError } = await supabase.rpc('submit_public_rfq_file', {
  p_rfq_request_id: rfq.id,
  p_file_name: 'deploy-test.pdf',
  p_file_path: filePath,
  p_file_type: 'application/pdf',
  p_file_size: pdfContent.length,
});

if (fileMetaError) {
  console.log('FILE_META: FAIL', fileMetaError.message);
  process.exit(1);
}
console.log('FILE_META: PASS');

const { data: notifyData, error: notifyError } = await supabase.functions.invoke('send-rfq-notification', {
  body: { rfq_request_id: rfq.id, mode: 'full_notification' },
});

if (notifyError) {
  console.log('NOTIFY: FAIL', notifyError.message);
} else {
  console.log('NOTIFY: INVOKED');
  console.log('INTERNAL_SENT:', notifyData?.internal_notification_sent ?? false);
  console.log('CUSTOMER_SENT:', notifyData?.customer_confirmation_sent ?? false);
  console.log('CUSTOMER_STATUS:', notifyData?.customer_confirmation_status ?? 'unknown');
  if (notifyData?.error) console.log('NOTIFY_ERROR:', notifyData.error);
}

const { data: lookupData, error: lookupError } = await supabase.functions.invoke('public-rfq-status-lookup', {
  body: { reference_number: rfq.reference_number, email: payload.p_email },
});

if (lookupError) {
  console.log('LOOKUP: FAIL', lookupError.message);
} else {
  console.log('LOOKUP: PASS');
  console.log('LOOKUP_FOUND:', lookupData?.found ?? false);
  console.log('LOOKUP_STATUS:', lookupData?.customer_status_label ?? lookupData?.public_status ?? 'n/a');
}
