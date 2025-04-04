import db from "@/prisma/prisma";
import bcrypt from "bcryptjs";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";


export const NEXT_AUTH_CONFIG: AuthOptions = {
    providers: [

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),

        CredentialProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "demo@demo.com", required: true },
                password: { label: "Password", type: "password", placeholder: "password", required: true }
            },
            async authorize(credentials) {

                const { email, password } = credentials as { email: string; password: string };

                if (!email || !password) {
                    throw new Error("Invalid credentials");
                }

                try {
                    const existingUser = await db.user.findUnique({
                        where: { email },
                    });

                    if (!existingUser) {
                        throw new Error("User not found");
                    }

                    const isVerified = await bcrypt.compare(password, existingUser.passwordHash);

                    if (!isVerified) {
                        console.log("Wrong Password")
                        throw new Error("Invalid password");
                    }

                    return {
                        id: existingUser.id.toString(),
                        email: existingUser.email,
                        name: existingUser.fullName,
                        role: existingUser.role,
                    };
                } catch (error) {
                    console.log(error)
                    throw new Error(`Authorization error`);
                }
            }

        })
    ],

    session: {
        strategy: "jwt"
    },

    pages: {
        signIn: '/signin'
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
                token.email = user.email!,
                token.name = user.name!,
                token.role = user.role;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (token) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.role = token.role as string;
                session.user.name = token.name as string;
            }
            return session;
        },

    }
}