import bcrypt from "bcrypt";
import * as userDB from "../data/user-data";
import { ApiError } from "../middlewares/error";
import { User, UserParams } from "../models/user";
import { getCurrentTime } from "../utils/util";

export async function getUserById(id: number): Promise<User | undefined> {
  return await userDB.getUserById(id);
}

export async function createUser(data: UserParams): Promise<{  data: User }> {
  
    const { username, password, role, email, firstName, lastName } = data;

    // Verificar si el username ya está registrado
    const existingUser = await userDB.getUserByUsername(username);
    if (existingUser) {
      throw new ApiError("El username ya está registrado", 400);
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Obtener la fecha y hora actual
    const currentTime = getCurrentTime();

    // Crear el usuario en la base de datos
    const newUser = await userDB.createUser({
      username,
      password: hashedPassword,
      role,
      email,
      firstName,
      lastName,
      createdAt: currentTime,
      updatedAt: currentTime,
    });

    return { data: newUser };
  
}

export async function getMyProfile(userId: number): Promise<User | undefined> {
  try {
    const user = await userDB.getUserMe(userId);
    return user;
  } catch (error) {
    throw new Error('Error al obtener el perfil del usuario actual');
  }
}
export async function updateUser(id: number, userParams: Partial<UserParams>): Promise<User | undefined> {
  const existingUser = await userDB.getUserById(id);

  if (!existingUser) {
    throw new ApiError("Usuario no encontrado", 404);
  }

  const updatedUser = await userDB.updateUser(id, userParams);
  return updatedUser;
}

export async function validateCredentials(
  credentials: UserParams
): Promise<User> {
  const { username, password } = credentials;
  const user = await userDB.getUserByUsername(username);

  const isValid = await bcrypt.compare(password, user?.password || "");

  if (!user || !isValid) {
    throw new ApiError("Credenciales incorrectas", 400);
  }

  return user;
}

export async function deleteProfile(id: number): Promise<void> {
  const userToDelete = await userDB.getUserById(id);

  if (!userToDelete) {
    throw new ApiError("Usuario no encontrado", 404);
  }

  await userDB.deleteUser(id);
}
