exports.errorHandler = (error, req, res, next) => {
    const status = error.statusCode || 400;
    const message = error.message;

    res.status(status).json({message: message});
};