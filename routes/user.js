import express from "express";
import { userModel } from "../db-utils/model.js";
import bcrypt, { hash } from "bcrypt";
import { generateJWT, verifyJWT } from "../utils/jwtToken.js";
import { sendMail } from "../utils/mailer.js";
import constants from "../constants/constants.js";
import { decreaseSequenceValue, getNextSequenceValue } from "../utils/counter.js";

const userRouter = express.Router();

userRouter.post("/validate-user", async (req, res) => {
  const { body } = req;
  // console.log(body);
  try {
    const user = await userModel.findOne({ email: body.email });
    if (!user) {
      res.status(200).send({ msg: "Invalid email or password", error: true });
      return;
    }
    bcrypt.compare(body.password, user.password, async (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ msg: "Something went wrong", error: true });
      } else {
        if (result) {
          const user = await userModel.findOne(
            { email: body.email },
            { __v: 0, password: 0, _id: 0 }
          );
          let token = generateJWT({ user });
          res.send({
            msg: "Logged in successfully!",
            error: false,
            token,
            user,
          });
        } else {
          res.status(200).send({ msg: "Invalid email or password", error: true });
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.send({ msg: "Something went wrong", error: true });
  }
});

userRouter.post("/create-user", async (req, res) => {
  const { body } = req;
  const isCustomer = req.query.isCustomer;
  // console.log(body, "Recived in user api");
  try {
    let user = await userModel.findOne({ email: body.email });
    if (user) {
      return res.status(200).send({ msg: "Email alredy exists" });
    }
    if (isCustomer) {
      await userModel.create({ ...body, password: "", id: await getNextSequenceValue('userId'), id: await getNextSequenceValue('customerId') })
    }
    else await userModel.create({ ...body, password: "", id: await getNextSequenceValue('userId') });

    user = await userModel.findOne({ email: body.email }, { __v: 0, password: 0, _id: 0 });
    const jwtToken = generateJWT({ user });
    sendMail({
      email: body.email,
      link: `${constants.fronEndUrl}/reset-password?token=${jwtToken}`,
      name: body.name,
      type: "registration",
    });
    // console.log({ ...body, password: null });
    res.send({ msg: "User created successfully", error: false });
  } catch (error) {
    await decreaseSequenceValue('userId');
    console.log(error);
    res.status(500).send({ msg: "Something went wrong" });
  }
});

userRouter.post("/require-change-password", async (req, res) => {
  const { body } = req;
  try {
    let user = await userModel.findOne({ email: body.email }, { __v: 0, password: 0 });
    if (!user) {
      res.send({ msg: "Invalid email ID" });
      return;
    }
    const jwtToken = generateJWT(user);
    sendMail({
      email: user.email,
      link: `${constants.fronEndUrl}/reset-password?token=${jwtToken}`,
      name: user.name,
      type: "passwordReset",
    });
    res.send({ msg: "Email sent successfully" })
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Something went wrong" });
  }
});

userRouter.put("/create-password", async (req, res) => {
  const { body } = req;
  try {
    const decodedToken = verifyJWT(body.token);
    console.log(decodedToken, "token decode");
    if (decodedToken.success === false) {
      return res.status(401).send({ msg: "Unauthorized" });
    }
    console.log(decodedToken, "tokenksdj");
    let user = await userModel.findOne({ email: decodedToken.data.user.email });
    if (!user) {
      return res.send({ msg: "Invalid email ID" });
    }
    bcrypt.hash(body.password, 10, async (error, hash) => {
      if (error) {
        console.log(error);
        res.status(500).send({ msg: "Something went wrong" });
      } else {
        await userModel.updateOne({ email: decodedToken.data.user.email }, { $set: { password: hash } });
        // console.log({ ...user, password: hash });
        res.send({ msg: "Password reset successfully", error: false });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Something went wrong", error: true });
  }
});

userRouter.get('/customer-users/:id?', async (req, res) => {
  const { id } = req.params;
  const customerId = req.query.customerId;
  try {
    if (id != undefined && customerId != undefined) {
      const user = await userModel.findOne({ id, customerId }, { __v: 0, _id: 0, password: 0 });
      return res.send({ user, error: false });
    }
    const users = await userModel.find({ customerId }, { __v: 0, _id: 0, password: 0 });
    return res.send({ users, error: false });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Something went wrong", error: true });
  }
});
userRouter.put('/customer-users/edit-user/:id', async (req, res) => {
  const { id } = req.params;
  const { body } = req
  try {
    if (id) {
      const user = await userModel.findOne({ id });
      await userModel.updateOne({ id: user.id }, { $set: { ...user, ...body } })
      return res.send({ msg: "User updated successfully", error: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Something went wrong", error: true });
  }
});
userRouter.delete('/customer-users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      await userModel.deleteOne({ id });
      return res.send({ msg: "User deleted successfully", error: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Something went wrong", error: true });
  }
});
export default userRouter;
