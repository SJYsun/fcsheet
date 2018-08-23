import { Component } from '@angular/core';
import { DialogService } from '../../../dialog/service';
@Component({
    selector: 'clipboard-board',
    templateUrl: './clipboard-board.component.html',
    styleUrls: [`./clipboard-board.component.css`]
})
export class ClipboardComponent {
    constructor(public dialog: DialogService) {
    }
    event($event, div?) {
        this.dialog.dialog(
            {
                title: '我弹',
                body: ClipboardComponent,
                zindex: '1000',
                background: 'mask',
                top: '50%',
                left: '50%',
            })
    }
}