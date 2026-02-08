import { Request, Response } from "express";

import { SpecialtyService } from "./specialty.service";

import { catchAsync } from "../../shared/catchAsync";

const createSpecialty = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await SpecialtyService.createSpecialty(payload);

  res.status(201).json({
    success: true,
    data: result,
    message: "Specialty created successfully",
  });
});

const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtyService.getAllSpecialties();

  res.status(200).json({
    success: true,
    data: result,
    message: "Specialties retrieved successfully",
  });
});

const updateSpecialty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await SpecialtyService.updateSpecialty(id as string, payload);

  res.status(200).json({
    success: true,
    data: result,
    message: "Specialty updated successfully",
  });
});

const deleteSpecialty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await SpecialtyService.deleteSpecialty(id as string);

  res.status(200).json({
    success: true,
    data: result,
    message: "Specialty deleted successfully",
  });
});

export const SpecialtyController = {
  createSpecialty,
  getAllSpecialties,
  deleteSpecialty,
  updateSpecialty,
};
