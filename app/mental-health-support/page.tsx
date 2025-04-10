// src/app/mental-health-support/page.tsx
import { Suspense } from "react";
import dynamic from 'next/dynamic';

// Dynamically import the client component with no SSR
const ChatInterface = dynamic(
  () => import('@/components/ui/chat/ChatInterface').then(mod => ({ default: mod.ChatInterface })),
  { ssr: false }
);

export const metadata = {
  title: "Mental Health Support | Your Project Name",
  description: "Get support and guidance for your mental health concerns",
};

export default function MentalHealthSupportPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Mental Health Support</h1>
          <p className="text-muted-foreground mt-2">
            Chat with our AI assistant for mental health guidance and support.
            Remember that this is not a replacement for professional help.
          </p>
        </div>
        
        <Suspense fallback={<div>Loading chat interface...</div>}>
          <ChatInterface />
        </Suspense>
        
        <div className="mt-8 text-sm text-muted-foreground">
          <h2 className="font-medium text-foreground">Important Notice</h2>
          <p className="mt-2">
            This AI assistant is designed to provide general guidance and support
            for mental health concerns. It is not a substitute for professional
            medical advice, diagnosis, or treatment.
          </p>
          <p className="mt-2">
            If you're experiencing a mental health emergency or having thoughts
            of harming yourself or others, please contact emergency services
            immediately or reach out to a mental health crisis hotline.
          </p>
        </div>
      </div>
    </div>
  );
}