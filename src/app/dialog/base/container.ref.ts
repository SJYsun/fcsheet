import { RootRef } from './root.ref';
import { ComponentType, DialogConfig } from './common';
import { ComponentRef } from '@angular/core';

export class ContainerRef {
    constructor(
        private rootRef: RootRef,
        private rootDOM: HTMLElement
    ) { }
    public createComponent<T>(
        containerComponent: ComponentType<T>,
        dialogConfig: DialogConfig
    ): ComponentRef<T> {
        return this.rootRef.attach(containerComponent, dialogConfig);
    }
    public removeComponent(): void {
        this.rootRef.dispose();
        if (this.rootDOM.parentNode != null) {
            this.rootDOM.parentNode.removeChild(this.rootDOM);
        }
    }
}
