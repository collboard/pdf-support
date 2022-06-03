import { ExportSystem, IExportScope } from '@collboard/modules-sdk';

export async function exportPdfFile({
    exportSystem,
    scope,
}: {
    exportSystem: ExportSystem;
    scope: IExportScope;
}): Promise<File> {
    const files = await exportSystem.exportFiles({
        scope,
        isHeavyExport: true,
        mimeType: 'application/pdf',
    });

    if (files.length === 0) {
        // TODO: [🀄] Custom error class
        throw new Error(`There is no PDF exported`);
    } else if (files.length === 1) {
        return files[0];
    } else {
        // tslint:disable-next-line:no-console
        console.warn(`More than one PDF exported.`, { files });
        return files[0];
    }
}
