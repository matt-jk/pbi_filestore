/*
 * MIT license
 * functions for use in the FileStore custom visual
 * Matt Kalal
 * matt_jk@hotmail.com
 */

function downloadFile(file_content: Uint8Array, filename: string) {
    //
    // The saveAs is implemented in FileSaver.js module
    // included under "node_modules"
    //
    let gsaveAs = (<any>window).saveAs;
    var blob = new Blob([file_content.buffer]);
    gsaveAs(blob, filename);
};

function convert_to_bin(tmpArray: Array<string>) {
    //
    // returns a Uint8Array representing a binary file
    //
    let tmpfileb64: string = "";
    let binary_content: Uint8Array;

    tmpArray.sort();

    for (let tmpRow of tmpArray) {
        tmpfileb64 += tmpRow.substring(6);
    }

    //
    // convert from base64
    //

    let tmpfile = atob(tmpfileb64);

    binary_content = new Uint8Array(tmpfile.length);

    for (let i = 0, strLen = tmpfile.length; i < strLen; i++) {
        binary_content[i] = tmpfile.charCodeAt(i);
    }

    return binary_content;
}
