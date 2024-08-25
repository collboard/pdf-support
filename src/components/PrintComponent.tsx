import {
    AppState,
    ExportScopePickerComponent,
    ExportScopeSimple,
    ExportSystem,
    IExportScope,
    React,
    Translate,
    TranslationsSystem,
    induceFileDownload,
} from '@collboard/modules-sdk';
import { exportPdfFile } from '../utils/exportPdfFile';
import { PdfComponent } from './PdfComponent';

interface IPrintComponentProps {
    // TODO: [👂] Here should be used react context to get systems container OR each system
    appState: AppState;
    exportSystem: ExportSystem;
    translationsSystem: TranslationsSystem;
}

export function PrintComponent({ exportSystem, appState, translationsSystem }: IPrintComponentProps) {
    const [scope, setScope] = React.useState<IExportScope>(ExportScopeSimple.Board);

    return (
        <>
            <ExportScopePickerComponent
                {...{ exportSystem, translationsSystem, appState }}
                value={scope}
                onChange={setScope}
            />

            <button
                className="button button-primary"
                onClick={async () => {
                    (
                        document.querySelector('.pdf-support-print-preview iframe') as HTMLIFrameElement
                    ).contentWindow!.print();
                }}
            >
                <Translate name={`Print`}>Print</Translate>
            </button>

            <button
                className="button button-primary"
                onClick={async () => {
                    await induceFileDownload(await exportPdfFile({ exportSystem, scope }));
                }}
            >
                <Translate name={`Download`}>Download</Translate>
            </button>

            <div className="pdf-support-print-preview">
                <PdfComponent {...{ exportSystem, scope }} />
            </div>
        </>
    );
}
