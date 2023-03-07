const { EventEmitter } = require('events')

const emitter = new EventEmitter({
    captureRejections: true
})


/**
 * Economy event emitter with only important emitter methods.
 * @private
 */
class Emitter {

    /**
    * Economy event emitter with only important emitter methods.
    * @private
    */
    constructor() { }

    /**
     * Listens to the event.
     * @param {EconomyEvents} event Event name.
     * @param {Function} listener Callback function.
     * @returns {Emitter} Economy Emitter.
     */
    on(event, listener) {
        emitter.on(event, listener)
        return this
    }

    /**
     * Listens to the event only for once.
     * @param {EconomyEvents} event Event name.
     * @param {Function} listener Callback function.
     * @returns {Emitter} Economy Emitter.
     */
    once(event, listener) {
        emitter.once(event, listener)
        return this
    }

    /**
     * Emits the event.
     * @param {EconomyEvents} event Event name.
     * @param {any} data Any data to send.
     * @returns {boolean} If emitted: true; else: false.
     */
    emit(event, data) {
        return emitter.emit(event, data)
    }
}

/**
 * Emitter class.
 * @type {Emitter}
 */
module.exports = Emitter

/**
 * @typedef {'balanceSet' | 'balanceAdd' | 'balanceSubtract' |
 * 'bankSet' | 'bankAdd' | 'bankSubtract' |
 * 'customCurrencySet' | 'customCurrencyAdd' | 'customCurrencySubtract' |
 * 'shopItemAdd' | 'shopItemEdit' | 'shopItemBuy' |
 * 'shopItemUse' | 'shopClear' |
 * 'ready' | 'destroy'} EconomyEvents Economy events.
 */
