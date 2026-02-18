import z from "zod";

const createSpecialtyZodSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long").optional(),
});

const updateSpecialtyZodSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long").optional(),
  description: z.string().min(10, "Description must be at least 10 characters long").optional(),
});

export const SpecialtyValidation = {
  createSpecialtyZodSchema,
  updateSpecialtyZodSchema,
};
