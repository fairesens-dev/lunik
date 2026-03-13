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

  // ── Header line ──
  doc.setDrawColor(40, 40, 40);
  doc.setLineWidth(0.8);
  doc.line(20, 18, 190, 18);

  // Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("FACTURE", 20, 30);

  // Invoice number right-aligned
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`N° F-${order.ref}`, 190, 30, { align: "right" });
  doc.text(`Date : ${formatDate(order.created_at)}`, 190, 36, { align: "right" });

  // Thin line under header
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(20, 40, 190, 40);

  // ── Company info (left) ──
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "bold");
  doc.text("Émetteur", 20, 50);
  doc.setFont("helvetica", "normal");
  doc.text("Mon Store", 20, 56);
  doc.text("12 rue de l'Atelier", 20, 61);
  doc.text("67000 Strasbourg", 20, 66);
  doc.text("SIRET : XXX XXX XXX 00001", 20, 71);
  doc.text("TVA : FR XX XXX XXX XXX", 20, 76);

  // ── Client info (right, framed) ──
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.roundedRect(110, 46, 80, 34, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setTextColor(60, 60, 60);
  doc.text("Facturé à", 115, 53);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
  doc.text(order.client_name, 115, 59);
  const addressParts = [order.client_address, order.client_address2, `${order.client_postal_code || ""} ${order.client_city || ""}`].filter(Boolean);
  const addressLines = addressParts.join(", ");
  const splitAddress = doc.splitTextToSize(addressLines, 70);
  doc.setTextColor(80, 80, 80);
  doc.text(splitAddress, 115, 65);

  // ── Reference line ──
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Commande : ${order.ref}`, 20, 90);

  // ── Table ──
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

  const body: any[][] = [
    [
      `Store Coffre Sur-Mesure\n${order.width} × ${order.projection} cm\nToile : ${order.toile_color || "—"} · Armature : ${order.armature_color || "—"}`,
      "1",
      `${(basePrice / 1.2).toFixed(2)} €`,
      "20 %",
      `${basePrice.toFixed(2)} €`,
    ],
  ];

  if (hasMotor) body.push(["Motorisation Somfy io", "1", `${(motorPrice / 1.2).toFixed(2)} €`, "20 %", `${motorPrice.toFixed(2)} €`]);
  if (hasLED) body.push(["Éclairage LED sous store", "1", `${(ledPrice / 1.2).toFixed(2)} €`, "20 %", `${ledPrice.toFixed(2)} €`]);
  if (hasConnect) body.push(["Pack Connect (Moteur + LED + App)", "1", `${(connectPrice / 1.2).toFixed(2)} €`, "20 %", `${connectPrice.toFixed(2)} €`]);
  body.push(["Livraison France métropolitaine", "1", "0,00 €", "20 %", "0,00 €"]);

  if (promoDiscount > 0) {
    body.push([
      `Code promo ${order.promo_code || ""}`,
      "",
      `−${(promoDiscount / 1.2).toFixed(2)} €`,
      "20 %",
      `−${promoDiscount.toFixed(2)} €`,
    ]);
  }

  const totalTTC = order.amount;
  const totalHT = +(totalTTC / 1.2).toFixed(2);
  const tva = +(totalTTC - totalHT).toFixed(2);

  autoTable(doc, {
    startY: 96,
    head: [["Désignation", "Qté", "Prix HT", "TVA", "Total TTC"]],
    body,
    foot: [
      ["", "", "Sous-total HT", "", `${totalHT.toFixed(2)} €`],
      ["", "", "TVA 20 %", "", `${tva.toFixed(2)} €`],
      ["", "", "TOTAL TTC", "", `${totalTTC.toFixed(2)} €`],
    ],
    headStyles: {
      fillColor: [50, 50, 50],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [40, 40, 40],
    },
    footStyles: {
      fontStyle: "bold",
      fontSize: 8.5,
      textColor: [30, 30, 30],
    },
    alternateRowStyles: {
      fillColor: [248, 248, 248],
    },
    styles: {
      cellPadding: 4,
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { halign: "center", cellWidth: 15 },
      2: { halign: "right", cellWidth: 28 },
      3: { halign: "center", cellWidth: 18 },
      4: { halign: "right", cellWidth: 28 },
    },
  });

  // ── Footer ──
  const finalY = (doc as any).lastAutoTable?.finalY || 220;

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(20, finalY + 8, 190, finalY + 8);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Paiement ${order.payment_status === "paid" ? "reçu" : "en attente"} · ${order.payment_method || "Carte bancaire"}`,
    20,
    finalY + 15
  );
  doc.text("Garantie légale de conformité · Garantie commerciale 5 ans", 20, finalY + 20);

  doc.setFont("helvetica", "italic");
  doc.setTextColor(120, 120, 120);
  doc.text("Merci pour votre confiance !", 105, finalY + 30, { align: "center" });

  doc.save(`Facture-${order.ref}.pdf`);
};
