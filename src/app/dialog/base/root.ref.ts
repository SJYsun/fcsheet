import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injector } from '@angular/core';
import { ComponentType, DialogConfig, DIALOG_DATA, PortalInjector } from './common';

export class RootRef {
    private disposeFn: (() => void) | null;
    private isDisposed: boolean = false;
    constructor(
        private rootDOM: HTMLElement,
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector
    ) { }
    public attach<T>(
        containerComponent: ComponentType<T>,
        dialogConfig: DialogConfig
    ) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(containerComponent);
        let componentRef: ComponentRef<T>;
        // 这一步要把遮罩的配置作为服务注入容器组件
        const injectionTokens = new WeakMap();
        injectionTokens.set(DIALOG_DATA, dialogConfig || {});

        componentRef = componentFactory.create(new PortalInjector(this.injector, injectionTokens));
        this.appRef.attachView(componentRef.hostView);
        this.setDisposeFn(() => {
            this.appRef.detachView(componentRef.hostView);
            componentRef.destroy();
        });
        this.rootDOM.appendChild(this.getComponentRootNode(componentRef));
        return componentRef;
    }

    public dispose(): void {
        if (this.disposeFn) {
            this.disposeFn();
            this.disposeFn = null;
        }
        this.isDisposed = true;
    }

    private setDisposeFn(fn: () => void) {
        this.disposeFn = fn;
    }

    private getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
        return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    }
}
