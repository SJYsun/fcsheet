import { Component, Inject, ViewEncapsulation, AfterViewInit, ViewChild, ViewContainerRef, TemplateRef, Type, ComponentFactoryResolver, ChangeDetectorRef, Injector, ComponentRef, OnInit } from '@angular/core';
import { DIALOG_DATA, ComponentType } from '../base/common';
import { DialogRef } from './dialog.ref';

@Component({
    template: `
       <!-- [Predefined] Default Modal Content -->
    <div *ngIf="data.title" class="dialog-content-header" [innerHTML]="data.title">
    </div>
    <ng-container #bodyContainer>
        <ng-container *ngIf="!isComponent(data.body)">
            <ng-container>
                <div class="dialog-content">
                    <ng-container *ngIf="isTemplateRef(data.body)" [ngTemplateOutlet]="data.body"></ng-container>
                </div>
            </ng-container>
        </ng-container>
    </ng-container>
    `,
    styles: [`
    .dialog-content-header{
        height:24px;
        text-align:center;
        line-height: 23px;
        font-size:14px;
    }
    .dialog-content{
        background:#fafafa;
        font-size: 14px;
        line-height: 1.5;
        word-wrap: break-word;
    }
    `],
    encapsulation: ViewEncapsulation.None
})
export class DialogComponent implements AfterViewInit, OnInit {
    private disposeFn: (() => void) | null;
    @ViewChild('bodyContainer', { read: ViewContainerRef }) bodyContainer: ViewContainerRef
    constructor(
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private changeDetectorRef: ChangeDetectorRef,
        @Inject(DIALOG_DATA) public data: any,
        private dialog: DialogRef<DialogComponent>
    ) { }
    public close(ok?: boolean) {
        this.dialog.close(!!ok);
    }
    ngAfterViewInit() {
    }
    ngOnInit() {
        if (this.isComponent(this.data.body)) {
            this.attachComponent(this.data.body); // Create component along without View
        }
    }
    public attachComponent<T>(component: ComponentType<T>, injector?: Injector): ComponentRef<T> {
        const viewContainerRef = this.viewContainerRef;
        const componentFactory =
            this.componentFactoryResolver.resolveComponentFactory(component);
        const ref = viewContainerRef.createComponent(
            componentFactory, viewContainerRef.length,
            injector || viewContainerRef.parentInjector);
        this.setDisposeFn(() => ref.destroy());
        return ref;
    }
    private setDisposeFn(fn: () => void) {
        this.disposeFn = fn;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    isTemplateRef(value: any): boolean {
        return value instanceof TemplateRef;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    isComponent(value: any): boolean {
        return value instanceof Type;
    }
}
