// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create the DASS-21 questionnaire
  const dass21 = await prisma.questionnaire.create({
    data: {
      title: 'DASS-21',
      description: 'Depression Anxiety Stress Scales (21 items)',
    },
  });

  // Create the questions
  const questions = [
    { text: 'I found it hard to wind down', category: 's', order: 1 },
    { text: 'I was aware of dryness of my mouth', category: 'a', order: 2 },
    { text: 'I couldn\'t seem to experience any positive feeling at all', category: 'd', order: 3 },
    { text: 'I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)', category: 'a', order: 4 },
    { text: 'I found it difficult to work up the initiative to do things', category: 'd', order: 5 },
    { text: 'I tended to over-react to situations', category: 's', order: 6 },
    { text: 'I experienced trembling (e.g. in the hands)', category: 'a', order: 7 },
    { text: 'I felt that I was using a lot of nervous energy', category: 's', order: 8 },
    { text: 'I was worried about situations in which I might panic and make a fool of myself', category: 'a', order: 9 },
    { text: 'I felt that I had nothing to look forward to', category: 'd', order: 10 },
    { text: 'I found myself getting agitated', category: 's', order: 11 },
    { text: 'I found it difficult to relax', category: 's', order: 12 },
    { text: 'I felt down-hearted and blue', category: 'd', order: 13 },
    { text: 'I was intolerant of anything that kept me from getting on with what I was doing', category: 's', order: 14 },
    { text: 'I felt I was close to panic', category: 'a', order: 15 },
    { text: 'I was unable to become enthusiastic about anything', category: 'd', order: 16 },
    { text: 'I felt I wasn\'t worth much as a person', category: 'd', order: 17 },
    { text: 'I felt that I was rather touchy', category: 's', order: 18 },
    { text: 'I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat)', category: 'a', order: 19 },
    { text: 'I felt scared without any good reason', category: 'a', order: 20 },
    { text: 'I felt that life was meaningless', category: 'd', order: 21 }
  ];

  // Options for all questions
  const options = [
    { value: "0", label: "Did not apply to me at all" },
    { value: "1", label: "Applied to me to some degree, or some of the time" },
    { value: "2", label: "Applied to me to a considerable degree or a good part of time" },
    { value: "3", label: "Applied to me very much or most of the time" }
  ];

  // Create each question
  for (const question of questions) {
    await prisma.question.create({
      data: {
        questionnaireId: dass21.id,
        questionText: question.text,
        category: question.category,
        order: question.order,
        options: options as any // Cast to any for Prisma Json type
      },
    });
  }

  console.log(`Seeded DASS-21 questionnaire and ${questions.length} questions`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });