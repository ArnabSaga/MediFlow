import { prisma } from "../../lib/prisma";

const getAllDoctors = async () => {
  const doctors = await prisma.doctor.findMany({
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  });

  return doctors;
};

// TODO: Implement this
/*
const getDoctorById = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
          id,
        isDeleted: false
    },
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },

    },
  });

  return doctor;
};

const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
  const doctor = await prisma.doctor.update({
    where: {
      id,
    },
    data: payload,
  });

  return doctor;
};

const deleteDoctor = async (id: string) => {
  const doctor = await prisma.doctor.updateMany({
    where: {
      id,
      isDeleted: false,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  if (doctor.count === 0) {
    throw new AppError(status.BAD_REQUEST, "Doctor not found or already deleted");
  }

  return doctor;
};
*/
export const DoctorService = {
  getAllDoctors,
};
