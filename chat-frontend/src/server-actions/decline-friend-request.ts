"use server";

import prisma from "../../lib/prisma";

export async function declineFriendRequest(requestId: string) {
  const friendRequest = await prisma.friendRequest.findUnique({
    where: { id: requestId },
  });
  if (!friendRequest) {
    throw new Error('Friend request not found');
  }
  const {senderId, receiverId} =friendRequest

  if (!friendRequest) {
    throw new Error('Friend request not found');
  }

  await prisma.friendRequest.delete({
    where: { id: requestId },
  });

  return {senderId, receiverId}
}
