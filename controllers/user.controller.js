const db = require("../db");
const jwt = require("jsonwebtoken");
const messages = require("../errors");
const bcrypt = require('bcryptjs');
const validator = require("validator");

// query objects
const queries = {
    createPerson: "INSERT INTO person (name, surname, email, passwordHash) values ($1, $2, $3, $4) RETURNING *",
    getUser: "SELECT id, name, surname, email FROM person WHERE id = $1",
    updateUser: "UPDATE person SET name = $2, surname = $3, email = $4 WHERE id = $1 RETURNING * ",
    getUsers: "SELECT * FROM person",
    delUser: "DELETE FROM person WHERE id = $1",
}

class UserController {
    async createUser(req, res) {
        //Getting info from body
        const {name, surname, email, password} = req.body;

        if (req.body.length < 1) {
            return res.status(400).json({message: messages.badReq.emptyBody})
        }
        if (!validator.isEmail(email)) {
            return res.status(400).send({message: messages.badReq.validationError})
        }
        if  (password < 6){
            return res.status(400).send({message: messages.badReq.validationError})
        }
        if (!email || !password || !name) {
            return res.status(400).json({message: messages.badReq.badData});
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10); //hash
            const user = await db.query(queries.createPerson, [name, surname, email, hashedPassword]); // create rows

            const {passwordhash, ...userData} = user.rows[0]; // remove passwordhash from response
            const token = jwt.sign(userData, process.env.JWT_SECRET_KEY, {expiresIn: '30d'}); // sign jwt

            return res.json({token: token});
        } catch (error) {
            console.error(error);
            return res.status(500).send({message: messages.resErr.serverError});
        }
    }

    async getUsers(req, res) {
        try {
            const users = new Promise(async (resolve, reject) => {
                await resolve(db.query(queries.getUsers))
            }).then(r => res.status(200).json(r.rows));
        } catch (e) {
            console.error(e)

            if (e.name === 'TokenExpiredError') {
                return res.status(401).send({message: messages.unauthorized.expiredToken});
            } else if (e.name === 'JsonWebTokenError') {
                return res.status(401).send({message: messages.unauthorized.invalidToken});
            } else if (e.name === 'NotBeforeError') {
                return res.status(401).send({message: messages.unauthorized.activeToken});
            } else {
                return res.status(500).send({message: messages.resErr.serverError});
            }
        }
    }

    async getOneUser(req, res) {
        const userId = req.params.id

        try {
            const user = await db.query(queries.getUser, [userId])

            if (user.rows.length === 0) {
                return res.status(404).send({message: messages.badReq.notFound});
            }

            res.status(200).json(user.rows[0]);
        } catch (e) {
            console.error(e);
            res.status(500).send({message: messages.resErr.serverError});
        }
    }

    async updateUser(req, res) {
        const {id, name, surname, email} = req.body;

        if (req.body.length < 1) {
            return res.status(400).json({message: messages.badReq.emptyBody})
        }
        if (!validator.isEmail(email)) {
            return res.status(400).send({message: messages.badReq.validationError})
        }
        if (!email || !name) {
            return res.status(400).json({message: messages.badReq.badData});
        }

        try {
            let updatedUser = await db.query(queries.updateUser, [id, name, surname, email]);

            const {passwordhash, ...userData} = updatedUser.rows[0];
            const token = jwt.sign(userData, process.env.JWT_SECRET_KEY, {expiresIn: '30d'}); // sign jwt
            res.status(200).json({token: token});
        } catch (e) {
            console.error(e);
            res.status(500).send({message: messages.resErr.serverError});
        }
    }

    async deleteUser(req, res) {
        const userId = req.params.id

        try {
            const user = await db.query(queries.delUser, [userId])

            res.status(200).json({
                status: 'success',
            });
        } catch (e) {
            console.error(e);
            res.status(500).send({message: messages.resErr.serverError});
        }
    }
}


module.exports = new UserController();