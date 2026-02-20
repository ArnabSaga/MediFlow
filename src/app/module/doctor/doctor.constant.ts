import { Prisma } from "../../../generated/prisma/client";

export const doctorSearchableFields = [
  "name",
  "email",
  "qualification",
  "designation",
  "currentWorkingPlace",
  "registrationNumber",
  "specialties.speciality.title",
];
export const doctorFilterableFields = [
  "gender",
  "isDeleted",
  "appointmentFee",
  "experience",
  "registrationNumber",
  "specialties.specialtyId",
  "currentWorkingPlace",
  "designation",
  "qualification",
  "specialties.speciality.title",
  "user.role",
  "user.email",
];

export const doctorIncludesConfig: Partial<
  Record<keyof Prisma.DoctorInclude, Prisma.DoctorInclude[keyof Prisma.DoctorInclude]>
> = {
  user: true,
  specialties: {
    include: {
      specialty: true,
    },
  },
  appointments: {
    include: {
      patient: true,
      doctor: true,
    },
  },
  doctorSchedules: {
    include: {
      schedule: true,
    },
  },
  prescriptions: true,
  reviews: true,
};
