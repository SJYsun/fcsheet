import { Injectable, Injector } from '@angular/core';
import { ComponentType, DialogConfig, DIALOG_DATA, PortalInjector } from './base/common';
import { Container } from './base/container';
import { ContainerRef } from './base/container.ref';
import { DialogContainerComponent } from './dialog/container';
import { DialogRef } from './dialog/dialog.ref';
import { DialogComponent } from './dialog/template';

@Injectable()
export class DialogService {
    constructor(
        private container: Container,
        private injector: Injector
    ) { }

    public dialog(config?: DialogConfig) {
        config = config || { body: null };
        config = {
            title: config.title || '消息',
            body: config.body,
            ok: config.ok || '确认',
            no: config.no || '取消',
            zindex: config.zindex || '1000',
            left: config.left || "50%",
            top: config.top || "50%",
            background: config.background || 'mask',
            backgroundColor: config.backgroundColor || '#d38c03',
            showCancel: true
        };
        return this.openDialog(DialogComponent, config);
    }

    private openDialog<T>(component: ComponentType<T>, config: DialogConfig): DialogRef<T> {
        const containerRef: ContainerRef = this.container.createContainer();
        const containerComponent: DialogContainerComponent =
            this.createContainerComponent(containerRef, DialogContainerComponent, config);
        const dialogRef = this.attachDialog(component, containerComponent, containerRef, config);
        return dialogRef;
    }

    private attachDialog<T>(
        component: ComponentType<T>,
        containerComponent: any,
        containerRef: ContainerRef,
        data?: DialogConfig
    ) {
        const dialogRef = new DialogRef<T>(containerRef, containerComponent);
        const injector = this.createDialogInjector<T>(data, dialogRef, containerComponent);
        if (containerComponent.attachComponent) {
            const contentRef = containerComponent.attachComponent(component, injector);
            dialogRef.componentInstance = contentRef.instance;
        }
        return dialogRef;
    }
    private createContainerComponent<T>(
        containerRef: ContainerRef,
        containerComponent: ComponentType<T>,
        dialogConfig: DialogConfig
    ) {
        const container = containerRef.createComponent(containerComponent, dialogConfig);
        return container.instance;
    }

    private createDialogInjector<T>(
        config: any = {},
        popupRef: any,
        dialogContainer: DialogContainerComponent
    ): PortalInjector {
        const injectionTokens = new WeakMap();
        injectionTokens.set(DialogRef, popupRef);
        injectionTokens.set(DialogContainerComponent, dialogContainer);
        injectionTokens.set(DIALOG_DATA, config);
        return new PortalInjector(this.injector, injectionTokens);
    }
}
