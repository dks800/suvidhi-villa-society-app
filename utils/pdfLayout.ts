import jsPDF from "jspdf";

export const primary = [30, 41, 59];
export const accent = [79, 70, 229];
export const logo = "/images/logo.png";

export const drawPageHeader = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.width;

  doc.setFillColor(accent[0], accent[1], accent[2]);
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.addImage(logo, "JPEG", 12, 6, 16, 12);
  doc.addImage(logo, "JPEG", pageWidth - 28, 6, 16, 12);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");

  doc.text("SUVIDHI VILLA", pageWidth / 2, 12, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(
    "Near Mamlatdar Kacheri, TB Road, Vijapur - 382870, Dist. Mehsana, Gujarat",
    pageWidth / 2,
    20,
    { align: "center" },
  );
};

export const drawFooter = (doc: jsPDF) => {
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  const footerY = pageHeight - 15;

  doc.setFontSize(9);
  doc.setTextColor(120);

  doc.text("This is a computer generated report", 14, footerY);

  const text1 = "Made with love by ";
  const text2 = "Murly";

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");

  const textWidth1 = doc.getTextWidth(text1);
  const totalWidth = textWidth1 + doc.getTextWidth(text2);
  const startX = (pageWidth - totalWidth) / 2;

  doc.text(text1, startX, footerY + 6);

  doc.setTextColor(255, 115, 0);
  doc.text(text2, startX + textWidth1, footerY + 6);
};

export const drawWatermark = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.width;

  const gState = (doc as any).GState;
  doc.setGState(new gState({ opacity: 0.06 }));
  doc.addImage(logo, "JPEG", pageWidth / 2 - 40, 90, 80, 60);
  doc.setGState(new gState({ opacity: 1 }));
};
