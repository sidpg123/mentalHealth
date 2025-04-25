import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function FAQ() {
  return (
    <section id="faq" className="min-h-screen">
      <div className="text-center pt-14">
        <h1 className="text-sm tracking-widest">MANY PEOPLE ASK</h1>
        <h1 className="text-2xl tracking-wider p-3">
          Frequently Asked Questions
        </h1>
        <h1 className="text-sm mx-4 text-slate-500">
          Actually, no one asked these questions, but I&apos;ll just put them
          here, who knows,
          <br /> you might want to read them, right?
        </h1>
      </div>

      <div className="flex justify-center mt-16 mb-10 md:mb-0">
        <Accordion type="single" collapsible className="mx-5 w-full md:w-1/2">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              What is this platform about?
            </AccordionTrigger>
            <AccordionContent>
              This platform is designed to help users assess their mental well-being,
              maintain a personal journal for self-reflection, and connect with mental health
              professionals for expert guidance. It provides a holistic approach to understanding
              and improving mental health.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              How does the mental health assessment work?
            </AccordionTrigger>
            <AccordionContent>
              The assessment consists of scientifically formulated questions that analyze various
              aspects of your mental well-being. Based on your responses, the platform provides insights,
              recommendations, and potential next steps to enhance your emotional health.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              Is my data private and secure?
            </AccordionTrigger>
            <AccordionContent>
              Yes, your data is completely private and encrypted. We follow industry-standard security
              protocols to ensure that your journal entries, test results, and personal information
              remain confidential and accessible only to you.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              Can I connect with a therapist through this platform?
            </AccordionTrigger>
            <AccordionContent>
              Yes, our platform provides access to licensed mental health professionals.
              You can book appointments and consult therapists online for expert guidance and support.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>
              How does the journaling feature help with mental health?
            </AccordionTrigger>
            <AccordionContent>
              Journaling allows you to express your emotions and track your mental well-being over time.
              Our AI-powered analysis provides insights into mood patterns and emotional trends,
              helping you gain clarity and self-awareness.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>
              Is this platform free to use?
            </AccordionTrigger>
            <AccordionContent>
              Yes, the basic features, including mental health assessments and journaling, are free.
              However, consultations with therapists may have associated costs based on the professional&apos;s fees.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger>
              Can I delete my data anytime?
            </AccordionTrigger>
            <AccordionContent>
              Absolutely! You have full control over your data. You can delete journal entries,
              assessment history, and even your account whenever you choose.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>


    </section>
  );
}

export default FAQ;
