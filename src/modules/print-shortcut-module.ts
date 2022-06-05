import { declareModule } from '@collboard/modules-sdk';
import { contributors, description, license, repository, version } from '../../package.json';

declareModule({
    manifest: {
        name: '@collboard/print-shortcut',
        title: { en: 'Shortcut Ctrl+P to print', cs: 'Zkratka Ctrl+P pro tisk' },
        contributors,
        description,
        license,
        repository,
        version,
    },
    async setup(systems) {
        const { controlSystem, appState, routingSystem } = await systems.request(
            'controlSystem',
            'appState',
            'routingSystem',
        );
        return controlSystem.registerControl({
            defaultShortcut: ['Control', 'p'],
            executor() {
                routingSystem.urlVariables.setValue({ module: '@collboard/print', modulePath: null });
            },
        });
    },
});
