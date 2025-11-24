export interface Product {
    id: string;
    sku: string;
    name: string;
    category: string;
    subcategory: string;
    description: string;
    specifications: {
        material: string;
        finish: string;
        length?: string;
        type?: string;
    };
    imageUrl: string;
}

export const PRODUCTS_DATA: Product[] = [
    // --- GENERAL SURGERY ---
    {
        id: 'gs-001',
        sku: 'SI-100-01',
        name: 'Mayo Surgical Scissors Straight',
        category: 'general-surgery',
        subcategory: 'scissors',
        description: 'Standard dissecting scissors with beveled blades, used for cutting fascia and sutures.',
        specifications: { material: 'German Stainless Steel', finish: 'Satin', length: '14cm', type: 'Straight' },
        imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'gs-002',
        sku: 'SI-100-02',
        name: 'Mayo Surgical Scissors Curved',
        category: 'general-surgery',
        subcategory: 'scissors',
        description: 'Curved blades allow for deeper tissue dissection with minimal trauma.',
        specifications: { material: 'German Stainless Steel', finish: 'Satin', length: '14cm', type: 'Curved' },
        imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'gs-003',
        sku: 'SI-100-05',
        name: 'Metzenbaum Scissors',
        category: 'general-surgery',
        subcategory: 'scissors',
        description: 'Fine surgical scissors designed for cutting delicate tissue and blunt dissection.',
        specifications: { material: 'German Stainless Steel', finish: 'Satin', length: '18cm', type: 'Curved' },
        imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'gs-004',
        sku: 'SI-101-10',
        name: 'Adson Tissue Forceps',
        category: 'general-surgery',
        subcategory: 'forceps',
        description: 'Thumb forceps used for holding and manipulating delicate tissues.',
        specifications: { material: 'German Stainless Steel', finish: 'Satin', length: '12cm', type: '1x2 Teeth' },
        imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'gs-005',
        sku: 'SI-101-15',
        name: 'DeBakey Atraumatic Forceps',
        category: 'general-surgery',
        subcategory: 'forceps',
        description: 'Versatile thumb forceps used in numerous surgical procedures to grasp tissue.',
        specifications: { material: 'German Stainless Steel', finish: 'Satin', length: '20cm', type: 'Atraumatic' },
        imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'gs-006',
        sku: 'SI-102-01',
        name: 'Halsted Mosquito Forceps',
        category: 'general-surgery',
        subcategory: 'hemostats',
        description: 'Small hemostatic forceps used to control bleeding in small blood vessels.',
        specifications: { material: 'German Stainless Steel', finish: 'Mirror', length: '12.5cm', type: 'Straight' },
        imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600'
    },

    // --- DENTAL ---
    {
        id: 'dn-001',
        sku: 'SI-200-01',
        name: 'Dental Mirror Handle with Mirror',
        category: 'dental',
        subcategory: 'diagnostic',
        description: 'Ergonomic handle with high-definition mirror for oral examination.',
        specifications: { material: 'Stainless Steel', finish: 'Mirror', length: 'Standard', type: 'No. 4' },
        imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'dn-002',
        sku: 'SI-200-05',
        name: 'Dental Explorer Probe',
        category: 'dental',
        subcategory: 'diagnostic',
        description: 'Double-ended explorer for detecting cavities and calculus.',
        specifications: { material: 'Stainless Steel', finish: 'Satin', length: 'Standard', type: 'Double Ended' },
        imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'dn-003',
        sku: 'SI-201-10',
        name: 'Extracting Forceps Upper Molars',
        category: 'dental',
        subcategory: 'extraction',
        description: 'Designed for the extraction of upper molars (right).',
        specifications: { material: 'German Stainless Steel', finish: 'Satin', length: 'Standard', type: 'Fig. 17' },
        imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'dn-004',
        sku: 'SI-202-01',
        name: 'Gracey Curette 1/2',
        category: 'dental',
        subcategory: 'periodontal',
        description: 'Site-specific curette for scaling and root planing of anterior teeth.',
        specifications: { material: 'High Carbon Steel', finish: 'Satin', length: 'Standard', type: '1/2' },
        imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600'
    },

    // --- CARDIOVASCULAR ---
    {
        id: 'cv-001',
        sku: 'SI-300-01',
        name: 'Castroviejo Needle Holder',
        category: 'cardiovascular',
        subcategory: 'needle-holders',
        description: 'Microsurgical needle holder with locking mechanism for fine suturing.',
        specifications: { material: 'Titanium', finish: 'Blue Anodized', length: '14cm', type: 'Straight' },
        imageUrl: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'cv-002',
        sku: 'SI-300-10',
        name: 'Potts-Smith Scissors',
        category: 'cardiovascular',
        subcategory: 'scissors',
        description: 'Angled scissors for vascular incision and extension.',
        specifications: { material: 'German Stainless Steel', finish: 'Satin', length: '19cm', type: '45 Degree' },
        imageUrl: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'cv-003',
        sku: 'SI-301-05',
        name: 'Satinsky Vena Cava Clamp',
        category: 'cardiovascular',
        subcategory: 'clamps',
        description: 'Partial occlusion clamp for vascular surgery.',
        specifications: { material: 'German Stainless Steel', finish: 'Satin', length: '26cm', type: 'Fig. 1' },
        imageUrl: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=600'
    },

    // --- ORTHOPEDIC ---
    {
        id: 'or-001',
        sku: 'SI-400-01',
        name: 'Liston Bone Cutting Forceps',
        category: 'orthopedic',
        subcategory: 'cutters',
        description: 'Heavy duty forceps for cutting bone.',
        specifications: { material: 'German Stainless Steel', finish: 'Satin', length: '20cm', type: 'Straight' },
        imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'or-002',
        sku: 'SI-400-10',
        name: 'Lambotte Osteotome',
        category: 'orthopedic',
        subcategory: 'osteotomes',
        description: 'Flat osteotome for bone cutting and shaping.',
        specifications: { material: 'German Stainless Steel', finish: 'Satin', length: '24cm', type: '10mm' },
        imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=600'
    },
    {
        id: 'or-003',
        sku: 'SI-401-05',
        name: 'Wire Cutter TC',
        category: 'orthopedic',
        subcategory: 'cutters',
        description: 'Tungsten Carbide insert wire cutter for K-wires and pins.',
        specifications: { material: 'TC / Stainless', finish: 'Satin', length: '18cm', type: 'Double Action' },
        imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=600'
    },
];

export const getProductsBySubcategory = (categoryId: string, subcategoryId: string) => {
    return PRODUCTS_DATA.filter(p => p.category === categoryId && p.subcategory === subcategoryId);
};

export const getProductById = (productId: string) => {
    return PRODUCTS_DATA.find(p => p.id === productId);
};

export const CATEGORIES = [
    {
        name: 'General Surgery',
        subcategories: ['Scissors', 'Forceps', 'Hemostats', 'Retractors', 'Needle Holders']
    },
    {
        name: 'Dental',
        subcategories: ['Diagnostic', 'Extraction', 'Periodontal', 'Restorative', 'Orthodontic']
    },
    {
        name: 'Cardiovascular',
        subcategories: ['Scissors', 'Needle Holders', 'Clamps', 'Rib Spreaders', 'Forceps']
    },
    {
        name: 'Orthopedic',
        subcategories: ['Cutters', 'Osteotomes', 'Mallets', 'Retractors', 'Elevators']
    },
    {
        name: 'Neuro & Spine',
        subcategories: ['Rongeurs', 'Punches', 'Dissectors', 'Hooks', 'Micro Scissors']
    },
    {
        name: 'ENT',
        subcategories: ['Otology', 'Rhinology', 'Tonsil', 'Laryngeal', 'Sinus']
    },
];
