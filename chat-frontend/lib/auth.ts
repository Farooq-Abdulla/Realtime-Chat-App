import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "./prisma";

 
export const { handlers, signIn, signOut, auth } = NextAuth({
  theme:{
    logo:"/logo.jpg"
  },
  providers: [Google],
  adapter: PrismaAdapter(prisma),
  // callbacks:{
  //    authorized({request,auth}) {
  //     if(request.nextUrl.pathname==='/') return !!auth;
  //     return true
  //   },
  // },
})