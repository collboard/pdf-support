import { declareModule, makeIconModuleOnRoute, ToolbarName } from '@collboard/modules-sdk';
import { contributors, description, license, repository, version } from '../../package.json';

// TODO: [🐅] Maybe some more elegant way how to create icon-window pairs of modules

declareModule(
    makeIconModuleOnRoute({
        manifest: {
            name: '@collboard/print-icon',
            title: { en: 'Print icon on toolbar', cs: 'Ikonka tisku na liště' },
            requirePermissions: ['view'],
            contributors,
            description,
            license,
            repository,
            version,
        },
        toolbar: ToolbarName.Social,
        icon: {
            icon: 'file-pdf' /* <- TODO: @roseckyj make icon for printing */,
            order: 30,
        },
        routeParams: {
            moduleName: '@collboard/print',
            modulePath: null,
        },
    }),
);
