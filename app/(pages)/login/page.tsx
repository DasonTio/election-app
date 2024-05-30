import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { AxiosError } from "axios";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/prisma/validator/authSchema";

type DataResponse = {
  message: string;
  data?: object;
  errors?: any[];
};

export default function Login() {
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onRedirectRegister = () => router.push("/register");

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const response = await axiosInstance.post("/auth/login", values);
    toast(response.data.message, {
      description: "Have a good day",
    });

    router.push("/");
  };

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[500px]  rounded-xl border flex flex-col p-8 gap-8 items-center"
        >
          <header className="text-center">
            <h1 className="text-2xl">Welcome Back </h1>
            <p className="text-sm text-gray-400">
              please fill your email and password
            </p>
          </header>
          <main className="w-full flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="supersecret123"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </main>
          <Button
            className="w-full"
            type="submit"
          >
            Sign In
          </Button>
          <footer className="mt-6">
            <p
              onClick={onRedirectRegister}
              className="text-sm text-gray-400 hover:text-gray-500 cursor-pointer"
            >
              Don&apos;t have an account yet? Register now
            </p>
          </footer>
        </form>
      </Form>
    </main>
  );
}
