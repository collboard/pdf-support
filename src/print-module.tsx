import React from 'react';
import { internalModules } from '../../../../50-systems/ModuleStore/internalModules';
import { makeModalModule } from '../../../../50-systems/ModuleStore/makers/makeModalModule';
import { DownloadPreviewComponent } from './DownloadPreviewComponent';

// TODO: [🐅] Maybe some more elegant way how to create icon-window pairs of modules

internalModules.declareModule(
    makeModalModule({
        manifest: {
            name: '@collboard/download-preview',
            title: { en: 'Download preview', cs: 'Náhled' },
        },
        async createModal(systems) {
            const { exportSystem, translationsSystem, appState } = await systems.request(
                'exportSystem',
                'translationsSystem',
                'appState',
            );

            return <DownloadPreviewComponent {...{ exportSystem, translationsSystem, appState }} />;
        },
    }),
);

/**
 * TODO: Allow to search for new modules
 */
