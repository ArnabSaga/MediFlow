import { Router } from "express";
import { SpecialtyRoutes } from '../modules/specialty/specialty.route';

const router = Router();

router.use("/specialties", SpecialtyRoutes);

export const IndexRoutes = router;
