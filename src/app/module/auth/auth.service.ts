import status from "http-status";

import { UserStatus } from "../../../generated/prisma/enums";

import AppError from "../../errorHelpers/AppError";

import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

interface IRegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

interface ILoginUserPayload {
  email: string;
  password: string;
}

const registerPatient = async (payload: IRegisterPatientPayload) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,

      //*default values
      // needsPasswordChange: false,
      // role: Role.PATIENT
    },
  });

  if (!data.user) {
    throw new AppError(status.BAD_REQUEST, "Failed to register patient");
  }

  try {
    const patient = await prisma.$transaction(async (tx) => {
      const patientTx = await tx.patient.create({
        data: {
          userId: data.user.id,
          name: payload.name,
          email: payload.email,
        },
      });

      return patientTx;
    });

    return {
      ...data,
      patient,
    };
  } catch (error) {
    console.log("Transaction Error: ", error);

    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    });

    throw error;
  }
};

const loginUser = async (payload: ILoginUserPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError(status.FORBIDDEN, "User is blocked. Please contact support.");
  }

  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError(status.FORBIDDEN, "User account has been deleted.");
  }
  return data;
};

export const AuthService = {
  registerPatient,
  loginUser,
};
