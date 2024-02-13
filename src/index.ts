import express from "express";
import userRouter from "./routers/user-router";
import postRouter from "./routers/post-router";
import likeRouter from "./routers/like-router";
import logRequest from "./middlewares/logRequest";
import authRouter from "./routers/auth-router";
import errorHandler from "./middlewares/error";


const app = express();
const port = 5505;

app.use(express.json());
app.use(logRequest);
app.use("/", authRouter);
app.use("/", userRouter);
app.use("/",postRouter);
app.use("/",likeRouter);


app.use(errorHandler);
app.listen(port, () => console.log(`Escuchando al puerto ${port}`));
