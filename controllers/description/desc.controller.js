const jwt = require("jsonwebtoken");
const messages = require("../../const/errors");
const db = require("../../db");
const queries = require("../../const/queries");

class DescriptionController {
    async createDesc(req, res) {
        const { data } = req.body;

        function getJwtToken(cookieString) {
            const cookieArray = cookieString.split('; ');
            const jwtCookie = cookieArray.find(cookie => cookie.startsWith('jwt='));

            if (jwtCookie) {
                return jwtCookie.split('=')[1];
            }

            return null;
        }
        const jwtData = jwt.decode(getJwtToken(req.headers.cookie))

        // Validate input
        if (!jwtData.id || !data || data.length === 0) {
            return res.status(400).json({ message: messages.badReq.badData });
        }

        if (data.length > 500) {
            return res.status(400).send({message: messages.badReq.validationError});
        }

        try {
            // Check if the person exists
            const person = await db.query(queries.getUser, [jwtData.id]);

            if (person.rows.length === 0) {
                return res.status(404).json({ message: messages.badReq.notFound });
            }

            const existingDesc = await db.query(queries.checkDesc, [jwtData.id]);

            if (existingDesc.rows.length > 0) {
                return res.status(409).json({ message: messages.badReq.conflicted });
            }

            // Insert the new description
            const result = await db.query(queries.createDescription, [data, jwtData.id]);
            // Return the newly created description
            return res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: messages.resErr.serverError });
        }
    }

    async getDesc (req, res) {
        function getJwtToken(cookieString) {
            const cookieArray = cookieString.split('; ');
            const jwtCookie = cookieArray.find(cookie => cookie.startsWith('jwt='));

            if (jwtCookie) {
                return jwtCookie.split('=')[1];
            }

            return null;
        }
        const jwtData = jwt.decode(getJwtToken(req.headers.cookie))

        // Validate input
        if (!jwtData.id) {
            return res.status(400).json({ message: messages.badReq.badData });
        }


        try {
            const description = await db.query(queries.getDesc, [jwtData.id]);

            if (description.rows.length < 0) {
                return res.status(404).json({ message: messages.badReq.notFound });
            }
            return res.status(200).json(description.rows[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: messages.resErr.serverError });
        }

    }
}

module.exports = new DescriptionController();