import { UserStatus } from "../../../generated/prisma/enums";
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
    throw new Error("Failed to register patient");
  }

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
    throw new Error("User is blocked. Please contact support.");
  }

  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new Error("User account has been deleted.");
  }
  return data;
};

export const AuthService = {
  registerPatient,
  loginUser,
};
