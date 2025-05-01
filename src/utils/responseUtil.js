// src/utils/responseUtil.js
const formatResponse = (success, message, payload) => {
    return {
        success,
        message,
        payload
    };
};

module.exports = {
    formatResponse
};
