import { ExportSystem, FileComponent, IExportScope, Loader, LoaderInline, React } from '@collboard/modules-sdk';
import { exportPdfFile } from '../utils/exportPdfFile';
import { useAsyncMemo } from '../utils/useAsyncMemo';

interface IPrintComponentProps {
    // TODO: [👂] Here should be used react context to get systems container OR each system
    exportSystem: ExportSystem;
    scope: IExportScope;
}

export function PdfComponent({ exportSystem, scope }: IPrintComponentProps) {
    const pdfFile = useAsyncMemo<File | null>(async () => {
        try {
            return exportPdfFile({ exportSystem, scope });
        } catch (error) {
            console.error(error);
            return null;
        }
    }, [exportSystem, scope]);

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
