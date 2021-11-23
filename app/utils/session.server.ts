import bcrypt from "bcrypt";
import { createCookieSessionStorage, redirect } from "remix";
import { db } from "./db.server";

type LoginType = {
  username: string;
  password: string;
};

export async function login({ username, password }: LoginType) {
  let existingUser = await db.user.findFirst({ where: { username } });
  if (!existingUser) return null;

  const passwordsMatch = await bcrypt.compare(
    password,
    existingUser.passwordHash
  );
  if (!passwordsMatch) return null;

  return existingUser;
}

let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("Must enviornment variable SESSION_SECRET");
}

let storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  let session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
