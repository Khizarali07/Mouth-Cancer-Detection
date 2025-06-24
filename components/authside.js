import Image from "next/image";
import Link from "next/link";

function Authside() {
  return (
    <section className="hidden w-1/2 items-center justify-center bg-brand p-10 lg:flex xl:w-2/5">
      <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-16">
        <Link href="/">
          <Image
            src="/assets/icons/full-Logo.png"
            alt="logo"
            width={224}
            height={82}
            className="h-auto"
          />
        </Link>
        <div className="space-y-5 text-white">
          <h1 className="h1">Detect Mouth Cancer with Confidence</h1>
          <p className="body-1">
            Empowering early detection through advanced AI technology for a
            healthier future.
          </p>
        </div>
        <Image
          src="/assets/images/file.png"
          alt="Files"
          width={220}
          height={220}
          className="transition-all hover:rotate-2 hover:scale-105"
        />
      </div>
    </section>
  );
}

export default Authside;
