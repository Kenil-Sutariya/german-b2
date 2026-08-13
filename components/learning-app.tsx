"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Cloud,
  Download,
  ExternalLink,
  Flame,
  Headphones,
  Home,
  Languages,
  Library,
  Menu,
  MessageCircle,
  Mic2,
  NotebookPen,
  Play,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  Trash2,
  Trophy,
  Upload,
  Volume2,
  WifiOff,
  X,
  Zap,
} from "lucide-react";
import {
  grammarTopics,
  redemittel,
  resources,
  roadmap,
  vocabularyThemes,
} from "@/data/curriculum";
import {
  defaultProgress,
  exportProgress,
  importProgress,
} from "@/lib/storage";
import {
  type SyncStatus,
  useCloudProgress,
} from "@/lib/use-cloud-progress";
import { recommendation, weakTopics } from "@/lib/recommendations";
import type {
  Confidence,
  DayStatus,
  ProgressState,
  Skill,
} from "@/types/learning";
import { HelpCenter, InfoTip } from "@/components/help-center";

const PracticeHub = dynamic(
  () => import("@/components/practice").then((module) => module.PracticeHub),
  { loading: () => <PracticeLoading /> },
);
const PracticeEntry = dynamic(
  () => import("@/components/practice").then((module) => module.PracticeEntry),
  { loading: () => <PracticeLoading /> },
);

function PracticeLoading() {
  return (
    <div className="practice-loading" role="status">
      Übungsdaten werden geladen …
    </div>
  );
}

export type View =
  | "today"
  | "roadmap"
  | "week"
  | "grammar"
  | "grammar-detail"
  | "vocabulary"
  | "skills"
  | "resources"
  | "exam"
  | "progress"
  | "notes"
  | "settings"
  | "practice"
  | "practice-entry"
  | "help";
type Props = { view: View; id?: string; mode?: string };

const nav = [
  ["today", "/", Home, "Heute"],
  ["roadmap", "/roadmap", CalendarDays, "Roadmap"],
  ["grammar", "/grammar", BookOpen, "Grammatik"],
  ["vocabulary", "/vocabulary", Languages, "Wortschatz"],
  ["practice", "/practice", Play, "Übungen"],
  ["skills", "/skills", BarChart3, "Skills"],
  ["resources", "/resources", Library, "Ressourcen"],
  ["exam", "/exam", ShieldCheck, "Prüfung"],
  ["progress", "/progress", Trophy, "Fortschritt"],
  ["notes", "/notes", NotebookPen, "Notizen"],
] as const;
const skillLabels: Record<Skill, string> = {
  grammar: "Grammatik",
  vocabulary: "Wortschatz",
  reading: "Lesen",
  listening: "Hören",
  writing: "Schreiben",
  speaking: "Sprechen",
};

export default function LearningApp({ view, id, mode }: Props) {
  const router = useRouter();
  const {
    progress,
    ready,
    status,
    update,
    migrationNotice,
    dismissMigrationNotice,
    retrySync,
  } = useCloudProgress();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);
  if (!ready)
    return (
      <div
        className="app-loading"
        role="status"
        aria-label="Lernplan wird geladen"
      >
        <span>K</span>
        <p>Lernplan wird geladen …</p>
      </div>
    );
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">K</div>
          <div>
            <strong>Kenil&apos;s</strong>
            <span>German Roadmap</span>
          </div>
          <button
            className="icon-button close-menu"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <div className="level-track">
          <span>B1</span>
          <div>
            <i style={{ width: "28%" }} />
          </div>
          <span>B2</span>
        </div>
        <nav aria-label="Main navigation">
          <p className="nav-label">LERNEN</p>
          {nav.slice(0, 7).map(([key, href, Icon, label]) => (
            <Link
              key={key}
              href={href}
              className={
                view === key ||
                (key === "practice" && view === "practice-entry") ||
                (key === "roadmap" && view === "week") ||
                (key === "grammar" && view === "grammar-detail")
                  ? "active"
                  : ""
              }
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={19} />
              <span>{label}</span>
              {key === "today" && <em>5</em>}
            </Link>
          ))}
          <p className="nav-label">MEIN BEREICH</p>
          {nav.slice(7).map(([key, href, Icon, label]) => (
            <Link
              key={key}
              href={href}
              className={view === key ? "active" : ""}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={19} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-foot">
          <Link href="/help" className={view === "help" ? "active" : ""}>
            <HelpCircleIcon />
            Hilfe
          </Link>
          <Link
            href="/settings"
            className={view === "settings" ? "active" : ""}
          >
            <Settings size={19} />
            Einstellungen
          </Link>
          <form action="/api/auth/logout" method="post">
            <button className="sidebar-signout" type="submit">Sign out</button>
          </form>
          <div className="daily-target">
            <div>
              <Target size={17} />
              <span>Tagesziel</span>
            </div>
            <strong>{progress.settings.dailyTarget} min</strong>
            <div className="mini-progress">
              <i style={{ width: "78%" }} />
            </div>
          </div>
          <small>Built for Kenil · v2.0</small>
        </div>
      </aside>
      {mobileOpen && (
        <button
          className="scrim"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <main className="main">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>
          <div className="global-search">
            <Search size={18} />
            <input
              aria-label="Search"
              placeholder="Themen, Wörter, Ressourcen suchen …"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value)
                  router.push(
                    `/grammar?q=${encodeURIComponent(e.currentTarget.value)}`,
                  );
              }}
            />
            <kbd>⌘ K</kbd>
          </div>
          <div className="top-actions">
            <SyncIndicator status={status} onRetry={retrySync} />
            <div className="streak">
              <Flame size={18} />
              <strong>{progress.streak}</strong>
              <span>Tage</span>
              <InfoTip label="Wie funktioniert der Streak?">
                Ein Tag zählt nach einer Kernaufgabe oder Light Session. Öffnen
                allein zählt nicht.
              </InfoTip>
            </div>
            <NotificationCenter progress={progress} update={update} />
            <div className="avatar">K</div>
            <form action="/api/auth/logout" method="post">
              <button className="sign-out" type="submit">Sign out</button>
            </form>
          </div>
        </header>
        <div className="content">
          {migrationNotice && (
            <div className="migration-notice" role="status">
              <Cloud size={18} />
              <span>
                Existing progress from this device was securely migrated to the
                cloud and will now follow you across devices.
              </span>
              <button onClick={dismissMigrationNotice} aria-label="Dismiss migration message">
                <X size={16} />
              </button>
            </div>
          )}
          {view === "today" && (
            <Dashboard progress={progress} update={update} />
          )}{" "}
          {view === "roadmap" && <Roadmap progress={progress} />}{" "}
          {view === "week" && (
            <WeekView id={id} progress={progress} update={update} />
          )}{" "}
          {view === "grammar" && (
            <GrammarLibrary progress={progress} update={update} />
          )}{" "}
          {view === "grammar-detail" && (
            <GrammarDetail id={id} progress={progress} update={update} />
          )}{" "}
          {view === "vocabulary" && (
            <Vocabulary progress={progress} update={update} />
          )}{" "}
          {view === "skills" && <Skills />}{" "}
          {view === "resources" && <Resources />} {view === "exam" && <Exam />}{" "}
          {view === "progress" && <Progress progress={progress} />}{" "}
          {view === "notes" && <Notes progress={progress} update={update} />}{" "}
          {view === "settings" && (
            <SettingsView progress={progress} update={update} />
          )}{" "}
          {view === "practice" && (
            <PracticeHub progress={progress} update={update} />
          )}{" "}
          {view === "practice-entry" && (
            <PracticeEntry
              id={id}
              mode={mode}
              progress={progress}
              update={update}
            />
          )}{" "}
          {view === "help" && <HelpCenter />}
        </div>
      </main>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {nav.slice(0, 5).map(([key, href, Icon, label]) => (
          <Link key={key} href={href} className={view === key ? "active" : ""}>
            <Icon size={19} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      {ready && !progress.onboardingComplete && (
        <Onboarding
          onFinish={() =>
            update((current) => ({ ...current, onboardingComplete: true }))
          }
        />
      )}
    </div>
  );
}

function SyncIndicator({
  status,
  onRetry,
}: {
  status: SyncStatus;
  onRetry: () => void;
}) {
  const labels: Record<SyncStatus, string> = {
    synced: "Synced",
    syncing: "Syncing…",
    offline: "Offline — saved on this device",
    error: "Sync error",
  };
  const Icon = status === "offline" ? WifiOff : Cloud;
  return (
    <button
      className={`sync-indicator ${status}`}
      type="button"
      onClick={status === "error" ? onRetry : undefined}
      aria-live="polite"
      title={status === "error" ? "Retry cloud synchronization" : labels[status]}
    >
      <Icon size={15} />
      <span>{labels[status]}</span>
    </button>
  );
}

function HelpCircleIcon() {
  return (
    <span aria-hidden="true" className="help-nav-icon">
      ?
    </span>
  );
}

function NotificationCenter({
  progress,
  update,
}: {
  progress: ProgressState;
  update: (fn: (p: ProgressState) => ProgressState) => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const enabled = progress.settings.notifications.enabled;
  const unread = enabled
    ? progress.notifications.filter((item) => !item.read).length
    : 0;
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key === "Tab" && panelRef.current) {
        const items = [
          ...panelRef.current.querySelectorAll<HTMLElement>(
            "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled])",
          ),
        ];
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [open]);
  return (
    <div className="notification-wrap">
      <button
        ref={triggerRef}
        className="icon-button"
        aria-label={`Notifications, ${unread} unread`}
        onClick={() => setOpen(!open)}
      >
        <Bell size={20} />
        {unread > 0 && <em>{unread}</em>}
      </button>
      {open && (
        <div
          ref={panelRef}
          className="notification-panel"
          role="dialog"
          aria-label="Notification center"
        >
          <header>
            <div>
              <span>ERINNERUNGEN</span>
              <h2>Mitteilungen</h2>
            </div>
            <button
              className="icon-button"
              onClick={() => setOpen(false)}
              aria-label="Close notifications"
            >
              <X size={18} />
            </button>
          </header>
          {enabled && progress.notifications.length ? (
            <>
              <div className="notification-list">
                {progress.notifications.map((item) => (
                  <article className={item.read ? "" : "unread"} key={item.id}>
                    <button
                      aria-label={`Mark ${item.title} as ${item.read ? "unread" : "read"}`}
                      onClick={() =>
                        update((p) => ({
                          ...p,
                          notifications: p.notifications.map((n) =>
                            n.id === item.id ? { ...n, read: !n.read } : n,
                          ),
                        }))
                      }
                    >
                      <span
                        className={`notification-dot ${item.category.toLowerCase()}`}
                      />
                    </button>
                    <div>
                      <span>
                        {item.category} ·{" "}
                        {new Date(item.timestamp).toLocaleDateString("de-DE")}
                      </span>
                      <strong>{item.title}</strong>
                      <p>{item.body}</p>
                    </div>
                    <button
                      aria-label={`Remove ${item.title}`}
                      onClick={() =>
                        update((p) => ({
                          ...p,
                          notifications: p.notifications.filter(
                            (n) => n.id !== item.id,
                          ),
                        }))
                      }
                    >
                      <X size={14} />
                    </button>
                  </article>
                ))}
              </div>
              <footer>
                <button
                  onClick={() =>
                    update((p) => ({
                      ...p,
                      notifications: p.notifications.map((n) => ({
                        ...n,
                        read: true,
                      })),
                    }))
                  }
                >
                  Alle als gelesen markieren
                </button>
                <button
                  onClick={() =>
                    update((p) => ({
                      ...p,
                      notifications: p.notifications.filter((n) => !n.read),
                    }))
                  }
                >
                  Gelesene löschen
                </button>
              </footer>
            </>
          ) : (
            <div className="notification-empty">
              <Bell />
              <strong>
                {enabled
                  ? "Keine neuen Mitteilungen"
                  : "In-App-Mitteilungen sind ausgeschaltet"}
              </strong>
              <p>
                {enabled
                  ? "Study-, Review- und Milestone-Hinweise erscheinen hier."
                  : "Du kannst sie jederzeit in den Einstellungen wieder aktivieren."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Onboarding({ onFinish }: { onFinish: () => void }) {
  const slides = [
    [
      "Heute",
      "Dein Tagesplan bleibt unter einer Stunde. Hake Aufgaben ab oder nutze die kurze Einheit.",
    ],
    [
      "Roadmap",
      "30 flexible Wochen führen von B1-Wiederholung zu echter B2-Kommunikation.",
    ],
    [
      "Übungen",
      "Jedes Grammatikthema hat Quick, Full und Review Mistakes mit Erklärungen.",
    ],
    [
      "Fortschritt",
      "Quizwerte und Vertrauen helfen bei Empfehlungen, sind aber kein offizielles B2-Zertifikat.",
    ],
    [
      "Erinnerungen",
      "In-App-Hinweise funktionieren lokal. Browser-Mitteilungen werden nur nach deiner Zustimmung aktiviert.",
    ],
  ];
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.querySelector<HTMLElement>("button")?.focus();
    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") onFinish();
      if (event.key !== "Tab") return;
      const items = [
        ...dialog.querySelectorAll<HTMLElement>(
          "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled])",
        ),
      ];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [onFinish]);
  return (
    <div className="modal-backdrop" role="presentation">
      <section
        ref={dialogRef}
        className="onboarding"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        <button className="skip" onClick={onFinish}>
          Überspringen
        </button>
        <span className="onboarding-step">
          {index + 1} / {slides.length}
        </span>
        <div className="onboarding-art">
          <span>{index + 1}</span>
        </div>
        <h2 id="onboarding-title">{slides[index][0]}</h2>
        <p>{slides[index][1]}</p>
        <div className="onboarding-dots">
          {slides.map((_, i) => (
            <i className={i === index ? "active" : ""} key={i} />
          ))}
        </div>
        <footer>
          <button
            className="button ghost"
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
          >
            Zurück
          </button>
          <button
            className="button primary"
            onClick={() =>
              index === slides.length - 1 ? onFinish() : setIndex(index + 1)
            }
          >
            {index === slides.length - 1 ? "Fertig" : "Weiter"}
            <ArrowRight size={16} />
          </button>
        </footer>
      </section>
    </div>
  );
}

function PageTitle({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="page-title">
      {eyebrow && <p>{eyebrow}</p>}
      <div>
        <section>
          <h1>{title}</h1>
          <span>{subtitle}</span>
        </section>
        {actions && <aside>{actions}</aside>}
      </div>
    </div>
  );
}
function ProgressBar({
  value,
  tone = "teal",
}: {
  value: number;
  tone?: string;
}) {
  return (
    <div className={`progress-bar ${tone}`}>
      <i style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: string;
}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function Dashboard({
  progress,
  update,
}: {
  progress: ProgressState;
  update: (fn: (p: ProgressState) => ProgressState) => void;
}) {
  const week = roadmap[progress.currentWeek - 1] || roadmap[6],
    day = week.days[2],
    weak = weakTopics(progress),
    rec = recommendation(progress);
  const done = day.tasks.filter((t) =>
    progress.completedTasks.includes(t.id),
  ).length;
  const totalRoadmapTasks = roadmap.reduce(
    (total, item) =>
      total +
      item.days.reduce((sum, studyDay) => sum + studyDay.tasks.length, 0),
    0,
  );
  const overallProgress = Math.round(
    (progress.completedTasks.length / totalRoadmapTasks) * 100,
  );
  const light = progress.settings.dailyTarget === 30;
  const planMinutes = light ? [5, 8, 8, 7, 2] : day.tasks.map((t) => t.minutes);
  const target = planMinutes.reduce((a, b) => a + b, 0);
  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("de-DE", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
        .format(new Date())
        .toUpperCase(),
    [],
  );
  const toggle = (task: string, mins: number) =>
    update((p) => {
      const on = p.completedTasks.includes(task);
      const today = new Date().toISOString().slice(0, 10);
      return {
        ...p,
        completedTasks: on
          ? p.completedTasks.filter((x) => x !== task)
          : [...p.completedTasks, task],
        totalMinutes: Math.max(0, p.totalMinutes + (on ? -mins : mins)),
        lastStudyDate: on ? p.lastStudyDate : today,
        streak: !on && p.lastStudyDate !== today ? p.streak + 1 : p.streak,
      };
    });
  return (
    <>
      <PageTitle
        eyebrow={dateLabel}
        title="Hallo Kenil 👋"
        subtitle="B1 auffrischen. B2 sicher beherrschen."
        actions={
          <>
            <button
              className="button ghost"
              onClick={() =>
                update((p) => ({
                  ...p,
                  settings: {
                    ...p.settings,
                    dailyTarget: p.settings.dailyTarget === 30 ? 55 : 30,
                  },
                }))
              }
            >
              <Zap size={17} />
              {light ? "55-Min-Version" : "20–30-Min-Version"}
            </button>
            <Link className="button primary" href={`/week/${week.id}`}>
              Weiterlernen <ArrowRight size={17} />
            </Link>
          </>
        }
      />
      <section className="metric-grid">
        <div className="metric hero-metric">
          <div className="metric-icon teal">
            <BookOpen />
          </div>
          <div>
            <span>AKTUELLE WOCHE</span>
            <strong>Woche {week.weekNumber}</strong>
            <p>{week.title}</p>
          </div>
          <Link href={`/week/${week.id}`} aria-label="Open current week">
            <ArrowRight />
          </Link>
        </div>
        <div className="metric">
          <div className="metric-icon blue">
            <Clock3 />
          </div>
          <div>
            <span>HEUTE</span>
            <strong>{target} Min</strong>
            <p>{done}/5 Aufgaben fertig</p>
          </div>
        </div>
        <div className="metric">
          <div className="metric-icon coral">
            <Flame />
          </div>
          <div>
            <span>LERNSTREAK</span>
            <strong>{progress.streak} Tage</strong>
            <p>Persönlich: 9 Tage</p>
          </div>
        </div>
        <div className="metric">
          <div className="metric-icon gold">
            <Target />
          </div>
          <div>
            <span>GESAMTFORTSCHRITT</span>
            <strong>{overallProgress}%</strong>
            <ProgressBar value={overallProgress} />
          </div>
        </div>
      </section>
      <div className="dashboard-grid">
        <section className="card today-card">
          <div className="card-head">
            <div>
              <Badge tone="teal">HEUTE · {target} MIN</Badge>
              <h2>{light ? "20–30-Minuten Fokusplan" : day.focus}</h2>
              <p>{week.objective}</p>
            </div>
            <div className="ring">
              <span>{done}/5</span>
            </div>
          </div>
          <div className="task-list">
            {day.tasks.map((task, i) => (
              <button
                className={`task ${progress.completedTasks.includes(task.id) ? "done" : ""}`}
                key={task.id}
                data-task-id={task.id}
                onClick={() => toggle(task.id, planMinutes[i])}
              >
                <span className="task-check">
                  {progress.completedTasks.includes(task.id) ? (
                    <Check size={16} />
                  ) : (
                    i + 1
                  )}
                </span>
                <span className={`skill-dot ${task.skill}`} />
                <span className="task-copy">
                  <strong>{task.title}</strong>
                  <small>{task.detail}</small>
                </span>
                <span className="task-time">
                  <Clock3 size={14} />
                  {planMinutes[i]} min
                </span>
              </button>
            ))}
          </div>
          <div className="today-foot">
            <span>
              <CheckCircle2 size={17} />
              Ziel: unter einer Stunde
            </span>
            <Link className="button primary" href={`/week/${week.id}`}>
              <Play size={16} />
              Session starten
            </Link>
          </div>
        </section>
        <aside className="side-stack">
          <section className="card week-goal">
            <div className="card-head compact">
              <div>
                <span className="kicker">WOCHENZIEL</span>
                <h3>B2-Antworten ausbauen</h3>
              </div>
              <span className="percent">38%</span>
            </div>
            <ProgressBar value={38} />
            <div className="goal-days">
              {["M", "D", "M", "D", "F", "S"].map((d, i) => (
                <span
                  className={i < 2 ? "complete" : i === 2 ? "current" : ""}
                  key={i}
                >
                  {i < 2 ? <Check size={14} /> : d}
                </span>
              ))}
            </div>
            <small>2 von 6 Lerntagen abgeschlossen</small>
          </section>
          <section className="card recommendation">
            <div className="rec-icon">
              <Sparkles />
            </div>
            <span className="kicker">
              SMARTER VORSCHLAG · {rec.minutes} MIN
            </span>
            <h3>{rec.title}</h3>
            <p>{rec.body}</p>
            <Link href={weak[0] ? `/grammar/${weak[0].slug}` : "/skills"}>
              Jetzt üben <ArrowRight size={16} />
            </Link>
          </section>
        </aside>
      </div>
      <div className="lower-grid">
        <section className="card weak-card">
          <div className="section-head">
            <div>
              <span className="kicker">
                FOKUS{" "}
                <InfoTip label="Warum erscheint ein Thema hier?">
                  Ein Thema erscheint bei einem Quiz unter 60% oder wenn du es
                  als Unsicher markierst.
                </InfoTip>
              </span>
              <h2>Diese Themen noch einmal ansehen</h2>
            </div>
            <Link href="/grammar">
              Alle Themen <ArrowRight size={16} />
            </Link>
          </div>
          {weak.length ? (
            weak.map((t, i) => (
              <Link
                className="weak-row"
                href={`/grammar/${t.slug}`}
                key={t.slug}
              >
                <div className="weak-index">0{i + 1}</div>
                <div>
                  <strong>{t.title}</strong>
                  <span>
                    {t.category} · {t.level}
                  </span>
                </div>
                <Badge tone={i ? "amber" : "coral"}>
                  {i ? "Wiederholen" : "Unsicher"}
                </Badge>
                <ArrowRight size={17} />
              </Link>
            ))
          ) : (
            <p className="helpful-empty">
              Noch keine schwierigen Themen. Sie erscheinen hier, wenn du ein
              Thema als „Unsicher“ markierst oder bei einer Übung
              Schwierigkeiten hast.
            </p>
          )}
        </section>
        <section className="card real-life">
          <div className="real-life-top">
            <span className="live-icon">
              <MessageCircle />
            </span>
            <div>
              <span className="kicker">DEUTSCH IM ECHTEN LEBEN</span>
              <h2>Um Klärung bitten</h2>
            </div>
          </div>
          <blockquote>
            „Könnten Sie bitte genauer erklären, was Sie damit meinen?“
          </blockquote>
          <p>
            Use this when a colleague’s instructions are unclear. Repeat it
            twice, then adapt it to your own situation.
          </p>
          <Link className="button dark" href="/practice/speaking">
            <Volume2 size={17} />
            Sprechübung · 2 min
          </Link>
        </section>
      </div>
      <section className="milestone-strip">
        <div className="milestone-icon">
          <Trophy />
        </div>
        <div>
          <span>NÄCHSTER MEILENSTEIN</span>
          <strong>B2 Bridge Complete</strong>
          <p>
            Noch 4 Wochen · Kein hartes Deadline — Wiederholen ist Teil des
            Plans.
          </p>
        </div>
        <div className="milestone-progress">
          <span>Woche 7 von 10</span>
          <ProgressBar value={70} tone="gold" />
        </div>
        <Link className="button ghost" href="/roadmap">
          Roadmap ansehen
        </Link>
      </section>
    </>
  );
}

function Roadmap({ progress }: { progress: ProgressState }) {
  const [filter, setFilter] = useState("All");
  const shown = roadmap.filter(
    (w) =>
      filter === "All" ||
      (filter === "B1"
        ? w.level === "B1"
        : filter === "B2"
          ? w.level === "B2"
          : w.weekNumber === progress.currentWeek),
  );
  return (
    <>
      <PageTitle
        eyebrow="30-WOCHEN-PFAD"
        title="Deine Roadmap"
        subtitle="Ein klarer Weg von der B1-Auffrischung zu sicherer B2-Kommunikation."
        actions={<Badge tone="teal">30–55 Min / Tag</Badge>}
      />
      <div className="filter-row">
        {["All", "B1", "B2", "Needs review"].map((x) => (
          <button
            className={filter === x ? "active" : ""}
            onClick={() => setFilter(x)}
            key={x}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="roadmap-list">
        {shown.map((w) => {
          const status =
            w.weekNumber < progress.currentWeek
              ? "Completed"
              : w.weekNumber === progress.currentWeek
                ? "In progress"
                : "Not started";
          return (
            <div
              className={`roadmap-week ${status === "In progress" ? "current" : ""}`}
              key={w.id}
            >
              <div className="timeline-dot">
                {status === "Completed" ? <Check size={16} /> : w.weekNumber}
              </div>
              <div className="week-main">
                <div>
                  <Badge tone={w.level === "B1" ? "blue" : "teal"}>
                    {w.level}
                  </Badge>
                  <span className="phase-label">{w.phase}</span>
                  {w.checkpoint && <Badge tone="gold">Milestone</Badge>}
                </div>
                <h3>
                  Woche {w.weekNumber} · {w.title}
                </h3>
                <p>{w.objective}</p>
                <div className="topic-pills">
                  {w.topics.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="week-meta">
                <Badge
                  tone={
                    status === "Completed"
                      ? "green"
                      : status === "In progress"
                        ? "teal"
                        : "neutral"
                  }
                >
                  {status}
                </Badge>
                <span>≈ 5h 10m</span>
                <Link
                  href={`/week/${w.id}`}
                  aria-label={`Open week ${w.weekNumber}`}
                >
                  <ArrowRight />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function WeekView({
  id,
  progress,
  update,
}: {
  id?: string;
  progress: ProgressState;
  update: (fn: (p: ProgressState) => ProgressState) => void;
}) {
  const week =
    roadmap.find((w) => w.id === id) || roadmap[progress.currentWeek - 1];
  const [open, setOpen] = useState(0);
  const toggle = (task: string, mins: number) =>
    update((p) => {
      const on = p.completedTasks.includes(task);
      return {
        ...p,
        completedTasks: on
          ? p.completedTasks.filter((x) => x !== task)
          : [...p.completedTasks, task],
        totalMinutes: Math.max(0, p.totalMinutes + (on ? -mins : mins)),
      };
    });
  const setStatus = (dayId: string, status: DayStatus) =>
    update((p) => ({
      ...p,
      dayStatuses: { ...p.dayStatuses, [dayId]: status },
    }));
  return (
    <>
      <Link className="back-link" href="/roadmap">
        <ArrowLeft size={16} />
        Zur Roadmap
      </Link>
      <PageTitle
        eyebrow={`${week.phase.toUpperCase()} · ${week.level}`}
        title={`Woche ${week.weekNumber}: ${week.title}`}
        subtitle={week.objective}
        actions={<Badge tone="teal">≈ 5h 10m diese Woche</Badge>}
      />
      <div className="week-layout">
        <section>
          <div className="objective-card">
            <Target />
            <div>
              <span>WOCHENZIEL</span>
              <strong>{week.objective}</strong>
              <p>
                At the end, explain the key ideas in your own words and use them
                in a real situation.
              </p>
            </div>
          </div>
          <div className="day-accordions">
            {week.days.map((day, i) => {
              const completed = day.tasks.filter((t) =>
                progress.completedTasks.includes(t.id),
              ).length;
              return (
                <article className="day-card" key={day.id}>
                  <button
                    className="day-toggle"
                    onClick={() => setOpen(open === i ? -1 : i)}
                  >
                    <span
                      className={`day-number ${completed === day.tasks.length ? "complete" : ""}`}
                    >
                      {completed === day.tasks.length ? <Check /> : i + 1}
                    </span>
                    <div>
                      <span>{day.label.toUpperCase()}</span>
                      <strong>{day.focus}</strong>
                    </div>
                    {progress.dayStatuses[day.id] && (
                      <Badge tone="teal">{progress.dayStatuses[day.id]}</Badge>
                    )}
                    <span className="day-duration">
                      <Clock3 size={15} />
                      {day.targetMinutes} min
                    </span>
                    <ChevronDown className={open === i ? "rotate" : ""} />
                  </button>
                  {open === i && (
                    <div className="day-tasks">
                      {day.tasks.map((task) => (
                        <button
                          key={task.id}
                          className={
                            progress.completedTasks.includes(task.id)
                              ? "done"
                              : ""
                          }
                          onClick={() => toggle(task.id, task.minutes)}
                        >
                          <span className="checkbox">
                            {progress.completedTasks.includes(task.id) && (
                              <Check size={14} />
                            )}
                          </span>
                          <span className={`skill-icon ${task.skill}`}>
                            {task.skill.slice(0, 1).toUpperCase()}
                          </span>
                          <span>
                            <strong>{task.title}</strong>
                            <small>{task.detail}</small>
                          </span>
                          <Badge>{skillLabels[task.skill]}</Badge>
                          <em>{task.minutes} min</em>
                        </button>
                      ))}
                      <div className="day-statuses">
                        <span>Tag markieren:</span>
                        {(
                          [
                            "done",
                            "partial",
                            "skipped",
                            "moved",
                            "repeat",
                          ] as DayStatus[]
                        ).map((status) => (
                          <button
                            key={status}
                            className={
                              progress.dayStatuses[day.id] === status
                                ? "active"
                                : ""
                            }
                            onClick={() => setStatus(day.id, status)}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
        <aside className="week-aside">
          <section className="card">
            <span className="kicker">KERNTHEMEN</span>
            <h3>Diese Woche</h3>
            {week.topics.map((t, i) => (
              <div className="check-topic" key={t}>
                <span>{i + 1}</span>
                <div>
                  <strong>{t}</strong>
                  <small>Learn · practise · produce</small>
                </div>
              </div>
            ))}
          </section>
          <section className="card">
            <span className="kicker">PASSENDE ÜBUNGEN</span>
            <h3>Offizielle Ressourcen</h3>
            {resources
              .filter((r) =>
                week.level === "B1"
                  ? r.level.includes("B1")
                  : r.level.includes("B2"),
              )
              .slice(0, 3)
              .map((r) => (
                <a
                  className="mini-resource"
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={r.id}
                >
                  <div>
                    <strong>{r.title}</strong>
                    <small>
                      {r.provider} ·{" "}
                      {r.access === "free" ? "Kostenlos" : "Buch/Lizenz"}
                    </small>
                  </div>
                  <ExternalLink size={15} />
                </a>
              ))}
          </section>
        </aside>
      </div>
    </>
  );
}

function GrammarLibrary({
  progress,
  update,
}: {
  progress: ProgressState;
  update: (fn: (p: ProgressState) => ProgressState) => void;
}) {
  const [query, setQuery] = useState(() =>
    typeof window === "undefined"
      ? ""
      : (new URLSearchParams(window.location.search).get("q") ?? ""),
  );
  const [level, setLevel] = useState("All");
  const filtered = grammarTopics.filter(
    (t) =>
      (level === "All" || t.level === level) &&
      (t.title + " " + t.category).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PageTitle
        eyebrow="NACHSCHLAGEN · ÜBEN · SICHER WERDEN"
        title="Grammatik-Bibliothek"
        subtitle={`${grammarTopics.length} fokussierte Themen von B1 bis B2.`}
      />
      <div className="library-tools">
        <label>
          <Search />
          <input
            aria-label="Grammatik suchen"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Grammatik suchen …"
          />
        </label>
        <div className="filter-row compact">
          {["All", "B1", "B2"].map((x) => (
            <button
              onClick={() => setLevel(x)}
              className={level === x ? "active" : ""}
              key={x}
            >
              {x}
            </button>
          ))}
        </div>
      </div>
      {filtered.length ? (
        <div className="grammar-grid">
          {filtered.map((t) => {
            const conf = progress.confidence[t.slug] || "okay";
            return (
              <article className="grammar-card" key={t.slug}>
                <div>
                  <Badge tone={t.level === "B1" ? "blue" : "teal"}>
                    {t.level}
                  </Badge>
                  <Badge>{t.category}</Badge>
                </div>
                <Link href={`/grammar/${t.slug}`}>
                  <h3>{t.title}</h3>
                </Link>
                <p>{t.description}</p>
                <div className="confidence">
                  <span>
                    Vertrauen{" "}
                    <InfoTip label="Vertrauensstufen erklären">
                      Unsicher = wiederholen, Okay = meist anwendbar, Sicher =
                      zuverlässig.
                    </InfoTip>
                  </span>
                  {(["unsicher", "okay", "sicher"] as Confidence[]).map((c) => (
                    <button
                      key={c}
                      aria-label={`Set confidence ${c}`}
                      className={conf === c ? `selected ${c}` : ""}
                      onClick={() =>
                        update((p) => ({
                          ...p,
                          confidence: { ...p.confidence, [t.slug]: c },
                        }))
                      }
                    >
                      {c === "unsicher" ? "?" : c === "okay" ? "~" : "✓"}
                    </button>
                  ))}
                </div>
                <div className="grammar-actions">
                  <Link href={`/practice/${t.slug}?mode=quick`}>
                    Quick Practice
                  </Link>
                  <Link className="card-link" href={`/grammar/${t.slug}`}>
                    Thema öffnen <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <section className="empty-state">
          <div>
            <Search />
          </div>
          <h2>Kein passendes Thema</h2>
          <p>
            Versuche einen kürzeren Suchbegriff oder entferne den Niveau-Filter.
          </p>
          <button
            className="button primary"
            onClick={() => {
              setQuery("");
              setLevel("All");
            }}
          >
            Filter zurücksetzen
          </button>
        </section>
      )}
    </>
  );
}

function GrammarDetail({
  id,
  progress,
  update,
}: {
  id?: string;
  progress: ProgressState;
  update: (fn: (p: ProgressState) => ProgressState) => void;
}) {
  const topic = grammarTopics.find((t) => t.slug === id) || grammarTopics[0];
  const mistakes =
    progress.exerciseProgress[topic.slug]?.incorrectQuestionIds.length ?? 0;
  return (
    <>
      <Link className="back-link" href="/grammar">
        <ArrowLeft size={16} />
        Grammatik-Bibliothek
      </Link>
      <PageTitle
        eyebrow={`${topic.level} · ${topic.category.toUpperCase()}`}
        title={topic.title}
        subtitle={topic.description}
        actions={
          <div className="confidence-picker">
            {(["unsicher", "okay", "sicher"] as Confidence[]).map((c) => (
              <button
                key={c}
                onClick={() =>
                  update((p) => ({
                    ...p,
                    confidence: { ...p.confidence, [topic.slug]: c },
                  }))
                }
                className={
                  progress.confidence[topic.slug] === c ? "active" : ""
                }
              >
                {c}
              </button>
            ))}
          </div>
        }
      />
      <div className="lesson-layout">
        <article className="lesson">
          <section>
            <span className="lesson-no">01</span>
            <div>
              <h2>Was bedeutet das?</h2>
              <p>{topic.rule}</p>
            </div>
          </section>
          <section>
            <span className="lesson-no">02</span>
            <div>
              <h2>Struktur</h2>
              <div className="formula">
                Regel erkennen → Form wählen → Verbposition prüfen
              </div>
              <p className="hint">
                Konzentriere dich auf die Funktion dieser Struktur und bilde
                anschließend ein eigenes Beispiel.
              </p>
            </div>
          </section>
          <section>
            <span className="lesson-no">03</span>
            <div>
              <h2>Beispiele</h2>
              {topic.examples.map(([de, en]) => (
                <div className="example" key={de}>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: de.replace(
                        /\*\*(.*?)\*\*/g,
                        "<strong>$1</strong>",
                      ),
                    }}
                  />
                  <small>{progress.settings.showEnglish && en}</small>
                </div>
              ))}
            </div>
          </section>
          <section>
            <span className="lesson-no">04</span>
            <div>
              <h2>Häufige Fehler</h2>
              {topic.mistakes.map((m) => (
                <p className="mistake" key={m}>
                  <X size={15} />
                  {m}
                </p>
              ))}
            </div>
          </section>
          <section className="memory">
            <Brain />
            <div>
              <span>MERKSATZ</span>
              <strong>{topic.memory}</strong>
            </div>
          </section>
          <section>
            <span className="lesson-no">05</span>
            <div>
              <h2>Üben mit Feedback</h2>
              <p>
                Jede Frage erklärt die richtige Antwort und die relevante Regel.
                Full Practice umfasst 8 Fragen in mehreren Formaten.
              </p>
              <div className="practice-buttons">
                <Link
                  className="button primary"
                  href={`/practice/${topic.slug}?mode=quick`}
                >
                  Quick Practice · 5
                </Link>
                <Link
                  className="button ghost"
                  href={`/practice/${topic.slug}?mode=full`}
                >
                  Full Practice · 8
                </Link>
                <Link
                  aria-disabled={!mistakes}
                  className={`button ghost ${!mistakes ? "disabled" : ""}`}
                  href={
                    mistakes
                      ? `/practice/${topic.slug}?mode=mistakes`
                      : "/grammar/" + topic.slug
                  }
                  title={
                    !mistakes ? "Noch keine Fehler zum Wiederholen." : undefined
                  }
                >
                  Review Mistakes{mistakes ? ` · ${mistakes}` : ""}
                </Link>
              </div>
              {!mistakes && (
                <small className="disabled-explanation">
                  Noch keine Fehler zum Wiederholen. Bearbeite zuerst eine
                  Übung.
                </small>
              )}
            </div>
          </section>
          <section className="challenge-grid">
            <div>
              <Mic2 />
              <span>SPRECHEN · 90 SEK.</span>
              <h3>
                Verwende {topic.title} in einer Antwort über deinen Alltag.
              </h3>
              <Link className="button dark" href="/practice/speaking">
                <Timer size={16} />
                Timer starten
              </Link>
            </div>
            <div>
              <NotebookPen />
              <span>SCHREIBEN · 8 MIN.</span>
              <h3>
                Schreibe vier natürliche Sätze und prüfe die Zielstruktur.
              </h3>
              <Link className="button ghost" href="/practice/writing">
                Aufgabe öffnen
              </Link>
            </div>
          </section>
        </article>
        <aside className="lesson-aside">
          <section className="card">
            <span className="kicker">PASSENDE ÜBUNGEN</span>
            <h3>Practise this topic</h3>
            {topic.resources
              .map((rid) => resources.find((r) => r.id === rid))
              .filter(Boolean)
              .map((r) => (
                <a
                  className="resource-side"
                  href={r!.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={r!.id}
                >
                  <strong>{r!.title}</strong>
                  <small>Best for: {r!.recommendedUse}</small>
                  <span>
                    {r!.access === "free"
                      ? "Free official resource"
                      : "Book / licence may be required"}
                    <ExternalLink size={13} />
                  </span>
                </a>
              ))}
          </section>
        </aside>
      </div>
    </>
  );
}

function Vocabulary({
  progress,
  update,
}: {
  progress: ProgressState;
  update: (fn: (p: ProgressState) => ProgressState) => void;
}) {
  const [selected, setSelected] = useState(vocabularyThemes[0]);
  const showEnglish = progress.settings.showEnglish;
  const [random, setRandom] = useState(0);
  const items = selected.items
    .slice(random)
    .concat(selected.items.slice(0, random));
  return (
    <>
      <PageTitle
        eyebrow="12 ALLTAGSTHEMEN"
        title="Wortschatz, der wirklich hilft"
        subtitle="Kleine, hochwertige Sets statt endloser Wortlisten."
        actions={
          <button
            className="button ghost"
            onClick={() =>
              setRandom(Math.floor(Math.random() * selected.items.length))
            }
          >
            <RotateCcw size={16} />
            Zufällig wiederholen
          </button>
        }
      />
      <div className="vocab-layout">
        <aside className="theme-list">
          {vocabularyThemes.map((t) => (
            <button
              className={selected.id === t.id ? "active" : ""}
              onClick={() => setSelected(t)}
              key={t.id}
            >
              <span>{t.title.slice(0, 1)}</span>
              <div>
                <strong>{t.title}</strong>
                <small>
                  {t.level} · {t.items.length} starter words
                </small>
              </div>
              <ArrowRight size={15} />
            </button>
          ))}
        </aside>
        <section className="vocab-main">
          <div className="vocab-head">
            <div>
              <Badge tone="teal">{selected.level}</Badge>
              <h2>{selected.title}</h2>
              <p>High-value words, collocations and natural examples.</p>
            </div>
            <div className="vocab-actions">
              <button
                className="switch-label"
                onClick={() =>
                  update((current) => ({
                    ...current,
                    settings: {
                      ...current.settings,
                      showEnglish: !current.settings.showEnglish,
                    },
                  }))
                }
              >
                <span className={showEnglish ? "switch on" : "switch"} />
                {showEnglish ? "English shown" : "English hidden"}
              </button>
              <Link
                className="button primary"
                href={`/practice/vocab-${selected.id}?mode=full`}
              >
                Thema üben
              </Link>
            </div>
          </div>
          {items.map((item, i) => {
            const hard = progress.difficultWords.includes(item.term);
            return (
              <article className="word-card" key={item.term}>
                <span className="word-no">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{item.term}</h3>
                  {showEnglish && <p>{item.meaning}</p>}
                  <blockquote>{item.example}</blockquote>
                </div>
                <button
                  className={hard ? "hard active" : "hard"}
                  onClick={() =>
                    update((p) => ({
                      ...p,
                      difficultWords: hard
                        ? p.difficultWords.filter((x) => x !== item.term)
                        : [...p.difficultWords, item.term],
                    }))
                  }
                >
                  <Zap size={16} />
                  {hard ? "Schwierig" : "Markieren"}
                </button>
              </article>
            );
          })}
          <div className="redemittel-block">
            <span className="kicker">REDEMITTEL</span>
            <h2>Meinung & Diskussion</h2>
            <div>
              {redemittel.Meinung.concat(redemittel.Diskutieren).map(
                (phrase) => (
                  <button
                    onClick={() => navigator.clipboard?.writeText(phrase)}
                    key={phrase}
                  >
                    {phrase}
                    <span>copy</span>
                  </button>
                ),
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function Skills() {
  const data = [
    [
      "Lesen",
      BookOpen,
      64,
      "Main ideas are strong; practise inference.",
      "reading",
    ],
    [
      "Hören",
      Headphones,
      52,
      "Train selective listening and notes.",
      "listening",
    ],
    [
      "Schreiben",
      NotebookPen,
      46,
      "Focus on paragraph structure and register.",
      "writing",
    ],
    [
      "Sprechen",
      Mic2,
      38,
      "Your clearest next opportunity: more output.",
      "speaking",
    ],
  ] as const;
  return (
    <>
      <PageTitle
        eyebrow="BALANCIERTE B2-FÄHIGKEIT"
        title="Deine vier Skills"
        subtitle="Course completion is useful. Real B2 means understanding and producing language."
      />
      <div className="skills-grid">
        {data.map(([name, Icon, value, next, route]) => (
          <article className="skill-card" key={name}>
            <div className="skill-top">
              <span>
                <Icon />
              </span>
              <Badge
                tone={value < 45 ? "coral" : value < 60 ? "amber" : "green"}
              >
                {value < 45
                  ? "Needs attention"
                  : value < 60
                    ? "Building"
                    : "On track"}
              </Badge>
            </div>
            <h2>{name}</h2>
            <div className="big-percent">{value}%</div>
            <ProgressBar value={value} />
            <p>{next}</p>
            <div className="skill-stats">
              <span>
                <strong>{Math.round(value / 6)}</strong>tasks done
              </span>
              <span>
                <strong>
                  {name === "Lesen" ? 78 : name === "Hören" ? 66 : 0}%
                </strong>
                latest check
              </span>
            </div>
            <Link className="button ghost" href={`/practice/${route}`}>
              Nächste Übung <ArrowRight size={16} />
            </Link>
          </article>
        ))}
      </div>
      <section className="card balance-card">
        <div>
          <span className="kicker">SMARTER FOKUS</span>
          <h2>Sprechen liegt hinter Grammatik</h2>
          <p>
            Add one 90-second answer today. No recording or perfect script—just
            clear structure, connectors and a concrete example.
          </p>
        </div>
        <Link className="button primary" href="/practice/speaking">
          <Mic2 size={17} />
          Sprechübung starten
        </Link>
      </section>
    </>
  );
}

function Resources() {
  const [provider, setProvider] = useState("All");
  const filtered = resources.filter(
    (r) => provider === "All" || r.provider === provider,
  );
  return (
    <>
      <PageTitle
        eyebrow="LEGAL · OFFIZIELL · FOKUSSIERT"
        title="Ressourcen"
        subtitle="Klett and Hueber first, with Goethe materials for realistic checkpoints."
      />
      <div className="featured-resources">
        {resources.slice(0, 3).map((resource, i) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`featured-resource r${i}`}
          >
            <span className="provider">{resource.provider}</span>
            <h2>{resource.title}</h2>
            <p>{resource.description}</p>
            <span>
              Empfohlen <ExternalLink size={16} />
            </span>
          </a>
        ))}
      </div>
      <div className="filter-row">
        {["All", "Klett", "Hueber", "Goethe"].map((option) => (
          <button
            key={option}
            className={provider === option ? "active" : ""}
            onClick={() => setProvider(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="resource-list">
        {filtered.map((resource) => (
          <article key={resource.id}>
            <div className={`provider-mark ${resource.provider.toLowerCase()}`}>
              {resource.provider.slice(0, 1)}
            </div>
            <div>
              <div>
                <Badge
                  tone={
                    resource.provider === "Klett"
                      ? "blue"
                      : resource.provider === "Hueber"
                        ? "teal"
                        : "gold"
                  }
                >
                  {resource.provider}
                </Badge>
                {resource.level.map((level) => (
                  <Badge key={level}>{level}</Badge>
                ))}
              </div>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <small>
                <strong>Recommended:</strong> {resource.recommendedUse}
              </small>
            </div>
            <div className="resource-action">
              <Badge tone={resource.access === "free" ? "green" : "amber"}>
                {resource.access === "free"
                  ? "Free official resource"
                  : "Book / licence may be required"}
              </Badge>
              <a
                className="button ghost"
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open practice <ExternalLink size={15} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function Exam() {
  const examSkills: Array<[string, string, string, typeof BookOpen, string]> = [
    [
      "Lesen",
      "65 min",
      "Main idea · detail · inference · author position",
      BookOpen,
      "reading",
    ],
    [
      "Hören",
      "40 min",
      "Global · selective · detailed · speaker attitude",
      Headphones,
      "listening",
    ],
    [
      "Schreiben",
      "75 min",
      "Clear position · arguments · register · proofreading",
      NotebookPen,
      "writing",
    ],
    [
      "Sprechen",
      "15 min",
      "Presentation · discussion · reacting · follow-up",
      Mic2,
      "speaking",
    ],
  ];
  return (
    <>
      <PageTitle
        eyebrow="REAL LANGUAGE FIRST"
        title="Prüfung & Checkpoints"
        subtitle="Learn the language; then practise using it in the exam format."
      />
      <div className="exam-hero">
        <div>
          <Badge tone="gold">WOCHE 29</Badge>
          <h2>Goethe-Zertifikat B2</h2>
          <p>
            Know the structure, manage your time and use one official practice
            set. Strategies support your German—they do not replace it.
          </p>
          <div>
            <a
              className="button light"
              href="https://www.goethe.de/de/spr/prf/ueb/pb2.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Offizielles Training <ExternalLink size={16} />
            </a>
            <Link className="button outline-light" href="/help">
              Prüfungsübersicht
            </Link>
          </div>
        </div>
        <div className="exam-score">
          <span>B2 readiness</span>
          <strong>47%</strong>
          <ProgressBar value={47} tone="gold" />
          <small>Foundation developing</small>
        </div>
      </div>
      <div className="exam-grid">
        {examSkills.map(([name, time, description, Icon, route]) => (
          <article className="card" key={name}>
            <span className="exam-icon">
              <Icon />
            </span>
            <div>
              <h3>{name}</h3>
              <span>{time}</span>
            </div>
            <p>{description}</p>
            <Link href={`/practice/${route}`}>
              Übung öffnen <ArrowRight size={15} />
            </Link>
          </article>
        ))}
      </div>
      <section className="checkpoint card">
        <div>
          <Badge tone="blue">B1 CHECKPOINT</Badge>
          <h2>B1 Core Refreshed</h2>
          <p>
            Attempt the official four-skill material, then rate each skill. Weak
            areas can continue alongside B2.
          </p>
        </div>
        <div className="checkpoint-score">
          <span>Diagnostic</span>
          <strong>72%</strong>
          <Badge tone="amber">Review once more</Badge>
        </div>
        <a
          href="https://www.goethe.de/de/spr/prf/ueb/pb1.html"
          target="_blank"
          rel="noopener noreferrer"
          className="button ghost"
        >
          Open official B1 set <ExternalLink size={15} />
        </a>
      </section>
    </>
  );
}

function Progress({ progress }: { progress: ProgressState }) {
  const completionFor = (weeks: typeof roadmap) => {
    const ids = weeks.flatMap((week) =>
      week.days.flatMap((day) => day.tasks.map((task) => task.id)),
    );
    return ids.length
      ? Math.round(
          (ids.filter((id) => progress.completedTasks.includes(id)).length /
            ids.length) *
            100,
        )
      : 0;
  };
  const recentWeeks = roadmap.slice(
    Math.max(0, progress.currentWeek - 7),
    progress.currentWeek,
  );
  const weekly = recentWeeks.map((week) => ({
    week: week.weekNumber,
    value: completionFor([week]),
  }));
  const phases: [string, number, string][] = [
    ["B1 Revision", completionFor(roadmap.slice(0, 6)), "6 Wochen"],
    ["B2 Foundation", completionFor(roadmap.slice(6, 10)), "4 Wochen"],
    ["B2 Expansion", completionFor(roadmap.slice(10, 18)), "8 Wochen"],
    ["Real-Life & Exam", completionFor(roadmap.slice(18)), "12 Wochen"],
  ];
  const exerciseAttempts = Object.values({
    ...progress.exerciseProgress,
    ...progress.vocabularyProgress,
  }).reduce((total, result) => total + result.attempts, 0);
  const completedMilestones = phases.filter(
    ([, value]) => value === 100,
  ).length;
  const confidenceCounts = grammarTopics.reduce(
    (counts, topic) => {
      counts[progress.confidence[topic.slug] ?? "okay"] += 1;
      return counts;
    },
    { unsicher: 0, okay: 0, sicher: 0 },
  );
  const confidencePercent = (key: Confidence) =>
    Math.round((confidenceCounts[key] / grammarTopics.length) * 100);
  return (
    <>
      <PageTitle
        eyebrow="DEIN LERNVERLAUF"
        title="Du bist auf dem richtigen Weg."
        subtitle="Progress is a signal for what to do next—not a score of your ability."
        actions={
          <InfoTip label="Was bedeuten diese Werte?">
            Roadmap completion is learning progress. It is not an official B2
            certificate or CEFR assessment.
          </InfoTip>
        }
      />
      <section className="metric-grid progress-metrics">
        <div className="metric">
          <div className="metric-icon teal">
            <CheckCircle2 />
          </div>
          <div>
            <span>SESSIONS</span>
            <strong>{progress.completedTasks.length + exerciseAttempts}</strong>
            <p>Aktivitäten gespeichert</p>
          </div>
        </div>
        <div className="metric">
          <div className="metric-icon blue">
            <Clock3 />
          </div>
          <div>
            <span>LERNZEIT</span>
            <strong>
              {Math.floor(progress.totalMinutes / 60)}h{" "}
              {progress.totalMinutes % 60}m
            </strong>
            <p>insgesamt</p>
          </div>
        </div>
        <div className="metric">
          <div className="metric-icon coral">
            <Flame />
          </div>
          <div>
            <span>KONSISTENZ</span>
            <strong>{progress.streak} Tage</strong>
            <p>aktueller Streak</p>
          </div>
        </div>
        <div className="metric">
          <div className="metric-icon gold">
            <Trophy />
          </div>
          <div>
            <span>MEILENSTEINE</span>
            <strong>{completedMilestones} / 4</strong>
            <p>Roadmap-Phasen abgeschlossen</p>
          </div>
        </div>
      </section>
      <div className="progress-layout">
        <section className="card chart-card">
          <div className="section-head">
            <div>
              <span className="kicker">WOCHENRHYTHMUS</span>
              <h2>Aufgabenfortschritt pro Woche</h2>
            </div>
            <Badge tone="green">Aus deinen Aufgaben</Badge>
          </div>
          <div className="bar-chart">
            {weekly.map(({ week, value }) => (
              <div key={week}>
                <span
                  style={{ height: `${Math.max(4, value * 1.6)}px` }}
                  className={week === progress.currentWeek ? "highlight" : ""}
                  title={`${value}% erledigt`}
                />
                <small>W{week}</small>
              </div>
            ))}
          </div>
        </section>
        <section className="card phase-progress">
          <span className="kicker">ROADMAP</span>
          <h2>Phasenfortschritt</h2>
          {phases.map(([name, value, weeks]) => (
            <div className="phase-row" key={name}>
              <div>
                <strong>{name}</strong>
                <span>{weeks}</span>
              </div>
              <b>{value}%</b>
              <ProgressBar value={value} />
            </div>
          ))}
        </section>
      </div>
      <section className="card confidence-chart">
        <div>
          <span className="kicker">GRAMMATIK-VERTRAUEN</span>
          <h2>43 Themen im Blick</h2>
        </div>
        <div className="confidence-bars">
          <div className="conf uns">
            <span style={{ width: `${confidencePercent("unsicher")}%` }} />
            Unsicher <b>{confidencePercent("unsicher")}%</b>
          </div>
          <div className="conf ok">
            <span style={{ width: `${confidencePercent("okay")}%` }} />
            Okay <b>{confidencePercent("okay")}%</b>
          </div>
          <div className="conf sure">
            <span style={{ width: `${confidencePercent("sicher")}%` }} />
            Sicher <b>{confidencePercent("sicher")}%</b>
          </div>
        </div>
      </section>
    </>
  );
}

function Notes({
  progress,
  update,
}: {
  progress: ProgressState;
  update: (fn: (p: ProgressState) => ProgressState) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const startNew = () => {
    setEditing(null);
    setTitle("");
    setBody("");
    setOpen(true);
  };
  const startEdit = (id: string) => {
    const note = progress.notes.find((item) => item.id === id);
    if (!note) return;
    setEditing(id);
    setTitle(note.title);
    setBody(note.body);
    setOpen(true);
  };
  const save = () => {
    if (!title.trim()) return;
    update((p) => ({
      ...p,
      notes: editing
        ? p.notes.map((note) =>
            note.id === editing
              ? {
                  ...note,
                  title: title.trim(),
                  body,
                  updatedAt: new Date().toLocaleDateString("de-DE"),
                }
              : note,
          )
        : [
            {
              id: String(Date.now()),
              title: title.trim(),
              body,
              tag: "Allgemein",
              updatedAt: new Date().toLocaleDateString("de-DE"),
            },
            ...p.notes,
          ],
    }));
    setOpen(false);
    setEditing(null);
  };
  const filtered = progress.notes.filter((note) =>
    (note.title + " " + note.body).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PageTitle
        eyebrow="DEIN PERSÖNLICHES WISSEN"
        title="Notizen"
        subtitle="Halte Regeln, Fehler und neue Redemittel an einem Ort fest."
        actions={
          <button className="button primary" onClick={startNew}>
            <NotebookPen size={16} />
            Neue Notiz
          </button>
        }
      />
      {progress.notes.length > 0 && (
        <label className="notes-search">
          <Search size={17} />
          <span className="sr-only">Notizen suchen</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Notizen suchen …"
          />
        </label>
      )}
      {open && (
        <section className="note-editor card">
          <label>
            <span className="sr-only">Titel</span>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titel der Notiz"
            />
          </label>
          <label>
            <span className="sr-only">Notiztext</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Regel, Beispiel oder persönlicher Hinweis …"
            />
          </label>
          <div>
            <button className="button ghost" onClick={() => setOpen(false)}>
              Abbrechen
            </button>
            <button
              className="button primary"
              disabled={!title.trim()}
              onClick={save}
            >
              {editing ? "Änderungen speichern" : "Speichern"}
            </button>
          </div>
        </section>
      )}
      {!progress.notes.length && !open ? (
        <section className="empty-state">
          <div>
            <NotebookPen />
          </div>
          <h2>Noch keine Notizen.</h2>
          <p>Speichere hier wichtige Regeln, Fehler und neue Redemittel.</p>
          <button className="button primary" onClick={startNew}>
            Erste Notiz erstellen
          </button>
        </section>
      ) : !filtered.length && !open ? (
        <section className="empty-state">
          <div>
            <Search />
          </div>
          <h2>Keine passende Notiz</h2>
          <p>Versuche einen anderen Suchbegriff.</p>
          <button className="button ghost" onClick={() => setQuery("")}>
            Suche löschen
          </button>
        </section>
      ) : (
        <div className="notes-grid">
          {filtered.map((note) => (
            <article className="card" key={note.id}>
              <Badge>{note.tag}</Badge>
              <h3>{note.title}</h3>
              <p>{note.body}</p>
              <div>
                <span>{note.updatedAt}</span>
                <span>
                  <button
                    aria-label={`Edit ${note.title}`}
                    onClick={() => startEdit(note.id)}
                  >
                    <NotebookPen size={16} />
                  </button>
                  <button
                    aria-label={`Delete ${note.title}`}
                    onClick={() => {
                      if (confirm(`„${note.title}“ löschen?`))
                        update((p) => ({
                          ...p,
                          notes: p.notes.filter((n) => n.id !== note.id),
                        }));
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

function SettingsView({
  progress,
  update,
}: {
  progress: ProgressState;
  update: (fn: (p: ProgressState) => ProgressState) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const supported = typeof window !== "undefined" && "Notification" in window;
  const permission = supported ? Notification.permission : "unsupported";
  const setting = <K extends keyof ProgressState["settings"]>(
    key: K,
    value: ProgressState["settings"][K],
  ) => update((p) => ({ ...p, settings: { ...p.settings, [key]: value } }));
  const notificationSetting = <
    K extends keyof ProgressState["settings"]["notifications"],
  >(
    key: K,
    value: ProgressState["settings"]["notifications"][K],
  ) =>
    update((p) => ({
      ...p,
      settings: {
        ...p.settings,
        notifications: { ...p.settings.notifications, [key]: value },
      },
    }));
  const requestNotifications = async () => {
    if (!supported) {
      setMessage(
        "Browser-Benachrichtigungen werden auf diesem Gerät nicht vollständig unterstützt. In-App-Erinnerungen bleiben verfügbar.",
      );
      return;
    }
    const result = await Notification.requestPermission();
    notificationSetting("browserNotifications", result === "granted");
    if (result === "granted") {
      new Notification("Zeit für Deutsch 🇩🇪", {
        body: `Heute sind ${progress.settings.dailyTarget} Minuten geplant.`,
        icon: "/favicon.svg",
      });
      setMessage(
        "Browser-Benachrichtigungen sind aktiviert, solange der Browser sie zulässt.",
      );
    } else
      setMessage(
        "Benachrichtigungen wurden im Browser blockiert. Du kannst sie in den Browser-Einstellungen wieder aktivieren.",
      );
  };
  return (
    <>
      <PageTitle
        eyebrow="DEIN PLAN, DEIN TEMPO"
        title="Einstellungen"
        subtitle="Change the rhythm without breaking the learning path."
      />
      {message && (
        <div className="settings-message" role="status">
          {message}
          <button aria-label="Meldung schließen" onClick={() => setMessage("")}>
            <X size={15} />
          </button>
        </div>
      )}
      <div className="settings-layout">
        <section className="card settings-card">
          <h2>Lernrhythmus</h2>
          <div className="setting-row">
            <div>
              <strong>Tägliches Ziel</strong>
              <span>
                Bei 30 Minuten werden Zeitblöcke automatisch verkürzt.
              </span>
            </div>
            <div className="segmented">
              {([30, 45, 55] as const).map((n) => (
                <button
                  key={n}
                  className={
                    progress.settings.dailyTarget === n ? "active" : ""
                  }
                  onClick={() => setting("dailyTarget", n)}
                >
                  {n} min
                </button>
              ))}
            </div>
          </div>
          <div className="setting-row">
            <div>
              <strong>Lerntage pro Woche</strong>
              <span>
                Der zusätzliche freie Tag wird nicht mit Aufgaben überladen.
              </span>
            </div>
            <div className="segmented">
              {([5, 6] as const).map((n) => (
                <button
                  key={n}
                  className={progress.settings.studyDays === n ? "active" : ""}
                  onClick={() => setting("studyDays", n)}
                >
                  {n} Tage
                </button>
              ))}
            </div>
          </div>
          <div className="setting-row">
            <div>
              <strong>English explanations</strong>
              <span>Show short translations below German examples.</span>
            </div>
            <button
              className="switch-button"
              onClick={() =>
                setting("showEnglish", !progress.settings.showEnglish)
              }
            >
              <span
                className={
                  progress.settings.showEnglish ? "switch on" : "switch"
                }
              />
              {progress.settings.showEnglish ? "On" : "Off"}
            </button>
          </div>
          <div className="setting-row">
            <div>
              <strong>Sunday mode</strong>
              <span>Rest without guilt or use a light catch-up session.</span>
            </div>
            <div className="segmented">
              <button
                className={
                  progress.settings.sundayMode === "rest" ? "active" : ""
                }
                onClick={() => setting("sundayMode", "rest")}
              >
                Rest
              </button>
              <button
                className={
                  progress.settings.sundayMode === "catch-up" ? "active" : ""
                }
                onClick={() => setting("sundayMode", "catch-up")}
              >
                Catch-up
              </button>
            </div>
          </div>
        </section>
        <section className="card settings-card notification-settings">
          <h2>Benachrichtigungen</h2>
          <p>
            In-App-Erinnerungen funktionieren lokal. Browser-Benachrichtigungen
            sind optional und werden nie ohne Klick angefordert.
          </p>
          <ToggleRow
            title="In-App notifications"
            detail="Mitteilungen in der Glocke anzeigen."
            value={progress.settings.notifications.enabled}
            onChange={(value) => notificationSetting("enabled", value)}
          />
          <ToggleRow
            title="Daily reminder"
            detail="Zeigt bei geöffneter App einen Tageshinweis."
            value={progress.settings.notifications.dailyReminder}
            onChange={(value) => notificationSetting("dailyReminder", value)}
          />
          {progress.settings.notifications.dailyReminder && (
            <label className="inline-setting">
              Reminder time
              <input
                aria-label="Reminder time"
                type="time"
                value={progress.settings.notifications.reminderTime}
                onChange={(event) =>
                  notificationSetting("reminderTime", event.target.value)
                }
              />
            </label>
          )}
          <ToggleRow
            title="Weekly review"
            detail="Erinnert an schwierige Themen."
            value={progress.settings.notifications.weeklyReview}
            onChange={(value) => notificationSetting("weeklyReview", value)}
          />
          {progress.settings.notifications.weeklyReview && (
            <label className="inline-setting">
              Weekly review day
              <select
                aria-label="Weekly review day"
                value={progress.settings.notifications.weeklyReviewDay}
                onChange={(event) =>
                  notificationSetting(
                    "weeklyReviewDay",
                    Number(event.target.value),
                  )
                }
              >
                {[
                  "Sonntag",
                  "Montag",
                  "Dienstag",
                  "Mittwoch",
                  "Donnerstag",
                  "Freitag",
                  "Samstag",
                ].map((day, index) => (
                  <option value={index} key={day}>
                    {day}
                  </option>
                ))}
              </select>
            </label>
          )}
          <ToggleRow
            title="Needs Review reminders"
            detail="Meldet Themen unter 60% oder mit Unsicher."
            value={progress.settings.notifications.reviewReminders}
            onChange={(value) => notificationSetting("reviewReminders", value)}
          />
          <ToggleRow
            title="Milestones"
            detail="Informiert über erreichte Roadmap-Meilensteine."
            value={progress.settings.notifications.milestoneNotifications}
            onChange={(value) =>
              notificationSetting("milestoneNotifications", value)
            }
          />
          <div className="permission-row">
            <div>
              <strong>Browser status</strong>
              <span>
                {permission === "granted"
                  ? "Enabled"
                  : permission === "denied"
                    ? "Denied"
                    : permission === "default"
                      ? "Permission needed"
                      : "Not supported"}
              </span>
            </div>
            <button
              className="button ghost"
              disabled={permission === "denied"}
              onClick={requestNotifications}
            >
              {permission === "granted"
                ? "Test notification"
                : "Browser notifications aktivieren"}
            </button>
          </div>
          <small className="browser-limit">
            Ohne Push-Backend können Erinnerungen nicht zuverlässig erscheinen,
            wenn Website und Browser vollständig geschlossen sind.
          </small>
        </section>
        <section className="card settings-card">
          <h2>Daten & Fortschritt</h2>
          <p>
            Your progress stays on this device. Export a backup before changing
            browser or computer.
          </p>
          <div className="data-actions">
            <button
              className="button ghost"
              onClick={() => {
                exportProgress(progress);
                setMessage("Fortschritt wurde als JSON exportiert.");
              }}
            >
              <Download size={16} />
              Fortschritt exportieren
            </button>
            <button
              className="button ghost"
              onClick={() => input.current?.click()}
            >
              <Upload size={16} />
              Importieren
            </button>
            <input
              ref={input}
              type="file"
              accept="application/json"
              hidden
              onChange={async (e) => {
                if (e.target.files?.[0])
                  try {
                    const imported = await importProgress(e.target.files[0]);
                    update(() => imported);
                    setMessage("Fortschritt erfolgreich importiert.");
                  } catch (error) {
                    setMessage(
                      error instanceof Error
                        ? error.message
                        : "Diese Datei enthält keine gültigen Roadmap-Fortschrittsdaten.",
                    );
                  } finally {
                    e.target.value = "";
                  }
              }}
            />
          </div>
          <div className="danger-zone">
            <div>
              <strong>Fortschritt zurücksetzen</strong>
              <span>This cannot be undone unless you exported a backup.</span>
            </div>
            <button
              onClick={() => {
                if (confirm("Wirklich alle Fortschritte löschen?")) {
                  update(() => structuredClone(defaultProgress));
                  setMessage("Fortschritt wurde zurückgesetzt.");
                }
              }}
            >
              <Trash2 size={16} />
              Zurücksetzen
            </button>
          </div>
        </section>
        <section className="card settings-card">
          <h2>Hilfe</h2>
          <p>
            Öffne die vollständige Funktionshilfe oder zeige die Einführung
            erneut.
          </p>
          <div className="data-actions">
            <Link className="button ghost" href="/help">
              Help Center öffnen
            </Link>
            <button
              className="button ghost"
              onClick={() =>
                update((p) => ({ ...p, onboardingComplete: false }))
              }
            >
              Onboarding erneut anzeigen
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

function ToggleRow({
  title,
  detail,
  value,
  onChange,
}: {
  title: string;
  detail: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="setting-row">
      <div>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
      <button
        className="switch-button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
      >
        <span className={value ? "switch on" : "switch"} />
        {value ? "On" : "Off"}
      </button>
    </div>
  );
}
