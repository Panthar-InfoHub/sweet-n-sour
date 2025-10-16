import Image from "next/image";
import React from "react";

const PageHeader = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="bg-gradient-to-b from-primary/10 to-transparent py-8 sm:py-16 border-b border-border bg-[url('/images/checkout-bg.svg')] bg-repeat bg-center relative overflow-hidden">
      <Image
        src="/images/decor/spices.svg"
        alt="Categories"
        width={50}
        height={50}
        className="absolute z-0  bottom-0 translate-y-1/3 left-0 right-0 w-24 h-24  md:w-36 md:h-36 object-contain"
      />
      <Image
        src="/images/decor/green-chili.svg"
        alt="Categories"
        width={50}
        height={50}
        className="absolute z-0 top-0  left-[15%]  w-36 h-36 object-contain max-md:hidden"
      />
      <Image
        src="/images/decor/mango.svg"
        alt="Categories"
        width={50}
        height={50}
        className="absolute z-0 max-md:top-0 md:bottom-0 w-24 h-24 right-0 md:right-[15%]  md:w-36 md:h-36 object-contain"
      />
      <Image
        src="/images/decor/green-red-chili.svg"
        alt="Categories"
        width={50}
        height={50}
        className="absolute z-0 -top-[25%] right-0  w-36 h-36 object-contain max-md:hidden"
      />

      <div className="custom-container relative z-10">
        <h1 className="text-2xl  sm:text-3xl md:text-4xl font-bold text-center mb-2">{title}</h1>
        <p className="text-center max-md:max-w-[50%] mx-auto   text-muted-foreground text-sm sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
