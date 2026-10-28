import type { Catalogue, CatalogueRef, Product } from '../types';
import catalogueData from '../catalog/catalogues.json';

// The catalogues shown on the site (the website does not use a database).
const CATALOGUES = catalogueData as Omit<Catalogue, 'category' | 'color'>[] as Catalogue[];
const activeCatalogues = () => CATALOGUES.filter(c => c.is_active).sort((a, b) => a.display_order - b.display_order);
const toRef = ({ id, title, pdf_url }: Catalogue): CatalogueRef => ({ id, title, pdf_url });

export async function getCatalogueById(id: string): Promise<CatalogueRef | null> {
    const catalogue = CATALOGUES.find(c => c.id === id);
    return catalogue ? toRef(catalogue) : null;
}

export async function getCatalogueByTitle(title: string): Promise<CatalogueRef | null> {
    const matches = activeCatalogues().filter(c => c.title.toLowerCase() === title.toLowerCase());
    return matches.length === 1 ? toRef(matches[0]) : null;
}

// A chapter catalogue holds the SKUs whose first two digits are its chapter (12-… is Dressing).
export async function getCatalogueForProduct(product: Product): Promise<CatalogueRef | null> {
    const chapter = product.sku.split('-')[0];
    const catalogue = activeCatalogues().find(c => c.chapter === chapter);
    return catalogue ? toRef(catalogue) : null;
}

export async function getCatalogues(): Promise<Catalogue[]> {
    return activeCatalogues();
}

export async function getCatalogueCategories(): Promise<string[]> {
    const uniqueCategories = new Set<string>();
    activeCatalogues().forEach(c => {
        if (c.category) uniqueCategories.add(c.category);
    });

    return ['All', ...Array.from(uniqueCategories).sort()];
}
