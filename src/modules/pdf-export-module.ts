import { declareModule, SCALE_PIXELS } from '@collboard/modules-sdk';
import { contributors, description, license, repository, version } from '../../package.json';
import { createPdf } from '../utils/createPdf';

declareModule({
    manifest: {
        name: `@collboard/pdf-export`,
        contributors,
        description,
        license,
        repository,
        version,
        flags: {
            isHidden: true /* <- TODO: (File) support modules should be always hidden*/,
        },
    },
    async setup(systems) {
        const { exportSystem } = await systems.request('exportSystem');

        // TODO: This exporter is not implemented because of an error in browser "DOMException: Support for multiple ClipboardItems is not implemented.". If this solved, implement it.
        return exportSystem.registerFileSupport({
            priority: 0,
            mimeType: `application/pdf`,
            isHeavy: true,
            exportFile({
                artContainers,
                boundingBox,
                scope,
                quality /* <- TODO: Use */,
                scale /* <- TODO: Use */,
                // Note: isMaterialized doesn't matter here
                // Note: isLinked doesn't matter here
                // Note: isTransparent doesn't matter here
                isTesting,
            }) {
                if (boundingBox.width * boundingBox.height === 0) {
                    return null;
                }

                return async () => {
                    const [backgroundImage] = await exportSystem.exportFiles({
                        // TODO: [🌚] Some way how to chain exports - pass useOtherExport util into IFileExportOptions
                        mimeType: 'image/png',
                        isHeavyExport: true,
                        scale: scale * 2 /* <- Note: To ensure better quality of background */,
                        scope,
                        isTesting,
                    });



                    return await createPdf({
                        pageSize: boundingBox.transform.scale.scale(
                            (1 / SCALE_PIXELS.centimeter) * 10 /* <- TODO: USE mimimeters */,
                        ),
                        backgroundImage,
                        elements: artContainers
                            .map(({ element }) => element)
                            .filter((element) => element !== null) as HTMLElement[],


                        isTesting,
                    });
                };
            },
        });
    },
});
