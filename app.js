//Requires

require('dotenv').config();
const express = require('express');
const cors = require("cors")
const cookieParser = require("cookie-parser");

const userRoute = require('./routes/user.routes');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({origin: 'http://localhost:3000', optionsSuccessStatus: 200, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(require("./settings/tokenCheck"))
app.use('/api', userRoute);


const start = async () => {
    try {
        await app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}/`);
        });
    } catch (e) {
        console.error(e)
    }
}

start().then(r => r)
