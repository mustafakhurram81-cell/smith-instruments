import { supabase } from '../supabase';
import type { Catalogue, CatalogueRef, Product } from '../types';

export async function getCatalogueById(id: string): Promise<CatalogueRef | null> {
    const { data, error } = await supabase
        .from('catalogues')
        .select('id, title, pdf_url')
        .eq('id', id)
        .single();

    if (error) return null;
    return data;
}

export async function getCatalogueByTitle(title: string): Promise<CatalogueRef | null> {
    const { data, error } = await supabase
        .from('catalogues')
        .select('id, title, pdf_url')
        .ilike('title', title)
        .eq('is_active', true)
        .single();

    if (error) return null;
    return data;
}

const SKU_PREFIX_TO_CATALOGUE: Record<string, string> = {
    '01': 'Scalpels',                                 // 01-100-01 to 01-208-00
    '02': 'Scissors',                                 // 02-100-12 to 02-606-16
    '03': 'Dissecting & Tissue Forceps',              // 03-100-10 to 03-562-03
    '04': 'Artery Forceps',                           // 04-100-02 to 04-828-18
    '05': 'Cotton Swab Forceps',                      // 05-100-22 to 05-156-26
    '06': 'Retractors',                               // 06-100-12 to 06-700-01
    '07': 'Probes',                                   // 07-100-13 to 07-186-90
    '08': 'Diagnostics',                              // 08-100-18 to 08-275-40
    '09': 'Trocars, Suction Tubes & Cannulas',        // 09-100-18 to 09-310-01
    '10': 'Anaesthesia',                              // 10-100-01 to 10-170-25
    '11': 'Suture',                                   // 11-100-01 to 11-646-14
    '12': 'Bone Surgery',                             // 12-100-24 to 12-216-26
    '13': 'Bone Surgery',                             // 13-100-24 to 13-992-04
    '14': 'Cardiovascular Surgery',                   // 14-100-23 to 14-546-04
    '15': 'Neurosurgery & Laminectomy',               // 15-100-30 to 15-702-16
    '16': 'Tracheotomy',                              // 16-100-14 to 16-150-10
    '17': 'Dermatology',                              // 17-100-01 to 17-160-23
    '18': 'Stomach, Intestines & Rectum',             // 18-100-12 to 18-360-38
    '19': 'Liver, Gall Bladder, Kidney & Urology',   // 19-100-01 to 19-216-12
    '20': 'Gynecology',                               // 20-100-01 to 20-548-28
    '21': 'Obstetrics',                               // 21-100-35 to 21-266-08
    '23': 'Otology',                                  // 23-100-01 to 23-568-92
    '24': 'Rhinology',                                // 24-100-14 to 24-424-03
    '25': 'Oral Maxillo-Facial Surgery',              // 25-100-17 to 25-480-08
    '26': 'Tonsillectomy & Laryngo-Bronchoscopy',     // 26-100-18 to 26-310-12
    '27': 'Cranio-Maxillo-Facial Surgery',            // 27-100-16 to 27-302-17
    '28': 'Holloware',                                // 28-100-22 to 28-422-15
    '29': 'Dissecting Kits',                          // 29-100-09 to 29-141-15
};

export async function getCatalogueForProduct(product: Product): Promise<CatalogueRef | null> {
    const prefix = product.sku.split('-')[0];
    const catalogueTitle = SKU_PREFIX_TO_CATALOGUE[prefix];

    if (catalogueTitle) {
        return getCatalogueByTitle(catalogueTitle);
    }

    return null;
}

export async function getCatalogues(): Promise<Catalogue[]> {
    const { data, error } = await supabase
        .from('catalogues')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching catalogues:', error);
        return [];
    }

    return data || [];
}

export async function getAllCatalogues(): Promise<Catalogue[]> {
    const { data, error } = await supabase
        .from('catalogues')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching all catalogues:', error);
        return [];
    }

    return data || [];
}

export async function getCatalogueCategories(): Promise<string[]> {
    const { data, error } = await supabase
        .from('catalogues')
        .select('category')
        .eq('is_active', true);

    if (error) {
        if (import.meta.env.DEV) console.error('Error fetching catalogue categories:', error);
        return [];
    }

    const uniqueCategories = new Set<string>();
    data?.forEach(c => {
        if (c.category) uniqueCategories.add(c.category);
    });

    return ['All', ...Array.from(uniqueCategories).sort()];
}

export async function createCatalogue(catalogue: Omit<Catalogue, 'id' | 'created_at'>): Promise<Catalogue | null> {
    const { data, error } = await supabase
        .from('catalogues')
        .insert(catalogue)
        .select()
        .single();

    if (error) {
        if (import.meta.env.DEV) console.error('Error creating catalogue:', error);
        return null;
    }

    return data;
}

export async function updateCatalogue(id: string, updates: Partial<Catalogue>): Promise<Catalogue | null> {
    const { data, error } = await supabase
        .from('catalogues')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        if (import.meta.env.DEV) console.error('Error updating catalogue:', error);
        return null;
    }

    return data;
}

export async function deleteCatalogue(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('catalogues')
        .delete()
        .eq('id', id);

    if (error) {
        if (import.meta.env.DEV) console.error('Error deleting catalogue:', error);
        return false;
    }

    return true;
}
