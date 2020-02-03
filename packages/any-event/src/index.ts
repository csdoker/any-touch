
export interface Listener {
    (...payload: any): void;
    targetEl?: HTMLElement | HTMLCollection;
}

export interface ListenersMap {
    [propName: string]: Listener[];
}
export default class AnyEvent {
    callbackMap: ListenersMap;
    targetEl?: HTMLElement | HTMLCollection;
    targetEls?: (HTMLElement | HTMLCollection)[];
    constructor() {
        this.callbackMap = {};
    };

    target(el: HTMLElement | HTMLCollection) {
        this.targetEl = el;
        const els = Array.isArray(el) ? Array.from(el) : [el];
        this.targetEls = this.targetEls || [];
        this.targetEls.push(...els);
        return this;
    };

    /**
     * 绑定事件
     * @param {String|Symbol} 事件名
     * @param {Function} 回调函数
     */
    on(eventName: string, listener: Listener): this {
        if (void 0 === this.callbackMap[eventName]) {
            this.callbackMap[eventName] = [];
        }
        listener.targetEl = this.targetEl;
        this.callbackMap[eventName].push(listener);
        // 重置targetEl
        this.targetEl = void 0;
        return this;
    };

    /**
     * 解除绑定 
     * 如果不指定listener, 那么解除所有eventName对应回调
     * @param {String|Symbol} 事件名
     * @param {Function} 回调函数
     */
    off(eventName: string, listener?: Listener): this {
        const listeners = this.callbackMap[eventName];
        // 事件存在
        if (void 0 !== listeners) {
            // 清空事件名对应的所有回调
            if (void 0 === listener) {
                delete this.callbackMap[eventName];
            }
            // 清空指定回调
            else {
                const index = listeners.findIndex((fn: Listener) => fn === listener);
                listeners.splice(index, 1);
            }
        }
        return this;
    };

    /**
     * 按照监听器注册的顺序，同步地调用每个注册到名为 eventName 的事件的监听器，并传入提供的参数。
     * @param {String|Symbol} 事件名 
     * @param {Any} 载荷数据 
     * @returns {Boolean} 如果事件有监听器，则返回 true，否则返回 false。
     */
    emit(eventName: string, payload?: any): boolean {
        const listeners = this.callbackMap[eventName];
        const { target } = payload || {};
        if (void 0 !== listeners && 0 < listeners.length) {
            for (const listener of listeners) {
                const { targetEl } = listener;
                if (void 0 === target ||
                    void 0 === targetEl ||
                    target === targetEl ||
                    (Array.isArray(targetEl) && Array.from(targetEl).includes(target))
                ) {
                    listener(payload);
                }
            }
            return true;
        } else {
            return false;
        }
    };

    /**
     * 销毁实例
     */
    destroy() {
        this.callbackMap = {};
    };
};