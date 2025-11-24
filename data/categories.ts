import { Scissors, Activity, HeartPulse, Brain, Bone, Stethoscope, Syringe, Microscope } from 'lucide-react';

export interface Category {
    id: string;
    name: string;
    description: string;
    image: string;
    icon: any;
}

export interface Subcategory {
    id: string;
    categoryId: string;
    name: string;
    description?: string;
    image?: string; // Optional, can fallback to category image or placeholder
}

export const CATEGORIES_DATA: Category[] = [
    {
        id: 'general-surgery',
        name: 'General Surgery',
        description: 'Standard instruments for general surgical procedures.',
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
        icon: Scissors
    },
    {
        id: 'dental',
        name: 'Dental Instruments',
        description: 'Precision tools for dental and orthodontic procedures.',
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
        icon: Activity
    },
    {
        id: 'cardiovascular',
        name: 'Cardiovascular',
        description: 'Specialized instruments for heart and vascular surgery.',
        image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=800',
        icon: HeartPulse
    },
    {
        id: 'neuro-spine',
        name: 'Neuro & Spine',
        description: 'Microsurgical instruments for neurosurgery and spine.',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
        icon: Brain
    },
    {
        id: 'orthopedic',
        name: 'Orthopedic',
        description: 'Heavy-duty instruments for bone and joint surgery.',
        image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800',
        icon: Bone
    },
    {
        id: 'ent',
        name: 'ENT & Diagnostics',
        description: 'Instruments for Ear, Nose, and Throat specialists.',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0929519?auto=format&fit=crop&q=80&w=800',
        icon: Stethoscope
    },
    {
        id: 'plastic-surgery',
        name: 'Plastic Surgery',
        description: 'Fine instruments for reconstructive and aesthetic surgery.',
        image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=800',
        icon: Syringe
    },
    {
        id: 'ophthalmic',
        name: 'Ophthalmic',
        description: 'Delicate tools for eye surgery and procedures.',
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
        icon: Microscope
    }
];

// Helper to get subcategories (mocked for now, but would ideally come from a real DB or comprehensive list)
export const getSubcategories = (categoryId: string): Subcategory[] => {
    const baseImage = CATEGORIES_DATA.find(c => c.id === categoryId)?.image || '';

    switch (categoryId) {
        case 'general-surgery':
            return [
                { id: 'scissors', categoryId, name: 'Scissors', image: baseImage },
                { id: 'forceps', categoryId, name: 'Forceps', image: baseImage },
                { id: 'retractors', categoryId, name: 'Retractors', image: baseImage },
                { id: 'needle-holders', categoryId, name: 'Needle Holders', image: baseImage },
                { id: 'scalpel-handles', categoryId, name: 'Scalpel Handles', image: baseImage },
                { id: 'hemostats', categoryId, name: 'Hemostats', image: baseImage },
            ];
        case 'dental':
            return [
                { id: 'diagnostic', categoryId, name: 'Diagnostic', image: baseImage },
                { id: 'extraction', categoryId, name: 'Extraction', image: baseImage },
                { id: 'periodontal', categoryId, name: 'Periodontal', image: baseImage },
                { id: 'restorative', categoryId, name: 'Restorative', image: baseImage },
            ];
        case 'cardiovascular':
            return [
                { id: 'vascular-clamps', categoryId, name: 'Vascular Clamps', image: baseImage },
                { id: 'rib-spreaders', categoryId, name: 'Rib Spreaders', image: baseImage },
                { id: 'thoracic-scissors', categoryId, name: 'Thoracic Scissors', image: baseImage },
                { id: 'needle-holders', categoryId, name: 'Needle Holders', image: baseImage },
            ];
        case 'neuro-spine':
            return [
                { id: 'rongeurs', categoryId, name: 'Rongeurs', image: baseImage },
                { id: 'kerrison-punches', categoryId, name: 'Kerrison Punches', image: baseImage },
                { id: 'micro-scissors', categoryId, name: 'Micro Scissors', image: baseImage },
                { id: 'dissectors', categoryId, name: 'Dissectors', image: baseImage },
            ];
        case 'orthopedic':
            return [
                { id: 'bone-cutters', categoryId, name: 'Bone Cutters', image: baseImage },
                { id: 'mallets', categoryId, name: 'Mallets', image: baseImage },
                { id: 'osteotomes', categoryId, name: 'Osteotomes', image: baseImage },
                { id: 'wire-cutters', categoryId, name: 'Wire Cutters', image: baseImage },
            ];
        default:
            return [];
    }
};
