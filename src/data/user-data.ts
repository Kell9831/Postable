import { query } from "../db";
import { User, UserParams } from "../models/user";
import { getCurrentTime } from "../utils/util";

export async function getUserById(id: number): Promise<User | undefined> {
  return (await query("SELECT * FROM users WHERE id = $1", [id])).rows[0];
}

export async function getUser(userId: string): Promise<{ username: string }> {
  const result = await query(
    `
    SELECT username
    FROM users
    WHERE id = $1
    `,
    [userId]
  );
  return result.rows[0];
}

export async function getUserMe(userId: number): Promise<User | undefined> {
  const result = await query(
    "SELECT id, username, email, firstName, lastName, createdAt, updatedAt FROM users WHERE id = $1",
    [userId]
  );

  return result.rows[0];
}


export async function createUser(userParams: UserParams): Promise<User> {
  const { username, password, email, firstName, lastName, role } = userParams;

  const currentTime = getCurrentTime();

  const result = await query(
    `
    INSERT INTO users (username, password, email, firstName, lastName, role, createdAt, updatedAt)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, username, email, firstName, lastName, createdAt, updatedAt
    `,
    [username, password, email, firstName, lastName, role, currentTime, currentTime]
  );

  return result.rows[0];
}


export async function updateUser(id: number, userParams: Partial<UserParams>): Promise<User | undefined> {
  const { username, password, email, firstName, lastName, role } = userParams;

  const currentTime = getCurrentTime();

  const result = await query(
    `
    UPDATE users
    SET username = COALESCE($1, username),
        password = COALESCE($2, password),
        email = COALESCE($3, email),
        firstName = COALESCE($4, firstName),
        lastName = COALESCE($5, lastName),
        role = COALESCE($6, role),
        updatedAt = $7
    WHERE id = $8
    RETURNING *, createdat
    `,
    [username as string, password as string, email as string, firstName as string, lastName as string, role as string, currentTime, id]
  );

  return result.rows[0];
}


export async function getUserByUsername(
  username: string
): Promise<User | undefined> {
  return (await query("SELECT * FROM users WHERE username = $1", [username]))
    .rows[0];
}




export async function deleteUser(id: number): Promise<void> {
  await query("DELETE FROM users WHERE id = $1", [id]);
}

