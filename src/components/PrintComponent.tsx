import {
    AppState,
    downloadFile,
    ExportScopePickerComponent,
    ExportScopeSimple,
    ExportSystem,
    IExportScope,
    React,
    Translate,
    TranslationsSystem,
} from '@collboard/modules-sdk';
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
                    console.log(document.querySelector('iframe'));
                    (document.querySelector('iframe') as HTMLIFrameElement).contentWindow!.print();
                    //window.frames['printf'].focus();
                    //window.frames['printf'].print();
                    /*
                    const [pdfFile] = await exportSystem.exportFiles({
                        scope,
                        isHeavyExport: true,
                        mimeType: 'application/pdf',
                    });

                    await printFile(pdfFile);
                    */
                }}
            >
                <Translate name={`Print`}>Print</Translate>
            </button>

            <button
                className="button button-primary"
                onClick={async () => {
                    const [pdfFile] = await exportSystem.exportFiles({
                        scope,
                        isHeavyExport: true,
                        mimeType: 'application/pdf',
                    });

                    await downloadFile(pdfFile);
                }}
            >
                <Translate name={`Download`}>Download</Translate>
            </button>

            <PdfComponent {...{ exportSystem, scope }} />
        </>
    );
}
