UPDATE admin_settings SET data = jsonb_set(
  jsonb_set(
    data,
    '{transfer}',
    '{"enabled": true, "iban": "FR76 3008 7330 2900 0207 9590 355", "bic": "CMCIFRPP", "accountHolder": "LE STORE RAYY", "bank": "CIC MOLSHEIM", "instructions": "Pour le moment, votre commande est en attente jusqu''à réception de votre paiement par virement. Une fois le paiement reçu, nous lancerons votre store Lunik en fabrication."}'::jsonb
  ),
  '{check}',
  '{"enabled": true, "orderTo": "Le Store Lunik", "sendAddress": "Le Store Rayy Sarl - 15 chemin de la loupe 67420 RANRUPT", "instructions": "Votre commande est en attente de traitement jusqu''à réception de votre chèque.\n\nMerci de libeller le chèque au nom de la société : Le Store Lunik et de l''envoyer à l''adresse :\n\nLe Store Rayy Sarl - 15 chemin de la loupe 67420 RANRUPT"}'::jsonb
), updated_at = now()
WHERE id = 'payment_methods';