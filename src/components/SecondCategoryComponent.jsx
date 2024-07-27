import { BotComponent } from "@/components/BotComponent";
import Image from "next/image";

export const SecondCategoryComponent = ({ attributes }) => {
  return (
    <div className="p-[16px] md:p-[32px]">
      <div className="flex justify-between items-center">
        <div className="flex gap-x-2 items-center">
          <div className="h-[50px] w-[9px] bg-[#28B9E8]" />
          <p className="text-[18px] md:text-[40px]">{attributes?.title}</p>
        </div>
        <a className="rounded-[30px] cursor-pointer h-fit px-[19px] py-[12px] bg-[#28B9E8] flex items-center gap-x-1">
          <span className="text-white text-[12px] md:text-[16px]">
            View All Bots
          </span>
          <Image
            width={24}
            height={24}
            alt="download"
            src="/img/chevron-right.svg"
          />
        </a>
      </div>
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-[16px] mt-[16px]">
        {attributes?.bots?.data
          ?.filter((data) => data?.attributes?.published)
          ?.map((data, idx) => (
            <BotComponent
              key={data?.id}
              attributes={{ ...data?.attributes, id: data?.id }}
            />
          ))}
      </div>
    </div>
  );
};
