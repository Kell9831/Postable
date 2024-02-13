import express from "express";
import {
  updateUser,
  getUserById,
  getMyProfile,
  deleteProfile,
} from "../services/user-services";
import { ApiError } from "../middlewares/error";
import { authenticateHandler } from "../middlewares/authenticate";
import { getCurrentTime } from "../utils/util";


const userRouter = express.Router();

userRouter.get("/", authenticateHandler, async (req, res, next) => {
  const userId = req.userId as number;
  const user = await getUserById(userId);

  if (user) {
    res.json(user);
  } else {
    next(new ApiError("No autorizado", 401));
  }
});



userRouter.get('/me', authenticateHandler, async (req, res, next) => {
  try {
    const userIdFromToken = req.userId;

    // Verificamos que userIdFromToken existe
    if (!userIdFromToken) {
      return next(new ApiError('No se proporcionó el ID del usuario', 400));
    }

    // Obtener el perfil del usuario actual
    const userProfile = await getMyProfile(userIdFromToken);

    if (!userProfile) {
      return next(new ApiError('Usuario no encontrado', 404));
    }

    res.status(200).json({
      ok: true,
      message: 'Perfil obtenido correctamente',
      data: userProfile,
    });
  } catch (error) {
    next(error);
  }
});

userRouter.patch(
  '/me',
  authenticateHandler,
  async (req, res, next) => {
    console.log('Middleware ejecutándose...');
    try {
      const userIdFromToken = req.userId;
      console.log("Este es el userID a actualizar: " + userIdFromToken);

      // Verificamos que userIdFromToken existe
      if (!userIdFromToken) {
        return next(new ApiError('No se proporcionó el ID del usuario', 400));
      }

      // Verificamos que la solicitud tiene campos a actualizar
      if (!Object.keys(req.body).length) {
        return next(new ApiError('No hay campos para actualizar', 400));
      }

      // Actualizamos el usuario
      const updatedUser = await updateUser(userIdFromToken, req.body);

      if (!updatedUser) {
        return next(new ApiError('Usuario no encontrado', 404));
      }

      // Obtenemos el usuario actualizado 
      const user = await getUserById(userIdFromToken);
      
      if (!user) {
        return next(new ApiError('Usuario no encontrado', 404));
      }

      res.status(200).json({
        ok: true,
        message: 'Perfil actualizado',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
          updatedAt: getCurrentTime(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);


userRouter.delete('/me', authenticateHandler, async (req, res, next) => {
  try {
    const userIdFromToken = req.userId;
    if (!userIdFromToken) {
      return next(new ApiError('No se proporcionó el ID del usuario', 400));
    }

    //se verifica si el usuario a eliminar esa logueado
    if (!userIdFromToken) {
      return next(new ApiError('No se proporcionó el ID del usuario', 400));
    }
    
    await deleteProfile(userIdFromToken);

    res.status(200).json({
      ok: true,
      message: 'Perfil eliminado correctamente',
    });
  } catch (error) {
    next(error);
  }
});

export default userRouter;
