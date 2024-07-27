import Image from "next/image";
import Link from "next/link";

export const MainLayout = ({ children }) => {
  return (
    <main>
      <div className="bg-white px-[10px] md:px-[150px] py-[32px] flex justify-between items-center border-[#D6D6D6] border-b">
        <Link href="/" onClick={() => {}} className="cursor-pointer">
          <Image
            width={197}
            height={40}
            className="w-[150px] md:w-[197px]"
            alt="telehub"
            src="/img/logo.svg"
          />
        </Link>
        <Link
          href="/submit-bot"
          className="rounded-[30px] cursor-pointer px-[27px] py-[10px] bg-[#28B9E8] flex items-center gap-x-2"
        >
          <Image
            width={24}
            height={24}
            alt="download"
            src="/img/file-download.svg"
          />
          <span className="text-white">Submit Bot</span>
        </Link>
      </div>
      {children}
      <div className="py-[75px] bg-white border-[#D6D6D6] border-t flex flex-col justify-center items-center gap-y-4">
        <Image width={135} height={140} alt="download" src="/img/telehub.svg" />
        <p>tagline here</p>
        <Image width={36} height={36} alt="download" src="/img/telegram.svg" />
        <p className="font-semibold">&copy; 2024 telehub.bot</p>
      </div>
    </main>
  );
};
