'use server';

import { User } from "@prisma/client";
import getServerSession from "../../lib/getServerSession";
import prisma from "../../lib/prisma";


type FriendRequestResponse = {
    success?: boolean; 
    error?: string;  
};

export default async function SendFriendRequest(toUser: User): Promise<FriendRequestResponse> {
    const session = await getServerSession();
    
    const userId = session?.user?.id;

    if (!userId) {
        return { error: "User not authenticated" };
    }

    try {
        await prisma.friendRequest.create({
            data: {
                senderId: userId,
                receiverId: toUser.id,
            },
        });

        return { success: true }; 

    } catch (error: any) {
        console.error("Error sending friend request:", error);
        
        // Handle specific errors (e.g., duplicate requests)
        if (error.code === 'P2002') { // Prisma error code for unique constraint violation
            return { error: "Friend request already sent" };
        }

        return { error: "An unexpected error occurred" };
    }
}
