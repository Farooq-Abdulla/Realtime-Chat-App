export { auth as middleware } from "../lib/auth";

// import { auth } from "@/auth";
// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// export async function middleware(request: NextRequest ){
//     console.log("Middleware running");
//     const session= await auth();
//     if(!session?.user){
//         return NextResponse.redirect(new URL('/api/auth/signin', request.url))
//     }
//     return NextResponse.next()
// }

// export const config={
//     matcher: ['/admin']
// }
