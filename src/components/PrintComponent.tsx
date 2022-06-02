import {
    AppState,
    ExportScopePickerComponent,
    ExportScopeSimple,
    ExportSystem,
    IExportScope,
    React,
    TranslationsSystem,
} from '@collboard/modules-sdk';
import { downloadFile } from '../utils/downloadFile';
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
                    const [pdfFile] = await exportSystem.exportFiles({
                        scope,
                        isHeavyExport: true,
                        mimeType: 'application/pdf',
                        isTesting: true /* !!! */,
                    });

                    await downloadFile(pdfFile);
                }}
            >
                Print
            </button>

            <PdfComponent {...{ exportSystem, scope }} />
        </>
    );
}
