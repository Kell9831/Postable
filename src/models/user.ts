import { z } from "zod";

export const userSchema = z.object({
  username: z.string({
    required_error: "Username es requerido",
    invalid_type_error: "Username debe ser un string",
  }),
  password: z
    .string()
    .min(6, "Password debe tener al menos 6 caracteres")
    .refine((value) => value !== null, {
      message: "Password es requerido",
    }),
  email: z
    .string({
      required_error: "Email es requerido",
      invalid_type_error: "Email debe ser un string",
    })
    .email({
      message: "Email debe tener un formato de dirección de correo electrónico válido",
    })
    .refine((value) => value !== undefined ? value : null).optional(), 
  firstName: z
    .string({
      required_error: "FirstName es requerido",
      invalid_type_error: "FirstName debe ser un string",
    })
    .refine((value) => value !== undefined ? value : " ").optional(), 
  lastName: z
    .string({
      required_error: "LastName es requerido",
      invalid_type_error: "LastName debe ser un string",
    })
    .refine((value) => value !== undefined ? value : null).optional(),
  role: z
    .enum(["admin", "user"], {
      errorMap: () => ({ message: "Role solo puede ser 'user' o 'admin'" }),
    })
    .default("user"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type UserParams = z.infer<typeof userSchema>;
export type User = UserParams & { id: number };

export const editUserSchema = userSchema.partial();



