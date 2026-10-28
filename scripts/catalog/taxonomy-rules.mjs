// Website taxonomy: every instrument family gets one instrument type and one or more specialties.
// Families are SKU prefixes (NN-NNN); the first two digits are the catalogue chapter.

export const TYPES = {
  'scissors':               { en: 'Scissors',                        es: 'Tijeras' },
  'needle-holders':         { en: 'Needle holders',                  es: 'Portaagujas' },
  'haemostats-clamps':      { en: 'Haemostatic forceps & clamps',    es: 'Pinzas hemostáticas y clamps' },
  'tissue-forceps':         { en: 'Tissue & dressing forceps',       es: 'Pinzas de tejido y disección' },
  'specialty-forceps':      { en: 'Grasping & biopsy forceps',       es: 'Pinzas de agarre y biopsia' },
  'retractors':             { en: 'Retractors & hooks',              es: 'Separadores y ganchos' },
  'specula':                { en: 'Specula',                         es: 'Espéculos' },
  'scalpels-knives':        { en: 'Scalpels & knives',               es: 'Bisturíes y cuchillos' },
  'elevators-dissectors':   { en: 'Elevators & dissectors',          es: 'Elevadores y disectores' },
  'curettes':               { en: 'Curettes',                        es: 'Curetas' },
  'rongeurs-bone-cutters':  { en: 'Rongeurs & bone cutters',         es: 'Gubias y cizallas óseas' },
  'osteotomes-chisels':     { en: 'Osteotomes, chisels & gouges',    es: 'Osteótomos, cinceles y escoplos' },
  'mallets':                { en: 'Mallets',                         es: 'Martillos' },
  'saws-rasps':             { en: 'Saws, rasps & files',             es: 'Sierras, raspas y limas' },
  'drills-plaster':       { en: 'Orthopaedic wire, drill & plaster tools', es: 'Instrumental ortopédico de alambres, taladro y yeso' },
  'suction':                { en: 'Suction tubes',                   es: 'Cánulas de aspiración' },
  'trocars-cannulas':       { en: 'Trocars, cannulas & needles',     es: 'Trócares, cánulas y agujas' },
  'probes-dilators':        { en: 'Probes, dilators & sounds',       es: 'Sondas, dilatadores y estiletes' },
  'diagnostics':            { en: 'Diagnostics & laryngoscopes',     es: 'Diagnóstico y laringoscopios' },
  'clips-applicators':      { en: 'Clips & applicators',             es: 'Clips y aplicadores' },
  'sterilisation-holloware':{ en: 'Sterilisation & holloware',       es: 'Esterilización y recipientes' },
  'other':                  { en: 'Other instruments',               es: 'Otros instrumentos' },
};

export const SPECIALTIES = {
  'general-surgery':    { en: 'General surgery',              es: 'Cirugía general' },
  'neurosurgery-spine': { en: 'Neurosurgery & spine',         es: 'Neurocirugía y columna' },
  'orthopaedics':       { en: 'Orthopaedics & trauma',        es: 'Ortopedia y traumatología' },
  'ent':                { en: 'ENT',                          es: 'Otorrinolaringología' },
  'ob-gyn':             { en: 'Obstetrics & gynaecology',     es: 'Ginecología y obstetricia' },
  'cardiovascular':     { en: 'Cardiovascular & thoracic',    es: 'Cardiovascular y torácica' },
  'urology':            { en: 'Urology',                      es: 'Urología' },
  'oral-maxillofacial': { en: 'Oral & maxillofacial',         es: 'Cirugía oral y maxilofacial' },
  'dental':             { en: 'Dental',                       es: 'Odontología' },
  'gi-abdominal':       { en: 'GI & abdominal',               es: 'Cirugía digestiva y abdominal' },
  'plastic':            { en: 'Plastic & reconstructive',     es: 'Cirugía plástica y reconstructiva' },
  'dermatology':        { en: 'Dermatology',                  es: 'Dermatología' },
  'ophthalmology':      { en: 'Ophthalmology',                es: 'Oftalmología' },
  'anaesthesia':        { en: 'Anaesthesia & diagnostics',    es: 'Anestesia y diagnóstico' },
  'sterilisation':      { en: 'Sterilisation & theatre',      es: 'Esterilización y quirófano' },
};

// Primary specialty by catalogue chapter (first two SKU digits).
export const CHAPTER_SPECIALTY = {
  '01': 'general-surgery', '02': 'general-surgery', '03': 'general-surgery', '04': 'general-surgery',
  '05': 'general-surgery', '06': 'general-surgery', '07': 'general-surgery', '09': 'general-surgery',
  '11': 'general-surgery', '08': 'anaesthesia', '10': 'anaesthesia', '12': 'orthopaedics',
  '13': 'orthopaedics', '14': 'cardiovascular', '15': 'neurosurgery-spine', '16': 'ent',
  '17': 'dermatology', '18': 'gi-abdominal', '19': 'urology', '20': 'ob-gyn', '21': 'ob-gyn',
  '22': 'ophthalmology', '23': 'ent', '24': 'ent', '25': 'oral-maxillofacial', '26': 'ent',
  '27': 'plastic', '28': 'sterilisation', '29': 'sterilisation',
};

// [pattern, type, priority]. Highest priority wins; ties go to the match nearest the end
// of the phrase (English head noun: "Bone Cutting Forceps" -> forceps, but priority lifts
// the multi-word pattern above plain "forceps").
export const TYPE_RULES = [
  [/bone[- ]holding|reduction forceps|reposition forceps|bone contouring/i, 'specialty-forceps', 9],
  [/needle[- ]holder|needle[- ]driver/i, 'needle-holders', 9],
  [/clip[- ]?(applying|applier|applicator|remov)|\bclips?\b|staple/i, 'clips-applicators', 9],
  [/\bshears?\b|bone[- ]cutting|bone[- ]cutter|rongeur|kerrison|punch|nipper|cutting forceps|pituitary/i, 'rongeurs-bone-cutters', 8],
  [/pelvimeter|depth gauge|fetoscope|caliper|goniometer|flexometer|ophthalmoscope|dermatoscope|pinwhe|diagnostic set|measuring|ruler|\blamp\b|head ?light/i, 'diagnostics', 8],
  [/distract|screw ?driver|plaster|cast\b|plier|wire cut|cutter|traction bow|extension bow|wrench|fixation disc|t handle|skull breaker|drill|burr|\bbur\b|wire (cutter|twister|tightener)|pin cutter|screwdriver|chuck|countersink|\btap\b|awl/i, 'drills-plaster', 9],
  [/laryngoscope|laryngeal mirror|mouth mirror|\bmirror\b|otoscope|tuning fork|percussion|reflex|tongue depressor|stethoscope/i, 'diagnostics', 8],
  [/speculum|speculm|speula|specula\b|sphincteroscope|specula blade|anoscope|anuscope|proctoscope/i, 'specula', 8],
  [/sterili[sz]|drum|tray|basin|bowl|kidney dish|gallipot|jar\b|container|holloware|instrument box|case\b|kit\b/i, 'sterilisation-holloware', 8],
  [/suction|aspirat/i, 'suction', 8],
  [/trocar|cannula|\bneedle\b|puncture|tracheal tube|tracheostomy tube|catheter|laryngeal tube|interchangeable tube|exchangeable tip|flushing tube|section tube|ear syringe/i, 'trocars-cannulas', 6],
  [/scissor/i, 'scissors', 6],
  [/haemosta|hemosta|artery forceps|mosquito|\bclamp|bulldog|towel/i, 'haemostats-clamps', 6],
  [/\bret\.|contractor|\bhooks\b|mobilizer|expander|mouth gag|tongue plate|cheek retract|\bblades\b|retractor|retracror|balfour|fixation device|frame\b|\bhook\b|hooklet|spreader|rib spreader|lever|hohmann|valve\b|depressor/i, 'retractors', 5],
  [/osteotome|chisel|gouge/i, 'osteotomes-chisels', 5],
  [/mallet|hammer/i, 'mallets', 5],
  [/\bsaw\b|gigli|rasp\b|raspatory|file\b/i, 'saws-rasps', 4],
  [/curette|curet\b|scoop|spoon|scraper/i, 'curettes', 5],
  [/elevator|dissector|micro hand instrument|enucleator|stripper|tendon pass|spatula|periosteal|freer|separator|raspator/i, 'elevators-dissectors', 5],
  [/scalpel|knife|knives|blade handle|\bblade\b|lancet|tenotome|keratome/i, 'scalpels-knives', 4],
  [/perforator|amniotome|meatotome|probe|dilator|\bsound\b|director|bougie|stylet/i, 'probes-dilators', 4],
  [/dressing forceps|tissue forceps|thumb forceps|dissecting forceps|micro forceps|sponge|swab|bayonet forceps|adson|splinter forceps|fixation forceps/i, 'tissue-forceps', 5],
  [/forceps?\b|grasper|holder|extractor|snare|ligator|foreign body/i, 'specialty-forceps', 2],
];

// Existing, reliable subcategories in the native catalogue override name rules.
export const SUBCATEGORY_TYPE = {
  'Scissors': 'scissors',
  'Needle Holders': 'needle-holders',
  'Hemostatic Forceps': 'haemostats-clamps',
  'Tissue Forceps': 'tissue-forceps',
  'Sponge Forceps': 'tissue-forceps',
  'Scalpels & Handles': 'scalpels-knives',
  'Probes & Sounds': 'probes-dilators',
  'Trocars & Cannulas': 'trocars-cannulas',
  'Holloware & Basins': 'sterilisation-holloware',
  'Dissecting Kits': 'sterilisation-holloware',
};

// Extra specialties, added on top of the chapter specialty.
export const EXTRA_SPECIALTY_RULES = [
  [/dental|extracting forceps|extraction forceps|molar|gingiv|periodont|alveol|luxat|root elevator|root tip/i, 'dental'],
  [/rhinopl|joseph|aufricht|converse|cottle|gillies|skin hook|plastic/i, 'plastic'],
  [/spinal|spine|lamin|vertebr|caspar|love-gruenwald|disc\b/i, 'neurosurgery-spine'],
  [/uter|vagin|cervi|obstet|hyster/i, 'ob-gyn'],
  [/vascular|aort|debakey|satinsky|cardiac|rib\b|sternal/i, 'cardiovascular'],
  [/intestin|bowel|gastro|rectal|anal\b|liver|gall/i, 'gi-abdominal'],
  [/bladder|kidney stone|urethr|prostat|ureter|stone forceps/i, 'urology'],
  [/nasal|ear\b|aural|tonsil|laryn|trache|septum|sinus/i, 'ent'],
];

// Deliberately empty: blanket-tagging basics (e.g. all scissors as plastic surgery) makes
// specialty pages noisy. Add curated family codes to taxonomy-overrides.json instead.
export const SHARED_BASICS = {};
