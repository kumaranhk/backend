import express from "express";
import { vendorModel } from "../db-utils/model.js";
import { decreaseSequenceValue, getNextSequenceValue } from "../utils/counter.js";

const vendorRouter = express.Router();

vendorRouter.post('/create-vendor', async (req, res) => {
    const role = req.token.role;
    if (role != "admin") return res.status(401).send({ msg: "You are unauthorized" });
    const customerId = req.token.customerId;
    const { body } = req;
    try {
        await vendorModel.create({ ...body, id: await getNextSequenceValue("vendorId"), customerId });
        res.send({ msg: "Vendor created successfully", error: false });
    } catch (err) {
        await decreaseSequenceValue("vendorId");
        console.log(err);
        res.status(err?._message ? 400 : 500).send({ msg: err?._message ? err?._message : "Something went wrong", error: true })
    }
});

vendorRouter.put('/edit-vendor/:id', async (req, res) => {
    const role = req.token.role;
    if (role != "admin") return res.status(401).send({ msg: "You are unauthorized" });
    const { body } = req;
    const { id } = req.params;
    try {
        const vendor = await vendorModel.findOne({ id });
        await vendorModel.updateOne({ id: vendor.id }, { $set: { ...vendor, ...body, updatedAt: new Date() } });
        res.send({ msg: "Vendor updated successfully", error: false })
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Something went wrong", error: true })
    }
});

vendorRouter.get('/:id?', async (req, res) => {

    const { id } = req.params;
    const customerId = req.token.customerId;
    if (id) {
        try {
            const vendor = await vendorModel.findOne({ id, customerId }, { __v: 0, _id: 0 });
            res.send({ vendor, error: false });
        } catch (err) {
            console.log(err);
            res.status(500).send({ msg: "Something went wrong", error: true })
        }
    }
    else {
        try {
            const vendors = await vendorModel.find({ customerId }, { _id: 0, __v: 0 });
            res.send({ vendors, error: false });
        } catch (err) {
            console.log(err);
            res.status(500).send({ msg: "Something went wrong", error: true })
        }
    }
});

vendorRouter.delete('/:id', async (req, res) => {
    const role = req.token.role;
    if (role != "admin") return res.status(401).send({ msg: "You are unauthorized" });
    const id = req.params;
    try {
        await vendorModel.deleteOne({ id });
        res.send({ msg: "Vendor deleted successfully", error: false })
    }
    catch {
        console.log(err);
        res.status(500).send({ msg: "Something went wrong", error: true })
    }
});

export default vendorRouter;