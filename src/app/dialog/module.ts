import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from './service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Container } from './base/container';
import { ContainerHostDirective } from './base/container-host';
import { DialogContainerComponent } from './dialog/container';
import { DialogComponent } from './dialog/template';

@NgModule({
    declarations: [
        ContainerHostDirective,
        DialogComponent,
        DialogContainerComponent,
    ],
    imports: [BrowserAnimationsModule, CommonModule],
    exports: [],
    providers: [DialogService, Container],
    entryComponents: [
        DialogComponent,
        DialogContainerComponent,
    ]
})
export class DialogModule { }
