import Image from "next/image";

function Spinner() {
  return (
    <div className="w-[60vw] h-screen flex justify-center items-center">
      <Image
        src="/assets/icons/Logo.png"
        alt="loader"
        width={48}
        height={48}
        className="animate-spin"
      />
    </div>
  );
}

export default Spinner;
