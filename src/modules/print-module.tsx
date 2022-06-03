import { declareModule, makeModalModule, React } from '@collboard/modules-sdk';
import { forTime } from 'waitasecond';
import { contributors, description, license, repository, version } from '../../package.json';
import { PrintComponent } from '../components/PrintComponent';

declareModule(
    makeModalModule({
        manifest: {
            name: '@collboard/print',
            title: { en: 'Print', cs: 'Tisk' },
            contributors,
            description,
            license,
            repository,
            version,
            flags: {
                isHidden: true /* <- TODO: Modal modules should be always hidden*/,
            },
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
