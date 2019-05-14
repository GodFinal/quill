export default class ParchmentError extends Error {
    constructor(message) {
        message = '[Parchment] ' + message;
        super(message);
        this.message = message;
        this.name = this.constructor.name;
    }
}
