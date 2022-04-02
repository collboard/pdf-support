import {
    blobToDataUrl,
    centerArts,
    dataUrlToBlob,
    declareModule,
    fitInside,
    ImageArt,
    measureImageSize,
} from '@collboard/modules-sdk';
import { contributors, description, license, repository, version } from '../package.json';
import { pdfToImages } from './pdfToImages';

console.log(Math.random());

declareModule({
    manifest: {
        name: '@collboard/pdf-import',
        contributors,
        description,
        license,
        repository,
        version,
        flags: {
            isHidden: true /* <- TODO: (File) support modules should be always hidden*/,
        },
        supports: {
            fileImport: 'application/pdf',
        },
    },
    async setup(systems) {
        const { importSystem, apiClient, appState, materialArtVersioningSystem } = await systems.request(
            'importSystem',

            'apiClient',
            'appState',
            'materialArtVersioningSystem',
        );

        return importSystem.registerFileSupport({
            priority: 10,
            async processFile({ logger, file, boardPosition, previewOperation, next }) {
                if (file.type !== 'application/pdf') {
                    return next();
                }

                // Note: DO NOT select created arts - DO not call willCommitArts

                const pdfFile = file;

                let pdfDataUrl = await blobToDataUrl(pdfFile);
                let imageSrc = await pdfToImages(pdfDataUrl);

                // await previewImage(imageSrc);

                const imageScaledSize = fitInside({
                    isUpscaling: false,
                    objectSize: await (await measureImageSize(imageSrc)).divide(appState.transform.scale),
                    containerSize: appState.windowSize.divide(appState.transform.scale),
                });

                const imageArt = new ImageArt(imageSrc, 'image');
                imageArt.size = imageScaledSize;
                imageArt.opacity = 0.5;

                logger.info('Imported art', imageArt);

                centerArts({ arts: [imageArt], boardPosition });

                previewOperation.update(imageArt);

                imageSrc = await apiClient.fileUpload(await dataUrlToBlob(imageSrc));
                imageArt.src = imageSrc;
                imageArt.opacity = 1;

                const operation = materialArtVersioningSystem.createPrimaryOperation().newArts(imageArt).persist();

                return operation;
            },
        });
    },
});

/**
 * TODO: Better tooling around PDFs
 * TODO: Maybe create PdfArt
 */
