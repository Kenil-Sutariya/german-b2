"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Headphones,
  Mic2,
  NotebookPen,
  Pause,
  Play,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { grammarTopics, vocabularyThemes } from "@/data/curriculum";
import {
  exercisesForTopic,
  listeningPractice,
  readingPractice,
  speakingPractice,
  vocabularyExercisesForTheme,
  writingPractice,
} from "@/data/exercises";
import type {
  ExerciseDifficulty,
  ExerciseMode,
  ProgressState,
} from "@/types/learning";

type Update = (fn: (progress: ProgressState) => ProgressState) => void;

export function PracticeHub({
  progress,
}: {
  progress: ProgressState;
  update: Update;
}) {
  return (
    <div className="practice-page">
      <div className="page-title">
        <p>AKTIV ANWENDEN</p>
        <div>
          <section>
            <h1>Übungen</h1>
            <span>
              Trainiere Grammatik, Wortschatz und alle vier Fertigkeiten mit
              direktem Feedback.
            </span>
          </section>
        </div>
      </div>
      <div className="practice-overview">
        <SkillCard
          icon={<BookOpen />}
          title="Lesen"
          text="Originaltexte mit Hauptaussage, Details und Schlussfolgerungen."
          href="/practice/reading"
          meta={`${readingPractice.length} Texte`}
        />
        <SkillCard
          icon={<Headphones />}
          title="Hören"
          text="Synthetische Ausspracheübung mit Transkript und Verständnisfrage."
          href="/practice/listening"
          meta={`${listeningPractice.length} Übungen`}
        />
        <SkillCard
          icon={<NotebookPen />}
          title="Schreiben"
          text="Aufgaben, Strukturhilfen, Wortzähler und synchronisierte Entwürfe."
          href="/practice/writing"
          meta={`${writingPractice.length} Aufgaben`}
        />
        <SkillCard
          icon={<Mic2 />}
          title="Sprechen"
          text="Vorbereitungs- und Sprech-Timer mit Redemitteln und Selbstbewertung."
          href="/practice/speaking"
          meta={`${speakingPractice.length} Aufgaben`}
        />
      </div>
      <section className="card practice-index">
        <div>
          <span className="kicker">GRAMMATIK</span>
          <h2>{grammarTopics.length} Themen mit Übungsbank</h2>
          <p>
            Quick Practice nutzt 5 Fragen. Full Practice nutzt alle 8 Fragen.
            Falsche Antworten landen automatisch in Review Mistakes.
          </p>
        </div>
        <div className="practice-topic-list">
          {grammarTopics.slice(0, 8).map((topic) => {
            const result = progress.exerciseProgress[topic.slug];
            return (
              <Link
                key={topic.slug}
                href={`/practice/${topic.slug}?mode=quick`}
              >
                <span>{topic.level}</span>
                <strong>{topic.title}</strong>
                <em>
                  {result
                    ? `Best: ${result.bestScore}%`
                    : "Noch nicht versucht"}
                </em>
                <ArrowRight size={16} />
              </Link>
            );
          })}
          <Link className="all-topics" href="/grammar">
            Alle Grammatikthemen ansehen <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function SkillCard({
  icon,
  title,
  text,
  href,
  meta,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  href: string;
  meta: string;
}) {
  return (
    <Link className="skill-practice-card" href={href}>
      <span>{icon}</span>
      <small>{meta}</small>
      <h2>{title}</h2>
      <p>{text}</p>
      <b>
        Öffnen <ArrowRight size={15} />
      </b>
    </Link>
  );
}

export function PracticeEntry({
  id,
  mode = "quick",
  progress,
  update,
}: {
  id?: string;
  mode?: string;
  progress: ProgressState;
  update: Update;
}) {
  if (id === "reading")
    return <ReadingPractice progress={progress} update={update} />;
  if (id === "listening")
    return <ListeningPractice progress={progress} update={update} />;
  if (id === "writing")
    return <WritingPractice progress={progress} update={update} />;
  if (id === "speaking")
    return <SpeakingPractice progress={progress} update={update} />;
  if (id?.startsWith("vocab-"))
    return (
      <ExercisePlayer
        key={`${id}:${mode}`}
        topicId={id}
        mode={mode as ExerciseMode}
        progress={progress}
        update={update}
      />
    );
  return (
    <ExercisePlayer
      key={`${id ?? grammarTopics[0].slug}:${mode}`}
      topicId={id ?? grammarTopics[0].slug}
      mode={mode as ExerciseMode}
      progress={progress}
      update={update}
    />
  );
}

function ExercisePlayer({
  topicId,
  mode,
  progress,
  update,
}: {
  topicId: string;
  mode: ExerciseMode;
  progress: ProgressState;
  update: Update;
}) {
  const router = useRouter();
  const isVocabulary = topicId.startsWith("vocab-");
  const grammarTopic = grammarTopics.find((topic) => topic.slug === topicId);
  const vocabTheme = vocabularyThemes.find(
    (theme) => `vocab-${theme.id}` === topicId,
  );
  const all = isVocabulary
    ? vocabularyExercisesForTheme(topicId.replace("vocab-", ""))
    : exercisesForTopic(topicId);
  const stored = (
    isVocabulary ? progress.vocabularyProgress : progress.exerciseProgress
  )[topicId];
  const [difficulty, setDifficulty] = useState<ExerciseDifficulty | "mixed">(
    "mixed",
  );
  const base =
    mode === "mistakes"
      ? all.filter((question) =>
          stored?.incorrectQuestionIds.includes(question.id),
        )
      : mode === "quick"
        ? all.slice(0, 5)
        : all;
  const questions =
    difficulty === "mixed"
      ? base
      : base.filter((question) => question.difficulty === difficulty);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correctIds, setCorrectIds] = useState<string[]>([]);
  const [incorrectIds, setIncorrectIds] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const question = questions[index];
  const title = grammarTopic?.title ?? vocabTheme?.title ?? "Übung";
  const back = grammarTopic ? `/grammar/${grammarTopic.slug}` : "/vocabulary";

  if (!all.length)
    return (
      <EmptyPractice
        title="Keine Übungsdaten"
        text="Für dieses Thema sind noch keine gültigen Fragen verfügbar."
        href={back}
      />
    );
  if (mode === "mistakes" && !base.length)
    return (
      <EmptyPractice
        title="Noch keine Fehler gespeichert."
        text="Bearbeite zuerst Quick oder Full Practice. Falsch beantwortete Fragen erscheinen danach hier."
        href={back}
      />
    );
  if (!questions.length)
    return (
      <EmptyPractice
        title={`Keine ${difficulty}-Fragen`}
        text="Wähle Mixed, um die vollständige Übungsbank zu verwenden."
        href={`${location.pathname}?mode=${mode}`}
      />
    );

  const answer = Array.isArray(question.correctAnswer)
    ? question.correctAnswer.join(" · ")
    : question.correctAnswer;
  const isCorrect = selected === answer;
  const submit = () => {
    if (!selected) return;
    setSubmitted(true);
    if (isCorrect)
      setCorrectIds((ids) =>
        ids.includes(question.id) ? ids : [...ids, question.id],
      );
    else
      setIncorrectIds((ids) =>
        ids.includes(question.id) ? ids : [...ids, question.id],
      );
  };
  const next = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setSelected("");
      setSubmitted(false);
      return;
    }
    const correctCount =
      correctIds.length +
      (isCorrect && !correctIds.includes(question.id) ? 1 : 0);
    const wrong = isCorrect
      ? incorrectIds
      : [...new Set([...incorrectIds, question.id])];
    const score = Math.round((correctCount / questions.length) * 100);
    const previous = stored;
    const record = {
      attempts: (previous?.attempts ?? 0) + 1,
      latestScore: score,
      bestScore: Math.max(previous?.bestScore ?? 0, score),
      incorrectQuestionIds: wrong,
      lastPracticeDate: new Date().toISOString(),
    };
    update((current) => {
      const notification =
        score < 60
          ? [
              {
                id: `review-${topicId}-${Date.now()}`,
                category: "Review" as const,
                title: `${title} braucht Wiederholung`,
                body: `Dein Ergebnis war ${score}%. Das Thema erscheint jetzt unter Needs Review.`,
                timestamp: new Date().toISOString(),
                read: false,
              },
              ...current.notifications,
            ]
          : current.notifications;
      return {
        ...current,
        confidence: {
          ...current.confidence,
          [topicId]: score < 60 ? "unsicher" : score >= 80 ? "sicher" : "okay",
        },
        testScores: { ...current.testScores, [topicId]: score },
        exerciseProgress: isVocabulary
          ? current.exerciseProgress
          : { ...current.exerciseProgress, [topicId]: record },
        vocabularyProgress: isVocabulary
          ? { ...current.vocabularyProgress, [topicId]: record }
          : current.vocabularyProgress,
        notifications: notification,
      };
    });
    setFinished(true);
  };
  const restart = (targetMode: ExerciseMode) => {
    router.push(`/practice/${topicId}?mode=${targetMode}`);
  };

  if (finished) {
    const total = questions.length;
    const correct = total - incorrectIds.length;
    const percentage = Math.round((correct / total) * 100);
    const label =
      percentage < 60
        ? "Needs Review"
        : percentage < 80
          ? "Okay"
          : percentage < 90
            ? "Good"
            : "Strong";
    return (
      <div className="quiz-wrap">
        <Link className="back-link" href={back}>
          <ArrowLeft size={16} />
          Zurück zum Thema
        </Link>
        <section className="quiz-result card">
          <span
            className={percentage >= 80 ? "result-icon strong" : "result-icon"}
          >
            {percentage >= 80 ? <CheckCircle2 /> : <RotateCcw />}
          </span>
          <small>ERGEBNIS · {label.toUpperCase()}</small>
          <h1>{percentage}%</h1>
          <p>
            {correct} richtig · {total - correct} falsch · {total} Fragen
          </p>
          <div className="result-rule">
            Ein Quizwert ist eine Lernhilfe und keine offizielle CEFR- oder
            B2-Zertifizierung.
          </div>
          <div className="result-actions">
            <button className="button primary" onClick={() => restart("full")}>
              <RotateCcw size={16} />
              Full Practice wiederholen
            </button>
            <button
              className="button ghost"
              disabled={!incorrectIds.length}
              title={
                !incorrectIds.length
                  ? "Noch keine Fehler zum Wiederholen."
                  : undefined
              }
              onClick={() => restart("mistakes")}
            >
              Fehler wiederholen
            </button>
            <Link className="button ghost" href={back}>
              Zurück zum Thema
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="quiz-wrap">
      <Link className="back-link" href={back}>
        <ArrowLeft size={16} />
        Zurück zum Thema
      </Link>
      <div className="quiz-top">
        <div>
          <span className="badge teal">
            {grammarTopic?.level ?? vocabTheme?.level}
          </span>
          <span className="badge">
            {mode === "quick"
              ? "Quick Practice"
              : mode === "full"
                ? "Full Practice"
                : "Review Mistakes"}
          </span>
          <h1>{title}</h1>
        </div>
        <label>
          Schwierigkeit
          <select
            value={difficulty}
            onChange={(event) => {
              setDifficulty(event.target.value as ExerciseDifficulty | "mixed");
              setIndex(0);
              setSelected("");
              setSubmitted(false);
              setCorrectIds([]);
              setIncorrectIds([]);
              setFinished(false);
            }}
          >
            <option value="mixed">Mixed</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
      </div>
      <section className="quiz-card card">
        <div className="quiz-progress">
          <span>
            Frage {index + 1} von {questions.length}
          </span>
          <span>
            {question.difficulty} · {question.type}
          </span>
        </div>
        <div className="progress-bar">
          <i style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>
        <h2>{question.prompt}</h2>
        <div className="quiz-options">
          {question.options?.map((option) => (
            <button
              key={option}
              disabled={submitted}
              onClick={() => setSelected(option)}
              className={`${selected === option ? "selected" : ""} ${submitted && option === answer ? "correct" : ""} ${submitted && selected === option && option !== answer ? "incorrect" : ""}`}
            >
              <span>
                {submitted && option === answer ? (
                  <Check size={16} />
                ) : submitted && selected === option && option !== answer ? (
                  <XCircle size={16} />
                ) : null}
              </span>
              {option}
            </button>
          ))}
        </div>
        {submitted && (
          <div
            className={`answer-feedback ${isCorrect ? "correct" : "incorrect"}`}
          >
            <strong>{isCorrect ? "Richtig" : "Noch nicht richtig"}</strong>
            <p>
              <b>Korrekte Antwort:</b> {answer}
            </p>
            <p>{question.explanation}</p>
            <small>Regel: {question.rule}</small>
          </div>
        )}
        <div className="quiz-actions">
          <button
            className="button primary"
            disabled={!selected}
            onClick={submitted ? next : submit}
          >
            {submitted
              ? index === questions.length - 1
                ? "Ergebnis ansehen"
                : "Nächste Frage"
              : "Prüfen"}
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}

function EmptyPractice({
  title,
  text,
  href,
}: {
  title: string;
  text: string;
  href: string;
}) {
  return (
    <section className="empty-state">
      <div>
        <BookOpen />
      </div>
      <h2>{title}</h2>
      <p>{text}</p>
      <Link className="button primary" href={href}>
        Zurück
      </Link>
    </section>
  );
}

function ReadingPractice({
  progress,
  update,
}: {
  progress: ProgressState;
  update: Update;
}) {
  const [selectedText, setSelectedText] = useState(readingPractice[0]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  return (
    <PracticeSkillLayout
      title="Lesen"
      subtitle="Originaltexte für Hauptaussage, Details, Wortschatz und Schlussfolgerungen."
      items={readingPractice}
      selectedId={selectedText.id}
      onSelect={(id) => {
        setSelectedText(
          readingPractice.find((item) => item.id === id) ?? readingPractice[0],
        );
        setAnswers({});
        setChecked(false);
      }}
    >
      <div className="reading-text">
        <span>
          {selectedText.level} · {selectedText.minutes} min
        </span>
        <h2>{selectedText.title}</h2>
        <p>{selectedText.text}</p>
      </div>
      {selectedText.questions.map((question, index) => (
        <div className="skill-question" key={question.prompt}>
          <strong>
            {index + 1}. {question.prompt}
          </strong>
          {question.options.map((option) => (
            <button
              className={answers[index] === option ? "selected" : ""}
              onClick={() => {
                setChecked(false);
                setAnswers({ ...answers, [index]: option });
              }}
              key={option}
            >
              {option}
            </button>
          ))}
          {checked && answers[index] && (
            <p
              className={
                answers[index] === question.answer ? "correct" : "incorrect"
              }
            >
              {answers[index] === question.answer
                ? "Richtig. "
                : `Richtig wäre: ${question.answer}. `}
              {question.explanation}
            </p>
          )}
        </div>
      ))}
      <button
        className="button primary"
        disabled={Object.keys(answers).length !== selectedText.questions.length}
        onClick={() => {
          setChecked(true);
          const correct = selectedText.questions.filter(
            (question, index) => answers[index] === question.answer,
          ).length;
          const score = Math.round(
            (correct / selectedText.questions.length) * 100,
          );
          const previous = progress.skillProgress[selectedText.id];
          update((current) => ({
            ...current,
            skillProgress: {
              ...current.skillProgress,
              [selectedText.id]: {
                attempts: (previous?.attempts ?? 0) + 1,
                latestScore: score,
                bestScore: Math.max(previous?.bestScore ?? 0, score),
                lastPracticeDate: new Date().toISOString().slice(0, 10),
              },
            },
          }));
        }}
      >
        Antworten prüfen
      </button>
    </PracticeSkillLayout>
  );
}

function ListeningPractice({
  progress,
  update,
}: {
  progress: ProgressState;
  update: Update;
}) {
  const [selectedItem, setSelectedItem] = useState(listeningPractice[0]);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [rate, setRate] = useState(1);
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;
  const speak = () => {
    if (!supported) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(selectedItem.transcript);
    utterance.lang = "de-DE";
    utterance.rate = rate;
    speechSynthesis.speak(utterance);
  };
  return (
    <PracticeSkillLayout
      title="Hören"
      subtitle="Synthetische Ausspracheübung – nicht als authentische Aufnahme gekennzeichnet."
      items={listeningPractice}
      selectedId={selectedItem.id}
      onSelect={(id) => {
        speechSynthesis?.cancel();
        setSelectedItem(
          listeningPractice.find((item) => item.id === id) ??
            listeningPractice[0],
        );
        setAnswer("");
        setChecked(false);
        setShowTranscript(false);
      }}
    >
      <div className="listening-controls">
        <span>
          <Headphones />
        </span>
        <div>
          <small>SYNTHETISCHE AUSSPRACHEÜBUNG</small>
          <h2>{selectedItem.title}</h2>
          <p>
            {supported
              ? "Die Browserstimme liest einen eigens für diese Website geschriebenen Text."
              : "Sprachausgabe wird in diesem Browser nicht unterstützt. Nutze das Transkript."}
          </p>
        </div>
        <button
          className="button primary"
          disabled={!supported}
          onClick={speak}
        >
          <Play size={16} />
          Abspielen
        </button>
        <button
          className="button ghost"
          disabled={!supported}
          onClick={() => speechSynthesis.pause()}
        >
          <Pause size={16} />
          Pause
        </button>
        <button
          className="button ghost"
          disabled={!supported}
          onClick={() => {
            setRate(rate === 1 ? 0.75 : 1);
          }}
        >
          {rate === 1 ? "Langsamer" : "Normal"}
        </button>
      </div>
      <button
        className="transcript-toggle"
        onClick={() => setShowTranscript(!showTranscript)}
      >
        {showTranscript ? "Transkript ausblenden" : "Transkript anzeigen"}
      </button>
      {showTranscript && (
        <blockquote className="transcript">
          {selectedItem.transcript}
        </blockquote>
      )}
      <div className="skill-question">
        <strong>{selectedItem.question}</strong>
        {selectedItem.options.map((option) => (
          <button
            className={answer === option ? "selected" : ""}
            onClick={() => {
              setChecked(false);
              setAnswer(option);
            }}
            key={option}
          >
            {option}
          </button>
        ))}
        {checked && answer && (
          <p
            className={answer === selectedItem.answer ? "correct" : "incorrect"}
          >
            {answer === selectedItem.answer
              ? "Richtig. "
              : `Richtig wäre: ${selectedItem.answer}. `}
            {selectedItem.explanation}
          </p>
        )}
      </div>
      <button
        className="button primary"
        disabled={!answer}
        onClick={() => {
          setChecked(true);
          const score = answer === selectedItem.answer ? 100 : 0;
          const previous = progress.skillProgress[selectedItem.id];
          update((current) => ({
            ...current,
            skillProgress: {
              ...current.skillProgress,
              [selectedItem.id]: {
                attempts: (previous?.attempts ?? 0) + 1,
                latestScore: score,
                bestScore: Math.max(previous?.bestScore ?? 0, score),
                lastPracticeDate: new Date().toISOString().slice(0, 10),
              },
            },
          }));
        }}
      >
        Antwort prüfen
      </button>
    </PracticeSkillLayout>
  );
}

function WritingPractice({
  progress,
  update,
}: {
  progress: ProgressState;
  update: Update;
}) {
  const [task, setTask] = useState(writingPractice[0]);
  const [draft, setDraft] = useState(progress.writingDrafts[task.id] ?? "");
  const [saved, setSaved] = useState(false);
  const words = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const select = (id: string) => {
    const next =
      writingPractice.find((item) => item.id === id) ?? writingPractice[0];
    setTask(next);
    setDraft(progress.writingDrafts[next.id] ?? "");
    setSaved(false);
  };
  const save = () => {
    const previous = progress.skillProgress[task.id];
    update((current) => ({
      ...current,
      writingDrafts: { ...current.writingDrafts, [task.id]: draft },
      skillProgress: {
        ...current.skillProgress,
        [task.id]: {
          ...previous,
          attempts: (previous?.attempts ?? 0) + 1,
          lastPracticeDate: new Date().toISOString().slice(0, 10),
        },
      },
    }));
    setSaved(true);
  };
  return (
    <PracticeSkillLayout
      title="Schreiben"
      subtitle="Plane, schreibe und synchronisiere deinen Entwurf auf deinen Geräten."
      items={writingPractice}
      selectedId={task.id}
      onSelect={select}
    >
      <div className="writing-brief">
        <span>
          {task.level} · {task.target[0]}–{task.target[1]} Wörter
        </span>
        <h2>{task.title}</h2>
        <p>{task.task}</p>
        <div>
          <section>
            <strong>Struktur</strong>
            {task.structure.map((item) => (
              <span key={item}>✓ {item}</span>
            ))}
          </section>
          <section>
            <strong>Konnektoren & Redemittel</strong>
            {task.connectors.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </section>
          <section>
            <strong>Checkliste vor dem Speichern</strong>
            {task.checklist.map((item) => (
              <span key={item}>□ {item}</span>
            ))}
          </section>
        </div>
      </div>
      <label className="writing-editor">
        <span>
          Dein Entwurf{" "}
          <b
            className={
              words >= task.target[0] && words <= task.target[1] ? "good" : ""
            }
          >
            {words} Wörter
          </b>
        </span>
        <textarea
          value={draft}
          onChange={(event) => {
            setSaved(false);
            setDraft(event.target.value);
          }}
          placeholder="Schreibe deinen Text hier …"
        />
      </label>
      <div className="writing-actions">
        <button
          className="button primary"
          onClick={save}
          disabled={!draft.trim()}
        >
          <NotebookPen size={16} />
          Entwurf speichern
        </button>
        {saved && (
          <span>
            <CheckCircle2 size={16} />
            Gespeichert — Cloud-Sync läuft automatisch
          </span>
        )}
      </div>
    </PracticeSkillLayout>
  );
}

function SpeakingPractice({
  progress,
  update,
}: {
  progress: ProgressState;
  update: Update;
}) {
  const [task, setTask] = useState(speakingPractice[0]);
  const [phase, setPhase] = useState<"idle" | "prep" | "speak" | "done">(
    "idle",
  );
  const [remaining, setRemaining] = useState(task.prep);
  const [rating, setRating] = useState("");
  useEffect(() => {
    if (phase !== "prep" && phase !== "speak") return;
    const timer = setInterval(
      () =>
        setRemaining((value) => {
          if (value > 1) return value - 1;
          if (phase === "prep") {
            setPhase("speak");
            return task.seconds;
          }
          setPhase("done");
          return 0;
        }),
      1000,
    );
    return () => clearInterval(timer);
  }, [phase, task.seconds]);
  const choose = (id: string) => {
    const next =
      speakingPractice.find((item) => item.id === id) ?? speakingPractice[0];
    setTask(next);
    setPhase("idle");
    setRemaining(next.prep);
    setRating("");
  };
  return (
    <PracticeSkillLayout
      title="Sprechen"
      subtitle="Sprich frei mit Vorbereitung, Timer, Redemitteln und ehrlicher Selbstbewertung."
      items={speakingPractice}
      selectedId={task.id}
      onSelect={choose}
    >
      <div className="speaking-stage">
        <span className={`speaking-clock ${phase}`}>
          <small>
            {phase === "idle"
              ? "BEREIT"
              : phase === "prep"
                ? "VORBEREITEN"
                : phase === "speak"
                  ? "SPRECHEN"
                  : "FERTIG"}
          </small>
          <strong>
            {Math.floor(remaining / 60)}:
            {String(remaining % 60).padStart(2, "0")}
          </strong>
        </span>
        <div>
          <span>
            {task.level} · {task.seconds} Sekunden
          </span>
          <h2>{task.title}</h2>
          <p>{task.prompt}</p>
          <div className="phrase-chips">
            {task.phrases.map((phrase) => (
              <span key={phrase}>{phrase}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="speaking-actions">
        {phase === "idle" && (
          <button
            className="button primary"
            onClick={() => {
              setPhase("prep");
              setRemaining(task.prep);
            }}
          >
            <Play size={16} />
            Vorbereitung starten
          </button>
        )}
        {(phase === "prep" || phase === "speak") && (
          <button
            className="button ghost"
            onClick={() => {
              setPhase("idle");
              setRemaining(task.prep);
            }}
          >
            Abbrechen
          </button>
        )}
        {phase === "done" && (
          <>
            <span>Wie sicher warst du?</span>
            {["Unsicher", "Okay", "Sicher"].map((item) => (
              <button
                className={`button ghost ${rating === item ? "active" : ""}`}
                onClick={() => {
                  setRating(item);
                  const previous = progress.skillProgress[task.id];
                  update((current) => ({
                    ...current,
                    skillProgress: {
                      ...current.skillProgress,
                      [task.id]: {
                        ...previous,
                        attempts: (previous?.attempts ?? 0) + 1,
                        selfRating: item,
                        lastPracticeDate: new Date()
                          .toISOString()
                          .slice(0, 10),
                      },
                    },
                  }));
                }}
                key={item}
              >
                {item}
              </button>
            ))}
            <button
              className="button primary"
              onClick={() => {
                setPhase("idle");
                setRemaining(task.prep);
                setRating("");
              }}
            >
              <RotateCcw size={16} />
              Wiederholen
            </button>
          </>
        )}
      </div>
      <p className="privacy-note">
        Kein Audio wird aufgenommen oder hochgeladen. Diese Übung nutzt nur
        einen lokalen Timer.
      </p>
    </PracticeSkillLayout>
  );
}

function PracticeSkillLayout<
  T extends { id: string; title: string; level: string },
>({
  title,
  subtitle,
  items,
  selectedId,
  onSelect,
  children,
}: {
  title: string;
  subtitle: string;
  items: T[];
  selectedId: string;
  onSelect: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="practice-page">
      <Link className="back-link" href="/practice">
        <ArrowLeft size={16} />
        Alle Übungen
      </Link>
      <div className="page-title">
        <p>FERTIGKEITSTRAINING</p>
        <div>
          <section>
            <h1>{title}</h1>
            <span>{subtitle}</span>
          </section>
        </div>
      </div>
      <div className="practice-skill-layout">
        <aside className="practice-selector">
          {items.map((item) => (
            <button
              className={selectedId === item.id ? "active" : ""}
              onClick={() => onSelect(item.id)}
              key={item.id}
            >
              <span>{item.level}</span>
              <strong>{item.title}</strong>
              <ArrowRight size={15} />
            </button>
          ))}
        </aside>
        <section className="practice-workspace card">{children}</section>
      </div>
    </div>
  );
}
