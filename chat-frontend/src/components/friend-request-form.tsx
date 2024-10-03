'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/lib/global-socket-provider";
import CheckIfValidUser from "@/server-actions/check-if-valid-user";
import SendFriendRequest from "@/server-actions/send-friend-request";
import { Loader2, UserPlus } from "lucide-react";
import { useToast } from "./ui/use-toast";



export const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function FriendRequestForm() {
  const {toast}= useToast()
  const {socket}=useSocket();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });


  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
        const res = await CheckIfValidUser(data);

        if (res.error) {
            form.setError("email", { message: res.error });
            return;
        }

        if (res.user) {
            const response = await SendFriendRequest(res.user);

            if (response.error) {
                form.setError("root", { message: response.error });
                return;
            }

            toast({
              description: "Successfully sent the request."
            })
            socket?.emit('friendRequestSent', res.user.id)
        }

    } catch (error: unknown) {
        form.setError("root", { message: "An unexpected error occurred. Please try again." });
    }
};



  return (
    <Card className="w-full max-w-2xl mx-auto dark:bg-inherit dark:border-none shadow-lg ">
      <CardHeader>
        <CardTitle>Add a new Friend</CardTitle>
        <CardDescription>Send a chat request to a new friend</CardDescription>
      </CardHeader>
      <CardContent>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8  ">

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className="text-3xl">Add a new Friend</FormLabel> */}
              <FormControl>
                <Input placeholder="abc@gmail.com" {...field} />
              </FormControl>
              <FormDescription> Enter the email that you&apos;d like to connect with</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
        <UserPlus className="h-4 w-4 mr-2" />
        Send Request {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </Form>
      </CardContent>
    </Card>

  );
}
