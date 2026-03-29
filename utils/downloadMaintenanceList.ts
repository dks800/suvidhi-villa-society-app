import jsPDF from "jspdf";
import autoTable, { Color } from "jspdf-autotable";
import { formatCurrency } from "./common";
import { formatDate } from "@/app/(protected)/admin/funds/page";

type PaidMemberType = Record<string, string | number>;

type UnpaidMemberType = Record<string, string>;

export const downloadMaintenanceList = (
  month: string,
  paidMembers: PaidMemberType[],
  unpaidMembers: UnpaidMemberType[],
  type: "full" | "paid" | "unpaid",
) => {
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

  /* ---------------- PAGE HEADER ---------------- */

  const drawPageHeader = () => {
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
      "Near Mamlatdar Kacheri, TB Road, Vijapur - 382870, Dist. Mehsana, Gujarat, India",
      pageWidth / 2,
      20,
      { align: "center" },
    );
  };

  drawPageHeader();

  /* ---------------- DOCUMENT TITLE ---------------- */

  const titleMap = {
    full: "Maintenance Report",
    paid: "Paid Maintenance Report",
    unpaid: "Unpaid Maintenance Report",
  };

  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");

  doc.text(`${titleMap[type]} - ${month}`, pageWidth / 2, 38, {
    align: "center",
  });

  /* ---------------- WATERMARK ---------------- */


  const gState = (doc as any).GState;
  doc.setGState(new gState({ opacity: 0.06 }));
  doc.addImage(logo, "JPEG", pageWidth / 2 - 40, 90, 80, 60);
  doc.setGState(new gState({ opacity: 1 }));

  /* ---------------- SUMMARY ---------------- */

  const paidList = paidMembers;
  const unpaidList = unpaidMembers;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(`Total Members : ${paidList.length + unpaidList.length}`, 14, 50);
  doc.text(`Paid : ${paidList.length}`, 70, 50);
  doc.text(`Unpaid : ${unpaidList.length}`, 110, 50);

  let startY = 60;

  /* ---------------- SECTION TITLE ---------------- */

  const drawSectionTitle = (title: string) => {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primary[0], primary[1], primary[2]);

    doc.text(title, 14, startY);

    doc.setDrawColor(200);
    doc.line(14, startY + 2, pageWidth - 14, startY + 2);

    startY += 6;
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

  /* ---------------- TABLE RENDER FUNCTION ---------------- */

  const renderTable = (
    title: string,
    data: any[],
    tableType: "paid" | "unpaid",
  ) => {
    const totalSummary =
      tableType === "paid"
        ? `Total Amount - ${formatCurrency(
            data.reduce((sum, m) => sum + Number(m.amount), 0),
            true,
          )}`
        : `Total Pending - ${formatCurrency(data.length * 600, true)}`;

    drawSectionTitle(`${title} (${totalSummary})`);

    const getTableRows = () => {
      if (tableType === "paid") {
        return data.map((m: PaidMemberType, i: number) => [
          i + 1,
          m.villaNo,
          m.memberName,
          formatCurrency(m.amount),
          formatDate(m.createdAt as string) || "-",
          m.receivedBy || "-",
        ]);
      }

      return data.map((m: UnpaidMemberType, i: number) => [
        i + 1,
        m.villaNo,
        m.name,
        formatCurrency(600),
        "5th of Month",
      ]);
    };

    const getTableHeaders = () => {
      if (tableType === "paid") {
        return [
          ["#", "Villa No", "Member Name", "Amount", "Paid On", "Received By"],
        ];
      }

      return [["#", "Villa No", "Member Name", "Amount Due", "Due Date"]];
    };

    autoTable(doc, {
      startY: startY,
      head: getTableHeaders(),
      body: getTableRows(),

      theme: "grid",

      margin: {
        top: 35, // space for header
        bottom: 20, // space for footer
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
        drawPageHeader();
        drawFooter();
      },
    });

    startY = (doc as any).lastAutoTable.finalY + 10;
  };

  /* ---------------- TABLES ---------------- */

  if (type === "full") {
    if (paidList.length) {
      renderTable("Paid Members", paidList, "paid");
    }

    if (unpaidList.length) {
      renderTable("Unpaid Members", unpaidList, "unpaid");
    }
  }

  if (type === "paid") {
    renderTable("Paid Members", paidList, "paid");
  }

  if (type === "unpaid") {
    renderTable("Unpaid Members", unpaidList, "unpaid");
  }

  /* ---------------- PAGE NUMBERS ---------------- */

  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    doc.setFontSize(8);
    doc.setTextColor(120);

    const pageText = `Page ${i} of ${pageCount}`;
    doc.text(pageText, pageWidth - 20, pageHeight - 10, { align: "right" });
  }

  /* ---------------- SAVE ---------------- */

  doc.save(`maintenance-${type}-${month}.pdf`);
};
