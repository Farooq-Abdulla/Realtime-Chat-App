'use server';
import prisma from '../../lib/prisma';

type Friend = {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
};

export async function getFriends(userId: string, onlineUsers: Map<string, boolean>): Promise<Friend[]> {
    console.log('from getFriends - userId:', userId);
    console.log('from getFriends - onlineUsers:', onlineUsers);
    const user = await prisma.user.findUnique({
        where:{
            id: userId
        },
        include:{
            friendsInitiated: {include:{ user2:true}},
            friendsReceived: {include: {user1:true}}
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
  
    return friends.map((friend) => {
      const isOnline = onlineUsers.get(friend.id) ||false;
      return {
        id: friend.id,
        name: friend.name || 'Unknown',
        avatar: friend.image || '/placeholder.svg?height=64&width=64',
        status: isOnline ? 'online' : 'offline',
      };
    });
  }
  