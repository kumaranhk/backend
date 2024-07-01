import express from "express";
import { orderModel, productModel, vendorModel } from "../db-utils/model.js";
import { decreaseSequenceValue, getNextSequenceValue } from "../utils/counter.js";

const orderRouter = express.Router();

orderRouter.post('/create-order', async (req, res) => {
    const { body } = req;
    const role = req.token.role;
    if (role != "admin") return res.status(401).send({ msg: "You are unauthorized" });
    const customerId = req.token.customerId;
    const orderType = req.query.orderType;
    try {
        await orderModel.create({ ...body, id: await getNextSequenceValue("orderId"), customerId });
        const product = await productModel.findOne({ id: body.productId });
        console.log(product);
        await productModel.updateOne({ id: product.id }, {
            $push: {
                transactionHistory: {
                    date: new Date(), type: orderType, quantity: body.quantity, totalPrice: body.totalPrice
                }
            }
        });
        res.send({ msg: "Ordered successfully", error: false });
    } catch (err) {
        await decreaseSequenceValue("orderId");
        res.status(500).send({ msg: "Something went wrong", error: true });
        console.log(err);
    }
});

orderRouter.put('/change-status/:id', async (req, res) => {
    const role = req.token.role;
    if (role != "admin") return res.status(401).send({ msg: "You are unauthorized" });
    const { id } = req.params;
    const { body } = req;
    try {
        const order = await orderModel.findOne({ id });
        if (!order) return res.status(400).send({ msg: "Order not found", error: true });
        await orderModel.updateOne({ id }, { $set: { orderStatus: body.orderStatustatus, updatedAt: new Date() } });
        if (body.orderStatustatus === "completed") {
            const product = await productModel.findOne({ id: order.productId });
            await productModel.updateOne({ id: product.id }, { $set: { quantityOnHand: product.quantityOnHand + order.quantity } });
        }
        res.send({ msg: "Order updated successfully", error: false });
    } catch (err) {
        res.status(500).send({ msg: "Something went wrong", error: true });
        console.log(err);
    }
});

orderRouter.get('/', async (req, res) => {
    const customerId = req.token.customerId;
    try {
        const orders = await getOrderDetails(customerId);
        res.send({ orders, error: false });
    } catch (err) {
        res.status(500).send({ msg: "Something went wrong", error: true })
        console.log(err);
    }
})

const getOrderDetails = async (customerId) => {
    try {
        const result = await orderModel.aggregate([
            { $match: { customerId } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: 'id',
                    as: 'productDetails',
                },
            },
            {
                $lookup: {
                    from: 'vendors',
                    localField: 'vendorId',
                    foreignField: 'id',
                    as: 'vendorDetails',
                },
            },
            {
                $unwind: '$productDetails',
            },
            {
                $unwind: '$vendorDetails',
            },
            {
                $project: {
                    _id: 0,
                    id: 1,
                    productId: 1,
                    customerId: 1,
                    vendorId: 1,
                    createdAt: 1,
                    orderStatus: 1,
                    updatedAt: 1,
                    quantity: 1,
                    pricePerQuantity: 1,
                    totalPrice: 1,
                    transactionType: 1,
                    productDetails: 1,
                    vendorDetails: 1,
                },
            },
        ]);
        return result;
    } catch (error) {
        console.error('Error in aggregation:', error);
        throw error;
    }
};

export default orderRouter;