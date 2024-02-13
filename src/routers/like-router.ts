import express from "express";
import { authenticateHandler } from "../middlewares/authenticate";
import { ApiError } from "../middlewares/error";
import { LikeParams } from "../models/likes";
import { likePost, deleteLike } from "../services/like-service";

const likeRouter = express.Router();

likeRouter.post('/posts/:postId/like', authenticateHandler, async (req, res, next) => {
    try {
        const userIdFromToken = req.userId;
        const postIdFromUrl = parseInt(req.params.postId, 10);

        if (userIdFromToken === undefined) {
            return next(new ApiError('Usuario no autenticado', 404));
        }

        const likeParams: LikeParams = {
            postId: postIdFromUrl,
            userId: userIdFromToken,
        };

        const likeResponse = await likePost(likeParams);

        res.status(200).json(likeResponse);
    } catch (error) {
        next(error);
    }
});

likeRouter.delete('/posts/:postId/like', authenticateHandler, async (req, res, next) => {
    try {
        const userIdFromToken = req.userId;
        const postIdFromUrl = parseInt(req.params.postId, 10);

        if (userIdFromToken === undefined) {
            return next(new ApiError('Usuario no autenticado', 404));
        }

        const likeParams: LikeParams = {
            postId: postIdFromUrl,
            userId: userIdFromToken,
        };

        const deleteLikeResponse = await deleteLike(likeParams);

        res.status(200).json(deleteLikeResponse);
    } catch (error) {
        next(error);
    }
});


export default likeRouter;