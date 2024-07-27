"use client";
import { MainLayout } from "@/layouts/MainLayout";
import Image from "next/image";
import { useState } from "react";
import { Select, Input } from "antd";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { doSocialLogin } from "../actions";
import { SessionProvider } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";

const { TextArea } = Input;

export default function SubmitBot() {
  const session = useSession();
  const router = useRouter();

  return (
    <SessionProvider>
      <MainLayout>
        <div className="flex mx-auto justify-center items-center flex-col p-[16px] md:p-[32px] gap-y-[32px]">
          <Image
            width={524}
            height={81}
            alt="walao"
            src="/img/bot-submission.svg"
          />
          <div className="p-[12px] md:p-[40px] bg-white rounded-[16px] flex flex-col gap-y-[16px]">
            <p className="text-[20px] md:text-[32px] font-bold text-center">
              Telehub bot submission
            </p>
            <form action={session?.data?.user ? signOut : doSocialLogin}>
              {session?.data?.user ? (
                <button
                  type="submit"
                  name="action"
                  value="google"
                  className="rounded-[30px] w-fit mx-auto cursor-pointer px-[27px] py-[10px] bg-[#28B9E8] flex items-center gap-x-2"
                >
                  <Image
                    width={30}
                    height={30}
                    alt="walao"
                    src={session?.data?.user?.image ?? ""}
                    className="rounded-full"
                  />
                  <span className="text-white font-bold">
                    {session?.data?.user?.email}
                  </span>
                </button>
              ) : (
                <button
                  type="submit"
                  name="action"
                  value="google"
                  className="rounded-[30px] w-fit mx-auto cursor-pointer px-[27px] py-[10px] bg-[#28B9E8] flex items-center gap-x-2"
                >
                  <FaGoogle color="#FFFFFF" />
                  <span className="text-white">Sign in with Google</span>
                </button>
              )}
            </form>
            {session?.data && (
              <div className="flex flex-col gap-y-4 flex-1">
                <Input
                  className="w-[85vw] md:w-full"
                  placeholder="Telegram bot name"
                />
                <Input placeholder="Telegram bot username (ex:@telegram_bot)" />
                <Select
                  defaultValue="lucy"
                  // onChange={handleChange}
                  className="w-full rounded-[12px]"
                  options={[
                    { value: "jack", label: "Jack" },
                    { value: "lucy", label: "Lucy" },
                    { value: "Yiminghe", label: "yiminghe" },
                  ]}
                />
                <TextArea
                  rows={6}
                  placeholder="Telegram Bot Description (max 250 characters)"
                  maxLength={250}
                />
                <a
                  onClick={() => router.push("/")}
                  className="cursor-pointer md:text-[16px] text-[12px] font-bold block w-full rounded-[12px] py-[16px] text-center bg-[#6CC1E3]"
                >
                  Submit Bot
                </a>
              </div>
            )}
            <a
              onClick={() => router.push("/submit-bot")}
              className="cursor-pointer md:text-[16px] text-[12px] underline text-[#1A202C] block w-full text-center"
            >
              Return to previous page
            </a>
          </div>
        </div>
      </MainLayout>
    </SessionProvider>
  );
}
