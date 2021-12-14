import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {KtDialogService} from "../../../shared/services/kt-dialog.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-area-converter',
    templateUrl: './area-converter.component.html',
    styleUrls: ['./area-converter.component.scss']
})
export class AreaConverterComponent implements OnInit {

    Unit: string;
    Area: number;
    ConvertUnit: string;
    Result: number;
    ConvertorForm: FormGroup;
    UnitConverter = [{id: "1", name: "Kanal"}, {id: "2", name: "Acre"}, {id: "3", name: "Gunta"}]
    UnitConverterd = [{id: "1", name: "Marla"}]

    ngOnInit(): void {
    }

    constructor(
        public dialogRef: MatDialogRef<AreaConverterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
       ) { }

    AreaConverter() {

        if (this.Area != undefined) {
            if (this.Unit == "1" && this.ConvertUnit == "1") {
                this.Result = this.Area * 20;
            }

            if (this.Unit == "2" && this.ConvertUnit == "1") {
                this.Result = this.Area * 160;
            }
            if (this.Unit == "3" && this.ConvertUnit == "1") {
                this.Result = this.Area * 4;
            }

        }
    }

    onCloseClick() {
        this.dialogRef.close({ data: { TotalArea: this.Result.toString() } }); // Keep only this row
    }
}
