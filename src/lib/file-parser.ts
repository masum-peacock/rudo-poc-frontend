import { PDFDocument } from 'pdf-lib';

export const parsePDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    let fullText = '';

    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
        const page = pdfDoc.getPage(i);
        const textContent = await page?.getTextContent(); // Assuming pdf-lib provides this or similar
        fullText += textContent + '\n';
    }

    return fullText;
};
