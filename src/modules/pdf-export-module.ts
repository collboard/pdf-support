import { declareModule } from '@collboard/modules-sdk';
import { createPdf } from '../utils/createPdf';

declareModule({
    manifest: {
        name: `@collboard/pdf-export`,
    },
    async setup(systems) {
        const { exportSystem } = await systems.request('exportSystem');

        // TODO: This exporter is not implemented because of an error in browser "DOMException: Support for multiple ClipboardItems is not implemented.". If this solved, implement it.
        return exportSystem.registerFileSupport({
            priority: 0,
            mimeType: `image/pdf`,
            isHeavy: true,
            export({
                artContainers,
                boundingBox,

                quality /* <- TODO: Use */,
                scale /* <- TODO: Use */,
                isMaterialized /* <- TODO: Use */,
                isLinked /* <- TODO: Use */,
                isTransparent /* <- TODO: Use */,
                isTesting,
            }) {
                if (boundingBox.width * boundingBox.height === 0) {
                    return null;
                }

                return async () => {
                    /*!!!
                    const [svgFile] = await exportSystem.exportFiles({
                        // TODO: [🌚] Some way how to chain exports - pass useOtherExport util into IFileExportOptions
                        mimeType: 'image/svg+xml',
                        isHeavyIncluded: true,
                        scope,

                        isMaterialized: true /* <- Note: Materialization is essential to propper bitmap conversion * /,
                        isTesting,
                    });

                    let canvas = await imageToCanvas(await blobToDataUrl(svgFile));
                    */

                    return await createPdf({
                        pageSize: boundingBox.transform.scale,
                        elements: artContainers
                            .map(({ element }) => element)
                            .filter((element) => element !== null) as HTMLElement[],
                        // !!!backgroundImage: Blob;

                        isTesting,
                    });
                };
            },
        });
    },
});
