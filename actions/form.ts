"use server";
import { signIn, signOut } from "next-auth/react"
import { signInSchema, signUpSchema } from "@/zodSchem/auth";
import { z } from "zod";
import db from "@/prisma/prisma";
import bcrypt from "bcryptjs";
// import { signIn } from "@/lib/auth";

export const handleSignUp = async ({ fullname, email, password,phoneNumber  }: z.infer<typeof signUpSchema>) => {
    try {
        // Validate input with Zod
        const validatedData = signUpSchema.parse({ fullname, email, password, phoneNumber });

        console.log({ fullname, email, password,phoneNumber  })
        // Check if user already exists
        const existingUser = await db.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            console.log("User already exist")
            throw new Error("User with this email already exists.");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        // Create new user
        const newUser = await db.user.create({
            data: {
                fullName: validatedData.fullname,
                email: validatedData.email,
                passwordHash: hashedPassword,
                phoneNumber: validatedData.phoneNumber,
                role: "USER",
            },
        });

        return { success: true, message: "User registered successfully!", user: newUser };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, message: error.message || "Something went wrong!" };
        } else {
            return { success: false, message: "An unknown error occurred." };
        }
    }
};


export const handleSignIn = async ({ email, password }: z.infer<typeof signInSchema>) => {
    try {
        // Validate input with Zod
        const validatedData = signInSchema.parse({ email, password });

        await signIn('credentials', {
            email: validatedData.email,
            password: validatedData.password,
            redirect: true,
            redirectTo: "/"
        })

        

    } catch (error) {
        if (error instanceof Error) {
            return { success: false, message: error.message || "Something went wrong!" };
        } else {
            return { success: false, message: "An unknown error occurred." };
        }
    }
};

export const handleGoogle = async () => {
    try {
        await signIn("google", { callbackUrl: "/" });
      } catch (error) {
        console.error("Google sign-in failed", error);
      }
} 