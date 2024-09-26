'use server';
import prisma from "../../lib/prisma";


type Friend = {
  id: string;
  name: string;
  avatar: string;
};

export async function getFriends(userId: string): Promise<Friend[]> {
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      friendsInitiated: { include: { user2: true } },
      friendsReceived: { include: { user1: true } }
    }
  });

  if (!user) {
    console.log('User not found');
    return [];
  }

  const friends = [
    ...user.friendsInitiated.map((friend) => friend.user2),
    ...user.friendsReceived.map((friend) => friend.user1),
  ];

  return friends.map((friend) => ({
    id: friend.id,
    name: friend.name || 'Unknown',
    avatar: friend.image || '/placeholder.svg?height=64&width=64',
  }));
}