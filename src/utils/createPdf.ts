import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { forAllImagesInElement } from 'waitasecond';
import { Vector } from 'xyzt';
import { findDeepestChild } from './findDeepestChild';

interface ICreatePdfOptions {
    pageSize: Vector;
    elements: HTMLElement[];
    //!!! backgroundImage: Blob;

    isTesting: boolean;
}

export async function createPdf({ pageSize, elements, /*backgroundImage, */isTesting }: ICreatePdfOptions): Promise<Blob> {
    // !!! Convert pageSize from pixels to mm

    const pdfDocument = new jsPDF('p', 'mm', pageSize.toArray2D());
    // TODO: @hejny Add metadata to PDF

    //!!!
    const containerElement = elements[0];

    await forAllImagesInElement(containerElement);

    const canvas = await html2canvas(containerElement, {
        scale: 3 /* TODO: @hejny What is the ideal quality */,
        backgroundColor: 'trasparent',
        allowTaint: true /* <- !!! Do not need */,
        // removeContainer: true,
        ignoreElements: (element) => {
            if (isTesting) {
                return false;
            } else {
                return false;
                // !!! return element.classList.contains('render-as-text');
            }
        },
    });

    const image = canvas.toDataURL('image/png' /* TODO: Configure quality */);

    /*!!!
    if (isTesting) {
        canvas.style.width = PAGE_SIZE.x * PAGE_MM_TO_PX_RATIO + 'px';
        canvas.style.height = PAGE_SIZE.y * PAGE_MM_TO_PX_RATIO + 'px';
        canvas.style.border = '1px solid red';
        canvas.style.position = 'fixed';
        canvas.style.bottom = '20px';
        canvas.style.right = '20px';
        document.body.appendChild(canvas);
    }
    */

    pdfDocument.addImage(
        // TODO: @hejny Compression of the image
        image,
        'JPEG',
        0,
        0,
        ...pageSize.toArray2D(),
    );

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

    // containerElement.style.display = 'none';

    return pdfDocument.output('blob');
}

/**
 * Note: [🍊] Using different lib for exporting and importing @see https://www.npmtrends.com/html-pdf-vs-jspdf-vs-pdf-vs-pdfjs-vs-pdfkit-vs-pdfmake-vs-pdf.js
 */
