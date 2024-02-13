import { z } from "zod";

export const postSchema = z.object({
  userId: z
    .number({
      required_error: "UserId es requerido",
      invalid_type_error: "UserId debe ser un número",
    }),
  content: z
    .string({
      required_error: "Contenido es requerido",
      invalid_type_error: "Contenido debe ser una cadena de texto",
    }),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  likesCount: z.number().optional(),
  username: z.string().optional(),
});


export type PostParams = z.infer<typeof postSchema>;
export type Post = PostParams & { id: number };

export const editPostSchema = postSchema.partial();