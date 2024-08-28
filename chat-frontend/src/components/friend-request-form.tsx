'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CheckIfValidUser from "@/server-actions/check-if-valid-user";
import SendFriendRequest from "@/server-actions/send-friend-request";
import { Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";

// Define the schema
export const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function FriendRequestForm() {
  const {toast}= useToast()
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
        }

    } catch (error: unknown) {
        form.setError("root", { message: "An unexpected error occurred. Please try again." });
    }
};



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-2/4 mx-auto my-40">

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-3xl">Add a new Friend</FormLabel>
              <FormControl>
                <Input placeholder="abc@gmail.com" {...field} />
              </FormControl>
              <FormDescription> Enter the email that you&apos;d like to connect with</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          Submit {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
