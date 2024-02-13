import express from "express";
import jwt from "jsonwebtoken";
import { createUser, validateCredentials } from "../services/user-services";
import { UserParams, userSchema } from "../models/user";
import { validationHandler } from "../middlewares/validation";
import { getCurrentTime } from "../utils/util";

const authRouter = express.Router();
authRouter.post(
  "/signup",
  validationHandler(userSchema),
  async (req, res, next) => {
    try {
      const newUserParams: UserParams = {
        ...req.body,
        createdAt: getCurrentTime(),
        updatedAt: getCurrentTime(),
      };

      const {data}  = await createUser(newUserParams);

      res.status(201).json({
        ok: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
);




const jwtSecret = "ultra-secret";
authRouter.post("/login", async (req, res, next) => {
  try {
    const user = await validateCredentials(req.body);
    const payload = { userId: user.id, userRole: user.role };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "10m" });

    res.json({ ok: true, message: "Login exitoso", data: { token } });
  } catch (error) {
    next(error);
  }
});

export default authRouter;
