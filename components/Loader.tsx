import Image from "next/image";

export const Loader = ({
  height = 60,
  width = 120,
}: {
  height?: number;
  width?: number;
}) => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center shadow-md p-6 rounded-xl bg-white">
      <Image
        src="/images/logo.png"
        alt="Suvidhi Villa Logo"
        width={width}
        loading="eager"
        height={height}
        className="animate-pulse"
      />
      <p className="text-[var(--color-darktext)] text-lg">Loading...</p>
    </div>
  );
};
