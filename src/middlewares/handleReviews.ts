import { Request, Response, NextFunction } from "express";

export default function handlePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals["id"] = req.params["id"];
  next();
}
