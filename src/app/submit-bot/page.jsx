"use client";
import { MainLayout } from "@/layouts/MainLayout";
import Image from "next/image";
import { useState } from "react";
import { Select, Input } from "antd";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { doSocialLogin } from "../actions";
import { SessionProvider } from "next-auth/react";

const { TextArea } = Input;

export default function SubmitBot() {
  const session = useSession();
  const router = useRouter();
  const [category, setCategory] = useState("agree-terms");
  return (
    <SessionProvider>
      <MainLayout>
        <div className="flex mx-auto justify-center items-center flex-col p-[16px] md:p-[32px] gap-y-[32px]">
          <Image
            width={524}
            height={81}
            alt="walao"
            src="/img/agree-terms.svg"
          />
          <div className="p-[12px] md:p-[40px] bg-white rounded-[16px] flex flex-col gap-y-[16px]">
            <p className="text-[20px] md:text-[32px] font-bold text-center">
              Telehub bot submission guidelines
            </p>
            <p className="text-[14px] md:text-[16px] text-[#718096] text-center">
              Please read the guidelines before proceeding
            </p>
            <div className="md:text-[16px] text-[13px] text-center md:text-left">
              1. No Adult Content: Bots must not distribute or promote adult
              content or explicit material.
              <br />
              2. No Scams or Spam: Bots should not engage in fraudulent
              activities, phishing attempts, or spamming users.
              <br />
              3. Respect User Privacy: Bots must handle user data responsibly,
              respecting privacy laws and Telegram&apos;s policies.
              <br />
              4. Original and Valuable Functionality: Bots should offer unique
              and useful features to enhance user experience.
              <br />
              5. Compliance: Bots must comply with Telegram&apos;s bot API terms
              and conditions.
              <br />
              6. Contact Information: Provide accurate contact details for bot
              developers for support and inquiries.
            </div>
            <form action={() => router.push("/submit-bot-2")}>
              <button
                // onClick={() => signIn()}
                type="submit"
                name="action"
                value="google"
                className="cursor-pointer md:text-[16px] text-[12px] font-bold block w-full rounded-[12px] py-[16px] text-center bg-[#6CC1E3]"
              >
                I understand and agree with the guidelines
              </button>
              <a
                onClick={() => router.push("/")}
                className="cursor-pointer mt-2 underline md:text-[16px] text-[12px] text-[#1A202C] block w-full text-center"
              >
                Return to previous page
              </a>
            </form>
          </div>
        </div>
      </MainLayout>
    </SessionProvider>
  );
}
