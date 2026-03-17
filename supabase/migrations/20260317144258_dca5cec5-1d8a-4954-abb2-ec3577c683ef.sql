UPDATE configurator_settings 
SET data = '[
  {"id":"blanc","hex":"#F5F5F5","label":"Blanc satiné — RAL 9016","active":true,"type":"solid","photoUrl":"/images/armatures/blanc-satine-ral-9016.jpg"},
  {"id":"ivoire","hex":"#DDD5BE","label":"Ivoire clair satiné — RAL 1015","active":true,"type":"solid","photoUrl":"/images/armatures/ivoire-clair-satine-ral-1015.jpg"},
  {"id":"aluminium","hex":"#A5A5A5","label":"Aluminium métallisé — RAL 9006","active":true,"type":"solid","photoUrl":"/images/armatures/aluminium-metallise-ral-9006.jpg"},
  {"id":"anthracite","hex":"#4A5459","label":"Gris anthracite texturé — RAL 7016","active":true,"type":"textured","photoUrl":"/images/armatures/gris-anthracite-texture-ral-7016.jpg"},
  {"id":"brun","hex":"#473B36","label":"Brun gris structuré — RAL 8019","active":true,"type":"textured","photoUrl":"/images/armatures/brun-gris-structure-ral-8019.jpg"},
  {"id":"noir","hex":"#2D2D2D","label":"Noir foncé structuré — RAL 9005","active":true,"type":"textured","photoUrl":"/images/armatures/noir-fonce-structure-ral-9005.jpg"}
]'::jsonb,
updated_at = now()
WHERE id = 'armatureColors';