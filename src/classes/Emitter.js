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
    constructor() { }

    /**
     * Listens to the event.
     * @param {ShopEvents} event Event name. 
     * @param {Function} listener Callback function.
     * @returns {Emitter} Economy Emitter.
     */
    on(event, listener) {
        return emitter.on(event, listener)
    }

    /**
     * Listens to the event only for once.
     * @param {ShopEvents} event Event name.
     * @param {Function} listener Callback function.
     * @returns {Emitter} Economy Emitter.
     */
    once(event, listener) {
        return emitter.once(event, listener)
    }

    /**
     * Emits the event.
     * @param {ShopEvents} event Event name.
     * @param {any} data Any data to send.
     * @returns {Boolean} If emitted: true; else: false.
     */
    emit(event, data) {
        return emitter.emit(event, data)
    }
}

module.exports = Emitter

/**
 * @typedef {'balanceSet' | 'balanceAdd' | 'balanceSubtract' |
 * 'bankSet' | 'bankAdd' | 'bankSubtract' |
 * 'shopAddItem' | 'shopEditItem' | 'shopItemBuy' |
 * 'shopItemUse' | 'shopClear' |
 * 'ready' | 'destroy'} ShopEvents
 */
