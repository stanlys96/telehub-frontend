"use client";
import { MainLayout } from "@/layouts/MainLayout";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Select, Modal, Input } from "antd";
import useSWR from "swr";
import { axiosApi, fetcherStrapi } from "@/utils/axios";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { FaGoogle } from "react-icons/fa";
import { doLogoutBot, doSocialLogin, doSocialLoginBot } from "@/app/actions";
import { transformGoogleDriveUrl } from "@/utils/helper";

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

const { TextArea } = Input;

export default function Bot() {
  const pathname = usePathname();
  const session = useSession();
  const queryId = pathname?.split("/")?.[2];
  const { data: userData } = useSWR(
    `/api/user-accounts?filters[email][$eq]=${session?.data?.user?.email}`,
    fetcherStrapi
  );

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const userResult = userData?.data?.data?.[0];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    if (!session?.data) {
      return Swal.fire({
        title: "Google login",
        text: "Please login with your google account first.",
        icon: "info",
      });
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (!description) return;
    setLoading(true);
    try {
      await axiosApi.post("/api/reports", {
        data: {
          description: description,
          user_account: userResult?.id,
          bot: botResult?.id,
        },
      });
      Toast.fire({
        icon: "success",
        title:
          "Successfully submitted the report! Thank you for your feedback!",
      });
      setDescription("");
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const { data: botData } = useSWR(
    `/api/bots/${queryId}?populate=*`,
    fetcherStrapi
  );
  const botResult = botData?.data?.data;
  const imageUrl = botResult?.attributes?.imageUrl ?? "/img/example.png";
  const { data: ratingData } = useSWR(
    `/api/ratings?filters[user_account][$eq]=${userResult?.id}&filters[bot][$eq]=${botResult?.id}`,
    fetcherStrapi
  );

  const ratingResult = ratingData?.data?.data?.[0];

  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(ratingResult?.attributes?.rating ?? 0);

  useEffect(() => {
    setRating(ratingResult?.attributes?.rating ?? 0);
  }, [ratingResult?.attributes?.rating]);
  return (
    <MainLayout>
      <div className="px-[16px] md:px-[100px] py-[50px]">
        <div className="flex justify-between items-center md:flex-row flex-col gap-y-2">
          <Link href="/" className="cursor-pointer underline">
            {"<"} Return to previous page
          </Link>
          <form
            action={async (formData) => {
              if (session?.data?.user) {
                await doLogoutBot(formData, botResult?.id);
                window.location.reload();
              } else {
                doSocialLoginBot(formData, botResult?.id);
              }
            }}
          >
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
        </div>
        <div className="grid md:grid-cols-3 gap-5 mt-5">
          <div className="flex flex-col md:gap-5 col-span-2">
            <div className="md:hidden flex justify-center items-center bg-[#9EE7FF] rounded-t-[16px] py-3">
              <Image
                width={100}
                height={100}
                alt="img"
                src={transformGoogleDriveUrl(botResult?.attributes?.imageUrl)}
              />
            </div>
            <div className="rounded-b-[12px] md:rounded-[12px] bg-white p-[12px] md:p-[24px] flex gap-x-4">
              <div className="hidden md:block">
                <Image
                  src={transformGoogleDriveUrl(botResult?.attributes?.imageUrl)}
                  width={180}
                  height={180}
                  alt="example"
                />
              </div>
              <div className="w-full">
                <div className="flex justify-between items-center w-full">
                  <p className="text-[24px] md:text-[40px] font-semibold">
                    {botResult?.attributes?.title}
                  </p>

                  <div
                    className={`p-[8px] md:p-[16px] rounded-[8px] ${
                      botResult?.attributes?.subcategory?.data?.attributes
                        ?.backgroundColor ?? "bg-[#CDFCFF]"
                    }`}
                  >
                    <span
                      className={`font-semibold text-[20px] ${
                        botResult?.attributes?.subcategory?.data?.attributes
                          ?.textColor ?? "text-[#11787F]"
                      }`}
                    >
                      {
                        botResult?.attributes?.subcategory?.data?.attributes
                          ?.title
                      }
                    </span>
                  </div>
                </div>
                <div className="my-3">
                  <p className="text-[16px] md:text-[24px]">
                    {botResult?.attributes?.chain?.data?.attributes?.name ??
                      "TON"}{" "}
                    Chain, {botResult?.attributes?.members ?? "0"} Members
                  </p>
                </div>
                <a
                  onClick={() => {
                    window.open(
                      `https://t.me/${botResult?.attributes?.username?.replaceAll(
                        "@",
                        ""
                      )}`,
                      "_blank"
                    );
                  }}
                  className="hover:bg-[#28B9E8] hover:text-white transition duration-300 cursor-pointer w-full block px-[19px] py-[8px] rounded-[39px] text-[#28B9E8] font-bold text-center border border-[#28B9E8]"
                >
                  {">"} Go to bot
                </a>
              </div>
            </div>
            <div className="md:mt-0 mt-5 rounded-[12px] bg-white p-[24px]">
              <p>Bot Description</p>
              <hr className="my-5" />
              <div
                dangerouslySetInnerHTML={{
                  __html: botResult?.attributes?.description.replaceAll(
                    "\\n",
                    "<br />"
                  ),
                }}
              />
            </div>
          </div>
          <div className="rounded-[12px] bg-white p-[35px]">
            <p className="text-[24px]">Bot Rating</p>
            <hr className="my-5" />
            <div className="flex gap-x-2">
              <div className="rounded-[8px] px-[16px] py-[10px] bg-[#FFFACD] w-fit">
                <span className="text-[36px] text-[#D88C0D] font-bold">
                  {botResult?.attributes?.rating ?? "0"}%
                </span>
              </div>
              <div>
                <p className="text-[24px] text-[#D88C0D]">Rated</p>
                <p className="text-[20px] text-[#D88C0D]">
                  {botResult?.attributes?.reviews ?? "0"} reviews
                </p>
              </div>
            </div>
            <div className="my-3 flex">
              <p>Contribute your rating&nbsp;</p>
              <p className="text-[#D88C0D]">{hover === 0 ? rating : hover}/5</p>
            </div>
            <div className="flex justify-center flex-1">
              {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setRating(index)}
                    onMouseEnter={() => setHover(index)}
                    onMouseLeave={() => setHover(rating)}
                  >
                    {index <= (hover || rating) ? (
                      <Image
                        className="cursor-pointer md:w-[56px] w-[32px] px-2"
                        src={`/img/star-filled.svg`}
                        width={56}
                        height={56}
                        alt="star"
                      />
                    ) : (
                      <Image
                        className="cursor-pointer md:w-[56px] w-[32px] px-2"
                        src={`/img/star-outlined.svg`}
                        width={56}
                        height={56}
                        alt="star"
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="my-5 flex justify-center items-center">
              <a
                onClick={async () => {
                  if (!session?.data) {
                    return Swal.fire({
                      title: "Google login",
                      text: "Please login with your google account first.",
                      icon: "info",
                    });
                  }
                  try {
                    if (ratingResult) {
                      await axiosApi.put(`/api/ratings/${ratingResult?.id}`, {
                        data: {
                          rating: rating,
                          user_account: userResult?.id,
                          bot: botResult?.id,
                        },
                      });
                    } else {
                      await axiosApi.post("/api/ratings", {
                        data: {
                          rating: rating,
                          user_account: userResult?.id,
                          bot: botResult?.id,
                        },
                      });
                    }
                    Toast.fire({
                      icon: "success",
                      title: "Successfully submitted rating!",
                    });
                  } catch (e) {
                    console.log(e);
                  }
                }}
                className="border text-[#D88C0D] font-semibold border-[#D88C0D] rounded-[39px] px-[19px] py-[12px] w-full text-center cursor-pointer"
              >
                Submit Score
              </a>
            </div>
            <div className="rounded-[11px] p-[16px] flex flex-col gap-[16px] bg-[#FFEDED] items-center md:items-start">
              <p className="text-center md:text-left">
                Do you notice any incorrect information, or do you suspect
                it&apos;s a malicious bot?
              </p>
              <a
                onClick={showModal}
                className="rounded-[10px] p-[12px] flex gap-x-[10px] bg-[#FF3636] w-fit items-center cursor-pointer"
              >
                <Image
                  className="cursor-pointer"
                  src="/img/alert-circle.svg"
                  width={24}
                  height={24}
                  alt="exclamation"
                />
                <p className="text-white">Report Bot</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        loading={loading}
      >
        <p className="mt-[25px] text-center text-[24px] font-bold">
          Report Bot
        </p>
        <p className="my-3 text-[14px] text-[#718096]">
          Please provide the reason and description for reporting the bot. We
          will review the issue and take appropriate action if it violates our
          guidelines.
        </p>
        <p className="text-[16px] font-bold text-[#718096] my-3">
          Tell us more about the problem
        </p>
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          placeholder="Please be clear and concise about the reasoning"
          maxLength={250}
        />
        <a
          onClick={handleOk}
          className="cursor-pointer bg-[#3AC8F7] rounded-[12px] px-[8px] py-[16px] font-bold w-full my-5 block text-center hover:text-black"
        >
          Report Bot
        </a>
        <a
          onClick={handleCancel}
          className="cursor-pointer underline text-[#636363] text-center block w-full hover:underline hover:text-[#636363]"
        >
          Cancel Action
        </a>
      </Modal>
    </MainLayout>
  );
}
