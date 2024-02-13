import * as likeDb from "../data/like-data";
import { LikeParams } from "../models/likes";


export async function likePost(likeParams: LikeParams): Promise<any> {
    try {
        const postDetails = await likeDb.getPostDetails(likeParams.postId);

        return {
            ok: true,
            data: postDetails,
        };
    } catch (error) {
        console.error(`Error al dar like al post: ${(error as Error).message}`);
        return {
            ok: false,
            message: `Error al dar like al post: ${(error as Error).message}`,
        };
    }
}

export async function deleteLike(likeParams: LikeParams): Promise<any> {
    try {
        const updatedPostDetails = await likeDb.deleteLike(likeParams.postId, likeParams.userId);

        return {
            ok: true,
            data: updatedPostDetails,
        };
    } catch (error) {
        console.error(`Error al quitar el like al post: ${(error as Error).message}`);
        return {
            ok: false,
            message: `Error al quitar el like al post: ${(error as Error).message}`,
        };
    }
}