exports.globalErrHandler = (err, req, res, next) => {
    const status = err.status ? err.status : 'failed';
    const statusCode = err.statusCode ? err.statusCode : 500;
    const message = err.message;

    res.status(statusCode).json({
        status, message 
    });
};

exports.notFoundErr = (req, res, next) => {
    const error = new Error(`Can't find ${req.originalUrl} on the server`);
    next(error);
}