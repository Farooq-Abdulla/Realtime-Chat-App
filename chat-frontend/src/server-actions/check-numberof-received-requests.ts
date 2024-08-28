"use server"

import prisma from "../../lib/prisma";

export default async function CheckNumberOfReceivedRequests(userId: string) {
    const count = await prisma.friendRequest.count({
        where: {
            receiverId: userId,
        },
    });

    return count;
}
