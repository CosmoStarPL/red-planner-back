const jwt = require("jsonwebtoken");
const messages = require("../const/errors");

const verifyToken = (req, res, next) => {
    if (req.path === '/api/user/create' && req.method === 'POST') {
        return next();
    }

    if (req.path === '/api/user/login' && req.method === 'POST') {
        return next();
    }

    if (req.path === '/api/user/check/auth' && req.method === 'GET') {
        return next();
    }

    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).send({message: messages.unauthorized.emptyToken});
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        next();
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            return res.status(401).send({message: messages.unauthorized.expiredToken});
        } else if (e.name === 'JsonWebTokenError') {
            return res.status(401).send({message: messages.unauthorized.invalidToken});
        } else {
            return res.status(500).send({message: messages.resErr.serverError});
        }
    }
};

module.exports = verifyToken;
