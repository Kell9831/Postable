import { query } from "../db";

export async function getPostDetails(postId: number): Promise<any> {
    const result = await query(
        `
        SELECT posts.id, posts.content, posts.createdAt, posts.updatedAt, users.username, COUNT(likes.id) as likesCount
        FROM posts
        JOIN users ON posts.userId = users.id
        LEFT JOIN likes ON posts.id = likes.postId
        WHERE posts.id = $1
        GROUP BY posts.id, users.username
        `,
        [postId]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
}
 
export async function deleteLike(postId: number, userId: number): Promise<any> {
    await query(
        `
        DELETE FROM likes
        WHERE postId = $1 AND userId = $2
        `,
        [postId, userId]
    );

    // Obtener los detalles del post después de eliminar el like
    const result = await query(
        `
        SELECT posts.id, posts.content, posts.createdAt, posts.updatedAt, users.username, COUNT(likes.id) as likesCount
        FROM posts
        JOIN users ON posts.userId = users.id
        LEFT JOIN likes ON posts.id = likes.postId
        WHERE posts.id = $1
        GROUP BY posts.id, users.username
        `,
        [postId]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
}