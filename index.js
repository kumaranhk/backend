import express from "express";
import jwt from 'jsonwebtoken';
import cors from 'cors';
import mongooseConnect from "./db-utils/mongoose.js";
import userRouter from "./routes/user.js";
import { giveDate } from "./utils/giveDate.js";
import productRouter from "./routes/products.js";
import vendorRouter from "./routes/vendors.js";
import orderRouter from "./routes/order.js";
import constants from "./constants/constants.js";

const app = express();
mongooseConnect();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    console.log(`${giveDate()} ${req.method} ${req.url}`);
    next();
});
const verifyJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).send({ msg: 'Unauthorized', error: true });
    }
    const tokenWithoutBearer = token.split(' ')[1];

    jwt.verify(tokenWithoutBearer, constants.jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ msg: 'Unauthorizeddddddd', error: true });
        }

        // If token is valid, save decoded token to request for use in other routes
        req.token = decoded.user;
        next();
    });
};

app.use('/users', userRouter);
app.use('/products', verifyJWT, productRouter);
app.use('/vendors', verifyJWT, vendorRouter);
app.use('/orders', verifyJWT, orderRouter);

const PORT = 8000;
app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));