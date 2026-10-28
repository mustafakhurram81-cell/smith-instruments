// Second level of the instrument-type taxonomy. Rules are checked in order; the first
// match wins, so put the most specific patterns first. Unmatched families fall into
// the type's `rest` bucket. Patterns were derived from descriptor words in the catalogue.

const S = (slug, en, es, re) => ({ slug, en, es, re });

export const SUBTYPES = {
  'scissors': {
    rules: [
      S('micro', 'Micro & ophthalmic scissors', 'Tijeras de microcirugía y oftalmología', /micro|vannas|castroviejo|jacobson|yasargil|\beye\b|iris|tenotomy|stevens|westcott|cornea/i),
      S('gynaecological', 'Gynaecological scissors', 'Tijeras ginecológicas', /sims|doyen|uter|hysterect|parametrium|gyn|episiotomy|umbilical|busch/i),
      S('plastic', 'Plastic & face-lift scissors', 'Tijeras de cirugía plástica', /face-?lift|gorney|kaye|joseph|rhinopl|goldman|fomon|cottle|la grange|kilner|gum|locklin/i),
      S('vascular', 'Vascular & cardiac scissors', 'Tijeras vasculares y cardíacas', /coronary|potts|vascular|debakey|dietrich|diethrich|cooley|thoracic|lung|nelson/i),
      S('ent', 'ENT scissors', 'Tijeras de otorrinolaringología', /\bear\b|nasal|tonsil|septum|heymann|laryn/i),
      S('dissecting', 'Dissecting scissors (Metzenbaum, Mayo)', 'Tijeras de disección (Metzenbaum, Mayo)', /metzenbaum|mayo|lexer|dissect|deaver|harrington|noble|sanvenero|strabismus/i),
      S('operating', 'Operating scissors', 'Tijeras de operación', /operating|surgical|standard|wagner|\bsh\/|\bbl\s?\//i),
      S('stitch-wire-bandage', 'Stitch, wire & bandage scissors', 'Tijeras de sutura, alambre y vendaje', /stitch|ligature|suture|wire|bandage|lister|plaster|dressing|spencer|littauer|nurse|universal|enterotomy|dammschere/i),
    ],
    rest: ['special', 'Special-purpose scissors', 'Tijeras de uso especial'],
  },
  'needle-holders': {
    rules: [
      S('ligature-needles', 'Ligature & aneurysm needles', 'Agujas de ligadura y aneurisma', /ligature needle|deschamps|aneurysm needle|cooper|dechamps|reverdin/i),
      S('micro', 'Micro & ophthalmic needle holders', 'Portaagujas de microcirugía y oftalmología', /micro|castroviejo|barraquer|kalt|arruga|troutman|jacobson|yasargil/i),
      S('deep', 'Deep & heavy needle holders', 'Portaagujas largos y de alta resistencia', /sternal|heaney|bozemann|wangensteen|finochietto|stratte|masson|lichtenberg|toennis|collier|debakey|cooley|ryder|jameson|sarot|vascular/i),
      S('fine', 'Fine needle holders (plastic surgery)', 'Portaagujas finos (cirugía plástica)', /gillies|kilner|converse|neivert|webster|derf|halsey|baby|delicate|fine|brown|adson/i),
      S('mathieu', 'Mathieu & ratchet-handle needle holders', 'Portaagujas Mathieu y de mango con cremallera', /mathieu|langenbeck|hospital|olsen|schoemaker/i),
    ],
    rest: ['standard', 'Standard needle holders (Mayo-Hegar, Crile-Wood)', 'Portaagujas estándar (Mayo-Hegar, Crile-Wood)'],
  },
  'haemostats-clamps': {
    rules: [
      S('bulldog', 'Bulldog clamps', 'Clamps bulldog', /bulldog/i),
      S('vascular', 'Vascular clamps', 'Clamps vasculares', /vascular|satinsky|aort|coarctation|potts|cooley|glover|beck|derra|fogarty|cardiac|atrial|pediatric|peripheral|ductus|anastomosis clamp/i),
      S('intestinal', 'Intestinal clamps', 'Clamps intestinales', /intestin|anastomosis|payr|mayo-robson|bowel|stomach|gastro|doyen|kocher intestinal|hartmann intestinal|fergusson|lane|scudder|rectal/i),
      S('towel', 'Towel clamps', 'Pinzas de campo', /towel|backhaus|jones|schaedel|lorna/i),
      S('ligature', 'Ligature & dissecting clamps', 'Pinzas de ligadura y disección', /ligature|overholt|mixter|right angle|gemini|lahey|o'shaugh|dissecting/i),
      S('organ', 'Organ, bronchus & tubing clamps', 'Clamps de órganos, bronquios y tubos', /kidney|pedicle|bronch|lung|organ|periton|mikulicz|tubing|tube|gall|cystic|uter|parametr|wertheim|heaney|phaneuf|ovar/i),
    ],
    rest: ['haemostatic', 'Haemostatic forceps (Kelly, Crile, Mosquito)', 'Pinzas hemostáticas (Kelly, Crile, Mosquito)'],
  },
  'clips-applicators': {
    rules: [
      S('aneurysm', 'Aneurysm clips', 'Clips para aneurisma', /aneurysm/i),
      S('applicators', 'Clip applicators & removers', 'Aplicadores y removedores de clips', /appl|remov|forceps|set\b/i),
    ],
    rest: ['vessel', 'Vessel & wound clips', 'Clips vasculares y de herida'],
  },
  'tissue-forceps': {
    rules: [
      S('micro', 'Micro & jeweller forceps', 'Pinzas de microcirugía y relojero', /micro|jewel|yasargil|heifetz|castroviejo|bishop|harms|dumont|colibri/i),
      S('sponge', 'Sponge & swab forceps', 'Pinzas porta torundas', /sponge|spong|swab|foerster|tampon|cotton|gross-maier|rampley/i),
      S('splinter', 'Splinter forceps', 'Pinzas para astillas', /splinter/i),
      S('dressing', 'Dressing forceps', 'Pinzas de curación', /dressing|atraumatic|anatomic|standard/i),
      S('dissecting', 'Dissecting forceps', 'Pinzas de disección', /dissect|cushing|gerald|potts-smith|mcindoe|brophy|taylor|english|ferris/i),
    ],
    rest: ['tissue', 'Tissue forceps (Adson, Semken, DeBakey)', 'Pinzas de tejido (Adson, Semken, DeBakey)'],
  },
  'specialty-forceps': {
    rules: [
      S('bone-holding', 'Bone-holding & reduction forceps', 'Pinzas de sujeción y reducción ósea', /bone holding|bone-holding|reduction|reposition|patella|contouring|lowman|verbrugge|lane bone|kern|farabeuf|fragment/i),
      S('obgyn', 'Uterine & obstetric forceps', 'Pinzas uterinas y obstétricas', /uter|tenaculum|ovum|pozzi|schroeder|obstet|simpson|kielland|naegele|piper|placenta|cervi|vagin/i),
      S('biopsy', 'Biopsy forceps', 'Pinzas de biopsia', /biopsy/i),
      S('grasping', 'Intestinal & organ grasping forceps', 'Pinzas de agarre intestinal y de órganos', /intestin|babcock|allis|duval|lung|grasp|organ|sigmoid|anastomosis|rectal|kidney|millin|capsule/i),
      S('ent', 'Ear, nose & throat forceps', 'Pinzas de otorrinolaringología', /\bear\b|nasal|ethmoid|polypus|tonsil|laryn|blakesley|septum|turbin|hartmann|jansen|lucae|wilde|takahashi|weil|tampon|adenoid|snare|foreign body|alligator/i),
      S('stone', 'Stone & gall bladder forceps', 'Pinzas para cálculos y vesícula', /stone|gall|randall|desjardin|mirizzi/i),
      S('vascular', 'Vascular forceps', 'Pinzas vasculares', /vascular|chitwood|cooley|diethrich|aort|debakey/i),
      S('tendon', 'Tendon forceps', 'Pinzas para tendones', /tendon|cartilage/i),
      S('wire', 'Wire & extracting forceps', 'Pinzas para alambre y extracción', /wire|nail|extract|sequestrum|twist/i),
    ],
    rest: ['other', 'Other grasping forceps', 'Otras pinzas de agarre'],
  },
  'retractors': {
    rules: [
      S('rib-sternal', 'Rib spreaders & sternal retractors', 'Separadores costales y esternales', /\brib\b|sternal|sternum|contractor|finochietto|tuffier|burford|morse|ankeney|castaneda/i),
      S('spinal', 'Spinal & neurosurgical retractors', 'Separadores de columna y neurocirugía', /cervical|vertebr|lamin|\bblades\b|cloward|caspar|mcculloch|scoville|taylor|love|nerve root|dura|cone|leyla|brain|haverfield|williams|beckman/i),
      S('oral', 'Oral, cheek & maxillofacial retractors', 'Separadores orales y maxilofaciales', /cheek|lip|gag|tongue|mouth|oral|obwegeser|obwegesser|dunn|ramus|mandib|sterberg|minnesota|seldin|channel|tmj|palat|champy/i),
      S('ent', 'ENT retractors', 'Separadores de otorrinolaringología', /\bear\b|nasal|trache|plester|fisch|mastoid|jansen|wullstein|cottle|mucosa|thyroid|tonsil/i),
      S('abdominal', 'Abdominal & pelvic retractors', 'Separadores abdominales y pélvicos', /abdomin|balfour|collin|deaver|harrington|bladder|prostat|young|kelly|gosset|ricard|doyen|vagin|pelvic|liver|kidney|ochsner|rochard|fixation device|frame|mikulicz|fritsch|kirschner|parker-mott/i),
      S('self-retaining', 'Self-retaining retractors', 'Separadores autoestáticos', /self-?retaining|weitlaner|gelpi|adson|beckmann|west|jansen|travers|holzheimer|henley|spreader|expander/i),
      S('bone-levers', 'Bone levers (Hohmann)', 'Palancas óseas (Hohmann)', /lever|hohmann|bennett|meyerding|blount|knee|hip|femoral|acetab|shoulder/i),
      S('hooks', 'Hooks & skin retractors', 'Ganchos y separadores de piel', /hook|skin|ret\./i),
    ],
    rest: ['hand-held', 'Hand-held retractors (Langenbeck, Volkmann)', 'Separadores manuales (Langenbeck, Volkmann)'],
  },
  'rongeurs-bone-cutters': {
    rules: [
      S('kerrison', 'Kerrison laminectomy punches', 'Punch de laminectomía Kerrison', /kerrison|laminectomy/i),
      S('disc', 'Disc & pituitary rongeurs', 'Gubias de disco e hipófisis', /caspar|love-gruenwald|spurling|cushing|wilde|oldberg|ferris-smith|takahashi|weil|pituitary|disc|\bbeck\b|cloward|st\. barts|schlesinger|hardy/i),
      S('ent', 'ENT punches & cutting forceps', 'Punch y pinzas cortantes de otorrino', /malleus|sphenoid|nasal|ethmoid|septum|antrum|mastoid|citelli|house|dieter|hajek|ostrom|struycken/i),
      S('cutting', 'Bone-cutting forceps & shears', 'Pinzas y cizallas cortahuesos', /cutting|shear|liston|cutter|nipper|horsley|gluck|brunner|sauerbruch|killian|bethune|collin|stille-liston/i),
    ],
    rest: ['bone', 'Bone rongeurs (Luer, Stille, Beyer)', 'Gubias óseas (Luer, Stille, Beyer)'],
  },
  'elevators-dissectors': {
    rules: [
      S('neuro-micro', 'Neuro & micro dissectors', 'Disectores neurológicos y de microcirugía', /dura|penfield|olivecrona|brain|davis|rhoton|micro|yasargil|jacobson|\bball\b|spatula|hook dissector|dandy|frazier|nerve|sachs|caspar|langenbeck dissector/i),
      S('oral-dental', 'Oral & dental elevators', 'Elevadores orales y dentales', /palat|cleft|dental|root|molt|swallow|inferior border|terry|seldin|coupland|apex|luxat|tooth|obweges/i),
      S('ent', 'Septum & ENT elevators', 'Elevadores de tabique y otorrino', /septum|freer|mckenty|killian|cottle|\bear\b|tonsil|henke|plester|\bfisch\b|mucosa|nasal|joseph|ballenger/i),
      S('periosteal', 'Periosteal elevators & raspatories', 'Periostótomos y legras', /periost|perisoteal|raspator|farabeuf|langenb|williger|obwegeser|obwegesser|cobb|key\b|sayre|doyen|lambotte|tessier|joseph/i),
    ],
    rest: ['other', 'Other elevators & dissectors', 'Otros elevadores y disectores'],
  },
  'curettes': {
    rules: [
      S('uterine', 'Uterine curettes', 'Curetas uterinas', /placenta|uter|endometr|recamier|sims|simon uter|bumm|thomas|rheinstadter|novak|kevorkian|sharman|flushing|secretion/i),
      S('spinal', 'Spinal & neuro curettes', 'Curetas de columna y neurocirugía', /bayonet|caspar|rhoton|hardy|fahlbusch|sypert|cone|epstein|cobb|pituitary|ring/i),
      S('ent', 'ENT curettes', 'Curetas de otorrino', /\bear\b|adenoid|buck|jansen|house|beckmann|lempert|antrum|mastoid|shapleigh/i),
      S('dermal', 'Dermal curettes', 'Curetas dermatológicas', /lupus|fox|dermal|piffard|skin|scraper|vidal/i),
    ],
    rest: ['bone', 'Bone curettes (Volkmann, Spratt)', 'Curetas óseas (Volkmann, Spratt)'],
  },
  'scalpels-knives': {
    rules: [
      S('handles', 'Scalpel handles & blades', 'Mangos y hojas de bisturí', /handle|blade|scalpel|bard|parker/i),
      S('dermatome', 'Dermatomes & skin-graft knives', 'Dermatomos y cuchillos de injerto', /dermatom|graft|humby|watson|blair|silver knife/i),
      S('meniscus', 'Meniscus & orthopaedic knives', 'Cuchillos de menisco y ortopedia', /menisc|smillie|cartilage|plaster knife|gigli/i),
      S('ent', 'ENT & rhinoplasty knives', 'Cuchillos de otorrino y rinoplastia', /tonsil|rhinopl|joseph|tympan|ballenger|septum|cottle|rosen|\bear\b|sickle|nasal|myringotomy|walb/i),
      S('micro', 'Micro & ophthalmic knives', 'Cuchillos de microcirugía y oftalmología', /cataract|graefe|castroviejo|barraquer|micro|trigeminal|olivecrona|arachnoid|troutman|eye|cone|ayre/i),
      S('amputation', 'Amputation, tumour & autopsy knives', 'Cuchillos de amputación, tumor y autopsia', /tumou?r|amputat|catlin|interosse|liston|autopsy|virchow|necropsy|brain knife|trowel/i),
    ],
    rest: ['other', 'Other surgical knives', 'Otros cuchillos quirúrgicos'],
  },
  'specula': {
    rules: [
      S('rectal', 'Rectal & anal specula', 'Espéculos rectales y anales', /rectal|anal|anus|anuscope|proctoscope|sphincter/i),
      S('ear', 'Ear specula', 'Espéculos de oído', /\bear\b|aural|politzer|hartmann ear|zollner|boucheron|toynbee|gruber/i),
      S('nasal', 'Nasal specula', 'Espéculos nasales', /nasal|nasel|cottle|killian|vienna|hartmann nasal|thudichum/i),
    ],
    rest: ['vaginal', 'Vaginal specula', 'Espéculos vaginales'],
  },
  'osteotomes-chisels': {
    rules: [
      S('rhinoplasty', 'Septum & rhinoplasty osteotomes', 'Osteótomos de tabique y rinoplastia', /septum|rhinopl|cottle|silver|fomon|rubin|cinelli|ballenger|killian|joseph|nasal|walter|parkes/i),
      S('gouges', 'Gouges', 'Gubias de golpe', /gouge/i),
      S('chisels', 'Chisels', 'Cinceles', /chisel/i),
    ],
    rest: ['osteotomes', 'Osteotomes', 'Osteótomos'],
  },
  'trocars-cannulas': {
    rules: [
      S('tracheostomy', 'Tracheostomy tubes', 'Cánulas de traqueostomía', /trache|crico|crycoth/i),
      S('ent', 'Ear & sinus cannulas', 'Cánulas de oído y senos', /tympan|paracent|antrum|\bear\b|eustach|sinus|laryn|brunings|exchangeable|catheter/i),
      S('irrigation', 'Irrigation & flushing cannulas', 'Cánulas de irrigación y lavado', /irrigat|flush|syringe/i),
    ],
    rest: ['trocars', 'Trocars, cannulas & puncture needles', 'Trócares, cánulas y agujas de punción'],
  },
  'suction': {
    rules: [
      S('instruments', 'Suction curettes & dissectors', 'Curetas y disectores de aspiración', /curette|dissector|raspator|rasparator|elevator/i),
      S('irrigation', 'Suction-irrigation cannulas', 'Cánulas de aspiración e irrigación', /irrigation/i),
    ],
    rest: ['tubes', 'Suction tubes (Yankauer, Frazier, Poole)', 'Cánulas de aspiración (Yankauer, Frazier, Poole)'],
  },
  'diagnostics': {
    rules: [
      S('mirrors', 'Examination mirrors', 'Espejos de exploración', /mirror/i),
      S('laryngoscopes', 'Laryngoscopes & blades', 'Laringoscopios y hojas', /laryngoscope|macintosh|miller|\bblade\b|fiber optic/i),
      S('tuning-forks', 'Tuning forks', 'Diapasones', /tuning/i),
      S('measuring', 'Calipers, pelvimeters & gauges', 'Calibradores, pelvímetros y medidores', /caliper|pelvimeter|gauge|goniometer|measur|ruler|flexometer/i),
    ],
    rest: ['examination', 'Examination instruments', 'Instrumental de exploración'],
  },
  'drills-plaster': {
    rules: [
      S('plaster', 'Plaster instruments', 'Instrumental para yeso', /plaster|cast|breaker/i),
      S('wire', 'Wire instruments & traction bows', 'Instrumental para alambres y estribos', /wire|plier|cutter|bow|twist|kirschner|cerclage/i),
    ],
    rest: ['drills', 'Hand drills, burrs & screwdrivers', 'Taladros manuales, fresas y destornilladores'],
  },
  'sterilisation-holloware': {
    rules: [
      S('containers', 'Sterilising drums, trays & boxes', 'Tambores, bandejas y cajas de esterilización', /drum|tray|container|box|case|cabinet/i),
      S('kits', 'Instrument kits', 'Kits de instrumental', /\bkit\b|\bset\b/i),
    ],
    rest: ['holloware', 'Bowls, basins & dishes', 'Bandejas, riñoneras y recipientes'],
  },
  'saws-rasps': {
    rules: [S('saws', 'Saws', 'Sierras', /saw|gigli/i)],
    rest: ['rasps', 'Rasps & files', 'Raspas y limas'],
  },
  'probes-dilators': {
    rules: [
      S('dilators', 'Dilators & sounds', 'Dilatadores y sondas uterinas', /dilat|sound|bougie|hegar|hank|pratt/i),
      S('perforators', 'Perforators & hooks', 'Perforadores y ganchos', /perforat|amniotom|meatotom|hook/i),
    ],
    rest: ['probes', 'Probes & grooved directors', 'Estiletes y sondas acanaladas'],
  },
};

export function classifySubtype(type, name) {
  const def = SUBTYPES[type];
  if (!def) return null;
  const hit = def.rules.find(r => r.re.test(name));
  return hit ? hit.slug : def.rest[0];
}

export function subtypeLabel(type, slug) {
  const def = SUBTYPES[type];
  if (!def) return null;
  const hit = def.rules.find(r => r.slug === slug);
  if (hit) return { en: hit.en, es: hit.es };
  if (def.rest[0] === slug) return { en: def.rest[1], es: def.rest[2] };
  return null;
}
