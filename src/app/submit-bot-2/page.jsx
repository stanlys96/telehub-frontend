"use client";
import { MainLayout } from "@/layouts/MainLayout";
import Image from "next/image";
import { useState } from "react";
import { Select, Input } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { doLogout, doSocialLogin } from "../actions";
import { SessionProvider } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { Spin } from "antd";
import useSWR from "swr";
import { axiosApi, fetcherStrapi } from "@/utils/axios";
import Swal from "sweetalert2";

const { TextArea } = Input;

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.close;
  },
});

export default function SubmitBot() {
  const session = useSession();
  const router = useRouter();
  const { data: userData } = useSWR(
    `/api/user-accounts?filters[email][$eq]=${session?.data?.user?.email}`,
    fetcherStrapi
  );
  const userResult = userData?.data?.data?.[0];
  const { data: categoriesData } = useSWR(`/api/subcategories`, fetcherStrapi);
  const categoriesResult = categoriesData?.data?.data;
  const [selectedImage, setSelectedImage] = useState();

  const theCategories = categoriesResult?.map((data) => ({
    id: data?.id,
    label: data?.attributes?.title,
    value: data?.id,
  }));
  const [loading, setLoading] = useState(false);
  const [botName, setBotName] = useState("");
  const [botUsername, setBotUsername] = useState("");
  const [botCategory, setBotCategory] = useState();
  const [botDescription, setBotDescription] = useState("");
  const handleChange = (value) => {
    setBotCategory(value);
  };
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
            <form action={session?.data?.user ? doLogout : doSocialLogin}>
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
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  className="w-[85vw] md:w-full"
                  placeholder="Telegram bot name"
                />
                <Input
                  value={botUsername}
                  onChange={(e) => setBotUsername(e.target.value)}
                  placeholder="Telegram bot username (ex:@telegram_bot)"
                />
                <Select
                  value={botCategory}
                  // defaultValue="lucy"
                  onChange={handleChange}
                  placeholder="Bot Category"
                  className="w-full rounded-[12px]"
                  options={theCategories}
                />
                {selectedImage && (
                  <div className="flex justify-center items-center">
                    <img
                      className="w-[200px] h-[200px]"
                      src={`${
                        !selectedImage
                          ? "/img/upload_id.svg"
                          : URL.createObjectURL(selectedImage)
                      }`}
                      alt="upload"
                    />
                  </div>
                )}
                <Input
                  accept="image/*"
                  multiple={false}
                  onChange={(e) => {
                    setSelectedImage(e?.target?.files?.[0]);
                  }}
                  type="file"
                  placeholder="Upload Image"
                />
                <TextArea
                  value={botDescription}
                  onChange={(e) => setBotDescription(e.target.value)}
                  rows={6}
                  placeholder="Telegram Bot Description (max 250 characters)"
                  maxLength={250}
                />
                {!loading ? (
                  <a
                    onClick={async () => {
                      if (
                        !botName ||
                        !botUsername ||
                        !botDescription ||
                        !botCategory ||
                        !selectedImage
                      ) {
                        return Swal.fire({
                          title: "Validation",
                          text: "Please fill all fields!",
                          icon: "info",
                        });
                      }
                      try {
                        setLoading(true);
                        const response = await axiosApi.post("/api/bots", {
                          data: {
                            title: botName,
                            username: "@" + botUsername?.replaceAll("@", ""),
                            description: botDescription,
                            subcategory: botCategory,
                            user_account: userResult?.id,
                          },
                        });
                        const data = new FormData();
                        data.append(
                          "file",
                          selectedImage,
                          session?.data?.user?.email + ".png"
                        );
                        data.append("files", selectedImage);
                        data.append("ref", "api::bot.bot");
                        data.append("refId", response?.data?.data?.id);
                        data.append("field", "image");
                        try {
                          const uploadRes = await axiosApi({
                            method: "POST",
                            url: "/api/upload",
                            data,
                          });
                        } catch (e) {
                          console.log(e);
                        }
                        setLoading(false);
                        if (response?.status === 200) {
                          setBotUsername("");
                          setBotCategory(null);
                          setBotDescription("");
                          setBotName("");
                          Toast.fire({
                            icon: "success",
                            title: "Registered bot successfully!",
                          });
                        }
                      } catch (e) {
                        setLoading(false);
                        console.log(e, "<< E");
                      }
                    }}
                    className="cursor-pointer md:text-[16px] text-[12px] font-bold block w-full rounded-[12px] py-[16px] text-center bg-[#6CC1E3]"
                  >
                    Submit Bot
                  </a>
                ) : (
                  <Spin className="mt-2" size="large" />
                )}
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
