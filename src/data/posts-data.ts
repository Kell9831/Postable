import { query } from "../db";
import { Post, PostParams } from "../models/posts";
import { getCurrentTime } from "../utils/util";

export async function getPostById(postId: number): Promise<Post | null> {
  const result = await query(
    `
      SELECT * FROM posts
      WHERE id = $1
      `,
    [postId]
  );

  return result.rows[0] || null;
}



export async function createPost(postParams: PostParams): Promise<any> {
  const { userId, content } = postParams;

  const currentTime = getCurrentTime();

  const result = await query(
    `
      INSERT INTO posts (userId, content, createdAt, updatedAt)
      VALUES ($1, $2, $3, $4)
      RETURNING posts.id, posts.userId, posts.content, posts.createdAt, posts.updatedAt
    `,
    [userId, content, currentTime, currentTime]
  );


  const userResult = await query(
    `
      SELECT users.username
      FROM users
      WHERE users.id = $1
    `,
    [userId]
  );

  const username = userResult.rows[0].username;

  return { ...result.rows[0], username };
}


export async function editPost(postId: number, postParams: Partial<PostParams>): Promise<any> {
  try {
    const currentTime = getCurrentTime();

    const result = await query(
      `
        UPDATE posts
        SET content = COALESCE($1, content),
            updatedAt = $2
        WHERE id = $3
        RETURNING id, userId, content, createdAt, updatedAt
      `,
      [postParams.content, currentTime, postId]
    );

    const updatedPost = result.rows[0];

    if (!updatedPost) {
      throw new Error('No se encontró el post para actualizar');
    }

    // Verificar que el usuario existe antes de obtener su nombre de usuario
    if (updatedPost.userId) {
      const userResult = await query(
        `
          SELECT username
          FROM users
          WHERE id = $1
        `,
        [updatedPost.userId]
      );

      if (userResult.rows.length > 0) {
        const username = userResult.rows[0].username;
        console.log("Username:", username);

        if (username) {
          return { ...updatedPost, username };
        }
      } else {
        console.error("No se encontró el usuario con ID:", updatedPost.userId);
      }
    } else {
      console.error("El post no tiene un ID de usuario válido.");
      return updatedPost;  // Retorna el post actualizado sin nombre de usuario
    }

    throw new Error('No se pudo obtener el nombre de usuario del propietario del post');
  } catch (error: any) {
    console.error(`Error al actualizar el post: ${(error as Error).message}`);
    throw new Error(`Error al actualizar el post: ${(error as Error).message}`);
  }
}

export async function checkIfUserIsOwnerOfPost(userId: number, postId: number): Promise<boolean> {
  try {
    const result = await query(
      `
        SELECT 1
        FROM Posts
        WHERE id = $1 AND userId = $2
      `,
      [postId, userId]
    );

    return result.rows.length > 0;
  } catch (error) {
    console.error('Error al verificar la propiedad del post:', error);
    throw new Error('Error al verificar la propiedad del post');
  }
}

export async function getPost(): Promise<Post[]> {
  const result = await query("SELECT * FROM post;");
  return result.rows;
}

export async function getAllPosts(
  page: number = 1,
  limit: number = 10,
  username?: string,
  orderBy: string = "createdAt",
  order: string = "asc"
): Promise<Post[]> {
  let queryText = `
    SELECT * FROM posts
    WHERE ($1::text IS NULL OR username = $1)
    ORDER BY ${orderBy} ${order}
    LIMIT $2 OFFSET $3;
  `;

  const offset = (page - 1) * limit;
  const queryParams = [username || undefined, limit, offset];

  const result = await query(queryText, queryParams);
  return result.rows;
}

export async function getTotalPostsCount(username?: string): Promise<number> {
  let queryText = `
    SELECT COUNT(*) FROM posts
    WHERE ($1::text IS NULL OR username = $1);
  `;

  const queryParams = [username || undefined];

  const result = await query(queryText, queryParams);
  return Number(result.rows[0].count);
}
