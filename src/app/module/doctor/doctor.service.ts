import status from "http-status";

import { UserStatus } from "../../../generated/prisma/enums";

import AppError from "../../errorHelpers/AppError";

import { Doctor, Prisma } from "../../../generated/prisma/client";
import { IQueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import {
  doctorFilterableFields,
  doctorIncludesConfig,
  doctorSearchableFields,
} from "./doctor.constant";
import { IUpdateDoctorPayload } from "./doctor.interface";

const getAllDoctors = async (queryParams: IQueryParams) => {
  // const doctors = await prisma.doctor.findMany({
  //   include: {
  //     user: true,
  //     specialties: {
  //       include: {
  //         specialty: true,
  //       },
  //     },
  //   },
  // });

  // return doctors;
  const queryBuilder = new QueryBuilder<Doctor, Prisma.DoctorWhereInput, Prisma.DoctorInclude>(
    prisma.doctor,
    queryParams,
    {
      searchableFields: doctorSearchableFields,
      filterableFields: doctorFilterableFields,
    }
  );

  const result = await queryBuilder
    .search()
    .filter()
    .where({
      isDeleted: false,
    })
    .includes({
      user: true,
      specialties: true,
    })
    .dynamicIncludes(doctorIncludesConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

const getDoctorById = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
      appointments: {
        include: {
          patient: true,
          schedule: true,
          prescription: true,
        },
      },
      doctorSchedules: {
        include: {
          schedule: true,
        },
      },
      reviews: true,
    },
  });
  return doctor;
};

const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
  const isDoctorExist = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });
  if (!isDoctorExist) {
    throw new AppError(status.NOT_FOUND, "Doctor not found");
  }

  const { doctor: doctorData, specialties } = payload;

  await prisma.$transaction(async (tx) => {
    if (doctorData) {
      await tx.doctor.update({
        where: {
          id,
        },
        data: {
          ...doctorData,
        },
      });
    }

    if (specialties && specialties.length > 0) {
      for (const specialty of specialties) {
        const { specialtyId, shouldDelete } = specialty;
        if (shouldDelete) {
          await tx.doctorSpecialty.delete({
            where: {
              doctorId_specialtyId: {
                doctorId: id,
                specialtyId,
              },
            },
          });
        } else {
          await tx.doctorSpecialty.upsert({
            where: {
              doctorId_specialtyId: {
                doctorId: id,
                specialtyId,
              },
            },
            create: {
              doctorId: id,
              specialtyId,
            },
            update: {},
          });
        }
      }
    }
  });

  const doctor = await getDoctorById(id);

  return doctor;
};

// Soft delete
const deleteDoctor = async (id: string) => {
  const isDoctorExist = await prisma.doctor.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!isDoctorExist) {
    throw new AppError(status.NOT_FOUND, "Doctor not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.user.update({
      where: { id: isDoctorExist.userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });

    await tx.session.deleteMany({
      where: { userId: isDoctorExist.userId },
    });

    await tx.doctorSpecialty.deleteMany({
      where: { doctorId: id },
    });
  });

  return { message: "Doctor deleted successfully" };
};

export const DoctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
