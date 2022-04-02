import {
    blobToDataUrl,
    centerArts,
    dataUrlToBlob,
    declareModule,
    fitInside,
    ImageArt,
    measureImageSize,
    patternToRegExp,
    string_mime_type_with_wildcard,
} from '@collboard/modules-sdk';
import { forEver } from 'waitasecond';
import { contributors, description, license, repository, version } from '../package.json';
import { pdfToImages } from './pdfToImages';

const mimeTypes: string_mime_type_with_wildcard[] = ['application/pdf'];

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
            fileImport: mimeTypes,
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
                if (!mimeTypes.some((mimeType) => patternToRegExp(mimeType).test(file.type))) {
                    return next();
                }

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

                await forEver();

                imageSrc = await apiClient.fileUpload(await dataUrlToBlob(imageSrc));
                imageArt.src = imageSrc;
                imageArt.opacity = 1;

                const operation = materialArtVersioningSystem.createPrimaryOperation().newArts(imageArt).persist();

                // Note: DO NOT select created arts

                return operation;
            },
        });
    },
});

/**
 * TODO: Better tooling around PDFs
 * TODO: Maybe create PdfArt
 */
