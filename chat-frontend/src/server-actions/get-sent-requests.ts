'use server';

import prisma from "../../lib/prisma";

export default async function GetAllSentRequests(userId:string) {


    try {
        const userWithSentRequests = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                sentRequests: {
                    include: {
                        receiver: true, 
                    }
                }
            }
        });

        const sentRequests = userWithSentRequests?.sentRequests.map(request => ({
            id: request.id,
            name: request.receiver.name,  
            avatar: request.receiver.image || "/placeholder.svg?height=40&width=40",  
            status: request.status || "Pending"  
        })) || [];
        
        return sentRequests;
    } catch (error) {
        console.error('Error fetching sent requests:', error);
        throw new Error('Failed to fetch sent requests.');
    }
}
