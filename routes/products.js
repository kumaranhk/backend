import express from "express";
import { productModel, vendorModel } from "../db-utils/model.js";
import { decreaseSequenceValue, getNextSequenceValue } from "../utils/counter.js";

const productRouter = express.Router();

productRouter.post('/create-product', async (req, res) => {
    const { body } = req;
    const customerId = req.token.customerId;
    const role = req.token.role;
    if (role != "admin") return res.status(401).send({ msg: "You are unauthorized" });
    try {
        await productModel.create({ ...body, customerId, id: await getNextSequenceValue("productId") });
        res.send({ msg: "Product created successfully", error: false });
    } catch (err) {
        await decreaseSequenceValue("productId");
        console.log(err);
        res.status(err?._message ? 400 : 500).send({ msg: err?._message ? err?._message : "Something went wrong", error: true })
    }
});

productRouter.put('/edit-product/:id', async (req, res) => {
    const { body } = req;
    const { id } = req.params;
    const role = req.token.role;
    if (role != "admin") return res.status(401).send({ msg: "You are unauthorized" });
    try {
        const product = await productModel.findOne({ _id: id });
        await productModel.updateOne({ _id: product.id }, { $set: { ...body, updatedAt: new Date() } });
        res.send({ msg: "Product updated successfully", error: false })
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Something went wrong", error: true })
    }
});

productRouter.get('/', async (req, res) => {
    const customerId = req.token.customerId;
    try {
        const products = await productModel.find({ customerId }, { __v: 0, _id: 0 });
        res.send({ products, error: false });
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Something went wrong", error: true })
    }
});

productRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const role = req.token.role;
    if (role != "admin") return res.status(401).send({ msg: "You are unauthorized" });
    try {
        await productModel.deleteOne({ id });
        res.send({ msg: "Product deleted successfully", error: false })
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Something went wrong", error: true })
    }
});
productRouter.get('/:id', async (req, res) => {
    const customerId = req.token.customerId;
    const { id } = req.params;

    // console.log(id);
    try {
        const product = await productModel.findOne({ id, customerId }, { __v: 0, _id: 0 });
        res.send({ product, error: false });
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Something went wrong", error: true })
    }
});
export default productRouter;