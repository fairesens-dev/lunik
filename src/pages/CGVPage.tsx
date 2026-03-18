import AnimatedSection from "@/components/AnimatedSection";
import SEOMeta from "@/components/SEOMeta";

const sections = [
  {
    id: "preambule",
    title: "Préambule",
    content: `Le site internet lunik-store.fr (ci-après le « Site ») est la propriété exclusive de la société LE STORE RAYY. Toute reproduction, intégrale ou partielle, du contenu du Site est soumise à l'autorisation préalable et écrite de la société. Les liens hypertextes pointant vers le Site sont toutefois autorisés sans demande préalable.`,
  },
  {
    id: "identification",
    title: "Article 1 — Identification du vendeur",
    content: `**LE STORE RAYY** (ci-après le « Vendeur »), exploitant le site lunik-store.fr sous la dénomination commerciale **Lunik Store**.

- **Forme juridique :** Société à responsabilité limitée (SARL)
- **Capital social :** [MONTANT] €
- **Siège social :** 15 Chemin de la Loupe, 67420 Ranrupt
- **SIRET :** 907 603 021 00011
- **Code APE/NAF :** 43.29B — Autres travaux d'installation n.c.a.
- **N° TVA intracommunautaire :** [À COMPLÉTER]
- **E-mail :** [À COMPLÉTER]
- **Téléphone :** [À COMPLÉTER]`,
  },
  {
    id: "champ-application",
    title: "Article 2 — Champ d'application",
    content: `Les présentes Conditions Générales de Vente (ci-après les « CGV ») s'appliquent, sans restriction ni réserve, à l'ensemble des ventes réalisées par le Vendeur auprès de clients professionnels ou consommateurs non professionnels (ci-après le « Client » ou les « Clients »), portant sur les produits proposés à la vente sur le Site (ci-après les « Produits »).

Les CGV précisent notamment les conditions de commande, de paiement, de livraison et de gestion des retours éventuels.

Elles peuvent être complétées, le cas échéant, par des conditions particulières mentionnées sur le Site avant toute transaction. Elles s'appliquent à l'exclusion de toutes autres conditions, notamment celles applicables aux ventes réalisées en dehors du Site.

Les CGV sont accessibles à tout moment sur le Site et prévalent sur toute version antérieure ou tout document contradictoire. La version applicable à chaque commande est celle en vigueur à la date de passation de cette commande. Le Vendeur se réserve le droit de modifier les CGV à tout moment ; les modifications ne s'appliquent pas aux commandes déjà validées.

En passant commande sur le Site, le Client déclare avoir pris connaissance des présentes CGV, les accepter sans réserve et disposer de la pleine capacité juridique pour s'engager.`,
  },
  {
    id: "produits",
    title: "Article 3 — Produits",
    subsections: [
      {
        subtitle: "3.1 — Description des produits",
        content: `Les Produits proposés à la vente sont ceux figurant sur le Site au moment de la commande. Le catalogue est susceptible d'évoluer en fonction des stocks disponibles, des délais de fabrication et de l'actualisation de l'offre commerciale.

Les caractéristiques principales des Produits (spécifications techniques, dimensions, illustrations, capacités) sont présentées sur chaque fiche produit. Le Client est tenu d'en prendre connaissance avant de passer commande. Le choix et l'achat d'un Produit relèvent de la seule responsabilité du Client.

Les photographies et visuels présentés sur le Site sont fournis à titre indicatif et n'ont aucune valeur contractuelle. Des variations de couleur peuvent exister entre le rendu à l'écran et le produit réel. Le Vendeur ne saurait être tenu responsable de telles différences.`,
      },
      {
        subtitle: "3.2 — Produits sur mesure",
        content: `Les Produits proposés sur le Site font l'objet d'une fabrication sur mesure selon les spécifications communiquées par le Client (dimensions, coloris de toile, type d'armature, motorisation, options et accessoires). Chaque commande constitue une fabrication à la demande, personnalisée selon les choix du Client.

Le Client est invité à vérifier attentivement les caractéristiques sélectionnées (dimensions, couleur, options) avant de valider sa commande. Les caractéristiques choisies ont valeur contractuelle et attestent de l'accord du Client quant aux spécifications du Produit.

Le Vendeur ne pourra être tenu responsable si les mesures ou informations communiquées par le Client s'avèrent erronées. Une marge de tolérance de 2 cm est admise lors de la confection des Produits, liée à l'assemblage des laizes et aux finitions. Cette marge n'affecte ni la pose ni l'utilisation du Produit et ne peut constituer un motif de réclamation.

Les chutes de toile résultant de la confection restent la propriété exclusive du Vendeur.`,
      },
      {
        subtitle: "3.3 — Zone de livraison",
        content: `Les Produits sont proposés à la vente pour une livraison en France métropolitaine. Pour toute livraison vers un autre pays, le Client est invité à contacter le service client afin de vérifier la faisabilité de l'expédition.

En cas de commande à destination d'un pays situé hors de France métropolitaine, le Client est considéré comme importateur. Les droits de douane, taxes locales ou droits d'importation éventuellement exigibles sont à la charge exclusive du Client.`,
      },
    ],
  },
  {
    id: "disponibilite",
    title: "Article 4 — Disponibilité des produits",
    content: `Les Produits étant fabriqués sur mesure, leur disponibilité dépend de l'approvisionnement en matières premières (toiles, moteurs, armatures, pièces détachées).

En cas de rupture temporaire d'un composant, le Client sera informé dans un délai de dix (10) jours ouvrés à compter de la date de commande. Si le Produit devient définitivement indisponible, le Client sera contacté par e-mail ou par téléphone et se verra proposer une alternative équivalente ou un remboursement.

En cas de remboursement, celui-ci interviendra dans un délai de cinq (5) à quinze (15) jours ouvrés à compter de l'accord entre les parties, selon le mode de paiement initial.

Les délais de disponibilité affichés sur le Site sont fournis à titre indicatif et ne constituent pas un engagement contractuel. Certains produits nécessitant des options spécifiques (coloris particulier, motorisation spéciale, etc.) peuvent entraîner un délai de fabrication plus long.`,
  },
  {
    id: "tarifs",
    title: "Article 5 — Tarifs",
    content: `Les Produits sont fournis au tarif en vigueur sur le Site au moment de la passation de la commande. Les prix sont exprimés en euros, toutes taxes comprises (TTC), TVA française incluse au taux en vigueur (actuellement 20 %).

Le Vendeur se réserve le droit de modifier ses tarifs à tout moment. Le prix applicable est celui affiché lors de la validation de la commande.

Le paiement demandé au Client correspond au montant total de l'achat, frais de livraison inclus. Les frais de livraison sont indiqués avant la validation de la commande.

Des remises commerciales peuvent être appliquées sur certains Produits pendant des périodes de promotion déterminées. Passé la période indiquée, les prix hors promotion s'appliquent. Les codes promotionnels doivent être saisis dans le champ prévu à cet effet lors de la commande et ne peuvent être appliqués rétroactivement.`,
  },
  {
    id: "tva",
    title: "Article 6 — TVA",
    content: `Le Vendeur est assujetti à la TVA française. Les commandes à destination de la France métropolitaine sont soumises à la TVA au taux en vigueur de 20 %.

Les commandes de particuliers à destination de pays hors de l'Union européenne sont soumises à la TVA française, sauf dispositions fiscales contraires permettant l'exonération au titre des exportations.`,
  },
  {
    id: "compte-client",
    title: "Article 7 — Création de compte client",
    content: `Pour passer commande, le Client peut être amené à créer un compte client en renseignant les informations suivantes : nom, prénom, adresse postale, adresse e-mail et numéro de téléphone. Le Client crée un mot de passe personnel et sécurisé pour accéder à son compte lors de ses prochaines connexions.

Toute usurpation d'identité, utilisation de fausse identité ou inscription multiple pourra entraîner la clôture immédiate du compte.`,
  },
  {
    id: "commande",
    title: "Article 8 — Commande",
    content: `Le Client passe commande selon le processus suivant :

1. Sélection du Produit et configuration de ses caractéristiques (dimensions, motorisation, coloris de toile, options, quantité) via le configurateur disponible sur le Site.
2. Ajout au panier et vérification du récapitulatif (prix, dimensions, quantité, coloris, options).
3. Saisie ou vérification des informations de livraison et de facturation.
4. Le cas échéant, saisie d'un code promotionnel.
5. Prise de connaissance et acceptation des présentes CGV.
6. Validation définitive de la commande et paiement.

Le Client dispose de la possibilité de modifier ou de supprimer des Produits dans son panier avant la validation définitive.

La validation de la commande implique l'acceptation intégrale des présentes CGV et l'obligation de paiement.`,
  },
  {
    id: "confirmation",
    title: "Article 9 — Confirmation de commande",
    content: `Le Client a la responsabilité de vérifier le détail de sa commande, son prix total et de corriger d'éventuelles erreurs avant de confirmer.

La vente n'est définitive qu'après l'envoi au Client d'un e-mail de confirmation de commande par le Vendeur, comprenant le numéro de commande et le récapitulatif. Cet e-mail est envoyé automatiquement après validation du paiement.

En cas de non-réception de cet e-mail, le Client est invité à vérifier ses courriers indésirables (spams). Le Vendeur ne peut être tenu responsable si l'e-mail est bloqué par un dispositif de type anti-spam.

Sauf preuve contraire, les données enregistrées dans le système informatique du Vendeur constituent la preuve de l'ensemble des transactions conclues avec le Client.

Le Vendeur se réserve le droit d'annuler ou de refuser toute commande émanant d'un Client avec lequel il existerait un litige relatif au paiement d'une commande antérieure.`,
  },
  {
    id: "annulation",
    title: "Article 10 — Annulation d'une commande non traitée",
    content: `Une commande payée mais non encore mise en fabrication peut faire l'objet d'une annulation, sous réserve que le Vendeur n'ait pas informé le Client (par e-mail) que sa commande est saisie ou en cours de traitement.

Le Client doit se manifester auprès du service client le plus rapidement possible, avant que la commande ne passe en statut « En cours de traitement » ou « Expédiée ». Une fois l'un de ces statuts appliqué, aucune annulation ne sera possible.

Le remboursement, après accord du service client, s'effectuera par le même moyen de paiement que celui utilisé pour la commande. Un délai de cinq (5) à vingt (20) jours ouvrés est généralement constaté.`,
  },
  {
    id: "facturation",
    title: "Article 11 — Facturation",
    content: `La facture est envoyée automatiquement par e-mail au Client après validation du paiement. Elle est également accessible et téléchargeable depuis le compte client, le cas échéant.

Il est conseillé au Client de conserver tous les documents (électroniques ou papier) relatifs à sa commande jusqu'à l'expiration de la garantie du ou des Produits.`,
  },
  {
    id: "traitement",
    title: "Article 12 — Traitement de la commande",
    content: `À réception de la commande, celle-ci est vérifiée et validée par l'équipe du Vendeur. En cas d'erreur constatée dans les informations communiquées par le Client (fixations, dimensions, quantité, coloris), un devis de modification sera adressé au Client par e-mail.

Aucune commande ne sera mise en fabrication tant que le règlement n'aura pas été intégralement effectué. Toute commande non réglée dans un délai de quinze (15) jours sera considérée comme caduque et annulée.`,
  },
  {
    id: "paiement",
    title: "Article 13 — Paiement",
    subsections: [
      {
        subtitle: "13.1 — Carte bancaire",
        content: `Le prix est exigible à la commande.

Le paiement par carte bancaire (Visa, Mastercard, CB) s'effectue en ligne, de manière sécurisée. Le Site utilise un protocole de cryptage SSL pour protéger toutes les données relatives au paiement. À aucun moment le numéro de carte du Client n'est communiqué au Vendeur ni stocké sur ses serveurs. Le Client est directement en liaison avec le serveur sécurisé de l'établissement bancaire partenaire.`,
      },
      {
        subtitle: "13.2 — Virement bancaire",
        content: `Le Client souhaitant régler par virement bancaire doit indiquer dans le libellé du virement son numéro de commande et son nom. La commande ne sera traitée qu'à réception effective du virement. En l'absence de libellé clair, le traitement de la commande pourra être retardé, sans que la responsabilité du Vendeur puisse être engagée.

Les coordonnées bancaires du Vendeur sont communiquées au Client lors de la validation de la commande.`,
      },
      {
        subtitle: "13.3 — Chèque",
        content: `Les chèques sont à libeller à l'ordre de LE STORE RAYY et à envoyer à l'adresse suivante :

LE STORE RAYY — Service comptabilité
15 Chemin de la Loupe
67420 Ranrupt

Le numéro de commande doit être inscrit au dos du chèque. Le paiement par chèque est conditionné à la bonne réception et à l'encaissement du chèque par le Vendeur. La commande ne sera mise en fabrication qu'après encaissement effectif.`,
      },
    ],
  },
  {
    id: "livraison",
    title: "Article 14 — Livraison",
    subsections: [
      {
        subtitle: "14.1 — Modalités générales",
        content: `La livraison s'effectue par transporteur professionnel à l'adresse indiquée par le Client lors de la commande. Elle s'entend au pied de l'immeuble, au portail ou au rez-de-chaussée (« au hayon du camion »). La livraison n'inclut ni la mise en service ni l'installation des Produits.

Le Client s'engage à garantir que le lieu de livraison est accessible au véhicule de livraison et à fournir toutes les informations nécessaires à l'accessibilité. Si la configuration du lieu empêche l'accès ou le déchargement, le transporteur se réserve le droit d'annuler la livraison. Le Client devra alors fournir une adresse alternative, et les frais de retour ou de nouvelle livraison seront à sa charge.`,
      },
      {
        subtitle: "14.2 — Délais de livraison",
        content: `Les délais de livraison sont indiqués sur chaque fiche produit à titre indicatif. Ils varient en fonction du type de Produit, de la localisation du Client et des contraintes du transporteur. Les délais annoncés s'entendent en jours ouvrés, hors week-ends, jours fériés et périodes de congés du transporteur.

Le transporteur prendra contact avec le Client pour convenir d'un rendez-vous de livraison. Le Client s'engage à être présent et joignable à la date convenue.

En cas d'absence ou de refus non justifié, les frais de retour et de nouvelle livraison seront facturés au Client.

Les délais de livraison peuvent être prolongés en période de forte activité (mars à août) ou en cas de circonstances exceptionnelles. La responsabilité du Vendeur ne saurait être engagée en cas de retard imputable au transporteur ou résultant d'un cas de force majeure (grèves, intempéries, restrictions gouvernementales, etc.).`,
      },
      {
        subtitle: "14.3 — Prise de rendez-vous et suivi",
        content: `Le Client reçoit par e-mail un récapitulatif d'expédition comprenant le numéro de suivi et l'identité du transporteur. La prise de contact par le transporteur pour convenir du rendez-vous intervient généralement dans un délai de sept (7) à dix (10) jours ouvrés suivant l'expédition.

Le Vendeur ne saurait être tenu responsable des retards imputables à l'organisation du transporteur ou si la date de livraison proposée ne correspond pas aux disponibilités du Client.`,
      },
      {
        subtitle: "14.4 — Frais de stockage",
        content: `Si la commande est conservée dans les locaux du Vendeur au-delà d'un délai de quatre-vingt-dix (90) jours après mise à disposition ou notification de disponibilité, des frais de stockage pourront être appliqués à hauteur de 4 € HT par jour calendaire à compter du 91e jour, et ce jusqu'au retrait effectif ou à l'expédition.`,
      },
    ],
  },
  {
    id: "reception",
    title: "Article 15 — Réception et réserves",
    subsections: [
      {
        subtitle: "15.1 — Vérification à la livraison",
        content: `À la réception de la marchandise, le Client s'engage à vérifier l'état de l'emballage et du contenu en présence du livreur, avant d'accepter la livraison.`,
      },
      {
        subtitle: "15.2 — Émission de réserves",
        content: `En cas de constat d'avarie ou de non-conformité lors de la livraison, le Client doit impérativement :

1. Inscrire des réserves précises et détaillées sur le récépissé de livraison (bon de transport) en présence du livreur, en décrivant les dommages constatés sur le produit (et non sur le seul emballage). Les mentions vagues telles que « sous réserve de déballage » ou « colis abîmé » n'ont aucune valeur et ne seront pas prises en compte.
2. Informer le Vendeur le jour même par e-mail, en joignant des photographies du produit détérioré.

Les réserves doivent mentionner : la date et l'heure de réception, le nom du signataire, la description précise des avaries constatées sur le produit, la référence et la quantité des articles concernés.

Si le livreur refuse d'attendre la vérification, le Client doit le noter expressément sur le récépissé.`,
      },
      {
        subtitle: "15.3 — Absence de réserves",
        content: `Si le Client (ou la personne désignée par le Client) accepte la livraison sans émettre de réserves, le Vendeur sera déchargé de toute responsabilité concernant les dommages liés au transport. Aucun litige ne sera accepté après la livraison et le départ du livreur, en l'absence de réserves dûment formulées.`,
      },
    ],
  },
  {
    id: "difficultes-livraison",
    title: "Article 16 — Difficultés liées à la livraison",
    content: `Les difficultés liées au transport (retard, colis bloqué, perte, adresse erronée, absence du Client) sont indépendantes du Vendeur et ne peuvent constituer un motif de remboursement ou d'annulation de commande.

En cas de colis déclaré perdu par le transporteur, le Vendeur effectue une déclaration de perte et une enquête de recherche est ouverte. Pendant la durée de l'enquête (pouvant aller jusqu'à trois semaines ouvrées), aucune demande de remboursement ne peut être traitée. Le Vendeur tiendra le Client informé des démarches et du suivi.

En cas de livraison d'une commande non conforme (erreur de destinataire), le Client s'engage à en informer le Vendeur le jour même par e-mail, à fournir les photographies demandées, et à conserver le produit dans son emballage d'origine en lieu sûr jusqu'à résolution du litige.`,
  },
  {
    id: "installation",
    title: "Article 17 — Installation",
    content: `L'installation des Produits achetés sur le Site est à la charge exclusive du Client.

Le Vendeur ne prend en charge ni la pose ni les frais de pose et décline toute responsabilité en cas de dommage, de mauvais réglage ou de mauvaise installation du Produit, que l'installation soit effectuée par le Client ou par un tiers désigné par celui-ci. Aucune demande de remboursement ou de dédommagement ne sera acceptée en cas de mauvaise installation.

Sur demande, le Vendeur peut communiquer au Client les coordonnées d'un installateur professionnel de sa région. Le professionnel ainsi recommandé reste seul responsable de sa prestation vis-à-vis du Client, sans recours possible contre le Vendeur.`,
  },
  {
    id: "modification",
    title: "Article 18 — Modification de commande",
    content: `Toute demande de modification doit être adressée par e-mail au service client avant que la commande ne passe en statut « En cours de traitement » ou « Expédiée ». Aucune modification ne peut être prise en compte par téléphone.

Les modifications peuvent porter sur les fixations, les dimensions, le retrait ou l'ajout d'options. Le service client communiquera au Client le montant d'un éventuel complément à régler ou remboursement.

Une fois la commande en cours de traitement ou expédiée, aucune modification ne sera possible.`,
  },
  {
    id: "reconfection",
    title: "Article 19 — Service reconfection",
    content: `Dans l'hypothèse d'un retour de marchandise pour modification dans le cadre du service reconfection, le Client s'engage à retourner le Produit dans un état conforme à celui de sa réception, dans son emballage d'origine, accompagné de sa facture.

Le Produit retourné ne devra avoir subi aucun dommage, aucune transformation, et ne devra pas avoir été monté, fixé ou démonté. Les frais de transport aller et retour sont à la charge exclusive du Client. Le Client devra communiquer par e-mail les informations précises relatives à la modification souhaitée.`,
  },
  {
    id: "echantillons",
    title: "Article 20 — Échantillons",
    content: `Le Vendeur peut proposer l'envoi d'échantillons de toile. Les dimensions des échantillons sont communiquées à titre indicatif et peuvent varier.

Les délais d'envoi sont de trois (3) à dix (10) jours ouvrés, à titre indicatif. En cas d'informations erronées fournies par le Client lors de la commande d'échantillons (notamment l'adresse), le Vendeur décline toute responsabilité en cas de non-réception.`,
  },
  {
    id: "garantie",
    title: "Article 21 — Garantie et service après-vente",
    subsections: [
      {
        subtitle: "21.1 — Garanties légales",
        content: `Le Vendeur est tenu de la garantie légale de conformité (articles L.217-4 et suivants du Code de la consommation) et de la garantie des vices cachés (articles 1641 et suivants du Code civil), dans les conditions prévues par la loi.`,
      },
      {
        subtitle: "21.2 — Garantie commerciale",
        content: `En complément des garanties légales, les Produits bénéficient des garanties commerciales suivantes :

• Armature du store : 5 ans (pièces uniquement)
• Motorisation : 5 ans (pièces uniquement)
• Toile (selon fabricant) : Jusqu'à 10 ans
• Accessoires et LED : 2 ans
• Lambrequin, jonc et galon : Non garanti

La garantie court à compter de la date de commande. Elle couvre uniquement les pièces défectueuses et n'inclut pas la main-d'œuvre, les frais de transport ni la pose.`,
      },
      {
        subtitle: "21.3 — Exclusions de garantie",
        content: `La garantie ne couvre pas :

• Les dommages résultant d'une mauvaise installation, d'un mauvais entretien ou d'une utilisation non conforme.
• Les détériorations causées par des conditions climatiques (vent, pluie, grêle).
• Les déchirures, brûlures, trous ou taches d'origine accidentelle.
• L'usure normale du produit et la corrosion.
• Toute modification, démontage ou transformation effectuée par le Client ou un tiers.`,
      },
      {
        subtitle: "21.4 — Mise en œuvre de la garantie",
        content: `Pour toute demande de SAV, le Client doit adresser un e-mail au Vendeur dans un délai maximum de sept (7) jours ouvrés à compter de la découverte du défaut. Aucune demande de SAV ne peut être formulée par téléphone.

Le Vendeur procédera, selon le cas, au remplacement, à la réparation ou au remboursement du Produit ou de la pièce défectueuse, dans un délai maximum de vingt-cinq (25) jours ouvrés suivant la constatation du défaut.

En cas de retour d'un produit ayant été monté, coupé, modifié, sali, ou envoyé dans un emballage autre que celui d'origine, le retour ne sera pas pris en charge par le Vendeur.`,
      },
    ],
  },
  {
    id: "irregularites-toile",
    title: "Article 22 — Irrégularités de toile",
    content: `Les toiles de store sont des produits de haute qualité soumis à des contrôles rigoureux. Toutefois, des irrégularités telles que des plis, des variations de couleur ou des différences de tension peuvent apparaître en raison des caractéristiques naturelles des matériaux, de l'emballage ou du transport. Le Client reconnaît que ces imperfections sont inhérentes au produit, n'affectent pas sa fonctionnalité et ne constituent pas un défaut donnant lieu à remplacement ou remboursement.`,
  },
  {
    id: "retractation",
    title: "Article 23 — Droit de rétractation",
    content: `Conformément à l'article L.221-28 du Code de la consommation, le droit de rétractation est exclu pour les biens confectionnés selon les spécifications du consommateur ou nettement personnalisés.

Les Produits proposés par le Vendeur étant fabriqués sur mesure selon les choix du Client (dimensions, coloris, options), ils constituent des produits personnalisés. Le Client reconnaît qu'une fois la commande validée, le droit de rétractation ne peut être exercé, sauf en cas de défaut de conformité ou de vice caché avéré.

Toutefois, en cas de produit défectueux ou non conforme, le Client pourra faire valoir ses droits dans le cadre des garanties légales de conformité et des vices cachés.`,
  },
  {
    id: "reserve-propriete",
    title: "Article 24 — Réserve de propriété",
    content: `Les Produits demeurent la propriété du Vendeur jusqu'au paiement intégral du prix par le Client. Le transfert des risques (perte, vol, détérioration) intervient toutefois dès la livraison des Produits.`,
  },
  {
    id: "visuels",
    title: "Article 25 — Visuels et rendus couleurs",
    content: `Les couleurs affichées à l'écran (ordinateur, smartphone, tablette) peuvent varier par rapport au rendu réel du Produit. En cas de doute, le Client est invité à commander un échantillon de toile sur le Site. Le Vendeur ne saurait être tenu responsable des variations de couleur entre l'affichage à l'écran et le produit livré. Ces variations ne constituent pas un motif de remboursement.`,
  },
  {
    id: "exoneration",
    title: "Article 26 — Exonération de responsabilité",
    content: `Le Vendeur ne pourra être considéré comme responsable d'aucun manquement à ses obligations ayant pour cause des faits échappant à son contrôle ou résultant d'un cas de force majeure au sens de la jurisprudence des cours et tribunaux français (grèves, intempéries, blocage des transports, pannes informatiques, interruptions de télécommunications, restrictions gouvernementales, etc.).

Les photographies et les descriptifs des Produits présents sur le Site sont fournis à titre indicatif et n'ont pas valeur contractuelle.`,
  },
  {
    id: "donnees",
    title: "Article 27 — Données personnelles",
    subsections: [
      {
        subtitle: "27.1 — Collecte et traitement",
        content: `La commande de Produits sur le Site implique la collecte de données à caractère personnel du Client (nom, prénom, adresse, e-mail, téléphone). Ces données sont traitées conformément au Règlement (UE) 2016/679 (RGPD) et à la loi Informatique et Libertés n°78-17 du 6 janvier 1978.

Le responsable du traitement est la société LE STORE RAYY, dont les coordonnées figurent à l'article 1.`,
      },
      {
        subtitle: "27.2 — Finalités",
        content: `Les données sont collectées aux fins suivantes : traitement des commandes, gestion de la relation client, élaboration de statistiques commerciales, respect des obligations légales et réglementaires, et lutte contre la fraude.`,
      },
      {
        subtitle: "27.3 — Destinataires",
        content: `Seuls le Vendeur et ses partenaires contractuels (transporteurs, prestataires de paiement) ayant besoin d'accéder aux données pour le traitement de la commande en sont destinataires. Les données ne sont ni vendues, ni louées, ni cédées à des tiers.`,
      },
      {
        subtitle: "27.4 — Durée de conservation",
        content: `Les données sont conservées pendant une durée de cinq (5) ans à compter de la dernière transaction ou de la dernière mise à jour du compte client. Passé ce délai, les données sont supprimées.`,
      },
      {
        subtitle: "27.5 — Sécurité",
        content: `Le Vendeur met en œuvre les mesures techniques et organisationnelles appropriées pour garantir la sécurité des données (cryptage SSL, anonymisation, accès restreint). Les transactions bancaires sont effectuées via une connexion sécurisée (HTTPS) et les données de carte bancaire ne sont ni conservées ni accessibles par le Vendeur.`,
      },
      {
        subtitle: "27.6 — Droits du Client",
        content: `Conformément au RGPD, le Client dispose d'un droit d'accès, de rectification, d'effacement, de limitation du traitement, de portabilité et d'opposition. Ces droits peuvent être exercés :

• Par e-mail : [À COMPLÉTER]
• Par courrier : LE STORE RAYY — 15 Chemin de la Loupe, 67420 Ranrupt

Le Client peut également introduire une réclamation auprès de la CNIL.`,
      },
      {
        subtitle: "27.7 — Cookies",
        content: `Le Site utilise des cookies pour mesurer l'audience (pages vues, nombre de visites, fréquence de retour). Les cookies ne permettent pas d'identifier le Client. L'utilisation de cookies non essentiels est soumise au consentement préalable du Client, lequel peut être donné ou retiré à tout moment via le paramétrage du navigateur ou le bandeau de gestion des cookies.`,
      },
    ],
  },
  {
    id: "propriete-intellectuelle",
    title: "Article 28 — Propriété intellectuelle",
    content: `Le Vendeur est propriétaire de l'ensemble des droits de propriété intellectuelle portant sur le Site, les contenus (textes, images, photographies, logos, graphismes), les noms de domaine et la marque Lunik Store. Toute reproduction, diffusion ou utilisation, totale ou partielle, est strictement interdite sans l'autorisation écrite et préalable du Vendeur.

Toute atteinte aux droits de propriété intellectuelle est susceptible de poursuites judiciaires.`,
  },
  {
    id: "contact",
    title: "Article 29 — Contact et assistance",
    content: `Pour toute question relative aux Produits, aux commandes ou au service après-vente, le Client peut contacter le Vendeur :

• Par e-mail : [À COMPLÉTER]
• Par courrier : LE STORE RAYY — 15 Chemin de la Loupe, 67420 Ranrupt
• Par téléphone : [À COMPLÉTER]`,
  },
  {
    id: "droit-applicable",
    title: "Article 30 — Droit applicable",
    content: `Les présentes CGV sont régies par le droit français. Elles sont rédigées en langue française, qui seule fait foi en cas de traduction.`,
  },
  {
    id: "litiges",
    title: "Article 31 — Litiges et juridictions compétentes",
    content: `Tout litige relatif à l'interprétation, l'exécution ou la résiliation des présentes CGV qui n'aurait pu être résolu à l'amiable entre le Vendeur et le Client sera soumis aux juridictions compétentes dans les conditions de droit commun pour le Client consommateur. Pour le Client professionnel, le tribunal de commerce du ressort du siège social du Vendeur sera seul compétent.`,
  },
  {
    id: "mediation",
    title: "Article 32 — Médiation",
    content: `En cas de litige, le Client peut adresser une réclamation écrite au Vendeur. Celui-ci s'engage à tout mettre en œuvre pour résoudre le différend à l'amiable.

Le Client consommateur est informé qu'il peut recourir gratuitement à un médiateur de la consommation conformément aux articles L.612-1 et suivants du Code de la consommation. Le consommateur doit justifier avoir préalablement tenté de résoudre son litige directement auprès du Vendeur par réclamation écrite.

Coordonnées du médiateur : [À COMPLÉTER — le Vendeur doit désigner un médiateur de la consommation et en communiquer les coordonnées]

Le Client peut également recourir à la plateforme européenne de règlement en ligne des litiges : https://ec.europa.eu/consumers/odr`,
  },
  {
    id: "info-precontractuelle",
    title: "Article 33 — Information précontractuelle",
    content: `Le fait de commander sur le Site emporte adhésion et acceptation pleine et entière des présentes CGV et obligation au paiement des Produits commandés. Le Client renonce à se prévaloir de tout document contradictoire qui serait inopposable au Vendeur.`,
  },
];

type Section = typeof sections[number];

const renderContent = (content: string) => {
  return content.split("\n\n").map((p, i) => (
    <p key={i} className="text-muted-foreground text-sm leading-relaxed mb-3 last:mb-0">
      {p.split("**").map((segment, j) =>
        j % 2 === 1 ? <strong key={j} className="text-foreground font-medium">{segment}</strong> : segment
      )}
    </p>
  ));
};

const CGVPage = () => {
  return (
    <section className="py-28 lg:py-36">
      <SEOMeta
        title="Conditions Générales de Vente | Lunik Store"
        description="Consultez les conditions générales de vente de Lunik Store : commande, paiement, livraison, garanties, droit de rétractation et données personnelles."
      />
      <div className="max-w-[900px] mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <h1 className="font-serif text-4xl md:text-5xl font-light mb-6">
            Conditions Générales <span className="italic">de Vente</span>
          </h1>
          <p className="text-muted-foreground text-sm mb-12">Dernière mise à jour : 18 mars 2026</p>

          {/* TOC */}
          <nav className="border border-border p-6 mb-16">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-medium">Sommaire</p>
            <ul className="space-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-sm text-primary hover:underline">{s.title}</a>
                </li>
              ))}
            </ul>
          </nav>
        </AnimatedSection>

        <div className="space-y-12">
          {sections.map((s: Section) => (
            <AnimatedSection key={s.id}>
              <article id={s.id}>
                <h2 className="font-serif text-2xl mb-4">{s.title}</h2>
                {"content" in s && s.content && renderContent(s.content)}
                {"subsections" in s && s.subsections && s.subsections.map((sub, i) => (
                  <div key={i} className="mb-6 last:mb-0">
                    <h3 className="font-serif text-lg mb-3">{sub.subtitle}</h3>
                    {renderContent(sub.content)}
                  </div>
                ))}
              </article>
            </AnimatedSection>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-muted-foreground text-xs italic">Les présentes CGV sont à jour au 18/03/2026.</p>
        </div>
      </div>
    </section>
  );
};

export default CGVPage;
