import jsPDF from "jspdf";
import autoTable, { Color } from "jspdf-autotable";
import {
  drawPageHeader,
  drawFooter,
  drawWatermark,
  primary,
  accent,
} from "./pdfLayout";
import { formatCurrency } from "./common";
import { formatDate } from "@/app/(protected)/admin/funds/page";

type RecordType = Record<string, any>;

export const downloadMaintenanceReport = (
  fromDate: string,
  toDate: string,
  records: RecordType[],
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  let startY = 60;

  /* ---------------- HEADER ---------------- */
  drawPageHeader(doc);

  /* ---------------- TITLE ---------------- */
  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");

  doc.text(`Maintenance Report (${fromDate} to ${toDate})`, pageWidth / 2, 38, {
    align: "center",
  });

  /* ---------------- WATERMARK ---------------- */
  drawWatermark(doc);

  /* ---------------- PROCESS DATA ---------------- */

  const totalCollection = records.reduce(
    (sum, r) => sum + Number(r.amount || 0),
    0,
  );

  const paidCount = records.filter((r) => r.amount > 0).length;
  const unpaidCount = records.length - paidCount;

  /* ---------------- SUMMARY ---------------- */

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(`Total Members : ${records.length}`, 14, 50);
  doc.text(`Paid : ${paidCount}`, 70, 50);
  doc.text(`Unpaid : ${unpaidCount}`, 110, 50);

  doc.text(`Collection : ${formatCurrency(totalCollection, true)}`, 150, 50);

  /* ---------------- TABLE ---------------- */

  const head = [
    [
      "#",
      "Villa No",
      "Name",
      "Month/Year",
      "Amount",
      "Paid On",
      "Mode",
      "Status",
    ],
  ];

  const body = records.map((m, i) => {
    const isPaid = m.amount > 0;

    const yearMonth = m.createdAt.toDate()?.toISOString().slice(0, 7);

    return [
      i + 1,
      m.villaNo,
      m.memberName || m.name,
      yearMonth,
      formatCurrency(m.amount || 0),
      isPaid ? formatDate(m.createdAt) : "-",
      m?.paymentMode?.toUpperCase() || "-",
      isPaid ? "Paid" : "Unpaid",
    ];
  });

  autoTable(doc, {
    startY,
    head,
    body,
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

    styles: {
      fontSize: 8,
      cellPadding: 1.5,
      lineColor: [200, 200, 200],
      lineWidth: 0.2,
    },
    bodyStyles: {
      fillColor: false,
    },

    didParseCell: (data) => {
      const rowIndex = data.row.index;
      const row = records[rowIndex];

      // Highlight unpaid
      if (!row?.amount) {
        data.cell.styles.textColor = [200, 0, 0];
      }
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

    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 10, {
      align: "right",
    });
  }

  /* ---------------- SAVE ---------------- */

  doc.save(`maintenance-${fromDate}-to-${toDate}.pdf`);
};
