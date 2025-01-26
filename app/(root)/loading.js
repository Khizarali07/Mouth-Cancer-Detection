import Image from "next/image";

export default function Loading() {
  return (
    <div className="w-full flex h-full flex-1 flex-col justify-center items-center">
      <div className="relative">
        {/* Outer loader */}
        <Image
          src="/assets/icons/loader-brand.svg"
          alt="loader"
          width={48}
          height={48}
          className="animate-spin"
        />

        {/* Inner logo */}
        <div className="absolute inset-0 flex justify-center items-center">
          <Image
            src="/assets/icons/Logo.png"
            alt="Logo"
            width={32}
            height={32} // Adjust size to fit nicely within the loader
          />
        </div>
      </div>
    </div>
  );
}
