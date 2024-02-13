import { z } from "zod";

export const likeSchema = z.object({
  postId: z
    .number({
      required_error: "PostId es requerido",
      invalid_type_error: "PostId debe ser un número",
    }),
  userId: z
    .number({
      required_error: "UserId es requerido",
      invalid_type_error: "UserId debe ser un número",
    }),
    createdAt: z.string().optional(),
});

export type LikeParams = z.infer<typeof likeSchema>;
export type Like = LikeParams & { id: number };

