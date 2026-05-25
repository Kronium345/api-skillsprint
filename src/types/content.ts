export type QuizOptionPayload = {
  text: string;
  isCorrect: boolean;
};

export type QuizQuestionPayload = {
  question: string;
  explanation?: string;
  options: QuizOptionPayload[];
};

export type FlashcardPayload = {
  front: string;
  back: string;
};

export type GeneratedLessonPayload = {
  title: string;
  summary: string;
  content: string;
  keyTerms: string[];
  videoUrl?: string;
  videoSearchQuery?: string;
  durationMinutes?: number;
  quiz: QuizQuestionPayload[];
  flashcards: FlashcardPayload[];
};

export type GeneratedCoursePayload = {
  title: string;
  description: string;
  difficulty: string;
  lessons: GeneratedLessonPayload[];
};
