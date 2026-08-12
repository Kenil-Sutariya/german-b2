import {
  grammarTopics,
  resources,
  roadmap,
  vocabularyThemes,
} from "../data/curriculum";
import {
  grammarExercises,
  readingPractice,
  speakingPractice,
  vocabularyExercises,
  writingPractice,
} from "../data/exercises";

const errors: string[] = [];
const ids = new Set<string>();
for (const exercise of [...grammarExercises, ...vocabularyExercises]) {
  if (ids.has(exercise.id))
    errors.push(`Duplicate exercise id: ${exercise.id}`);
  ids.add(exercise.id);
  if (!exercise.correctAnswer || !exercise.explanation || !exercise.rule)
    errors.push(`Malformed exercise: ${exercise.id}`);
  if (
    exercise.options &&
    !exercise.options.includes(
      Array.isArray(exercise.correctAnswer)
        ? exercise.correctAnswer.join(" · ")
        : exercise.correctAnswer,
    )
  )
    errors.push(`Correct answer missing from options: ${exercise.id}`);
}

for (const topic of grammarTopics) {
  const exercises = grammarExercises.filter(
    (exercise) => exercise.topicId === topic.slug,
  );
  if (exercises.length < 8)
    errors.push(`${topic.slug} has ${exercises.length}/8 grammar questions`);
  if (new Set(exercises.map((exercise) => exercise.type)).size < 3)
    errors.push(`${topic.slug} has fewer than 3 exercise types`);
}

for (const exercise of grammarExercises)
  if (!grammarTopics.some((topic) => topic.slug === exercise.topicId))
    errors.push(`Unknown grammar topic: ${exercise.topicId}`);
for (const exercise of vocabularyExercises)
  if (
    !vocabularyThemes.some((theme) => `vocab-${theme.id}` === exercise.topicId)
  )
    errors.push(`Unknown vocabulary theme: ${exercise.topicId}`);
for (const theme of vocabularyThemes)
  if (
    vocabularyExercises.filter(
      (exercise) => exercise.topicId === `vocab-${theme.id}`,
    ).length <
    theme.items.length * 2
  )
    errors.push(`Vocabulary theme lacks practice: ${theme.id}`);
for (const week of roadmap) {
  if (!week.days.length || week.days.some((day) => !day.tasks.length))
    errors.push(`Week lacks practice activity: ${week.id}`);
  if (
    !week.days.some((day) =>
      day.tasks.some((task) => task.skill === "speaking"),
    )
  )
    errors.push(`Week lacks speaking practice: ${week.id}`);
  for (const day of week.days)
    for (const task of day.tasks)
      if (
        task.resourceId &&
        !resources.some((resource) => resource.id === task.resourceId)
      )
        errors.push(`Invalid resource ${task.resourceId} in ${task.id}`);
}
for (const topic of grammarTopics)
  for (const resourceId of topic.resources)
    if (!resources.some((resource) => resource.id === resourceId))
      errors.push(`Invalid resource ${resourceId} in ${topic.slug}`);
for (const resource of resources) {
  try {
    new URL(resource.url);
  } catch {
    errors.push(`Malformed resource URL: ${resource.id}`);
  }
}
for (const reading of readingPractice) {
  if (reading.questions.length < 4)
    errors.push(`Reading lacks four question dimensions: ${reading.id}`);
  for (const question of reading.questions)
    if (
      !question.answer ||
      !question.explanation ||
      !question.options.includes(question.answer)
    )
      errors.push(`Malformed reading question in ${reading.id}`);
}
for (const writing of writingPractice)
  if (
    !writing.task ||
    !writing.structure.length ||
    !writing.connectors.length ||
    !writing.checklist.length
  )
    errors.push(`Malformed writing task: ${writing.id}`);
for (const speaking of speakingPractice)
  if (
    !speaking.prompt ||
    !speaking.prep ||
    !speaking.seconds ||
    !speaking.phrases.length
  )
    errors.push(`Malformed speaking task: ${speaking.id}`);

if (errors.length) {
  console.error(
    `Content validation failed with ${errors.length} error(s):\n${errors.map((error) => `- ${error}`).join("\n")}`,
  );
  process.exit(1);
}
console.log(
  `Content validation passed: ${grammarTopics.length} grammar topics, ${grammarExercises.length} grammar questions, ${vocabularyThemes.length} vocabulary themes, ${vocabularyExercises.length} vocabulary questions, ${roadmap.length} roadmap weeks.`,
);
