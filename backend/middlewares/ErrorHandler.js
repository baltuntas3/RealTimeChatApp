const catchErrors = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function errorHandler(err, req, res, next) {
    let statusCode = 422;
    if (err.name == "AuthException") statusCode = 401;
    const now = Date.now();
    const timestamp = new Date(now);
    const errorMessages = {
        timestamp: timestamp,
        message: err.message,
        subErrors: [],
    };
    if (Array.isArray(err)) {
        const errors = err.map((error) => error.message);
        errorMessages.subErrors.push(errors);
        return res.status(statusCode).send(errorMessages);
    }
    return res.status(statusCode).send(errorMessages);
}

module.exports = { errorHandler, catchErrors };
