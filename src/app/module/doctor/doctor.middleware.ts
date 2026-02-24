import { NextFunction, Request, Response } from "express";
import { IUpdateDoctorProfilePayload } from "./doctor.interface";

export const updateMyDoctorProfileMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.data) {
    req.body = JSON.parse(req.body.data);
  }

  const payload: IUpdateDoctorProfilePayload = req.body;

  const file = req.file;

  if (file) {
    if (!payload.doctor) {
      payload.doctor = {};
    }
    payload.doctor.profilePhoto = file.path;
  }

  req.body = payload;

  next();
};
