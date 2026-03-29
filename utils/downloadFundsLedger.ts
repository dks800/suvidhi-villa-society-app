import jsPDF from "jspdf";
import autoTable, { Color } from "jspdf-autotable";
import { formatCurrency } from "./common";
import { formatDate } from "@/app/(protected)/admin/funds/page";

export type TransactionType = {
  type: "credit" | "debit";
  amount: number;
  category: string;
  title?: string;
  month?: string;
  memberName?: string;
  villaNo?: string;
  paymentMode?: string;
  transactionDate: string;
};

type ExportType = "full" | "credit" | "debit";

export const downloadFundsLedger = (
  year: string,
  month: string,
  transactions: TransactionType[],
  type: ExportType = "full",
) => {
  /* ---------------- FILTER ---------------- */

  let filtered = [...transactions];

  if (type === "credit") {
    filtered = filtered.filter((t) => t.type === "credit");
  }

  if (type === "debit") {
    filtered = filtered.filter((t) => t.type === "debit");
  }

  /* ---------------- SORT ---------------- */

  const sortedAsc = [...filtered].sort(
    (a, b) =>
      new Date(formatDate(a.transactionDate) || a.transactionDate).getTime() -
      new Date(formatDate(b.transactionDate) || b.transactionDate).getTime(),
  );

  /* ---------------- PREPARE LEDGER ---------------- */

  let balance = 0;

  const ledgerAsc = sortedAsc.map((t, index) => {
    if (t.type === "credit") {
      balance += Number(t.amount);
    } else {
      balance -= Number(t.amount);
    }

    return {
      sr: index + 1,
      date: formatDate(t?.transactionDate) || "-",
      type: t.type,
      category: t.category,
      title: t.title || "-",
      villaNo: t.villaNo,
      paymentMode: t.paymentMode || "-",
      credit: t.type === "credit" ? t.amount : "",
      debit: t.type === "debit" ? t.amount : "",
      balance,
    };
  });

  // ✅ Step 3: Reverse for UI/PDF (latest first)
  const ledgerData = ledgerAsc.reverse();

  /* ---------------- SUMMARY ---------------- */

  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const openingBalance = 0; // you can enhance later
  const closingBalance = openingBalance + totalCredit - totalDebit;

  /* ---------------- PDF INIT ---------------- */

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  const primary = [30, 41, 59];
  const accent = [79, 70, 229];

  const logo = "/images/logo.png";

  /* ---------------- HEADER ---------------- */

  const drawHeader = () => {
    doc.setFillColor(accent[0], accent[1], accent[2]);
    doc.rect(0, 0, pageWidth, 28, "F");

    doc.addImage(logo, "JPEG", 12, 6, 16, 12);
    doc.addImage(logo, "JPEG", pageWidth - 28, 6, 16, 12);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Suvidhi Villa", pageWidth / 2, 12, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(
      "Near Mamlatdar Kacheri, TB Road, Vijapur - 382870, Gujarat",
      pageWidth / 2,
      20,
      { align: "center" },
    );
  };

  const drawFooter = () => {
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
  /* ---------------- TITLE ---------------- */

  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");

  doc.text(`Funds Ledger - ${month}`, pageWidth / 2, 38, {
    align: "center",
  });

  /* ---------------- WATERMARK ---------------- */

  const gState = (doc as any).GState;
  doc.setGState(new gState({ opacity: 0.06 }));
  doc.addImage(logo, "JPEG", pageWidth / 2 - 40, 90, 80, 60);
  doc.setGState(new gState({ opacity: 1 }));

  /* ---------------- SUMMARY ---------------- */

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(`Opening Balance : ${formatCurrency(openingBalance, true)}`, 14, 50);
  doc.text(`Total Credit : ${formatCurrency(totalCredit, true)}`, 70, 50);
  doc.text(`Total Debit : ${formatCurrency(totalDebit, true)}`, 120, 50);

  doc.text(`Closing Balance : ${formatCurrency(closingBalance, true)}`, 14, 56);

  /* ---------------- TABLE ---------------- */

  autoTable(doc, {
    startY: 65,
    bodyStyles: {
      fillColor: false,
    },

    head: [
      [
        "#",
        "Date",
        "Type",
        "Category",
        "Title",
        "Villa No",
        "Mode",
        "Credit",
        "Debit",
        "Balance",
      ],
    ],

    body: ledgerData.map((row, index) => [
      index + 1,
      row.date || "",
      row.type.toUpperCase() || "",
      row.category || "",
      row.title || "",
      row.villaNo || "",
      row.paymentMode || "",
      row.credit ? formatCurrency(row.credit) : "",
      row.debit ? formatCurrency(row.debit) : "",
      formatCurrency(row.balance),
    ]),

    theme: "grid",

    margin: {
      top: 35,
      bottom: 20,
    },

    headStyles: {
      fillColor: accent as Color,
      textColor: 255,
      fontSize: 8,
    },

    styles: {
      fontSize: 7,
      cellPadding: 1.5,
      lineColor: [200, 200, 200],
      lineWidth: 0.2,
    },

    didParseCell: (data) => {
      if (data.column.index === 7) {
        data.cell.styles.textColor = [0, 150, 0]; // credit
      }
      if (data.column.index === 8) {
        data.cell.styles.textColor = [200, 0, 0]; // debit
      }
    },

    didDrawPage: () => {
      drawHeader();
      drawFooter();
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

  doc.save(`funds-ledger-${type}-${month}.pdf`);
};
