import { Directive, Injector, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { ComponentType } from './common';

@Directive({
    selector: '[dialogHost]',
})
export class ContainerHostDirective {
    private disposeFn: (() => void) | null;
    constructor(
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {}
    public attachComponent<T>(component: ComponentType<T>, injector: Injector): ComponentRef<T> {
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
}
