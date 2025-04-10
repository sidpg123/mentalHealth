"use client";
import { gsap } from "gsap";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { FaRegArrowAltCircleUp as ArrowCircleUpIcon } from "react-icons/fa";
import Navbar from "../Navbar";
import { Button } from "../ui/button";

function Hero() {
  const router = useRouter();
  
  // State to store session data
  // const [session, setSession] = useState(null);

  // Refs for animating text elements
  const subtitleRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);
  const imageRef = useRef(null);

  const handleTestRequest = () => {
    router.push("/questionnaire/dass21");
  };

  useEffect(() => {
    // // Fetch session data inside useEffect
    // const fetchSession = async () => {
    //   const sessionData = await getSession();
    //   setSession(sessionData);
    // };

    // fetchSession();

    // Create a timeline for sequential animations
    const tl = gsap.timeline({
      defaults: { 
        duration: 1, 
        ease: "power3.out" 
      }
    });

    // Stagger and animate text elements
    tl.fromTo(
      subtitleRef.current, 
      { 
        opacity: 0, 
        y: 50 
      },
      { 
        opacity: 1, 
        y: 0 
      }
    )
    .fromTo(
      titleRef.current, 
      { 
        opacity: 0, 
        y: 50 
      },
      { 
        opacity: 1, 
        y: 0 
      },
      "-=0.5" // Overlap with previous animation
    )
    .fromTo(
      descriptionRef.current, 
      { 
        opacity: 0, 
        y: 50 
      },
      { 
        opacity: 1, 
        y: 0 
      },
      "-=0.5"
    )
    .fromTo(
      buttonsRef.current, 
      { 
        opacity: 0, 
        scale: 0.8 
      },
      { 
        opacity: 1, 
        scale: 1 
      },
      "-=0.5"
    )
    .fromTo(
      imageRef.current,
      {
        opacity: 0,
        scale: 0.9
      },
      {
        opacity: 1,
        scale: 1
      },
      "-=0.5"
    );
  }, []);

  return (
    <section className="min-h-screen">
      <Navbar />
      <div className="flex flex-col md:flex-row-reverse justify-center pt-14 md:pt-31 mx-auto md:max-w-[95%]">
        <div 
          ref={imageRef}
          className="w-full mx-auto max-w-[80%] flex justify-center items-center px-6 sm:w-9/12 md:w-2/4 xl:w-[40%]"
        >
          <Image
            className="rounded-lg content-center"
            width={500}
            height={200}
            src={"/hero.png"}
            alt={"Hero image"}
          />
        </div>

        <div className="mt-5 max-w-[80%] md:max-w-[35%] p-5 mx-auto border-slate-700 w-full md:w-1/2 flex flex-col">
          <h1 
            ref={subtitleRef}
            className="text-sm font-bold tracking-wider bg-gradient-to-r from-[#4A72FF] via-[#5C53D1] to-[#712D99] bg-clip-text text-transparent"
          >
            Think Clear, Feel Better!
          </h1>
          <h1 
            ref={titleRef}
            className="pt-7 text-4xl tracking-wide"
          >
            Assess your well-being, express your thoughts, and find support—all in one place.
          </h1>
          <h4 
            ref={descriptionRef}
            className="pt-3 tracking-wide text-slate-400"
          >
            Assess your mind, write your thoughts, and connect with experts—simple, insightful, and always there for you
          </h4>
          <div 
            ref={buttonsRef}
            className="mt-6 flex flex-row"
          >
            <Button
              className="py-5 px-7 mr-3 bg-[#4A72FF] hover:bg-blue-500 shadow-md shadow-blue-600"
              onClick={handleTestRequest}
            >
              Take Test <ArrowCircleUpIcon className="rotate-90" />
            </Button>
            <Button className="py-5 px-7 mx-auto text-[#4A72FF] bg-[#f1f1f3] hover:bg-[#f1eeeeee] shadow-md shadow-slate-300">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
