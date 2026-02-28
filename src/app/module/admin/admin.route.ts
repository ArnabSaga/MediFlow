import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AdminController } from "./admin.controller";
import { updateAdminProfileZodSchema, updateAdminZodSchema } from "./admin.validation";

import { multerUpload } from "../../config/multer.config";
import { updateMyAdminProfileMiddleware } from "./admin.middleware";

const router = Router();

router.patch(
  "/update-my-profile",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("profilePhoto"),
  updateMyAdminProfileMiddleware,
  validateRequest(updateAdminProfileZodSchema),
  AdminController.updateMyProfile
);

router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), AdminController.getAllAdmins);

router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), AdminController.getAdminById);

router.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN),
  validateRequest(updateAdminZodSchema),
  AdminController.updateAdmin
);

router.delete("/:id", checkAuth(Role.SUPER_ADMIN), AdminController.deleteAdmin);

router.patch("/change-user-status", AdminController.changeUserStatus);

router.patch("/change-user-role", AdminController.changeUserRole);

export const AdminRoutes = router;
