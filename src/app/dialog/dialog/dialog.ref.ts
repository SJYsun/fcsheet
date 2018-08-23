import { AnimationEvent } from '@angular/animations';
import { DialogContainerComponent } from './container';
import { ContainerRef } from '../base/container.ref';
import { from, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
let uniqueId = 0;

export class DialogRef<T> {
    public componentInstance: T;
    private afterClosed = new Subject<any>();
    private result: any;
    constructor(
        private containerRef: ContainerRef,
        private containerComponent: DialogContainerComponent,
        private readonly id: string = `dialog-${uniqueId++}`
    ) {
        from(containerComponent.animationStateChange).pipe(filter((event: AnimationEvent) => event.phaseName === 'done' && event.toState === 'exit'))
            .subscribe(() => {
                this.containerRef.removeComponent();
                this.afterClosed.next(this.result);
                this.afterClosed.complete();
                this.componentInstance = null!;
            })

    }
    public close(result?: any) {
        // 执行关闭动画
        this.result = result;
        // Transition the backdrop in parallel to the dialog.
        from(this.containerComponent.animationStateChange).pipe(filter((event: AnimationEvent) => event.phaseName === 'start'))
            .subscribe();
        this.containerComponent._startExitAnimation();
    }
    public afterClose() {
        // 订阅关闭事件
        return this.afterClosed.asObservable();
    }
}
