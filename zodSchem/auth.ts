import { z } from "zod";

export const signUpSchema = z.object({
  fullname: z.string().min(2).max(50),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(5, { message: "Must be 5 or more characters long" }),
  phoneNumber: z.string().min(10, {message: "Phone number must have 10 digits."})
});

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});