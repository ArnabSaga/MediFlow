import { IRequestUser } from "./request.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IRequestUser;
    }
  }
}
