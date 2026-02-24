import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { DoctorController } from "./doctor.controller";
import { updateDoctorProfileZodSchema, updateDoctorZodSchema } from "./doctor.validation";

import { multerUpload } from "../../config/multer.config";
import { updateMyDoctorProfileMiddleware } from "./doctor.middleware";

const router = Router();

router.patch(
  "/update-my-profile",
  checkAuth(Role.DOCTOR),
  multerUpload.single("profilePhoto"),
  updateMyDoctorProfileMiddleware,
  validateRequest(updateDoctorProfileZodSchema),
  DoctorController.updateMyProfile
);

router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DoctorController.getAllDoctors);

router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DoctorController.getDoctorById);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateDoctorZodSchema),
  DoctorController.updateDoctor
);

router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DoctorController.deleteDoctor);

export const DoctorRoutes = router;
