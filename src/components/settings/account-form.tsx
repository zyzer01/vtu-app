"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";
import { Input } from "../ui/input";
import { LoaderCircle } from "lucide-react";

// Validation schema
const accountFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

interface AccountFormProps {
  id: string;
  email: string;
}

export function AccountForm({ email, id }: AccountFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: { email: email },
  });


  const onSubmit = async (data: AccountFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update account");
      }

      await response.json();
      toast({
        title: "Success",
        description: "Your account has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating account:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Update failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <Toaster />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormDescription>Enter a new email address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} type="submit">
            {isLoading && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update account
          </Button>
      </form>
    </Form>
  );
}
