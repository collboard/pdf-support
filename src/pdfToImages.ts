import { loadAndRunExternalScript, string_url } from '@collboard/modules-sdk';

export async function pdfToImages(pdfUrl: string_url): Promise<string_url /* !!! [] */> {
    // Note: I can not figure out how to install this library via NPM
    //       TODO: Probbably put it into module assets to not rely on CDN
    //       TODO: loadAndRunExternalScriptOnce
    //       TODO: Put security checksum to script loading
    //       For pdf.min.js manual @see https://usefulangle.com/post/20/pdfjs-tutorial-1-preview-pdf-during-upload-wih-next-prev-buttons
    await loadAndRunExternalScript(`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.228/pdf.min.js`);

    const pdfjsLib = (window as any).pdfjsLib;

    const pdfDocument = await pdfjsLib.getDocument({ url: pdfUrl });

    // const pdfPagesCount = pdfDocument.numPages;

    const page = await pdfDocument.getPage(1 /* TODO: !!! Get all pages */);

    const canvas = document.createElement('canvas');
    const { width, height } = page.getViewport(1);
    canvas.width = width;
    canvas.height = height;

    const viewport = page.getViewport(1 /* !!! Do we need this param */);

    await page.render({
        canvasContext: canvas.getContext('2d'),
        viewport,
    });

    return canvas.toDataURL('image/png');
}
