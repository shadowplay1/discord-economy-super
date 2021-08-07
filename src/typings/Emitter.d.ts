/**
* Simple Economy event emitter with only important emitter methods.
*/
export default class Emitter {
    on(event: String, fn: Function): void
    once(event: String, fn: Function): void
    emit(event: String, data: any): void
}