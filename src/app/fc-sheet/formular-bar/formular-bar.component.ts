import { Component } from '@angular/core';
@Component({
    selector: 'formular-bar',
    templateUrl: './formular-bar.component.html',
    styleUrls: [`./formular-bar.component.scss`]
})
export class FormulaBarComponent {
    selectedRange: string = 'H5';
    formulaValue: string;
    constructor() {
    }
}