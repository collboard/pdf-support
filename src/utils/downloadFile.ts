/**
 * Download File
 *
 * !!! Take from @collboard-modules-sdk
 */
export async function downloadFile(file: File) {
    const url = URL.createObjectURL(file);
    console.log({ url });
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
}
