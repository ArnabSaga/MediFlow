import { Router } from "express";

import { validateRequest } from "../../middleware/validateRequest";

import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { UserControllers } from "./user.controller";
import { createDoctorZodSchema } from "./user.validation";

const router = Router();

router.post("/create-doctor", validateRequest(createDoctorZodSchema), UserControllers.createDoctor);

router.post("/create-admin", checkAuth(Role.SUPER_ADMIN, Role.ADMIN), UserControllers.createAdmin);
export const UserRoutes = router;
