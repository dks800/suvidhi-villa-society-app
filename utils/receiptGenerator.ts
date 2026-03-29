import jsPDF from "jspdf";
import { formatCurrency } from "./common";

type dataType = Record<string, string | number>;

export const downloadMaintenanceReceipt = (data: dataType) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  const pageWidth = doc.internal.pageSize.width;

  const primary = [41, 67, 112];
  const accent = [79, 70, 229];

  const logo = "/images/logo.png";

  /* ---------------- HEADER ---------------- */

  doc.setFillColor(primary[0], primary[1], primary[2]);
  doc.rect(0, 0, pageWidth, 30, "F");

  // LOGO
  doc.addImage(logo, "JPEG", 12, 6, 18, 14, undefined, "FAST");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("SUVIDHI VILLA", pageWidth / 2, 14, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Near Mamlatdar Kacheri, TB Road, Vijapur - 3828700, Dist. Mehsana, Gujarat, India",
    pageWidth / 2,
    21,
    {
      align: "center",
    },
  );

  doc.addImage(logo, "JPEG", pageWidth - 30, 6, 18, 14, undefined, "FAST");

  /* ---------------- WATERMARK ---------------- */

  const gState = (doc as any).GState;
  doc.setGState(new gState({ opacity: 0.06 }));
  doc.addImage(logo, "JPEG", pageWidth / 2 - 40, 70, 80, 60, undefined, "FAST");
  doc.setGState(new gState({ opacity: 1 }));

  /* ---------------- SOCIETY ADDRESS ---------------- */

  doc.setTextColor(primary[0], primary[1], primary[2]);

  doc.setFontSize(10);

  doc.text("Maintenance Payment Receipt", 14, 40);

  /* ---------------- RECEIPT META ---------------- */

  const receiptNo = `REC-${Date.now().toString().slice(-6)}`;

  doc.text(`Receipt No: ${receiptNo}`, pageWidth - 60, 40);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 60, 46);

  /* ---------------- MEMBER DETAILS BOX ---------------- */

  doc.setDrawColor(200);

  doc.roundedRect(10, 55, pageWidth - 20, 25, 3, 3);

  doc.setFont("helvetica", "bold");

  doc.text("Member Name:", 14, 65);
  doc.text("Villa No:", 14, 72);
  doc.text("Month:", 100, 65);
  doc.text("Payment Mode:", 100, 72);

  doc.setFont("helvetica", "normal");

  doc.text(data.memberName as string, 45, 65);
  doc.text(data.villaNo as string, 45, 72);
  doc.text(data.month as string, 135, 65);
  doc.text(data?.paymentMode?.toString()?.toUpperCase(), 135, 72);

  /* ---------------- ACCOUNTING STYLE TABLE ---------------- */

  const startY = 95;

  doc.setFillColor(240, 242, 255);

  doc.rect(10, startY, pageWidth - 20, 10, "F");

  doc.setFont("helvetica", "bold");

  doc.text("Description", 15, startY + 7);
  doc.text("Amount (Rs.)", pageWidth - 40, startY + 7);

  doc.setFont("helvetica", "normal");

  let y = startY + 18;

  const row = (label: string, value: string | number) => {
    doc.text(label, 15, y);
    doc.text(` ${formatCurrency(value)}`, pageWidth - 35, y);
    y += 10;
  };

  row("Maintenance Amount", data.amount);
  row("Previous Due", data.prevDue);
  row("Late Fees", data.lateFees);

  /* ---------------- TOTAL SECTION ---------------- */

  doc.setDrawColor(180);
  doc.line(10, y, pageWidth - 10, y);

  y += 12;

  doc.setFillColor(230, 236, 255);
  doc.roundedRect(10, y - 7, pageWidth - 20, 12, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(accent[0], accent[1], accent[2]);

  doc.text(
    `TOTAL PAID :  ${formatCurrency(data.total, true)}`,
    pageWidth / 2,
    y,
    {
      align: "center",
    },
  );

  const footerY = doc.internal.pageSize.height - 15;

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.setFont("helvetica", "normal");

  doc.text(
    "This is a computer generated receipt and does not require physical signature",
    14,
    footerY,
  );

  /* ---------------- CREDIT ---------------- */

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");

  const text1 = "Made with love by ";
  const text2 = "Murly";

  const textWidth1 = doc.getTextWidth(text1);
  const totalWidth = textWidth1 + doc.getTextWidth(text2);

  const startX = (pageWidth - totalWidth) / 2;

  doc.text(text1, startX, footerY + 8);

  doc.setTextColor(255, 115, 0);
  doc.text(text2, startX + textWidth1, footerY + 8);

  /* ---------------- SAVE ---------------- */

  doc.save(`maintenance-${data.villaNo}-${data.month}.pdf`);
};
