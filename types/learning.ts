export type Level = "B1" | "B1+" | "B2";
export type Skill = "grammar" | "vocabulary" | "reading" | "listening" | "writing" | "speaking";
export type Confidence = "unsicher" | "okay" | "sicher";
export type DayStatus = "done" | "partial" | "skipped" | "moved" | "repeat";
export type ExerciseType = "multiple-choice" | "fill-blank" | "sentence-order" | "correct-mistake" | "connector" | "case-choice" | "transformation" | "word-order";
export type ExerciseDifficulty = "easy" | "medium" | "hard";
export type ExerciseMode = "quick" | "full" | "mistakes";
export type NotificationCategory = "Study" | "Review" | "Milestone" | "System";

export interface StudyTask { id: string; title: string; minutes: number; skill: Skill; detail: string; resourceId?: string; optional?: boolean }
export interface StudyDay { id: string; label: string; focus: string; targetMinutes: number; tasks: StudyTask[] }
export interface RoadmapWeek { id: string; weekNumber: number; phase: string; level: Level; title: string; objective: string; topics: string[]; days: StudyDay[]; checkpoint?: boolean }
export interface GrammarTopic { slug: string; title: string; level: Level; category: string; description: string; rule: string; examples: [string, string][]; mistakes: string[]; memory: string; resources: string[] }
export interface Resource { id: string; title: string; provider: "Klett" | "Hueber" | "Goethe" | "Other"; level: Level[]; skills: Skill[]; type: string; url: string; access: "free" | "book-or-license"; description: string; recommendedUse: string }
export interface VocabularyItem { term: string; meaning: string; example: string; meta?: string }
export interface VocabularyTheme { id: string; title: string; level: Level; icon: string; items: VocabularyItem[] }
export interface Exercise { id: string; topicId: string; level: Level; difficulty: ExerciseDifficulty; type: ExerciseType; prompt: string; options?: string[]; correctAnswer: string | string[]; explanation: string; rule: string }
export interface ExerciseProgress { attempts: number; latestScore: number; bestScore: number; incorrectQuestionIds: string[]; lastPracticeDate: string }
export interface SkillProgress { attempts: number; latestScore?: number; bestScore?: number; selfRating?: string; lastPracticeDate: string }
export interface AppNotification { id: string; category: NotificationCategory; title: string; body: string; timestamp: string; read: boolean }
export interface NotificationSettings { enabled: boolean; dailyReminder: boolean; reminderTime: string; weeklyReview: boolean; weeklyReviewDay: number; reviewReminders: boolean; milestoneNotifications: boolean; browserNotifications: boolean }
export interface ProgressState { version: 2; completedTasks: string[]; dayStatuses: Record<string, DayStatus>; confidence: Record<string, Confidence>; difficultWords: string[]; testScores: Record<string, number>; exerciseProgress: Record<string, ExerciseProgress>; vocabularyProgress: Record<string, ExerciseProgress>; skillProgress: Record<string, SkillProgress>; notes: { id: string; title: string; body: string; tag: string; updatedAt: string }[]; writingDrafts: Record<string, string>; currentWeek: number; streak: number; lastStudyDate: string; totalMinutes: number; onboardingComplete: boolean; notifications: AppNotification[]; settings: { dailyTarget: 30 | 45 | 55; studyDays: 5 | 6; showEnglish: boolean; sundayMode: "rest" | "catch-up"; notifications: NotificationSettings } }
