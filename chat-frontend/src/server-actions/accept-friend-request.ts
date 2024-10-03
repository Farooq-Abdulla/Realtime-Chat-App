'use server';

import prisma from '../../lib/prisma';

export async function handleAcceptFriendRequest(requestId: string) {
  const friendRequest = await prisma.friendRequest.findUnique({
    where: {
      id: requestId,
    },
  });
  if (!friendRequest) {
    throw new Error('Friend request not found');
  }
  const { senderId, receiverId } = friendRequest;

  await acceptFriendRequest(requestId);

  await createFriendship(senderId, receiverId);

  await deleteFriendRequest(requestId);

  return {senderId, receiverId}

  // Optional: Send notification to the sender
  // await createNotification(senderId, 'Your friend request has been accepted.');
}


const acceptFriendRequest = async (requestId: string) => {
  await prisma.friendRequest.update({
    where: { id: requestId },
    data: { status: 'accepted' },
  });
};

const createFriendship = async (user1Id: string, user2Id: string) => {
  await prisma.friend.create({
    data: {
      user1: { connect: { id: user1Id } },
      user2: { connect: { id: user2Id } },
    },
  });
};

const deleteFriendRequest = async (requestId: string) => {
  await prisma.friendRequest.delete({
    where: { id: requestId },
  });
};
