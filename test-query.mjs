import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://luvzcysxlsyqnvnrjypf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1dnpjeXN4bHN5cW52bnJqeXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5NzIyMDcsImV4cCI6MjEwOTU0ODIwN30.QtxsqaP4yzHyqz_Z_YHJ9IzQElWQ4OBs23nhUR5_P_o';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testQueryComplaints() {
  console.log('Testing anon query on complaints table...');
  const { data, count, error } = await supabase
    .from('complaints')
    .select('*, wards(ward_name, ward_number)', { count: 'exact' });

  if (error) {
    console.error('Complaints query error:', error.message);
  } else {
    console.log(`Query succeeded! Returned ${data.length} complaints (total count: ${count})`);
    console.log('First complaint:', data[0]?.complaint_number, data[0]?.issue_title);
  }
}

testQueryComplaints();

