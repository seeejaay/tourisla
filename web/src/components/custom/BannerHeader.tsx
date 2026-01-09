import Image from "next/image";

interface BannerHeaderProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function BannerHeader({
  imageSrc,
  imageAlt = "Banner",
  title,
  subtitle,
  children,
}: BannerHeaderProps) {
  return (
    <header className="relative">
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={1920}
        height={800}
        className="w-full h-96 object-cover object-center brightness-[55%]"
        sizes="100vw"
        priority
      />
      <div className="absolute top-5 inset-0 flex items-center justify-center flex-col space-y-4">
        <h1 className="lg:text-5xl text-3xl font-extrabold text-gray-50 text-center drop-shadow-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="lg:text-xl text-lg text-gray-50 text-center font-semibold drop-shadow-2xl">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
