import { ExportScopeSimple, ExportSystem, FileComponent, Loader, LoaderInline, React } from '@collboard/modules-sdk';
import { forTime } from 'waitasecond';
import { useAsyncMemo } from '../utils/useAsyncMemo';

interface IPrintComponentProps {
    // TODO: [👂] Here should be used react context to get systems container OR each system
    exportSystem: ExportSystem;
}

/**
 * @collboard-modules-sdk
 */
export function PrintComponent({ exportSystem }: IPrintComponentProps) {
    // TODO: !!! Allow to pick a scope

    const pdfFile = useAsyncMemo<File | null>(async () => {
        await forTime(5000);
        const files = await exportSystem.exportFiles({
            scope: ExportScopeSimple.Board /* <- TODO: Allow to pick */,
            isHeavyExport: true,
            mimeType: 'application/pdf',
        });

        if (files.length === 0) {
            console.warn(`There is no PDF exported`);
            return null;
        } else if (files.length === 1) {
            return files[0];
        } else {
            console.warn(`More than one PDF exported.`, { files });
            return files[0];
        }
    }, []);

    if (pdfFile === undefined) {
        return <Loader alt="Creating PDF" />;
    } else if (pdfFile === null) {
        return (
            <LoaderInline alt="Nothing to print" icon="file-pdf" canLoadForever>
                Nothing to print
            </LoaderInline>
        );
    } else {
        return <FileComponent file={pdfFile} />;
    }
}
