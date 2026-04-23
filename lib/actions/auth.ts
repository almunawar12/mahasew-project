'use server';

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import prisma from "@/lib/prismadb";
import bcrypt from "bcryptjs";

export async function login(formData: any) {
  try {
    await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    // Fetch user to get role for redirection logic
    const user = await prisma.user.findUnique({
      where: { email: formData.email },
      select: { role: true }
    });

    return { success: true, role: user?.role };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email atau kata sandi salah" };
        default:
          return { error: "Terjadi kesalahan sistem" };
      }
    }
    return { error: "Terjadi kesalahan sistem" };
  }
}

export async function register(formData: any) {
  const { name, email, password, role = "USER" } = formData;

  try {
    if (!name || !email || !password) {
      return { error: "Semua data harus diisi" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { error: "Email sudah terdaftar" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role: role as any,
      }
    });

    return { success: true, user };
  } catch (error) {
    console.error("REGISTER_ERROR", error);
    return { error: "Terjadi kesalahan saat mendaftar" };
  }
}

export async function loginWithGoogle() {
  try {
    await signIn("google", {
      redirectTo: "/dashboard",
    });
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
