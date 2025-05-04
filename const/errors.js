const messages = {
    badReq: {
        badData: "Email, name and password are required",
        validationError: "Please send a valid form",
        notFound: "Not found",
        emptyBody: "Please enter body",
        conflicted: "Data had signed up yet",
        unAuth: "Unauthorized",
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