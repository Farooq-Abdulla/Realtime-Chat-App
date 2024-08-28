'use server';


import { formSchema } from "@/components/friend-request-form";
import { User } from "@prisma/client";
import { z } from "zod";
import prisma from "../../lib/prisma";

type TResponse = {
    user?: User; 
    error?: string; 
};

export default async function CheckIfValidUser(data: z.infer<typeof formSchema>): Promise<TResponse> {
    const { email } = data;

    try {
        const validUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!validUser) {
            return { error: "User not found. Ask the owner of the email address to SignUp" };
        }

        return { user: validUser };

    } catch (error) {
        return { error: "An unexpected error occurred" };
    }
}
