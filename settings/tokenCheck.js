const messages = require("../errors");
const tokenCheck = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({message: messages.unauthorized.emptyToken})
    }
    if (!req.headers.authorization.startsWith("Bearer ")) {
        return res.status(401).send({message: messages.unauthorized.invalidToken})
    }
    next()
}

module.exports = tokenCheck