// Old category URLs (/products/General%20Surgery/Scissors, /products/instruments/..., /products/specialty/...)
// mapped to the closest page in the new catalog.
const TYPE_BY_OLD: Record<string, string> = {
  'scissors': 'scissors', 'needle holders': 'needle-holders', 'hemostatic forceps': 'haemostats-clamps',
  'tissue forceps': 'tissue-forceps', 'sponge forceps': 'tissue-forceps', 'general retractors': 'retractors', 'retractors': 'retractors',
  'scalpels & handles': 'scalpels-knives', 'probes & sounds': 'probes-dilators', 'trocars & cannulas': 'trocars-cannulas',
  'bone cutting instruments': 'rongeurs-bone-cutters', 'bone cutting': 'rongeurs-bone-cutters', 'holloware & basins': 'sterilisation-holloware',
  'dissecting kits': 'sterilisation-holloware', 'diagnostic instruments': 'diagnostics', 'cutting instruments': 'scissors',
  'forceps & clamps': 'haemostats-clamps', 'suturing & wound care': 'needle-holders', 'access instruments': 'trocars-cannulas',
  'accessories & diagnostics': 'diagnostics', 'anaesthesia': 'diagnostics',
};
const SPECIALTY_BY_OLD: Record<string, string> = {
  'general surgery': 'general-surgery', 'neurosurgery': 'neurosurgery-spine', 'orthopedics': 'orthopaedics', 'orthopedic surgery': 'orthopaedics',
  'ent': 'ent', 'ent surgery': 'ent', 'otology (ear)': 'ent', 'rhinology (nose)': 'ent', 'laryngoscopy & tonsillectomy': 'ent', 'tracheotomy': 'ent',
  'gynecology': 'ob-gyn', 'gynecology & obstetrics': 'ob-gyn', 'obstetrics': 'ob-gyn', 'cardiovascular': 'cardiovascular',
  'cardiovascular surgery': 'cardiovascular', 'urology': 'urology', 'urology & hepatobiliary': 'urology', 'hepatobiliary & urology': 'urology',
  'oral & maxillofacial': 'oral-maxillofacial', 'oral & maxillofacial surgery': 'oral-maxillofacial', 'gi & abdominal': 'gi-abdominal',
  'gi & abdominal surgery': 'gi-abdominal', 'craniofacial': 'plastic', 'plastic surgery': 'plastic', 'dermatology': 'dermatology',
  'ophthalmology': 'ophthalmology', 'diagnostics': 'anaesthesia', 'accessories': 'sterilisation', 'accessories & equipment': 'sterilisation',
};

export function legacyTarget(segments: string[]) {
  const parts = segments.map(s => { try { return decodeURIComponent(s).toLowerCase(); } catch { return s.toLowerCase(); } });
  const last = parts[parts.length - 1] ?? '';
  if (/^\d{2}-\d{3}(-\w+)?$/.test(last)) return `/product/${last.toUpperCase()}`;
  const named = parts.filter(p => !['products', 'instruments', 'specialty', 'browse'].includes(p));
  for (const name of [...named].reverse()) {
    if (TYPE_BY_OLD[name]) return `/products/type/${TYPE_BY_OLD[name]}`;
    if (SPECIALTY_BY_OLD[name]) return `/products/specialty/${SPECIALTY_BY_OLD[name]}`;
  }
  return '/products';
}
