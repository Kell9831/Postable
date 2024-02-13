import { NextFunction, Request, Response } from "express";

export default function logRequest(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const now = Date.now();
  const formatNow = new Date(now);
  console.log(`${req.method}:"${req.path}" - ${formatNow} `);
  next();
}
