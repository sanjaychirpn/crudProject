// utils/responseHelper.js

exports.sendResponse = (res, statusCode, message, data = null) => {
    res.status(statusCode).json({
        statusCode,
        message,
        data,
    });
};
