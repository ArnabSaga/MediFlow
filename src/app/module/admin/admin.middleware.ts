import { NextFunction, Request, Response } from "express";
import { IUpdateAdminProfilePayload } from "./admin.interface";

export const updateMyAdminProfileMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.data) {
    req.body = JSON.parse(req.body.data);
  }

  const payload: IUpdateAdminProfilePayload = req.body;

  const file = req.file;

  if (file) {
    if (!payload.admin) {
      payload.admin = {};
    }
    payload.admin.profilePhoto = file.path;
  }

  req.body = payload;

  next();
};
