import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";

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

}
