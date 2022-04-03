import {
    blobToDataUrl,
    centerArts,
    dataUrlToBlob,
    declareModule,
    fitInside,
    ImageArt,
    measureImageSize,
} from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import { Vector } from 'xyzt';
import { contributors, description, license, repository, version } from '../package.json';
import { pdfToImages } from './pdfToImages';

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

                const pdfDataUrl = await blobToDataUrl(pdfFile);
                const imagesDataUrl = await pdfToImages(pdfDataUrl);

                const result = Registration.void();

                for (const [i, imageDataUrl] of imagesDataUrl.entries()) {
                    const imageArt = new ImageArt(
                        imageDataUrl,
                        `Page ${i + 1}/${imagesDataUrl.length} of ${pdfFile.name}`,
                    );
                    imageArt.size = fitInside({
                        isUpscaling: false,
                        objectSize: await (await measureImageSize(imageDataUrl)).divide(appState.transform.scale),
                        containerSize: appState.windowSize.divide(appState.transform.scale),
                    });
                    imageArt.opacity = 0.5;
                    imageArt.locked = true;

                    centerArts({
                        arts: [imageArt],
                        boardPosition,
                    });

                    logger.info(`Page ${i + 1}/${imagesDataUrl.length}`, imageArt);

                    boardPosition = boardPosition.add(
                        new Vector(imageArt.size).rearrangeAxis(([x, y, z]) => [0, y, 0]),
                    );

                    previewOperation.update(imageArt);

                    const imageSrc = await apiClient.fileUpload(await dataUrlToBlob(imageDataUrl));
                    imageArt.src = imageSrc;
                    imageArt.opacity = 1;

                    const operation = materialArtVersioningSystem.createPrimaryOperation().newArts(imageArt).persist();
                    result.addSubdestroyable(operation);
                }

                return result;
            },
        });
    },
});

/**
 * TODO: !!! Add some frame
 * TODO: Better tooling around PDFs
 * TODO: Maybe create PdfArt
 */
