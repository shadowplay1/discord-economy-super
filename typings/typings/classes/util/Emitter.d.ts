import EconomyEvents from '../../interfaces/EconomyEvents'

/**
* Economy event emitter with only important emitter methods.
*/
declare class Emitter {

    /**
     * Listens to the event.
     * @param event Event name
     * @param listener Callback function
     */
    on<T extends keyof EconomyEvents>(event: T, listener: (...args: EconomyEvents[T][]) => any): Emitter

    /**
     * Listens to the event only once.
     * @param event Event name
     * @param listener Callback function
     */
    once<T extends keyof EconomyEvents>(event: T, listener: (...args: EconomyEvents[T][]) => any): Emitter

    /**
     * Emits the event.
     * @param event Event name
     * @param args Args to send in the event.
     */
    emit<T extends keyof EconomyEvents>(event: T, ...args: EconomyEvents[T][]): boolean
}

export = Emitter