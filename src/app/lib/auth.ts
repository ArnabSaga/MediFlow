import { betterAuth } from "better-auth";

import { prismaAdapter } from "better-auth/adapters/prisma";

import { Role, UserStatus } from "../../generated/prisma/enums";

import { bearer } from "better-auth/plugins";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.PATIENT,
      },

      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },

      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },

      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },

      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null,
      },
    },
  },

  plugins: [bearer()],

  session: {
    expiresIn: 60 * 60 * 60 * 24, // 1 Day
    updateAge: 60 * 60 * 60 * 24, // 1 Day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24, // 1 Day
    },
  },

  // trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:5000"],

  // advanced: {
  //     disableCSRFCheck: true,
  // }
});
