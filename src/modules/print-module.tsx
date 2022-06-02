import { declareModule, makeModalModule, React } from '@collboard/modules-sdk';
import { forTime } from 'waitasecond';
import { PrintComponent } from '../components/PrintComponent';

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

            await forTime(1000);
            return <PrintComponent {...{ exportSystem, translationsSystem, appState }} />;
        },
    }),
);

/**
 * TODO: [🐅] Maybe some more elegant way how to create icon-window pairs of modules
 * TODO: [🍈] Some way how to hide modal modules when colldev
 */
