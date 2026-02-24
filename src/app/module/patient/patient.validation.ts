import { z } from "zod";
import { BloodGroup } from "../../../generated/prisma/enums";

const updatePatientProfileZodSchema = z.object({
  patientInfo: z
    .object({
      name: z
        .string("Name must be a string")
        .min(1, "Name can't be empty")
        .max(100, "Name can't be more than 100 characters")
        .optional(),
      profilePhoto: z.url("Profile photo must be a valid URL").optional(),
      contactNumber: z
        .string("Contact number must be a string")
        .min(11, "Contact number must be at least 11 digits")
        .max(15, "Contact number must be at most 15 digits")
        .optional(),
      address: z
        .string("Address must be a string")
        .min(1, "Address can't be empty")
        .max(255, "Address can't be more than 255 characters")
        .optional(),
    })
    .optional(),
  patientHealthData: z
    .object({
      gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
      dateOfBirth: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" })
        .optional(),
      bloodGroup: z
        .enum([
          BloodGroup.A_POSITIVE,
          BloodGroup.A_NEGATIVE,
          BloodGroup.B_POSITIVE,
          BloodGroup.B_NEGATIVE,
          BloodGroup.AB_POSITIVE,
          BloodGroup.AB_NEGATIVE,
          BloodGroup.O_POSITIVE,
          BloodGroup.O_NEGATIVE,
        ])
        .optional(),
      hasAllergies: z.boolean().optional(),
      hasDiabetes: z.boolean().optional(),
      height: z.string().optional(),
      weight: z.string().optional(),
      smokingStatus: z.boolean().optional(),
      dietaryPreferences: z.string().optional(),
      pregnancyStatus: z.boolean().optional(),
      mentalHealthHistory: z.string().optional(),
      immunizationStatus: z.string().optional(),
      hasPastSurgeries: z.boolean().optional(),
      recentAnxiety: z.boolean().optional(),
      recentDepression: z.boolean().optional(),
      maritalStatus: z.string().optional(),
    })
    .optional(),
  medicalReports: z
    .array(
      z.object({
        shouldDelete: z.boolean().optional(),
        reportId: z.uuid().optional(),
        reportName: z.string().optional(),
        reportLink: z.url().optional(),
      })
    )
    .optional()
    .refine(
      (reports) => {
        if (!reports || reports.length === 0) return true; // if no reports or empty array, it's valid

        for (const report of reports) {
          //* case - 1 => if shouldDelete is true, reportId must be present
          if (report.shouldDelete === true && !report.reportId) {
            return false;
          }

          //* case - 2 => if reportId is present, shouldDelete must be false
          if (report.reportId && !report.shouldDelete) {
            return false;
          }

          //* case - 3 => if reportName and reportLink are present, shouldDelete must be false
          if (report.reportName && !report.reportLink) {
            return false;
          }

          //* case - 4 => if reportLink is present, reportName must be false
          if (report.reportLink && !report.reportName) {
            return false;
          }

          return true;
        }
      },
      {
        message:
          "Invalid patient medical reports data. If shouldDelete is true, reportId must be present. If reportId is present, shouldDelete must be false. If reportName is present, reportLink must be false. If reportLink is present, reportName must be false.",
      }
    ),
});

export const PatientValidation = {
  updatePatientProfileZodSchema,
};
