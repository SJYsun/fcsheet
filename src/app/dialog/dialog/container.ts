import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, EventEmitter, Inject, Injector, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { dialog, mask } from '../animations';
import { ComponentType, DIALOG_DATA } from '../base/common';
import { ContainerHostDirective } from '../base/container-host';

@Component({
    selector: 'dialog-container',
    template: `
        <div class="dialog-mask" [@mask]="(data.background === 'transition' || data.background === 'loose') ? 'exit' : _state" (click)="close()"></div>
        <div class="dialog-wrapper" [ngStyle]="{'z-index':data.zindex,top:data.top,left:data.left,'background-color':data.backgroundColor}" [@dialog]="_state" (@dialog.start)="_onAnimationStart($event)" (@dialog.done)="_onAnimationDone($event)">
            <ng-template dialogHost></ng-template>
        </div>
        
    `,
    styles: [`
    .dialog-mask{
        background: rgba(0, 0, 0, .6);
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0
    }
    .dialog-wrapper {
        position: absolute;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        background: #fafafa;
        border: solid 1px #a7abb0;
        box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);
        -webkit-box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);
        -moz-box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);
        padding:4px;
        
    }
    `
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
    animations: [dialog, mask]
})
export class DialogContainerComponent {
    public animationStateChange = new EventEmitter<AnimationEvent>();
    public _state: 'void' | 'enter' | 'exit' = 'enter';
    private isAnimating = false;
    private disposeFn: (() => void) | null;
    @ViewChild(ContainerHostDirective) private host: ContainerHostDirective;
    constructor(
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private changeDetectorRef: ChangeDetectorRef,
        @Inject(DIALOG_DATA) public data: any,
    ) { }
    public attachComponent<T>(component: ComponentType<T>, injector: Injector): ComponentRef<T> {
        return this.host.attachComponent(component, injector);
    }
    public _onAnimationDone(event: AnimationEvent) {
        this.animationStateChange.emit(event);
        this.isAnimating = false;
    }
    public _onAnimationStart(event: AnimationEvent) {
        this.isAnimating = true;
        this.animationStateChange.emit(event);
    }
    public _startExitAnimation(): void {
        this._state = 'exit';
        this.changeDetectorRef.markForCheck();
    }
    public close() {
        if (this.data.background === 'mask' || this.data.background === 'loose') {
            this._startExitAnimation();
        }
    }
}
