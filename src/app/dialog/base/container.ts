import {
    Injectable,
    ComponentFactoryResolver,
    ApplicationRef,
    Injector
} from '@angular/core';
import { RootRef } from './root.ref';
import { ContainerRef } from './container.ref';

let nextUniqueId = 0;

@Injectable()
export class Container {
    private rootContainerDOM: HTMLElement;
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector
    ) { }
    public createContainer(): ContainerRef {
        const dom = document.createElement('div');
        dom.id = `dialog-root-${nextUniqueId++}`;
        dom.classList.add('dialog-root-container');
        this.getRootContainer().appendChild(dom);
        return new ContainerRef(
            new RootRef(
                dom,
                this.componentFactoryResolver,
                this.appRef,
                this.injector
            ),
            dom
        );
    }
    private getRootContainer(): HTMLElement {
        if (!this.rootContainerDOM) {
            const dom = document.createElement('div');
            dom.classList.add('dialog-root');
            document.body.appendChild(dom);
            this.rootContainerDOM = dom;
        }
        return this.rootContainerDOM;
    }
}
