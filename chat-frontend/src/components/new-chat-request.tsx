import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@react-hook/media-query"


interface INewChatRequest{
    children: React.ReactNode,
    chatWindowRequestOpen: boolean,
    setChatWindowRequestOpen:  React.Dispatch<React.SetStateAction<boolean>>;
}

function NewChatRequest({children, chatWindowRequestOpen , setChatWindowRequestOpen}:INewChatRequest) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={chatWindowRequestOpen} onOpenChange={setChatWindowRequestOpen}>
        <DialogTrigger asChild>
          {/* <Button variant="outline">Edit Profile</Button> */}
          <Button variant={"ghost"}>{children}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send a Chat Request</DialogTitle>
            <DialogDescription>
            Enter the email and click Send Request when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={chatWindowRequestOpen} onOpenChange={setChatWindowRequestOpen}>
      <DrawerTrigger asChild>
        {/* <Button variant="outline">Edit Profile</Button> */}
        <Button variant={"ghost"}>{children}</Button>
        
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Send a Chat Request</DrawerTitle>
          <DrawerDescription>
            Enter the email and click send request when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default React.memo(NewChatRequest)

function ProfileForm({ className }: React.ComponentProps<"form">) {
    const [email, setEmail]= React.useState('');
    // const handleSubmit= (e: React.FormEvent<HTMLFormElement>)=>{
    //     e.preventDefault();

    // }

  return (
    <div className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email"  value={email} onChange={(e)=>setEmail(e.target.value)} />
      </div>
      <Button type="submit">Send Request</Button>
    </div>
  )
}
