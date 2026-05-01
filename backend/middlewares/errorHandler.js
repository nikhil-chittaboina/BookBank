const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal server error';

    if (statusCode >= 500) {
        console.error('[UNHANDLED_ERROR]', err);
    }

    res.status(statusCode).json({
        error: message
    });
};

module.exports = errorHandler;
