'use server';

import prisma from "../../lib/prisma";

export default async function GetAllReceivedRequests(userId: string) {

    
    try {
        const userWithReceivedRequests = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                receivedRequests:{
                    include:{
                        sender:true
                    }
                }
            }
        });


        const receivedRequests = userWithReceivedRequests?.receivedRequests.map(request => ({
            id: request.id,
            name: request.sender.name,  
            avatar: request.sender.image
        })) || [];
        
        return receivedRequests;
    } catch (error) {
        console.error('Error fetching received requests:', error);
        throw new Error('Failed to fetch received requests.');
    }
}
