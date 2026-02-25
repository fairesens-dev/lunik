import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface OrderData {
  ref: string;
  created_at: string;
  client_name: string;
  client_email: string;
  client_address?: string | null;
  client_address2?: string | null;
  client_postal_code?: string | null;
  client_city?: string | null;
  width: number;
  projection: number;
  toile_color?: string | null;
  armature_color?: string | null;
  options?: string[] | null;
  amount: number;
  payment_method?: string | null;
  payment_status?: string | null;
  promo_code?: string | null;
  promo_discount?: number | null;
}

const formatDate = (d: string) => {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const generateInvoicePDF = (order: OrderData) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("FACTURE", 105, 25, { align: "center" });

  // Company info (top left)
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Mon Store", 20, 40);
  doc.text("12 rue de l'Atelier", 20, 46);
  doc.text("67000 Strasbourg", 20, 52);
  doc.text("SIRET: XXX XXX XXX 00001", 20, 58);
  doc.text("TVA: FR XX XXX XXX XXX", 20, 64);

  // Invoice info (top right)
  doc.setFont("helvetica", "bold");
  doc.text(`Facture N°: F-${order.ref}`, 140, 40);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${formatDate(order.created_at)}`, 140, 46);
  doc.text(`Commande: ${order.ref}`, 140, 52);

  // Client info block
  doc.setFillColor(245, 240, 232);
  doc.rect(20, 75, 170, 30, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Facturé à :", 25, 85);
  doc.setFont("helvetica", "normal");
  doc.text(order.client_name, 25, 91);
  const addressParts = [order.client_address, order.client_address2, `${order.client_postal_code || ""} ${order.client_city || ""}`].filter(Boolean);
  doc.text(addressParts.join(", "), 25, 97);

  // Surface
  const area = ((order.width * order.projection) / 10000).toFixed(2);
  const options = order.options || [];
  const hasMotor = options.some((o) => o.toLowerCase().includes("motor"));
  const hasLED = options.some((o) => o.toLowerCase().includes("led") || o.toLowerCase().includes("éclairage"));
  const hasConnect = options.some((o) => o.toLowerCase().includes("connect"));

  const motorPrice = hasMotor ? 390 : 0;
  const ledPrice = hasLED ? 290 : 0;
  const connectPrice = hasConnect ? 590 : 0;
  const optionsTotal = motorPrice + ledPrice + connectPrice;
  const promoDiscount = order.promo_discount || 0;
  const basePrice = order.amount + promoDiscount - optionsTotal;

  // Table body
  const body: any[][] = [
    [
      `Store Coffre Sur-Mesure\n${order.width}×${order.projection}cm\nToile ${order.toile_color || "—"} · Armature ${order.armature_color || "—"}`,
      "1",
      `${(basePrice / 1.2).toFixed(2)} €`,
      "20%",
      `${basePrice.toFixed(2)} €`,
    ],
  ];

  if (hasMotor) body.push(["Motorisation Somfy io", "1", `${(motorPrice / 1.2).toFixed(2)} €`, "20%", `${motorPrice.toFixed(2)} €`]);
  if (hasLED) body.push(["Éclairage LED sous store", "1", `${(ledPrice / 1.2).toFixed(2)} €`, "20%", `${ledPrice.toFixed(2)} €`]);
  if (hasConnect) body.push(["Pack Connect (Moteur + LED + App)", "1", `${(connectPrice / 1.2).toFixed(2)} €`, "20%", `${connectPrice.toFixed(2)} €`]);
  body.push(["Livraison France métropolitaine", "1", "0,00 €", "20%", "0,00 €"]);

  if (promoDiscount > 0) {
    body.push([
      `Code promo ${order.promo_code || ""}`,
      "",
      `−${(promoDiscount / 1.2).toFixed(2)} €`,
      "20%",
      `−${promoDiscount.toFixed(2)} €`,
    ]);
  }

  const totalTTC = order.amount;
  const totalHT = +(totalTTC / 1.2).toFixed(2);
  const tva = +(totalTTC - totalHT).toFixed(2);

  autoTable(doc, {
    startY: 115,
    head: [["Désignation", "Qté", "Prix HT", "TVA", "Total TTC"]],
    body,
    foot: [
      ["", "", "Sous-total HT", "", `${totalHT.toFixed(2)} €`],
      ["", "", "TVA 20%", "", `${tva.toFixed(2)} €`],
      ["", "", "TOTAL TTC", "", `${totalTTC.toFixed(2)} €`],
    ],
    headStyles: { fillColor: [74, 94, 58] },
    footStyles: { fontStyle: "bold" },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 80 },
    },
  });

  // Footer
  const finalY = (doc as any).lastAutoTable?.finalY || 220;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Paiement ${order.payment_status === "paid" ? "reçu" : "en attente"} · ${order.payment_method || "Carte bancaire"}`,
    20,
    finalY + 15
  );
  doc.text("Garantie légale de conformité · Garantie commerciale 5 ans", 20, finalY + 21);
  doc.setFont("helvetica", "italic");
  doc.text("Merci pour votre confiance !", 105, finalY + 32, { align: "center" });

  doc.save(`Facture-${order.ref}.pdf`);
};
