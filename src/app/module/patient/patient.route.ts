import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { PatientController } from "./patient.controller";
import { updateMyPatientProfileMiddleware } from "./patient.middleware";
import { PatientValidation } from "./patient.validation";

const router = Router();

router.patch(
  "/update-my-profile",
  checkAuth(Role.PATIENT),
  multerUpload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "medicalReports", maxCount: 5 },
  ]),
  updateMyPatientProfileMiddleware,
  validateRequest(PatientValidation.updatePatientProfileZodSchema),
  PatientController.updateMyProfile
);

export const PatientRoute = router;
