/**
 * Error carrying an HTTP status, thrown by the service layer so controllers can
 * translate business failures into proper responses without leaking internals.
 */
class DomainError extends Error {
    constructor(status, message) {
        super(message);
        this.name = "DomainError";
        this.status = status;
    }
}

module.exports = DomainError;
