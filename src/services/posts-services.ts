import * as postDB from "../data/posts-data";
import {  PostParams } from "../models/posts";


export async function createPost(postParams: PostParams): Promise<any > {
  try {
    const newPost = await postDB.createPost(postParams);

    const response = {
      ok: true,
      message: 'Post creado exitosamente',
      data: {
        id: newPost.id,
        content: newPost.content,
        username: newPost.username,
        createdAt: newPost.createdAt,
        updatedAt: newPost.updatedAt,
      },
    };

    return response;
  } catch (error) {
    console.error('Error al crear el post:', error);

    const errorResponse = {
      ok: false,
      message: 'Error al crear el post',
    
    };

    return errorResponse;
  }
}


export async function editPost(postId: number, postParams: PostParams): Promise<any> {
  try {
    const updatedPost = await postDB.editPost(postId, postParams);

    const response = {
      ok: true,
      message: 'Post actualizado exitosamente',
      data: {
        id: updatedPost.id,
        content: updatedPost.content,
        createdAt: updatedPost.createdAt,
        updatedAt: updatedPost.updatedAt,
        username: updatedPost.username,
      },
    };

    return response;
  } catch (error) {
    console.error('Error al actualizar el post:', error);

    const errorResponse = {
      ok: false,
      message: 'Error al actualizar el post',
    
    };

    return errorResponse;
  }
}


export async function getAllPosts(
  page: number = 1,
  limit: number = 10,
  username?: string,
  orderBy: string = "createdAt",
  order: string = "asc"
): Promise<any> {
  try {
    const posts = await postDB.getAllPosts(page, limit, username, orderBy, order);

    // Pagination
    const totalItems = await getTotalPostsCount(username);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      ok: true,
      data: posts,
      pagination: {
        page,
        pageSize: limit,
        totalItems,
        totalPages,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
      },
    };
  } catch (error) {
    console.log('Error al obtener los posts:');
    
  }
}

async function getTotalPostsCount(username?: string): Promise<number> {
  return postDB.getTotalPostsCount(username);
}
