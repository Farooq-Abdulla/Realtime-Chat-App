'use server';


import { formSchema } from "@/components/friend-request-form";
import getServerSession from "@/lib/getServerSession";
import { User } from "@prisma/client";
import { z } from "zod";
import prisma from "../../lib/prisma";
import { getFriends } from "./get-friends";

type TResponse = {
    user?: User; 
    error?: string; 
};

export default async function CheckIfValidUser(data: z.infer<typeof formSchema>): Promise<TResponse> {
    const session= await getServerSession();
    const currUserId= session?.user?.id
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

        const validRequest=await prisma.friendRequest.findUnique({
            where:{
                senderId_receiverId:{
                    senderId: currUserId!,
                    receiverId: validUser.id
                }
            }
        })
        if(validRequest){
            return { error: "You already have a request sent to this user, Check Requests page" };
        }

        const friends = await getFriends(currUserId!);
        const found=friends.find((item)=> item.id===validUser.id)
        if(found){
            return { error: "You are already friends with this user" };
        }

        return { user: validUser };

    } catch (error) {
        return { error: "An unexpected error occurred" };
    }
}
