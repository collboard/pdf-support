import {
    Abstract2dArt,
    blobToDataurl,
    centerArts,
    dataurlToBlob,
    declareModule,
    fitInside,
    ImageArt,
    measureImageSize,
    ShapeArt,
    ShapeName,
    windowSize,
} from '@collboard/modules-sdk';
import { Vector } from 'xyzt';
import { contributors, description, license, repository, version } from '../../package.json';
import { pdfToImages } from '../utils/pdfToImages';

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
        const { importSystem, usercontentSystem, appState, materialArtVersioningSystem } = await systems.request(
            'importSystem',
            'usercontentSystem',
            'appState',
            'materialArtVersioningSystem',
        );

        return importSystem.registerFileSupport({
            priority: 10,
            async importFile({ logger, file, boardPosition, previewOperation, willCommitArts, next }) {
                if (file.type !== 'application/pdf') {
                    return next();
                }

                // Note: DO NOT select created arts by not returning operation
                willCommitArts();

                const pdfFile = file;

                const pdfDataUrl = await blobToDataurl(pdfFile);
                const imagesDataUrl = await pdfToImages(pdfDataUrl);

                const result: Abstract2dArt[] = [];

                for (const [i, imageDataUrl] of imagesDataUrl.entries()) {
                    const imageArt = new ImageArt(
                        imageDataUrl,
                        `Page ${i + 1}/${imagesDataUrl.length} of ${pdfFile.name}`,
                    );
                    imageArt.size = fitInside({
                        isUpscaling: false,
                        objectSize: await (await measureImageSize(imageDataUrl)).divide(appState.transform.value.scale),
                        containerSize: windowSize.value.divide(appState.transform.value.scale),
                    });
                    imageArt.opacity = 0.5;
                    imageArt.locked = true;

                    const borderArt = new ShapeArt(
                        ShapeName.Rectange,
                        '#ccc',
                        3 / appState.transform.value.scale.x,
                        imageArt.shift,
                        imageArt.size,
                    );
                    // TODO: Maybe borderArt.opacity= 0.9;
                    borderArt.locked = true;

                    centerArts({
                        arts: [imageArt, borderArt],
                        boardPosition,
                    });

                    logger.info(`Page ${i + 1}/${imagesDataUrl.length}`, imageArt);

                    boardPosition = boardPosition
                        .add(new Vector(imageArt.size).rearrangeAxis(([x, y, z]) => [0, y, 0]))
                        .add(new Vector(0, 30).scale(1 / appState.transform.value.scale.x));

                    previewOperation.update(imageArt /* TODO: Also borderArt */);

                    const imageSrc = await usercontentSystem.upload(await dataurlToBlob(imageDataUrl));
                    imageArt.src = imageSrc;
                    imageArt.opacity = 1;

                    result.push(imageArt, borderArt);
                }

                return result;
            },
        });
    },
});

/**
 * TODO: Do not make border by ShapeArt but make some better ImageArt
 * TODO: Better tooling around PDFs
 * TODO: Maybe create PdfArt
 */
