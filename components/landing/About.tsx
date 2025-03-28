import Image from "next/image";
import React from "react";


export default function About() {
  return (
    <section className="min-h-screen ">
      <div className="text-center">
        <h1 className="mt-16 md:mt-0 text-sm font-bold bg-gradient-to-r from-[#4A72FF] via-[#5C53D1] to-[#712D99] bg-clip-text text-transparent">
          MannVeda – Your Mental Wellness Companion
        </h1>
        <h1 className="text-2xl tracking-wider p-3">
          Struggling to understand your emotions?
        </h1>
        <h1 className="text-sm mx-4 text-slate-500">
          Assess, express, and get expert support—all in one place!
        </h1>
      </div>


      <div className="flex flex-col md:flex-row justify-between items-center mx-auto w-[78%]">

        <div className="w-80 lg:pt-16">

          <Image src={'/quiz.jpg'} alt={"Quiz"} width={400} height={400} className="pb-8" />
          <h1 className="text-center pb-2 tracking-wide text-lg">
            Mental Health Assessment
          </h1>
          <h1 className="text-center text-darkLight pl-4 ">
            Our questionnaire helps users assess their mental well-being by analyzing their responses. The test provides insights into stress levels, anxiety, and emotional health, allowing users to take proactive steps toward better mental health.
          </h1>
        </div>


        <div className="w-80">

          <Image src={"/docBooking.png"} alt={"Doctor booking"} width={400} height={400} />
          <h1 className="text-center pb-2 tracking-wide text-lg">
            Expert Consultation & Support
          </h1>
          <h1 className="text-center text-darkLight pl-4 ">
            Connect with certified mental health professionals for guidance and support. Our seamless booking system makes it easy to schedule consultations, ensuring that users receive the right help when they need it
          </h1>
        </div>


        <div className="w-80">
          {/* <PendingFeeTracking /> */}
          <Image src={"/diary.png"} alt={"Diary"} width={300} height={200} className="pb-6" />
          <h1 className="text-center pb-2 tracking-wide text-lg">
            Interactive Mental Health Journal
          </h1>
          <h1 className="text-center text-darkLight pl-4 ">
            Users can maintain a private diary to express their thoughts and emotions. Our intelligent system analyzes journal entries to provide trends, mood insights, and helpful suggestions, enabling users to track their mental health journey effectively.
          </h1>
        </div>


      </div>
    </section>
  );
}
