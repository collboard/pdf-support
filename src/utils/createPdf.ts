import { blobToDataurl, fetchAsFile } from '@collboard/modules-sdk';
import { jsPDF } from 'jspdf';
// import { forAllImagesInElement } from 'waitasecond';
import { Vector } from 'xyzt';
// import { findDeepestChild } from './findDeepestChild';

interface ICreatePdfOptions {
    /**
     * Page size in milimeters
     */
    pageSize: Vector;
    elements: HTMLElement[];
    backgroundImage?: Blob;

    isTesting: boolean;
}

export async function createPdf({ pageSize, elements, backgroundImage, isTesting }: ICreatePdfOptions): Promise<Blob> {
    const pdfDocument = new jsPDF('p', 'mm', pageSize.toArray2D());
    // TODO: @hejny Add metadata to PDF

    // TODO: !!!
    // const containerElement = elements[0];
    // await forAllImagesInElement(containerElement);

    if (backgroundImage) {
        pdfDocument.addImage(
            // TODO: @hejny Compression of the image
            await blobToDataurl(backgroundImage),
            'PNG',
            0,
            0,
            ...pageSize.toArray2D(),
            // TODO: More
        );
    }

    /*
    const containerBoundingBox = containerElement.getBoundingClientRect();
    const originPosition = Vector.fromObject(containerBoundingBox, ['left', 'top']);
    const containerSize = Vector.fromObject(containerBoundingBox, ['width', 'height']);

    pdfDocument.addFont('Times New Roman', 'Times', 'serif');
    // TODO: @hejny Remove unnessesary fonts from the document
    //   console.log(pdfDocument.getFontList());

    for (const textElement of Array.from(containerElement.querySelectorAll('.render-as-text')) as HTMLElement[]) {
        const positionInPdf = Vector.fromObject(textElement.getBoundingClientRect(), ['left', 'top'])
            .subtract(originPosition)
            .divide(containerSize)
            .multiply(pageSize)
            .add(new Vector(0, 0.5));

        const textElementDeepestChild = findDeepestChild(textElement);

        const fontSize = parseFloat(
            window.getComputedStyle(textElementDeepestChild, null).getPropertyValue('font-size'),
        );

        const fontWeight = parseFloat(
            window.getComputedStyle(textElementDeepestChild, null).getPropertyValue('font-weight'),
        );

        const fontStyle = fontWeight > 400 ? 'bold' : 'normal';

        const fontSizeInPdf = fontSize * (pageSize.y / containerSize.y) * 2.83464566929;

        pdfDocument.setFontSize(fontSizeInPdf);

        pdfDocument.setFont('Times', fontStyle);
        pdfDocument.text(textElement.innerText, ...positionInPdf.toArray2D(), {
            baseline: 'top',
        });

        // console.log(textElement.innerText, ...positionInPdf.toArray2D());
    }
    */

    // containerElement.style.display = 'none';

    if (isTesting) {
        pdfDocument.addImage(
            await blobToDataurl(
                await fetchAsFile(`https://collboard.fra1.cdn.digitaloceanspaces.com/assets/21.4.1/logo-small.png`),
            ),
            'PNG',
            10,
            10,
            111,
            79,
            // TODO: More
        );
    }

    return pdfDocument.output('blob');
}

/**
 * Note: [🍊] Using different lib for exporting and importing @see https://www.npmtrends.com/html-pdf-vs-jspdf-vs-pdf-vs-pdfjs-vs-pdfkit-vs-pdfmake-vs-pdf.js
 */
