import type { Product } from '../types';
import { loadCatalogRows } from '../catalog';

export async function getProductsBySkus(skus: string[]): Promise<Product[]> {
    // Read from the static catalogue files (public/catalog/variants).
    const rows = await loadCatalogRows(skus);
    const bySku = new Map(rows.map(r => [r.sku, { id: r.sku, sku: r.sku, name: r.name, image_url: r.image ?? undefined } as Product]));
    return skus.map(sku => bySku.get(sku)).filter((p): p is Product => Boolean(p));
}
