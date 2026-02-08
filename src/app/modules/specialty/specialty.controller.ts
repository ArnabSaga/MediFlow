import { Request, Response } from "express";
import { SpecialtyService } from "./specialty.service";

const createSpecialty = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const result = await SpecialtyService.createSpecialty(payload);

    res.status(201).json({
      success: true,
      data: result,
      message: "Specialty created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to create specialty",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

const getAllSpecialties = async (req: Request, res: Response) => {
  try {
    const result = await SpecialtyService.getAllSpecialties();

    res.status(201).json({
      success: true,
      data: result,
      message: "Specialties retrieved successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve specialties",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

const updateSpecialty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const result = await SpecialtyService.updateSpecialty(id as string, payload);

    res.status(201).json({
      success: true,
      data: result,
      message: "Specialty updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to update specialty",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

const deleteSpecialty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await SpecialtyService.deleteSpecialty(id as string);

    res.status(201).json({
      success: true,
      data: result,
      message: "Specialty deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete specialty",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

export const SpecialtyController = {
  createSpecialty,
  getAllSpecialties,
  deleteSpecialty,
  updateSpecialty,
};
