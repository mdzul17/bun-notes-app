import { PrismaClient } from "@prisma/client";
import { usersController } from "./UsersController";
import { NotFoundError } from "elysia";

const db = new PrismaClient();

export const authenticationsController = {
  postAuthentications: async ({ jwt, refreshJwt, body, set }) => {
    const userId = await usersController.verifyUserByUsername(body.username);

    if (!userId) throw new NotFoundError("User not found");

    const access_token = await jwt.sign(userId);
    const refresh_token = await refreshJwt.sign(userId);

    await db.authentications.create({
      data: {
        token: refresh_token,
      },
    });

    set.status = 201;

    return {
      data: {
        access_token: access_token,
        refresh_token: refresh_token,
      },
    };
  },
  putAuthentications: async ({
    jwt,
    refreshJwt,
    body: { refresh_token },
    set,
  }) => {
    await db.authentications.findFirst({
      where: {
        token: {
          equals: refresh_token,
        },
      },
    });

    const tokenPayload = await refreshJwt.verify(refresh_token);
    const access_token = await jwt.sign(tokenPayload);

    console.log(tokenPayload);

    set.status = 200;
    return {
      message: "Access token successfully updated",
      data: {
        access_token: access_token,
      },
    };
  },
  deleteAuthentications: async ({
    refreshJwt,
    body: { refresh_token },
    set,
  }) => {
    await db.authentications.findFirst({
      where: {
        token: {
          equals: refresh_token,
        },
      },
    });

    await refreshJwt.verify(refresh_token);

    set.status = 200;
    return {
      message: "Refresh token has been successfully deleted",
    };
  },
};
