"use client";
import { MainLayout } from "@/layouts/MainLayout";
import Image from "next/image";
import { useState } from "react";
import { Select, Modal, Input } from "antd";
import useSWR from "swr";
import { fetcherStrapi } from "@/utils/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { TextArea } = Input;

export default function Bot() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(0);
  const { data: botData } = useSWR(
    `/api/bots/${router.query?.id}?populate=*`,
    fetcherStrapi
  );
  const botResult = botData?.data?.data;

  return (
    <MainLayout>
      <div className="px-[16px] md:px-[100px] py-[50px]">
        <Link href="/" className="cursor-pointer underline">
          {"<"} Return to previous page
        </Link>
        <div className="grid md:grid-cols-3 gap-5 mt-5">
          <div className="flex flex-col md:gap-5 col-span-2">
            <div className="md:hidden flex justify-center items-center bg-[#9EE7FF] rounded-t-[16px] py-3">
              {botResult?.attributes?.image?.data?.attributes?.url && (
                <Image
                  width={100}
                  height={100}
                  alt="img"
                  src={
                    process.env.NEXT_PUBLIC_AXIOS_API +
                      botResult?.attributes?.image?.data?.attributes?.url ?? ""
                  }
                />
              )}
            </div>
            <div className="rounded-b-[12px] md:rounded-[12px] bg-white p-[12px] md:p-[24px] flex gap-x-4">
              <div className="hidden md:block">
                {botResult?.attributes?.image?.data?.attributes?.url && (
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_AXIOS_API +
                        botResult?.attributes?.image?.data?.attributes?.url ??
                      ""
                    }
                    width={180}
                    height={180}
                    alt="example"
                  />
                )}
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
                    {botResult?.attributes?.chain?.data?.attributes?.name}{" "}
                    Chain, {botResult?.attributes?.members} Members
                  </p>
                </div>
                <a className="cursor-pointer w-full block px-[19px] py-[8px] rounded-[39px] text-[#28B9E8] font-bold text-center border border-[#28B9E8]">
                  + Add bot
                </a>
              </div>
            </div>
            <div className="md:mt-0 mt-5 rounded-[12px] bg-white p-[24px]">
              <p>Bot Description</p>
              <hr className="my-5" />
              <p>{botResult?.attributes?.description}</p>
            </div>
          </div>
          <div className="rounded-[12px] bg-white p-[35px]">
            <p className="text-[24px]">Bot Rating</p>
            <hr className="my-5" />
            <div className="flex gap-x-2">
              <div className="rounded-[8px] px-[16px] py-[10px] bg-[#FFFACD] w-fit">
                <span className="text-[36px] text-[#D88C0D] font-bold">
                  {botResult?.attributes?.rating}%
                </span>
              </div>
              <div>
                <p className="text-[24px] text-[#D88C0D]">Rated</p>
                <p className="text-[20px] text-[#D88C0D]">
                  {botResult?.attributes?.reviews} reviews
                </p>
              </div>
            </div>
            <div className="my-3 flex justify-between">
              <p>Contribute your rating</p>
              <p className="text-[#D88C0D]">1/5</p>
            </div>
            <div className="flex justify-between">
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
                        className="cursor-pointer md:w-[56px] w-[32px]"
                        src={`/img/star-filled.svg`}
                        width={56}
                        height={56}
                        alt="star"
                      />
                    ) : (
                      <Image
                        className="cursor-pointer md:w-[56px] w-[32px]"
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
              <a className="border text-[#D88C0D] font-semibold border-[#D88C0D] rounded-[39px] px-[19px] py-[12px] w-full text-center cursor-pointer">
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
      >
        <p className="mt-[25px] text-center text-[24px] font-bold">
          Report Bot
        </p>
        <p className="my-3 text-[14px] text-[#718096]">
          Please provide the reason and description for reporting the bot. We
          will review the issue and take appropriate action if it violates our
          guidelines.
        </p>
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
        <p className="text-[16px] font-bold text-[#718096] my-3">
          Tell us more about the problem
        </p>
        <TextArea
          rows={6}
          placeholder="Please be clear and concise about the reasoning"
          maxLength={10}
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
