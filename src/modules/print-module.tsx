import { React, declareModule, makeModalModule, makeMultiModule } from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import { contributors, description, license, repository, version } from '../../package.json';
import { PrintComponent } from '../components/PrintComponent';
import { ModuleInstallation } from '@collboard/modules-sdk/types/50-systems/ModuleStore/ModuleInstallation';

declareModule(
    makeMultiModule({
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
        modules: [
            makeModalModule({
                async createModal(systems) {
                    const { exportSystem, translationsSystem, appState } = await systems.request(
                        'exportSystem',
                        'translationsSystem',
                        'appState',
                    );

                    // await forTime(1000);
                    return <PrintComponent {...{ exportSystem, translationsSystem, appState }} />;
                },
            }),
            {
                async setup(systems) {
                    const { moduleInstaller } = await systems.request('moduleInstaller');

                    const frames = await exportSystem.getFrames();


                    ModuleInstallation.install()

                    console.log({ frames });

                    // TODO: !!! Show virtual frame whenprinting

                    return Registration.void();
                },
            },
        ],
    }),
);

/**
 * TODO: [🐅] Maybe some more elegant way how to create icon-window pairs of modules
 * TODO: [🍈] Some way how to hide modal modules when colldev
 */
