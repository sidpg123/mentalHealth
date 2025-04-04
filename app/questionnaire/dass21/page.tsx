// app/questionnaire/dass21/page.tsx
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DASS21Questions = [
  { id: 1, text: "I found it hard to wind down", category: "s" },
  { id: 2, text: "I was aware of dryness of my mouth", category: "a" },
  { id: 3, text: "I couldn't seem to experience any positive feeling at all", category: "d" },
  { id: 4, text: "I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)", category: "a" },
  { id: 5, text: "I found it difficult to work up the initiative to do things", category: "d" },
  { id: 6, text: "I tended to over-react to situations", category: "s" },
  { id: 7, text: "I experienced trembling (e.g. in the hands)", category: "a" },
  { id: 8, text: "I felt that I was using a lot of nervous energy", category: "s" },
  { id: 9, text: "I was worried about situations in which I might panic and make a fool of myself", category: "a" },
  { id: 10, text: "I felt that I had nothing to look forward to", category: "d" },
  { id: 11, text: "I found myself getting agitated", category: "s" },
  { id: 12, text: "I found it difficult to relax", category: "s" },
  { id: 13, text: "I felt down-hearted and blue", category: "d" },
  { id: 14, text: "I was intolerant of anything that kept me from getting on with what I was doing", category: "s" },
  { id: 15, text: "I felt I was close to panic", category: "a" },
  { id: 16, text: "I was unable to become enthusiastic about anything", category: "d" },
  { id: 17, text: "I felt I wasn't worth much as a person", category: "d" },
  { id: 18, text: "I felt that I was rather touchy", category: "s" },
  { id: 19, text: "I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat)", category: "a" },
  { id: 20, text: "I felt scared without any good reason", category: "a" },
  { id: 21, text: "I felt that life was meaningless", category: "d" }
];

// Rating options
const ratingOptions = [
  { value: "0", label: "Did not apply to me at all" },
  { value: "1", label: "Applied to me to some degree, or some of the time" },
  { value: "2", label: "Applied to me to a considerable degree or a good part of time" },
  { value: "3", label: "Applied to me very much or most of the time" }
];

// Severity levels
const severityLevels = {
  depression: [
    { range: [0, 9], label: "Normal" },
    { range: [10, 13], label: "Mild" },
    { range: [14, 20], label: "Moderate" },
    { range: [21, 27], label: "Severe" },
    { range: [28, 100], label: "Extremely Severe" }
  ],
  anxiety: [
    { range: [0, 7], label: "Normal" },
    { range: [8, 9], label: "Mild" },
    { range: [10, 14], label: "Moderate" },
    { range: [15, 19], label: "Severe" },
    { range: [20, 100], label: "Extremely Severe" }
  ],
  stress: [
    { range: [0, 14], label: "Normal" },
    { range: [15, 18], label: "Mild" },
    { range: [19, 25], label: "Moderate" },
    { range: [26, 33], label: "Severe" },
    { range: [34, 100], label: "Extremely Severe" }
  ]
};

export default function DASS21Page() {
  const { status } = useSession();
  const router = useRouter();
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/signin?callbackUrl=/questionnaire/dass21");
    return null;
  }

  // Calculate progress
  const progress = Object.keys(responses).length / DASS21Questions.length * 100;

  // Handle response change
  const handleResponseChange = (questionId: number, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  // Get severity level
  const getSeverityLevel = (category: string, score: number) => {
    const levels = severityLevels[category as keyof typeof severityLevels];
    return levels.find(level => score >= level.range[0] && score <= level.range[1])?.label || "Unknown";
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate all questions are answered
    if (Object.keys(responses).length < DASS21Questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/questionnaire/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionnaireId: "dass21", // You should use the actual ID from your database
          responses,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit questionnaire");
      }

      const data = await res.json();
      setResults(data.results);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset the questionnaire
  const handleReset = () => {
    setResponses({});
    setResults(null);
    setError(null);
  };

  // If results are available, show them
  if (results) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8 px-4">
        <div className="w-full max-w-3xl">
          <Card className="w-full shadow-lg">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-center text-2xl text-blue-800">DASS-21 Assessment Results</CardTitle>
              <CardDescription className="text-center">
                Here are your DASS-21 assessment results based on your responses
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-8">
                {/* Depression Score */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Depression</h3>
                    <span className="font-bold text-lg">{results.depression} / 42</span>
                  </div>
                  <Progress value={(results.depression / 42) * 100} className= "sticky h-3" />
                  <div className="bg-blue-50 p-4 rounded-md">
                    <span className="font-semibold">
                      Severity: <span className={`${getSeverityLevel("depression", results.depression) === "Normal" ? "text-green-600" : "text-red-600"}`}>
                        {getSeverityLevel("depression", results.depression)}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Anxiety Score */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Anxiety</h3>
                    <span className="font-bold text-lg">{results.anxiety} / 42</span>
                  </div>
                  <Progress value={(results.anxiety / 42) * 100} className="h-3" />
                  <div className="bg-blue-50 p-4 rounded-md">
                    <span className="font-semibold">
                      Severity: <span className={`${getSeverityLevel("anxiety", results.anxiety) === "Normal" ? "text-green-600" : "text-red-600"}`}>
                        {getSeverityLevel("anxiety", results.anxiety)}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Stress Score */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Stress</h3>
                    <span className="font-bold text-lg">{results.stress} / 42</span>
                  </div>
                  <Progress value={(results.stress / 42) * 100} className="h-3" />
                  <div className="bg-blue-50 p-4 rounded-md">
                    <span className="font-semibold">
                      Severity: <span className={`${getSeverityLevel("stress", results.stress) === "Normal" ? "text-green-600" : "text-red-600"}`}>
                        {getSeverityLevel("stress", results.stress)}
                      </span>
                    </span>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Important Note</AlertTitle>
                  <AlertDescription>
                    This assessment is for informational purposes only and does not replace professional medical advice. 
                    If you're experiencing significant emotional difficulties, please contact a healthcare professional.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handleReset}>
                Take Again
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/")}>
                Return to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8 px-4">
      <div className="w-full max-w-3xl">
        <Card className="w-full shadow-lg">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-center text-2xl text-blue-800">DASS-21 Assessment</CardTitle>
            <CardDescription className="text-center">
              Please read each statement and select a number which indicates how much the statement
              applied to you over the past week. There are no right or wrong answers.
            </CardDescription>
          </CardHeader>
          <CardContent className="sticky pt-6">
            <div className="mb-6 space-y-2">
              <div className="flex justify-between items-center">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-8">
              {DASS21Questions.map((question) => (
                <div key={question.id} className="space-y-4">
                  <div className="font-medium">
                    {question.id}. {question.text}
                  </div>
                  <RadioGroup
                    value={responses[question.id] || ""}
                    onValueChange={(value) => handleResponseChange(question.id, value)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    {ratingOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50">
                        <RadioGroupItem value={option.value} id={`q${question.id}-${option.value}`} />
                        <Label
                          htmlFor={`q${question.id}-${option.value}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex justify-between">
                            <span>{option.label}</span>
                            <span className="font-semibold">{option.value}</span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {question.id < DASS21Questions.length && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 px-8" 
              onClick={handleSubmit} 
              disabled={loading || Object.keys(responses).length < DASS21Questions.length}
            >
              {loading ? "Submitting..." : "Submit Assessment"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}