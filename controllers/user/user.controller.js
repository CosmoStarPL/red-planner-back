const db = require("../../db");
const jwt = require("jsonwebtoken");
const messages = require("../../const/errors");
const bcrypt = require('bcryptjs');
const validator = require("validator");
const queries = require("../../const/queries");
const {createUser} = require("./get/createUser");

class UserController {
    async createUser(req, res) {
        //Getting info from body
        const {name, surname, email, password} = req?.body;

        if (req.body.length < 1) {
            return res.status(400).json({message: messages.badReq.emptyBody})
        }
        if (password < 6) {
            return res.status(400).send({message: messages.badReq.validationError})
        }
        if (!email || !password || !name) {
            return res.status(400).json({message: messages.badReq.badData});
        }

        try {

            const result = await db.query(queries.getEmail, [email]);

            if (result.rows.length > 0) {
                return res.status(409).send({message: messages.badReq.conflicted});
            }

            const hashedPassword = await bcrypt.hash(password, 10); //hash
            const user = await db.query(queries.createPerson, [name, surname, email, hashedPassword]); // create rows

            const {passwordhash, ...userData} = user.rows[0]; // remove passwordhash from response
            const token = jwt.sign(userData, process.env.JWT_SECRET_KEY); // sign jwt

            res.cookie("jwt", token, { httpOnly: true });
            return await res.status(200).json(user.rows[0]);
        } catch (error) {
            console.error(error);

            if (error.code === '23505') {
                return await res.status(409).send({message: messages.badReq.conflicted});
            }

            return await res.status(500).send({message: messages.resErr.serverError});
        }
    }

    async getUsers(req, res) {
        try {
            const users = new Promise(async (resolve, reject) => {
                await resolve(db.query(queries.getUsers))
            }).then(r => res.status(200).json(r.rows));
        } catch (e) {
            console.error(e)
            return await res.status(500).send({message: messages.resErr.serverError});
        }
    }

    async getOneUser(req, res) {
        const jwtId = req.cookies["jwt"];

        const userId = jwt.decode(jwtId, process.env.JWT_SECRET_KEY);

        try {
            const user = await db.query(queries.getUser, [userId.id])

            if (user.rows.length === 0) {
                return await res.status(404).send({message: messages.badReq.notFound});
            }

            await res.status(200).json(user.rows[0]);
        } catch (e) {
            console.error(e);
            await res.status(500).send({message: messages.resErr.serverError});
        }
    }

    async updateUser(req, res) {
        const {id, name, surname, email} = req.body;

        if (req.body.length < 1) {
            return await res.status(400).json({message: messages.badReq.emptyBody})
        }
        if (!validator.isEmail(email)) {
            return await res.status(400).send({message: messages.badReq.validationError})
        }
        if (!email || !name) {
            return await res.status(400).json({message: messages.badReq.badData});
        }

        try {
            let updatedUser = await db.query(queries.updateUser, [id, name, surname, email]);

            const {passwordhash, ...userData} = updatedUser.rows[0];
            const token = jwt.sign(userData, process.env.JWT_SECRET_KEY, {expiresIn: '30d'}); // sign jwt
            await res.status(200).json({token: token});
        } catch (e) {
            console.error(e);
            await res.status(500).send({message: messages.resErr.serverError});
        }
    }

    async deleteUser(req, res) {
        const userId = req.params.id

        try {
            const user = await db.query(queries.delUser, [userId])

            await res.status(200).json({
                status: 'success',
            });
        } catch (e) {
            console.error(e);
            await res.status(500).send({message: messages.resErr.serverError});
        }
    }

    async login(req, res) {
        const {email, password} = req.body

        try {
            const user = await db.query(queries.getPassword, [email])

            if (user.rows.length === 0) {
                return await res.status(404).send({message: messages.badReq.notFound});
            }

            const isSame = await bcrypt.compare(password, user.rows[0].passwordhash);

            if(isSame) {
                const token = jwt.sign({id: user.rows[0].id}, process.env.JWT_SECRET_KEY); // sign jwt
                res.cookie("jwt", token, { httpOnly: true });
                return res.status(201).send(user.rows[0]);
            } else {
                return res.status(401).send({message: messages.badReq.unAuth});
            }

        } catch (e) {
            console.error(e);
            return await res.status(500).send({message: messages.resErr.serverError});
        }
    }

    async checkToken(req, res) {
        const token = req.cookies.jwt;

        if (!token) {
            return res.json({ authenticated: false });
        }

        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
            res.json({ authenticated: true });
        } catch (err) {
            res.json({ authenticated: false });
        }
    }

    async logout(req, res) {
        res.clearCookie("jwt");
        res.end()
    }
}


module.exports = new UserController();