const messages = {
    badReq: {
        badData: "Email, name and password are required",
        validationError: "Please send a valid email address",
        notFound: "Not found",
        emptyBody: "Please enter body",
    },
    unauthorized: {
        emptyToken: "Send token to the server",
        invalidToken: "Invalid token",
        expiredToken: "Expired token",
        activeToken: "Token not active yet",
    },
    resErr: {
        serverError: "Internal server error",
    }
}

module.exports = messages