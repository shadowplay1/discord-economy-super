const { EventEmitter } = require('events')
const emitter = new EventEmitter()

/**
 * Simple Economy event emitter with only important emitter methods.
 * @private
 */
class Emitter {
    /**
    * Simple Economy event emitter with only important emitter methods.
    * @private
    */
    constructor() {}
    
    /**
     * Listens to the event.
     * @param {'balanceSet' | 'balanceAdd' | 'balanceSubtract' | 'bankSet' | 'bankAdd' | 'bankSubtract' | 'shopAddItem' | 'shopEditItem' | 'shopItemBuy' | 'shopItemUse' | 'shopClear' | 'ready' | 'destroy'} event Event name. 
     * @param {Function} fn Callback function.
     * @returns {Emitter} Economy Emitter.
     */
    on(event, fn) {
        return emitter.on(event, fn)
    }

    /**
     * Listens to the event only for once.
     * @param {'balanceSet' | 'balanceAdd' | 'balanceSubtract' | 'bankSet' | 'bankAdd' | 'bankSubtract' | 'shopAddItem' | 'shopEditItem' | 'shopItemBuy' | 'shopItemUse' | 'shopClear' | 'ready' | 'destroy'} event Event name.
     * @param {Function} fn Callback function.
     * @returns {Emitter} Economy Emitter.
     */
    once(event, fn) {
        return emitter.once(event, fn)
    }

    /**
     * Emits the event.
     * @param {'balanceSet' | 'balanceAdd' | 'balanceSubtract' | 'bankSet' | 'bankAdd' | 'bankSubtract' | 'shopAddItem' | 'shopEditItem' | 'shopItemBuy' | 'shopItemUse' | 'shopClear' | 'ready' | 'destroy'} event Event name.
     * @param {any} data Any data to send.
     * @returns {Boolean} If emitted: true; else: false.
     */
    emit(event, data) {
        return emitter.emit(event, data)
    }
}

module.exports = Emitter