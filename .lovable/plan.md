

# Plan : Mettre à jour les infos de paiement (chèque + virement)

## Ce qui change

Mise à jour directe en base (`admin_settings`, id `payment_methods`) avec les nouvelles instructions et coordonnées bancaires extraites du RIB CIC.

### Données à écrire

**Virement** :
- `iban`: `FR76 3008 7330 2900 0207 9590 355`
- `bic`: `CMCIFRPP`
- `accountHolder`: `LE STORE RAYY`
- `bank`: `CIC MOLSHEIM`
- `instructions`: « Pour le moment, votre commande est en attente jusqu'à réception de votre paiement par virement. Une fois le paiement reçu, nous lancerons votre store Lunik en fabrication. »

**Chèque** :
- `orderTo`: `Le Store Lunik`
- `sendAddress`: `Le Store Rayy Sarl - 15 chemin de la loupe 67420 RANRUPT`
- `instructions`: « Votre commande est en attente de traitement jusqu'à réception de votre chèque.\n\nMerci de libeller le chèque au nom de la société : Le Store Lunik et de l'envoyer à l'adresse :\n\nLe Store Rayy Sarl - 15 chemin de la loupe 67420 RANRUPT »

## Fichier modifié

| Fichier | Action |
|---------|--------|
| Migration SQL | UPDATE `admin_settings` id=`payment_methods` avec les nouvelles données JSON |

Une seule migration SQL, aucune modification de code front-end nécessaire (les composants lisent déjà ces champs dynamiquement).

