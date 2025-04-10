// app/api/questionnaire/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth"; // Adjust path as needed
import { PrismaClient } from "@prisma/client";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";

const prisma = new PrismaClient();

// Helper function to calculate DASS-21 scores
function calculateDASS21Scores(responses: Record<number, string>) {
  // Define which questions belong to which categories
  const categories = {
    depression: [3, 5, 10, 13, 16, 17, 21],
    anxiety: [2, 4, 7, 9, 15, 19, 20],
    stress: [1, 6, 8, 11, 12, 14, 18]
  };

  // Initialize scores
  const scores = {
    depression: 0,
    anxiety: 0,
    stress: 0
  };

  // Calculate raw scores for each category
  Object.entries(responses).forEach(([questionId, value]) => {
    const qId = parseInt(questionId);
    const score = parseInt(value);

    if (categories.depression.includes(qId)) {
      scores.depression += score;
    } else if (categories.anxiety.includes(qId)) {
      scores.anxiety += score;
    } else if (categories.stress.includes(qId)) {
      scores.stress += score;
    }
  });

  // Multiply by 2 to get final scores as per DASS-21 guidelines
  scores.depression *= 2;
  scores.anxiety *= 2;
  scores.stress *= 2;

  return scores;
}

// Helper function to get severity levels
function getSeverityLevels(scores: { depression: number; anxiety: number; stress: number }) {
  const severityLevels = {
    depression: "",
    anxiety: "",
    stress: ""
  };

  // Depression severity
  if (scores.depression <= 9) severityLevels.depression = "Normal";
  else if (scores.depression <= 13) severityLevels.depression = "Mild";
  else if (scores.depression <= 20) severityLevels.depression = "Moderate";
  else if (scores.depression <= 27) severityLevels.depression = "Severe";
  else severityLevels.depression = "Extremely Severe";

  // Anxiety severity
  if (scores.anxiety <= 7) severityLevels.anxiety = "Normal";
  else if (scores.anxiety <= 9) severityLevels.anxiety = "Mild";
  else if (scores.anxiety <= 14) severityLevels.anxiety = "Moderate";
  else if (scores.anxiety <= 19) severityLevels.anxiety = "Severe";
  else severityLevels.anxiety = "Extremely Severe";

  // Stress severity
  if (scores.stress <= 14) severityLevels.stress = "Normal";
  else if (scores.stress <= 18) severityLevels.stress = "Mild";
  else if (scores.stress <= 25) severityLevels.stress = "Moderate";
  else if (scores.stress <= 33) severityLevels.stress = "Severe";
  else severityLevels.stress = "Extremely Severe";

  return severityLevels;
}

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(NEXT_AUTH_CONFIG);
        // console.log(session?.user.id)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request body
    const body = await req.json();
    const { questionnaireId, responses } = body;

    // Validate request
    if (!questionnaireId || !responses || Object.keys(responses).length < 21) {
      return NextResponse.json(
        { error: "Invalid request. Missing questionnaireId or incomplete responses." },
        { status: 400 }
      );
    }

    // Calculate scores
    const scores = calculateDASS21Scores(responses);
    const severities = getSeverityLevels(scores);

    // Create results object with scores and severities
    const results = {
      ...scores,
      severities,
      timestamp: new Date().toISOString()
    };

    // Get the actual questionnaire from the database
    const questionnaire = await prisma.questionnaire.findFirst({
      where: { title: "DASS-21" },
    });

    if (!questionnaire) {
      return NextResponse.json({ error: "Questionnaire not found" }, { status: 404 });
    }

    // Save the response to the database
    const userResponse = await prisma.userResponse.create({
      data: {
        userId: session.user.id,
        questionnaireId: questionnaire.id,
        responses: responses as any, // Cast to any for Prisma Json type
        results: results as any // Cast to any for Prisma Json type
      }
    });

    // Return the results
    return NextResponse.json({
      success: true,
      userResponseId: userResponse.id,
      results: scores
    });
  } catch (error) {
    console.error("Error in DASS-21 submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}