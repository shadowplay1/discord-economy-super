import EconomyEvents from '../interfaces/EconomyEvents'

/**
* Simple Economy event emitter with only important emitter methods.
*/
declare class Emitter {
    
    /**
     * Listens to the event.
     * @param event Event name
     * @param listener Callback function
     */
    on<K extends keyof EconomyEvents>(event: K, listener: (...args: EconomyEvents[K][]) => void): this;

    /**
     * Listens to the event only once.
     * @param event Event name
     * @param listener Callback function
     */
    once<K extends keyof EconomyEvents>(event: K, listener: (...args: EconomyEvents[K][]) => void): this;

    /**
     * Emits the event.
     * @param event Event name
     * @param args Args to send in the event.
     */
    emit<K extends keyof EconomyEvents>(event: K, ...args: EconomyEvents[K][]): boolean;
}

export = Emitter