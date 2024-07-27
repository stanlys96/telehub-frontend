import Image from "next/image";
// import { useRouter } from "next/router";

export const BotSearchComponent = ({ attributes }) => {
  // const router = useRouter();
  return (
    <div
      onClick={() => {}}
      className="hover:bg-[#F1FCFE] h-fit w-full bg-white transition duration-250 rounded-[16px] border border-[#FFFFFF] cursor-pointer hover:border-[#28B9E8]"
    >
      <div className="flex justify-center items-center bg-[#9EE7FF] rounded-t-[16px] py-3">
        {attributes?.image?.data?.attributes?.url && (
          <Image
            width={100}
            height={100}
            alt="img"
            src={
              process.env.NEXT_PUBLIC_AXIOS_API +
                attributes?.image?.data?.attributes?.url ?? ""
            }
            className="h-fit"
          />
        )}
      </div>
      <div className="p-[16px]">
        <div className="flex flex-col gap-y-3 justify-center">
          <p className="font-semibold">{attributes?.title}</p>
          <p>
            {attributes?.chain?.data?.attributes?.name} Chain,{" "}
            {attributes?.members} members
          </p>
          <a className="px-[19px] py-[8px] justify-center rounded-[39px] border-[#28B9E8] border-[1px] flex gap-x-2 cursor-pointer">
            <Image width={24} height={24} alt="download" src="/img/plus.svg" />
            <span className="font-bold  text-[16px] text-[#28B9E8]">
              Add Bot
            </span>
          </a>
        </div>
        <div className="flex flex-row justify-between mt-5 items-end gap-y-2">
          <div
            className={`rounded-[8px] w-fit ${
              attributes?.subcategory?.data?.attributes?.backgroundColor ??
              "bg-[#CDFCFF]"
            } px-[16px] py-[10px] h-fit ${
              attributes?.subcategory?.data?.attributes?.textColor ??
              "text-[#11787F]"
            } font-semibold`}
          >
            {attributes?.subcategory?.data?.attributes?.title}
          </div>
          <div className="flex gap-y-2 gap-x-2 items-center">
            <div>
              <p className="text-[#D88C0D] text-right">Rated</p>
              <p className="text-[#D88C0D] text-[10px] text-right">
                {attributes?.reviews} views
              </p>
            </div>
            <div className="bg-[#FFFACD] px-[16px] py-[10px] font-semibold text-[#D88C0D] rounded-[8px] h-fit">
              {attributes?.rating}%
            </div>
          </div>
        </div>
        <hr className="block my-5" />
        <p className="block">{attributes?.description}</p>
      </div>
    </div>
  );
};
