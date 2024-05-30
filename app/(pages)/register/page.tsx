"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AxiosError } from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema, registerSchema } from "@/prisma/validator/authSchema";
import { cn } from "@/lib/utils";
import { register } from "module";

type DataResponse = {
  message: string;
  data?: object;
  errors?: any[];
};

export default function Register() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [gender, setGender] = useState("");

  const formRegisterSchema = registerSchema
    .omit({
      role: true,
      gender: true,
    })
    .extend({
      birthDate: z.string(),
    });
  const form = useForm<z.infer<typeof formRegisterSchema>>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      id: "",
      email: "",
      name: "",
      password: "",
      birthDate: "",
      address: "",
      phoneNumber: "",
      ward: "", //Sungai Raya
      subDistrict: "", //Sungai Raya
      regency: "", //Kubu Raya
      city: "", //Pontianak
      province: "", //Kalimantan Barat
    },
  });

  const onRedirectLogin = () => router.push("/login");

  const onPrevButtonClicked = () => {
    setProgress((prev) => (prev-- <= 0 ? 0 : prev--));
  };

  const onNextButtonClicked = () => {
    setTimeout(() => {
      const itemMessage = document.querySelectorAll(
        `section#form-${progress} p[id*='form-item-message']`
      );

      if (itemMessage.length != 0) return;

      setProgress((prev) => (prev++ >= 2 ? 2 : prev++));
    }, 100);
  };

  const onSubmit = async (values: z.infer<typeof formRegisterSchema>) => {
    const response = await axiosInstance.post("/auth/register", {
      ...values,
      gender,
      role: "user",
    });

    toast(response.data.message, {
      description: "Register Success",
    });

    router.push("/login");
  };

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[500px]  rounded-xl border flex flex-col p-8 gap-8 items-center"
        >
          <header className="text-center">
            <h1 className="text-2xl">Hello, Votee </h1>
            <p className="text-sm text-gray-400">
              let&apos;s make your first account simple
            </p>
          </header>
          <main className="w-full [&>section]:flex-col [&>section]:gap-4">
            {/* Account Data Section */}
            <section
              id="form-0"
              className={cn("flex", {
                hidden: progress != 0,
              })}
            >
              <div>
                <FormLabel>Username</FormLabel>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="John Doe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormLabel>Email</FormLabel>
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
              </div>
              <div>
                <FormLabel>Password</FormLabel>
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
              </div>
            </section>

            {/* Detailed Data Section */}
            <section
              id="form-1"
              className={cn("flex", {
                hidden: progress != 1,
              })}
            >
              <div>
                <FormLabel>Civilization Number</FormLabel>
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="01234567890123456"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormLabel>Birth Date</FormLabel>
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormLabel>Gender</FormLabel>
                <Select
                  name="gender"
                  value={gender}
                  onValueChange={(value) => setGender(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FormLabel>Phone Number</FormLabel>
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="0812345678901"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Location Section */}
            <section
              id="form-2"
              className={cn("flex", {
                hidden: progress != 2,
              })}
            >
              <div>
                <FormLabel>Address</FormLabel>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Jl. Adisucipto no 89 B, Sungai Raya, Kubu Raya..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormLabel>Province</FormLabel>
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Kalimantan Barat"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormLabel>City</FormLabel>
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Pontianak"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormLabel>Regency</FormLabel>
                <FormField
                  control={form.control}
                  name="regency"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Kubu Raya"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormLabel>Sub District</FormLabel>
                <FormField
                  control={form.control}
                  name="subDistrict"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Sungai Raya"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormLabel>Ward</FormLabel>
                <FormField
                  control={form.control}
                  name="ward"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Sungai Raya"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>
          </main>
          <div className="w-full flex justify-between ">
            {/* Stepper */}
            <div className="w-full flex gap-2 items-center">
              {new Array(3).fill(null).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "border border-gray-300 bg-white rounded-full w-6 aspect-square",
                    {
                      "bg-black": progress >= i,
                    }
                  )}
                ></div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={onPrevButtonClicked}
                className={cn("bg-white hover:bg-gray-200 border text-black", {
                  hidden: progress == 0,
                })}
                type="button"
              >
                Prev
              </Button>

              <Button
                onClick={onNextButtonClicked}
                className={cn("px-6", {
                  hidden: progress == 2,
                })}
                type="button"
              >
                Next
              </Button>

              <Button
                className={cn("px-6", {
                  hidden: progress != 2,
                })}
                onClick={() => form.handleSubmit(onSubmit)()}
                type="submit"
              >
                Finish
              </Button>
            </div>
          </div>

          <footer className="mt-6">
            <p
              onClick={onRedirectLogin}
              className="text-sm text-gray-400 hover:text-gray-500 cursor-pointer"
            >
              Already have an account? Login now
            </p>
          </footer>
        </form>
      </Form>
    </main>
  );
}
