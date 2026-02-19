import { Router } from "express";

import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";

import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";
import { SpecialtyController } from "./specialty.controller";
import { SpecialtyValidation } from "./specialty.validation";

const router = Router();

router.get("/", SpecialtyController.getAllSpecialties);

router.post(
  "/",
  // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(SpecialtyValidation.createSpecialtyZodSchema),
  SpecialtyController.createSpecialty
);

router.patch(
  "/:id",
  // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(SpecialtyValidation.updateSpecialtyZodSchema),
  SpecialtyController.updateSpecialty
);

router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialtyController.deleteSpecialty);

export const SpecialtyRoutes = router;
