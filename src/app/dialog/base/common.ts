import { InjectionToken, Injector, TemplateRef } from '@angular/core';

export interface ComponentType<T> {
    new(...args: any[]): T;
}

export class PortalInjector implements Injector {
    constructor(
        private _parentInjector: Injector,
        private _customTokens: WeakMap<any, any>
    ) { }

    public get(token: any, notFoundValue?: any): any {
        const value = this._customTokens.get(token);

        if (typeof value !== 'undefined') {
            return value;
        }

        return this._parentInjector.get<any>(token, notFoundValue);
    }
}
export interface DialogConfig {
    /**
     * 是否显示取消按钮，用于区分alert和dialog
     */
    showCancel?: boolean;
    /**
     * 弹窗标题
     */
    title?: string;
    /**
     * 内容
     */
    body: TemplateRef<any> | ComponentType<any>;
    /**
     * 确认文字
     */
    ok?: string;
    /**
     * 取消文字
     */
    no?: string;
    /**
     * 弹窗层级
     */
    zindex?: string;
    /**
     * [transition]透明点击无效
     * [mask]点击后关闭
     * [strict]点击无效
     * [none]无遮罩
     * [loose]透明点击后关闭
     */
    background?: 'transition' | 'mask' | 'strict' | 'none' | 'loose';
    /**
     * 弹窗位置
     */
    top?: string;
    left?: string;
    backgroundColor?: string;
}
export const DIALOG_DATA = new InjectionToken<any>('DIALOG_DATA');
