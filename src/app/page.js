"use client";
import { CategoryComponent } from "@/components/CategoryComponent";
import { MainLayout } from "@/layouts/MainLayout";
import { fetcherStrapi } from "@/utils/axios";
import Image from "next/image";
import useSWR from "swr";
import { useState } from "react";
import { Checkbox, Col, Input } from "antd";
import { BotSearchComponent } from "@/components/BotSearchComponent";
import { Spin } from "antd";
// import { useRouter } from "next/router";

export default function Home() {
  // const router = useRouter();
  const { data: categoriesData } = useSWR(
    `/api/categories?populate=deep,10`,
    fetcherStrapi
  );

  const { data: subcategoriesData } = useSWR(
    `/api/subcategories?populate=*`,
    fetcherStrapi
  );

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedChain, setSelectedChain] = useState("");
  const categoriesResult = categoriesData?.data?.data;
  const subcategoriesResult = subcategoriesData?.data?.data;

  const [searchQuery, setSearchQuery] = useState("");
  const ratingOptions = [
    {
      label: "Excellent (90-100%)",
      value: "excellent",
      minValue: 90,
      maxValue: 100,
    },
    {
      label: "Very Good (80-90%)",
      value: "very-good",
      minValue: 80,
      maxValue: 90,
    },
    {
      label: "Good (70-80%)",
      value: "Good",
      minValue: 70,
      maxValue: 80,
    },
    {
      label: "Pleasant (60-70%)",
      value: "pleasant",
      minValue: 60,
      maxValue: 70,
    },
    {
      label: "Satisfactory (0-60%)",
      value: "satisfactory",
      minValue: 0,
      maxValue: 60,
    },
  ];
  const { data: botsData, isLoading: botLoading } = useSWR(
    `/api/bots?populate=*&filters[title][$containsi]=${searchQuery}`,
    fetcherStrapi
  );

  const botsResult = botsData?.data?.data;

  const filterByCategory = (attr) => {
    if (selectedCategories?.length === 0) return true;
    return selectedCategories?.includes(
      attr?.attributes?.subcategory?.data?.attributes?.title?.toLowerCase()
    );
  };

  const filterByRating = (attr) => {
    if (selectedRatings?.length === 0) return true;
    for (let i = 0; i < selectedRatings?.length; i++) {
      const currentRatingOption = ratingOptions?.find(
        (data) => data.value === selectedRatings[i]
      );
      if (
        currentRatingOption &&
        attr?.attributes?.rating >= currentRatingOption?.minValue &&
        attr?.attributes?.rating <= currentRatingOption?.maxValue
      ) {
        return true;
      }
    }
    return false;
  };

  const filterByChain = (attr) => {
    if (!selectedChain) return true;
    return attr?.attributes?.chain?.data?.attributes?.name
      ?.toLowerCase()
      .includes(selectedChain);
  };

  const finalBotsResult = botsResult
    ?.filter(filterByCategory)
    ?.filter(filterByRating)
    ?.filter(filterByChain);

  const onChangeCategory = (checkedValues) => {
    setSelectedCategories(checkedValues);
  };

  const onChangeRating = (checkedValues) => {
    setSelectedRatings(checkedValues);
  };

  const subcategoriesOptions = subcategoriesResult?.map((data) => ({
    label: data?.attributes?.title,
    value: data?.attributes?.title?.toLowerCase(),
    childLength: data?.attributes?.bots?.data?.length,
  }));

  return (
    <MainLayout>
      <div
        className={`${searchQuery ? "h-fit" : "h-[512px]"} p-[16px] w-full ${
          searchQuery ? "bg-[#3AC8F7]" : "hero"
        } flex justify-center items-center ${
          searchQuery ? "md:flex-row gap-x-5 flex-col gap-y-4" : "flex-col"
        }`}
      >
        {!searchQuery && (
          <div>
            <p className="text-[32px] md:text-[64px] font-bold text-center">
              Discover top-tier Telegram bots
            </p>
            <p className="text-[24px] md:text-[40px] md:mt-0 mt-4 font-bold text-center font-extralight">
              Number one telegram directory for your needs
            </p>
          </div>
        )}
        {searchQuery && (
          <div className="text-center md:text-left">
            <p>Search results for &quot;{searchQuery}&quot;</p>
            <p>{botsResult?.length ?? "0"} results</p>
          </div>
        )}
        <div
          className={`bg-white rounded-[55px] px-[30px] flex justify-between py-[18px] w-[90vw] md:w-[70vw] ${
            searchQuery ? "mt-0" : "mt-[50px]"
          }`}
        >
          <div className="flex gap-x-2 items-center flex-1">
            <Image width={24} height={24} alt="search" src="/img/Search.svg" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search Bot"
              className="outline-none w-full"
            />
          </div>
          <div className="flex gap-x-2 cursor-pointer">
            <div className="h-full w-[1px] bg-black mr-3" />
            <p>All Category</p>
            <Image
              width={24}
              height={24}
              alt="search"
              src="/img/chevron-down.svg"
            />
          </div>
        </div>
      </div>
      {!searchQuery &&
        categoriesResult?.map((data, idx) => (
          <CategoryComponent key={data?.id} attributes={data?.attributes} />
        ))}
      {searchQuery && (
        <div className="flex md:flex-row flex-col gap-x-10 px-[10px] md:px-[25px] py-[25px]">
          <div className="bg-white rounded-[12px] px-[24px] py-[18px]">
            <p className="text-[20px] font-bold">Filters</p>
            <hr className="my-5" />
            <div className="flex justify-between mb-3 gap-x-[200px]">
              <p className="text-[20px] font-semibold">Category</p>
              <Image
                width={16}
                height={16}
                alt="search"
                src="/img/chevron-down.svg"
              />
            </div>
            <Checkbox.Group
              style={{ width: "100%" }}
              onChange={onChangeCategory}
            >
              <Col className="flex flex-col gap-y-2 justify-center" span={24}>
                {subcategoriesOptions?.map((data) => (
                  <div
                    key={data.value}
                    className="flex justify-between items-center"
                  >
                    <Checkbox
                      className="text-[14px] text-[#676767]"
                      value={data?.value}
                    >
                      {data?.label}
                    </Checkbox>
                    <p>
                      {botsResult?.filter(
                        (botData) =>
                          botData?.attributes?.subcategory?.data?.attributes?.title?.toLowerCase() ===
                          data?.value?.toLowerCase()
                      ).length ?? "0"}
                    </p>
                  </div>
                ))}
              </Col>
            </Checkbox.Group>
            <hr className="my-5" />
            <div className="flex justify-between mb-3">
              <p className="text-[20px] font-semibold">Rating</p>
              <Image
                width={16}
                height={16}
                alt="search"
                src="/img/chevron-down.svg"
              />
            </div>
            <Checkbox.Group style={{ width: "100%" }} onChange={onChangeRating}>
              <Col className="flex flex-col gap-y-2 justify-center" span={24}>
                {ratingOptions.map((data) => (
                  <div
                    key={data.value}
                    className="flex justify-between items-center"
                  >
                    <Checkbox
                      className="text-[12px] text-[#676767] w-full"
                      value={data.value}
                    >
                      {data.label}
                    </Checkbox>
                    <p>
                      {botsResult?.filter(
                        (item) =>
                          item?.attributes?.rating >= data?.minValue &&
                          item?.attributes?.rating <= data?.maxValue
                      ).length ?? "0"}
                    </p>
                  </div>
                ))}
              </Col>
            </Checkbox.Group>
            <hr className="my-5" />
            <div className="flex justify-between mb-3">
              <p className="text-[20px] font-semibold">Chain</p>
              <Image
                width={16}
                height={16}
                alt="search"
                src="/img/chevron-down.svg"
              />
            </div>
            <Input
              size="large"
              onChange={(e) => setSelectedChain(e.target.value)}
              value={selectedChain}
              placeholder="Search All Chain"
              prefix={
                <Image
                  width={16}
                  height={16}
                  alt="search"
                  src="/img/Search.svg"
                />
              }
            />
          </div>
          {finalBotsResult?.length > 0 ? (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 w-full md:mt-0 mt-5 gap-3">
              {finalBotsResult?.map((data, idx) => (
                <BotSearchComponent
                  key={data?.id}
                  attributes={{ ...data?.attributes, id: data?.id }}
                />
              ))}
            </div>
          ) : botLoading ? (
            <div className="flex justify-center w-full">
              <Spin size="large" />
            </div>
          ) : (
            <p className="text-black text-[32px] md:mt-0 mt-3 md:text-[40px] w-full text-center">
              Query not found...
            </p>
          )}
        </div>
      )}
    </MainLayout>
  );
}
