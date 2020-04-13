module.exports = (statusCode, message, details = []) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    err.details = details;
    return err;
}