import Image from "next/image";

export function MoodSection() {
  return (
    <section className="py-16 bg-surface">
      <div className="">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-balance">
          What's your mood for the day?
        </h2>
        <p className="text-center font-semibold text-foreground-muted mb-12 max-w-2xl mx-auto text-pretty">
          How are you feeling today? I hope you're doing well! Let's take a moment to brighten your
          mood and bring some positivity into your day!
        </p>
        {/* decorative background */}
        <div className=" bg-[url('/images/mood-decorative.svg')] bg-cover bg-center rounded-2xl py-8 bg-no-repeat px-4">
          {/* kitchen */}
          <div className="relative h-[300px] md:h-[500px] max-w-6xl mx-auto rounded-2xl overflow-hidden bg-[url('/images/mood-bg.png')] bg-no-repeat bg-cover bg-center">
            {/* table  */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-[url('/images/mood-table.png')] bg-no-repeat bg-contain w-full h-64 bg-center">
              {/* // bottles on the table  */}
              <div className=" absolute w-96 h-44  left-1/2 -translate-x-1/2 top-0 ">
                <Image
                  src="/images/dummy-2.png"
                  alt="Dummy 2"
                  width={90}
                  height={90}
                  className="object-contain absolute left-0 bottom-1/2 translate-y-1/2"
                />
                <Image
                  src="/images/dummy-2.png"
                  alt="Dummy 2"
                  width={90}
                  height={90}
                  className="object-contain absolute right-0 bottom-1/2 translate-y-1/2"
                />
                <Image
                  src="/images/dummy-2.png"
                  alt="Dummy 2"
                  width={70}
                  height={70}
                  className="object-contain absolute right-1/2 -translate-x-1/2 top-4"
                />
                <Image
                  src="/images/dummy-2.png"
                  alt="Dummy 2"
                  width={70}
                  height={70}
                  className="object-contain absolute left-1/2 translate-x-1/2 top-4"
                />
                <Image
                  src="/images/dummy-2.png"
                  alt="Dummy 2"
                  width={90}
                  height={90}
                  className="object-contain absolute right-1/2 translate-x-1/2 bottom-0"
                />
              </div>
              {/* character  */}
              <div >
                {/* on right side  */}
                <Image
                  src="/images/mood-character.png"
                  alt="Mood Character"
                  width={300}
                  height={300}
                  className="object-contain absolute right-10 bottom-0 "
                />
                {/* on left side  */}
                <Image
                  src="/images/mood-character.png"
                  alt="Mood Character"
                  width={300}
                  height={300}
                  className="object-contain absolute left-10 bottom-0 rotate-y-180"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
