import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (element: HTMLElement, invoiceNumber: string) => {
  try {
    const canvas = await html2canvas(element, {
      useCORS: true,
      logging: true,
      scale: 2, // Higher resolution
      ignoreElements: (el) => el.tagName === 'BUTTON', // Exclude buttons if needed
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const heightLeft = pdfHeight;
    const position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    pdf.save(`invoice-${invoiceNumber}.pdf`);
  } catch (error) {
    console.error('PDF generation failed:', error);
    alert('Failed to generate PDF. Check console for details.');
  }
};