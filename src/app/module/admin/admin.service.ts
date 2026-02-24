import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { IUpdateAdminPayload, IUpdateAdminProfilePayload } from "./admin.interface";

const getAllAdmins = async () => {
  const admins = await prisma.admin.findMany({
    include: {
      user: true,
    },
  });
  return admins;
};

const getAdminById = async (id: string) => {
  const admin = await prisma.admin.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
  return admin;
};

const updateAdmin = async (id: string, payload: IUpdateAdminPayload) => {
  const isAdminExist = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  if (!isAdminExist) {
    throw new AppError(status.NOT_FOUND, "Admin Or Super Admin not found");
  }

  const { admin } = payload;

  const updatedAdmin = await prisma.admin.update({
    where: {
      id,
    },
    data: {
      ...admin,
    },
  });

  return updatedAdmin;
};

const deleteAdmin = async (id: string, user: IRequestUser) => {
  const isAdminExist = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  if (!isAdminExist) {
    throw new AppError(status.NOT_FOUND, "Admin Or Super Admin not found");
  }

  if (isAdminExist.id === user.userId) {
    throw new AppError(status.BAD_REQUEST, "You can not delete yourself");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.admin.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.user.update({
      where: { id: isAdminExist.userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });

    await tx.session.deleteMany({
      where: { userId: isAdminExist.userId },
    });

    await tx.account.deleteMany({
      where: { userId: isAdminExist.userId },
    });

    const admin = await getAdminById(id);

    return admin;
  });

  return result;
};

const updateMyProfile = async (user: IRequestUser, payload: IUpdateAdminProfilePayload) => {
  const adminData = await prisma.admin.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const { admin } = payload;

  await prisma.$transaction(async (tx) => {
    if (admin) {
      await tx.admin.update({
        where: {
          id: adminData.id,
        },
        data: {
          ...admin,
        },
      });

      if (admin.name || admin.profilePhoto) {
        const userData = {
          name: admin.name ? admin.name : adminData.name,
          image: admin.profilePhoto ? admin.profilePhoto : adminData.profilePhoto,
        };
        await tx.user.update({
          where: {
            id: adminData.userId,
          },
          data: {
            ...userData,
          },
        });
      }
    }
  });

  const result = await prisma.admin.findUnique({
    where: {
      id: adminData.id,
    },
    include: {
      user: true,
    },
  });

  return result;
};

export const AdminService = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  updateMyProfile,
};
