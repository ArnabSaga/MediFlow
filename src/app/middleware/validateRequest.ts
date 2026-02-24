import { NextFunction, Request, Response } from "express";
import * as z from "zod";

export const validateRequest = (zodSchema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data && typeof req.body.data === "string") {
      req.body = JSON.parse(req.body.data);
    }

    const parsedResult = zodSchema.safeParse(req.body);

    if (!parsedResult.success) {
      next(parsedResult.error);
    }

    // sanitize the data
    req.body = parsedResult.data;

    next();
  };
};
