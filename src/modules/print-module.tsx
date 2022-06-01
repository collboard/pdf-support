import { declareModule, DownloadPreviewComponent, makeModalModule } from '@collboard/modules-sdk';
import React from 'react';

// TODO: [🐅] Maybe some more elegant way how to create icon-window pairs of modules

declareModule(
    makeModalModule({
        manifest: {
            name: '@collboard/print',
            title: { en: 'Print', cs: 'Tisk' },
        },
        async createModal(systems) {
            const { exportSystem, translationsSystem, appState } = await systems.request(
                'exportSystem',
                'translationsSystem',
                'appState',
            );

            // !!! Implement
            return <DownloadPreviewComponent {...{ exportSystem, translationsSystem, appState }} />;
        },
    }),
);
