import express from "express";
import { PostParams } from "../models/posts";
import { checkIfUserIsOwnerOfPost, createPost, editPost } from "../data/posts-data";
import { authenticateHandler } from "../middlewares/authenticate";
import { ApiError } from "../middlewares/error";
import { getAllPosts } from "../services/posts-services";
import { ParsedQs } from "qs";

 const postRouter = express.Router();


postRouter.post('/posts', authenticateHandler, async (req, res, next) => {
  console.log("middleware ejecutándose");
  try {
    const userIdFromToken = req.userId;

    // Verificamos que userIdFromToken existe
    if (!userIdFromToken) {
      return next(new ApiError('No se proporcionó el ID del usuario', 400));
    }

    // Log para verificar el cuerpo de la solicitud
    console.log('Cuerpo de la solicitud:', req.body);

    const postParams: PostParams = {
      userId: userIdFromToken,
      content: req.body.content,
    };

    // Crear el nuevo post
    const newPost = await createPost(postParams);

    // Respondemos con los datos del nuevo post
    res.status(201).json({
      ok: true,
      message: 'Post creado exitosamente',
      data: {
        id: newPost.id,
        content: newPost.content,
        createdAt: newPost.createdAt,
        updatedAt: newPost.updatedAt,
        username: newPost.username,
      },
    });
  } catch (error) {
    next(error);
  }
});


postRouter.patch('/posts/:id', authenticateHandler, async (req, res, next) => {
  console.log("se esta ejecutando /posts/:id");
  try {
    const userIdFromToken = req.userId;
    const postIdFromUrl = parseInt(req.params.id, 10);

    console.log("userIdFromToken:", userIdFromToken);
    console.log("postIdFromUrl:", postIdFromUrl);

    // Verificar que el usuario está autenticado
    if (userIdFromToken === undefined) {
      return next(new ApiError('Usuario no autenticado', 401));
    }

    // Verificar que el usuario es el propietario del post
    const isOwner = await checkIfUserIsOwnerOfPost(userIdFromToken, postIdFromUrl);

    console.log("Is owner:", isOwner);
    
    if (!isOwner) {
      return next(new ApiError('No estás autorizado para editar este post', 401));
    }

    // Editar el post existente
    const postParams: Partial<PostParams> = {
      content: req.body.content || '', // Puedes ajustar esto según tus necesidades
    };

    const updatedPostResponse = await editPost(postIdFromUrl, postParams);

    // Respondemos con los datos del post actualizado
    res.status(200).json(updatedPostResponse);
  } catch (error) {
    next(error);
  }
});



postRouter.get(
  "/posts",
  authenticateHandler,
  async (req, res, next) => {
    try {
      const { page, limit, username, orderBy, order } = req.query as {
        page?: string;
        limit?: string;
        username?: string;
        orderBy?: string;
        order?: string;
      };

      const postsResponse = await getAllPosts(
        parseInt(page || "1", 10),
        parseInt(limit || "10", 10),
        username,
        orderBy || "createdAt",
        order || "asc"
      );

      res.json(postsResponse);
    } catch (error) {
      next(error);
    }
  }
);



export default postRouter;