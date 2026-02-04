import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jnvdysssdnttlybycefh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpudmR5c3NzZG50dGx5YnljZWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzM1ODIsImV4cCI6MjA4MDUwOTU4Mn0.00l-_l1F49LpbUIvxQwIvuRSutFj7rZ14ygX2fKMB_w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
    const { data, error } = await supabase
        .from('catalogues')
        .select('id, title, pdf_url')
        .order('title');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('CATALOGUES:\n');
    data?.forEach((c, i) => {
        console.log(`${i + 1}. ${c.title}`);
        console.log(`   ID: ${c.id}`);
        console.log(`   PDF: ${c.pdf_url}\n`);
    });
}

main();
