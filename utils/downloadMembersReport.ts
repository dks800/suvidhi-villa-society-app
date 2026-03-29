import jsPDF from "jspdf";
import autoTable, { Color } from "jspdf-autotable";
import {
  drawPageHeader,
  drawFooter,
  drawWatermark,
  primary,
  accent,
} from "./pdfLayout";

export const downloadMembersReport = (members: Record<string, string>[]) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  /* ---------------- HEADER ---------------- */
  drawPageHeader(doc);

  /* ---------------- TITLE ---------------- */
  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");

  doc.text("Members Report", pageWidth / 2, 38, {
    align: "center",
  });

  const now = new Date();

  const formattedDateTime = now.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.setFont("helvetica", "normal");

  doc.setFontSize(9);
  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.text(`Date: ${formattedDateTime}`, pageWidth - 60, 46);

  /* ---------------- WATERMARK ---------------- */
  drawWatermark(doc);

  /* ---------------- SUMMARY ---------------- */
  doc.setFontSize(10);

  doc.text(`Total Members : ${members.length}`, 14, 50);

  /* ---------------- TABLE ---------------- */
  autoTable(doc, {
    startY: 60,

    head: [["#", "Villa No", "Member Name", "Phone"]],

    body: members?.map((m, i) => [
      i + 1,
      m.villaNo || "-",
      m.name || "-",
      m.phone || "-",
    ]),

    theme: "grid",

    margin: {
      top: 35,
      bottom: 20,
    },

    headStyles: {
      fillColor: accent as Color,
      textColor: 255,
      fontSize: 9,
    },
    bodyStyles: {
      fillColor: false,
    },
    styles: {
      fontSize: 8,
      cellPadding: 1.5,
      lineColor: [200, 200, 200],
      lineWidth: 0.2,
    },

    didDrawPage: () => {
      drawPageHeader(doc);
      drawFooter(doc);
    },
  });

  /* ---------------- PAGE NUMBERS ---------------- */

  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    doc.setFontSize(8);
    doc.setTextColor(120);

    const pageText = `Page ${i} of ${pageCount}`;
    doc.text(pageText, pageWidth - 20, pageHeight - 10, {
      align: "right",
    });
  }

  /* ---------------- SAVE ---------------- */

  doc.save("members-report.pdf");
};
