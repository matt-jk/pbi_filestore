/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

/*
 * Modified by Matt Kalal
 * matt_jk@hotmail.com
 * for custom visual filestore
 */

module powerbi.extensibility.visual {
    "use strict";
    export class Visual implements IVisual {
        private target: HTMLElement;
        private settings: VisualSettings;

        constructor(options: VisualConstructorOptions) {
            this.target = options.element;

            let shtml: string = '<b><u><span id="top">Download File</span></u></b>';
            shtml += '<table>'
            shtml += '<tr><td>File:</td><td><span id="filename">filename</span></td></tr>';
            shtml += '<tr> <td>Size:</td> <td><span id="filesize">filesize</span></td> </tr>';
            shtml += '</table>';
            shtml += '<br><button id="btnDownload">Download</button>';

            //console.log("Begin constructor");

            if (typeof document !== "undefined") {

                let controlDiv: HTMLDivElement = document.createElement("div");
                controlDiv.innerHTML = shtml;
                this.target.appendChild(controlDiv);
            }
        }

        public update(options: VisualUpdateOptions) {
            this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
            let dataView: DataView = options.dataViews[0];

            //console.log("Begin update");

            for (let cc of dataView.table.columns) {
                switch (true) {
                    case cc.roles.hasOwnProperty("file_name"):
                        var file_name = dataView.table.rows[0][cc.index] as number;
                        break;
                    case cc.roles.hasOwnProperty("file_content"):
                        var file_colno = cc.index;
                        break;
                    default:
                }
            }

            let current_file_name: HTMLSpanElement = document.getElementById("filename") as HTMLSpanElement;

            /*
             * this block is where it loads the content.
             * It only takes a second to run, but I guess if it doesn't have to run
             * we shouldn't run, so only run this block if it is a new filename
             */

            if (current_file_name.innerHTML != file_name.toString()) {
                let file_content: Uint8Array = convert_to_bin(dataView.table.rows.map(trow => trow[file_colno].toString()));
                current_file_name.innerHTML = file_name.toString();
                (document.getElementById("filesize") as HTMLSpanElement).innerHTML = Math.floor(file_content.length / 1024).toString() + ' KB';
                (document.getElementById("btnDownload") as HTMLButtonElement).onclick = function () {downloadFile(file_content, file_name.toString())};
            }
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         * 
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }
    }
}
