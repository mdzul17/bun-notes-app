import { NotFoundError, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { AuthorizationError } from "../exceptions/AuthorizationError";
import { InvariantError } from "../exceptions/InvariantError";

const db = new PrismaClient();

export const usersController = {
  getUsers: async ({ query }) => {
    return db.users.findMany({
      where: {
        id: {
          equals: query.id,
        },
      },
    });
  },

  createUser: async ({ body, set, cookie }) => {
    const id = uuidv4();
    await db.users.create({
      data: {
        id: `users-${id}`,
        username: body.username,
        fullname: body.fullname,
        email: body.email,
        password: body.password,
      },
    });
    set.status = 201;
    return `Data ${body.username} successfully created!`;
  },

  getUserById: async ({ set, params: { id } }) => {
    const user = await db.users.findFirst({
      where: {
        id: {
          equals: id,
        },
      },
    });

    if (!user) throw new NotFoundError("User not found");

    set.status = 200;
    return user;
  },

  deleteUser: async ({ params: { id } }) => {
    await db.users.delete({
      where: {
        id: id,
      },
    });
  },

  loginUser: async ({ jwt, cookie: { auth }, setCookie, body, set }) => {
    const isAvailable = await usersController.verifyUserByUsername(
      body.username
    );

    if (!isAvailable) {
      throw new InvariantError("Username or password is not correct!");
    }

    const profile = await jwt.verify(auth);

    if (!profile) {
      setCookie("auth", await jwt.sign(body), {
        httpOnly: true,
        maxAge: 4 * 86400,
      });
    }

    return `Sign in as ${profile.username}`;
  },

  verifyUserByUsername: async (username: string) => {
    const user = await db.users.findFirst({
      where: {
        username: {
          equals: username,
        },
      },
      select: {
        id: true,
      },
    });

    return user;
  },

  validateCreateUser: t.Object({
    username: t.String(),
    password: t.String(),
    fullname: t.String(),
    email: t.String(),
  }),
};
