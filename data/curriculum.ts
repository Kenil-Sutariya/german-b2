import type {
  GrammarTopic,
  Resource,
  RoadmapWeek,
  Skill,
  VocabularyTheme,
} from "@/types/learning";

const weekSeeds = [
  [
    "Satzbau & Foundations",
    "Build reliable German word order and connect everyday ideas.",
    ["Verbposition 2", "Satzklammer", "weil · dass · obwohl"],
  ],
  [
    "Fälle, Artikel & Adjektive",
    "Describe people, things and places precisely.",
    [
      "Nominativ · Akkusativ · Dativ",
      "Wechselpräpositionen",
      "Adjektivdeklination",
    ],
  ],
  [
    "Verben & Zeiten",
    "Tell stories, plans and experiences with control.",
    ["Perfekt · Präteritum", "Verben mit Präpositionen", "Infinitiv mit zu"],
  ],
  [
    "Nebensätze & Relativsätze",
    "Connect ideas naturally in longer sentences.",
    ["Relativpronomen", "temporale Nebensätze", "indirekte Fragen"],
  ],
  [
    "Passiv & Konjunktiv II",
    "Explain processes and speak politely or hypothetically.",
    ["Vorgangspassiv", "würde · hätte · wäre", "N-Deklination"],
  ],
  [
    "B1 Consolidation",
    "Check all four skills and choose targeted B1 review.",
    ["mixed grammar", "writing sample", "speaking check"],
  ],
  [
    "Longer answers",
    "Move beyond short answers with reasons and examples.",
    ["opinion structure", "examples", "paraphrasing"],
  ],
  [
    "Connector precision",
    "Choose connectors by meaning, not habit.",
    ["cause · result", "contrast", "word order"],
  ],
  [
    "B2 paragraph building",
    "Write organised, cohesive paragraphs.",
    ["topic sentences", "reference words", "register"],
  ],
  [
    "B2 Bridge Checkpoint",
    "Summarise and speak for two minutes with confidence.",
    ["summary", "mini presentation", "bridge review"],
  ],
  [
    "Contrast & concession",
    "Compare positions with nuanced contrast.",
    ["obwohl · dennoch", "während · wohingegen", "einerseits … andererseits"],
  ],
  [
    "Paired connectors",
    "Link balanced and alternative ideas.",
    ["sowohl … als auch", "weder … noch", "nicht nur … sondern auch"],
  ],
  [
    "Method & result",
    "Explain how actions lead to results.",
    ["indem", "dadurch, dass", "sodass"],
  ],
  [
    "Condition & time",
    "Express conditions and precise time relationships.",
    ["falls · sofern", "advanced temporal clauses", "je … desto"],
  ],
  [
    "Passive alternatives",
    "Describe processes in varied, natural ways.",
    ["sich lassen", "sein + zu", "haben + zu"],
  ],
  [
    "Konjunktiv advanced",
    "Discuss unreal past and distance claims politely.",
    ["unreal past", "polite distancing", "hypotheses"],
  ],
  [
    "Reported speech",
    "Report information neutrally.",
    ["Konjunktiv I", "indirect speech", "source distance"],
  ],
  [
    "Participle structures",
    "Make descriptions compact and precise.",
    ["Partizip I", "Partizip II", "extended attributes"],
  ],
  [
    "Nominalisation",
    "Recognise and produce formal written German.",
    ["Nominalisierung", "Verbalisierung", "formal register"],
  ],
  [
    "Funktionsverbgefüge",
    "Replace basic verbs with common B2 collocations.",
    [
      "eine Entscheidung treffen",
      "Einfluss nehmen",
      "Verantwortung übernehmen",
    ],
  ],
  [
    "Cohesion & reference",
    "Guide readers clearly through an argument.",
    ["reference words", "synonyms", "paragraph links"],
  ],
  [
    "Formal style",
    "Write clear workplace and administrative German.",
    ["formal email", "neutral tone", "sentence transformation"],
  ],
  [
    "Arbeit & Bewerbung",
    "Communicate professionally and present experience.",
    ["workplace", "job interview", "updates"],
  ],
  [
    "Studium & Wohnen",
    "Handle university, training and housing situations.",
    ["Weiterbildung", "rental issues", "formal requests"],
  ],
  [
    "Gesundheit & Behörden",
    "Manage appointments and explain problems clearly.",
    ["doctor", "Bürgeramt", "telephone"],
  ],
  [
    "Gesellschaft & Umwelt",
    "Discuss current issues with balanced arguments.",
    ["sustainability", "media", "mobility"],
  ],
  [
    "Four-skill training I",
    "Train reading and listening under time pressure.",
    ["main idea", "inference", "note-taking"],
  ],
  [
    "Four-skill training II",
    "Produce structured writing and spoken discussion.",
    ["opinion text", "presentation", "interaction"],
  ],
  [
    "B2 Exam Strategy",
    "Use time and checklists well on realistic tasks.",
    ["Goethe format", "timing", "proofreading"],
  ],
  [
    "Final B2 Checkpoint",
    "Assess balanced B2 readiness and plan the next month.",
    ["four-skill simulation", "strengths", "next 4 weeks"],
  ],
] as const;

const rhythms: [string, string, Skill][] = [
  ["Montag", "Grammatik + kurzer Output", "grammar"],
  ["Dienstag", "Wortschatz + Lesen", "reading"],
  ["Mittwoch", "Hören + Shadowing", "listening"],
  ["Donnerstag", "Grammatik + Schreiben", "writing"],
  ["Freitag", "Sprechen + Deutsch im echten Leben", "speaking"],
  ["Samstag", "Mixed review + Mini-Test", "grammar"],
];

export const roadmap: RoadmapWeek[] = weekSeeds.map((seed, index) => {
  const n = index + 1;
  const level = n <= 6 ? "B1" : n <= 10 ? "B1+" : "B2";
  const phase =
    n <= 6
      ? "B1 Revision"
      : n <= 10
        ? "B2 Foundation"
        : n <= 18
          ? "B2 Expansion"
          : n <= 26
            ? "Real-Life B2"
            : "Exam & Checkpoint";
  return {
    id: `week-${n}`,
    weekNumber: n,
    phase,
    level,
    title: seed[0],
    objective: seed[1],
    topics: [...seed[2]],
    checkpoint: [6, 10, 18, 26, 30].includes(n),
    days: rhythms.map(([label, focus, skill], d) => ({
      id: `w${n}-d${d + 1}`,
      label,
      focus,
      targetMinutes: d === 5 ? 50 : 52,
      tasks: [
        {
          id: `w${n}-d${d + 1}-a`,
          title: d === 0 ? "Aktive Wiederholung" : "Quick recall",
          minutes: 5,
          skill: "vocabulary",
          detail: `Review 8 useful words from ${seed[2][d % 3]}.`,
        },
        {
          id: `w${n}-d${d + 1}-b`,
          title: seed[2][d % 3],
          minutes: 18,
          skill,
          detail: `Learn one focused idea, then make two examples from your daily life.`,
        },
        {
          id: `w${n}-d${d + 1}-c`,
          title: d % 2 ? "Guided input practice" : "Focused exercises",
          minutes: 14,
          skill: d % 2 ? "reading" : "grammar",
          detail:
            "Complete a short official exercise and note one useful pattern.",
          resourceId: n <= 10 ? "klett-online" : "sicher",
        },
        {
          id: `w${n}-d${d + 1}-d`,
          title: d === 3 ? "Write 80–120 words" : "Speak for 90 seconds",
          minutes: 10,
          skill: d === 3 ? "writing" : "speaking",
          detail: `Use ${seed[2][d % 3]} to explain a real situation.`,
        },
        {
          id: `w${n}-d${d + 1}-e`,
          title: "Selbstcheck",
          minutes: 5,
          skill: "grammar",
          detail: "Mark confidence and save one correction.",
        },
      ],
    })),
  };
});

const grammarSeeds: [string, string, string, string, string][] = [
  [
    "wortstellung-hauptsatz",
    "Wortstellung im Hauptsatz",
    "B1",
    "Sentence structure",
    "The conjugated verb normally stands in position 2.",
  ],
  [
    "satzklammer",
    "Satzklammer",
    "B1",
    "Sentence structure",
    "Split verb forms frame the middle field.",
  ],
  [
    "nebensaetze",
    "Nebensätze",
    "B1",
    "Sentence structure",
    "A subordinating connector sends the conjugated verb to the end.",
  ],
  [
    "weil-dass-obwohl-wenn",
    "weil · dass · obwohl · wenn",
    "B1",
    "Connectors",
    "Choose the connector by meaning and keep verb-final order.",
  ],
  [
    "deshalb-trotzdem",
    "deshalb · trotzdem",
    "B1",
    "Connectors",
    "Adverbial connectors take position 1 and trigger inversion.",
  ],
  [
    "faelle",
    "Die vier Fälle",
    "B1",
    "Cases",
    "Case shows the role of a noun phrase in the sentence.",
  ],
  [
    "wechselpraepositionen",
    "Wechselpräpositionen",
    "B1",
    "Cases",
    "Use Akkusativ for direction and Dativ for location.",
  ],
  [
    "adjektivdeklination",
    "Adjektivdeklination",
    "B1",
    "Cases",
    "The adjective ending signals gender, case and article information.",
  ],
  [
    "komparativ-superlativ",
    "Komparativ & Superlativ",
    "B1",
    "Adjectives",
    "Compare with -er and express the highest degree with am …-sten.",
  ],
  [
    "perfekt",
    "Perfekt",
    "B1",
    "Verbs",
    "Use haben/sein plus Partizip II for most spoken past narration.",
  ],
  [
    "praeteritum",
    "Präteritum",
    "B1",
    "Verbs",
    "Common in writing and with sein, haben and modal verbs.",
  ],
  [
    "plusquamperfekt",
    "Plusquamperfekt",
    "B1",
    "Verbs",
    "Show that one past action happened before another.",
  ],
  [
    "futur-i",
    "Futur I",
    "B1",
    "Verbs",
    "Use werden + infinitive for predictions or emphatic plans.",
  ],
  [
    "modalverben",
    "Modalverben",
    "B1",
    "Verbs",
    "Express ability, necessity, permission and intention.",
  ],
  [
    "reflexive-verben",
    "Reflexive Verben",
    "B1",
    "Verbs",
    "Match the reflexive pronoun to the subject and required case.",
  ],
  [
    "verben-mit-praepositionen",
    "Verben mit Präpositionen",
    "B1",
    "Verbs",
    "Learn verb, preposition and case as one unit.",
  ],
  [
    "da-wo-komposita",
    "da-/wo-Komposita",
    "B1",
    "Verbs",
    "Use wo(r)- for questions and da(r)- to refer to things or ideas.",
  ],
  [
    "relativsaetze",
    "Relativsätze",
    "B1",
    "Sentence structure",
    "Add information with a relative pronoun matching case and antecedent.",
  ],
  [
    "indirekte-fragen",
    "Indirekte Fragen",
    "B1",
    "Sentence structure",
    "Turn a question into a polite verb-final clause.",
  ],
  [
    "infinitiv-mit-zu",
    "Infinitiv mit zu",
    "B1",
    "Verbs",
    "Use zu + infinitive when subjects or meanings align.",
  ],
  [
    "um-zu",
    "um … zu",
    "B1",
    "Connectors",
    "Express purpose when both clauses have the same subject.",
  ],
  [
    "passiv",
    "Vorgangspassiv",
    "B1",
    "Passive",
    "Focus on an action with werden + Partizip II.",
  ],
  [
    "konjunktiv-ii",
    "Konjunktiv II",
    "B1",
    "Konjunktiv",
    "Make requests, wishes and hypotheses polite or unreal.",
  ],
  [
    "n-deklination",
    "N-Deklination",
    "B1",
    "Cases",
    "Certain masculine nouns take -(e)n outside Nominativ singular.",
  ],
  [
    "temporale-nebensaetze",
    "Temporale Nebensätze",
    "B1",
    "Connectors",
    "Relate events with als, wenn, bevor, nachdem and während.",
  ],
  [
    "advanced-connectors",
    "Advanced connectors",
    "B2",
    "Connectors",
    "Express logical relations with precise two-part and adverbial links.",
  ],
  [
    "relativ-mit-praeposition",
    "Relativsätze mit Präpositionen",
    "B2",
    "Sentence structure",
    "Place the required preposition before the relative pronoun.",
  ],
  [
    "je-desto",
    "je … desto/umso",
    "B2",
    "Connectors",
    "Show two developments changing together.",
  ],
  [
    "indem",
    "indem",
    "B2",
    "Connectors",
    "Explain the method used to achieve something.",
  ],
  [
    "dadurch-dass",
    "dadurch, dass",
    "B2",
    "Connectors",
    "Highlight a means or cause across two clauses.",
  ],
  [
    "ohne-statt-dass",
    "ohne/statt dass",
    "B2",
    "Connectors",
    "Express missing or alternative action with different subjects.",
  ],
  [
    "sodass",
    "sodass · so … dass",
    "B2",
    "Connectors",
    "Express a consequence or an intensified result.",
  ],
  [
    "falls-sofern",
    "falls · sofern",
    "B2",
    "Connectors",
    "State a possible or restricted condition.",
  ],
  [
    "passiv-alternativen",
    "Passivalternativen",
    "B2",
    "Passive",
    "Use sich lassen, sein + zu or -bar forms to vary style.",
  ],
  [
    "zustandspassiv",
    "Zustandspassiv",
    "B2",
    "Passive",
    "Describe the result of an action with sein + Partizip II.",
  ],
  [
    "konjunktiv-ii-vergangenheit",
    "Konjunktiv II Vergangenheit",
    "B2",
    "Konjunktiv",
    "Describe unreal past outcomes with hätte/wäre + Partizip II.",
  ],
  [
    "konjunktiv-i",
    "Konjunktiv I & indirekte Rede",
    "B2",
    "Konjunktiv",
    "Report another person’s words with neutral distance.",
  ],
  [
    "partizipien-als-adjektive",
    "Partizip I & II als Adjektive",
    "B2",
    "Advanced structures",
    "Compress clauses into precise attributes.",
  ],
  [
    "nominalisierung",
    "Nominalisierung",
    "B2",
    "Formal style",
    "Turn actions and qualities into nouns for formal texts.",
  ],
  [
    "verbalisierung",
    "Verbalisierung",
    "B2",
    "Formal style",
    "Turn dense noun phrases into clearer verbal clauses.",
  ],
  [
    "funktionsverbgefuege",
    "Funktionsverbgefüge",
    "B2",
    "Formal style",
    "Use established noun–verb combinations in formal communication.",
  ],
  [
    "advanced-word-order",
    "Advanced word order",
    "B2",
    "Sentence structure",
    "Control multiple clauses, pronouns and information order.",
  ],
  [
    "reference-words",
    "Cohesive reference words",
    "B2",
    "Formal style",
    "Link claims without repeating the same nouns and verbs.",
  ],
];

export const grammarTopics: GrammarTopic[] = grammarSeeds.map(
  ([slug, title, level, category, description], i) => ({
    slug,
    title,
    level: level as "B1" | "B2",
    category,
    description,
    rule:
      i === 26
        ? "Preposition + relative pronoun; the required preposition determines the case."
        : description,
    examples:
      i === 26
        ? [
            [
              "Das ist die Stelle, **auf die** ich mich beworben habe.",
              "That is the position I applied for.",
            ],
            [
              "Die Kollegin, **mit der** ich telefoniere, hilft mir.",
              "The colleague I’m speaking with helps me.",
            ],
          ]
        : [
            [
              `Ich übe heute, **weil ich sicherer sprechen möchte**.`,
              `The target structure connects the idea naturally.`,
            ],
            [
              `Im Büro **wende ich die Regel direkt an**.`,
              `A practical example in everyday context.`,
            ],
          ],
    mistakes: [
      "Do not copy English word order automatically.",
      "Check the position of the conjugated verb before finishing.",
    ],
    memory:
      i === 26
        ? "The preposition travels with the relative pronoun."
        : "Find the conjugated verb first; then check its position.",
    resources:
      level === "B1"
        ? ["klett-online", "intensivtrainer", "deutsch-ueben"]
        : ["sicher", "vielfalt-learn", "deutsch-ueben"],
  }),
);

export const resources: Resource[] = [
  {
    id: "klett-overview",
    title: "Netzwerk neu",
    provider: "Klett",
    level: ["B1"],
    skills: ["grammar", "vocabulary", "reading", "listening"],
    type: "Course series",
    url: "https://www.klett-sprachen.de/netzwerk-neu/r-1/605",
    access: "book-or-license",
    description: "The preferred chapter-based backbone for B1 revision.",
    recommendedUse:
      "Follow the relevant B1 chapter and use its official media.",
  },
  {
    id: "klett-online",
    title: "Netzwerk neu Online-Übungen",
    provider: "Klett",
    level: ["B1"],
    skills: ["grammar", "vocabulary"],
    type: "Interactive exercises",
    url: "https://einstufungstests.klett-sprachen.de/eks/netzwerk-neu/",
    access: "free",
    description: "Short official chapter exercises for grammar and vocabulary.",
    recommendedUse: "10–15 minutes after learning a topic.",
  },
  {
    id: "intensivtrainer",
    title: "Netzwerk neu B1 Intensivtrainer",
    provider: "Klett",
    level: ["B1"],
    skills: ["grammar", "vocabulary", "writing"],
    type: "Practice book",
    url: "https://www.klett-sprachen.de/netzwerk-neu-b1/t-1/9783126071741",
    access: "book-or-license",
    description:
      "Structured reinforcement for B1 grammar, vocabulary and Redemittel.",
    recommendedUse: "Choose one focused exercise set, not a whole chapter.",
  },
  {
    id: "schritte",
    title: "Schritte Plus Neu B1 Übungen",
    provider: "Hueber",
    level: ["B1"],
    skills: ["grammar", "vocabulary"],
    type: "Online exercises",
    url: "https://legacy.hueber.de/exercises/530-25142/",
    access: "free",
    description: "Additional official B1 practice by Hueber.",
    recommendedUse: "Use when a weak topic needs a second explanation.",
  },
  {
    id: "deutsch-ueben",
    title: "Deutsch üben",
    provider: "Hueber",
    level: ["B1", "B2"],
    skills: ["grammar", "vocabulary"],
    type: "Practice series",
    url: "https://www.hueber.de/reihe/deutsch-ueben",
    access: "book-or-license",
    description: "Targeted grammar and vocabulary reinforcement by level.",
    recommendedUse: "Pick one precise weakness for a 15-minute practice block.",
  },
  {
    id: "lesen-schreiben",
    title: "Deutsch üben: Lesen & Schreiben",
    provider: "Hueber",
    level: ["B1", "B2"],
    skills: ["reading", "writing"],
    type: "Practice series",
    url: "https://www.hueber.de/reihe/deutsch-ueben-lesen-schreiben",
    access: "book-or-license",
    description: "Focused reading and writing practice.",
    recommendedUse: "Use on Tuesday or Thursday study blocks.",
  },
  {
    id: "sicher",
    title: "Sicher! Lernmaterialien",
    provider: "Hueber",
    level: ["B1+", "B2"],
    skills: ["grammar", "vocabulary", "reading", "listening"],
    type: "Learner resources",
    url: "https://www.hueber.de/reihe/sicher/lernen",
    access: "free",
    description: "Official learner resources for the B1+ to B2 bridge.",
    recommendedUse: "Use for one integrated B2 lesson per week.",
  },
  {
    id: "vielfalt-learn",
    title: "Vielfalt Lernmaterialien",
    provider: "Hueber",
    level: ["B2"],
    skills: [
      "grammar",
      "vocabulary",
      "reading",
      "listening",
      "writing",
      "speaking",
    ],
    type: "Learner resources",
    url: "https://www.hueber.de/reihe/vielfalt/lernen",
    access: "free",
    description: "Integrated upper-intermediate practice and exam formats.",
    recommendedUse: "Use during B2 expansion and four-skill weeks.",
  },
  {
    id: "vielfalt",
    title: "Vielfalt B2",
    provider: "Hueber",
    level: ["B2"],
    skills: ["reading", "listening", "writing", "speaking"],
    type: "Course series",
    url: "https://www.hueber.de/reihe/vielfalt",
    access: "book-or-license",
    description: "A complete B2 course progression with integrated skills.",
    recommendedUse: "Use as a structured B2 course alongside this roadmap.",
  },
  {
    id: "goethe-b1",
    title: "Goethe-Zertifikat B1 Prüfungstraining",
    provider: "Goethe",
    level: ["B1"],
    skills: ["reading", "listening", "writing", "speaking"],
    type: "Official exam practice",
    url: "https://www.goethe.de/de/spr/prf/ueb/pb1.html",
    access: "free",
    description: "Official B1 sample tasks across all four skills.",
    recommendedUse: "Use in week 6 as a checkpoint, not daily drills.",
  },
  {
    id: "goethe-b2",
    title: "Goethe-Zertifikat B2 Prüfungstraining",
    provider: "Goethe",
    level: ["B2"],
    skills: ["reading", "listening", "writing", "speaking"],
    type: "Official exam practice",
    url: "https://www.goethe.de/de/spr/prf/ueb/pb2.html",
    access: "free",
    description: "Official B2 practice materials and realistic task formats.",
    recommendedUse: "Use in weeks 29–30 under timed conditions.",
  },
];

export const vocabularyThemes: VocabularyTheme[] = [
  [
    "arbeit",
    "Arbeit & Beruf",
    "B2",
    "briefcase",
    [
      [
        "die Verantwortung, -en",
        "responsibility",
        "Ich übernehme gern Verantwortung für das Projekt.",
      ],
      [
        "eine Entscheidung treffen",
        "make a decision",
        "Wir müssen heute eine Entscheidung treffen.",
      ],
      [
        "sich bewerben um + Akk.",
        "apply for",
        "Sie bewirbt sich um eine Stelle.",
      ],
    ],
  ],
  [
    "wohnen",
    "Wohnen",
    "B1",
    "home",
    [
      [
        "der Mietvertrag, -verträge",
        "rental contract",
        "Ich habe den Mietvertrag genau gelesen.",
      ],
      [
        "die Nebenkosten (Pl.)",
        "additional costs",
        "Sind die Nebenkosten in der Miete enthalten?",
      ],
      [
        "sich kümmern um + Akk.",
        "take care of",
        "Der Hausmeister kümmert sich um die Heizung.",
      ],
    ],
  ],
  [
    "gesundheit",
    "Gesundheit & Alltag",
    "B1",
    "heart",
    [
      [
        "die Beschwerden (Pl.)",
        "symptoms",
        "Seit gestern habe ich starke Beschwerden.",
      ],
      [
        "einen Termin vereinbaren",
        "make an appointment",
        "Ich möchte einen Termin vereinbaren.",
      ],
      ["leiden an + Dat.", "suffer from", "Er leidet an einer Allergie."],
    ],
  ],
  [
    "digital",
    "Medien & Digitalisierung",
    "B2",
    "monitor",
    [
      [
        "der Datenschutz",
        "data protection",
        "Datenschutz spielt im Unternehmen eine wichtige Rolle.",
      ],
      [
        "zur Verfügung stehen",
        "be available",
        "Die Daten stehen online zur Verfügung.",
      ],
      [
        "zugreifen auf + Akk.",
        "access",
        "Nur Mitarbeitende können auf die Datei zugreifen.",
      ],
    ],
  ],
  [
    "umwelt",
    "Umwelt & Nachhaltigkeit",
    "B2",
    "leaf",
    [
      ["die Maßnahme, -n", "measure", "Die Stadt ergreift neue Maßnahmen."],
      ["nachhaltig", "sustainable", "Wir brauchen eine nachhaltige Lösung."],
      [
        "beitragen zu + Dat.",
        "contribute to",
        "Jeder kann zum Klimaschutz beitragen.",
      ],
    ],
  ],
  [
    "mobilitaet",
    "Mobilität & Reisen",
    "B1",
    "train",
    [
      [
        "die Verspätung, -en",
        "delay",
        "Wegen einer Verspätung verpasse ich den Anschluss.",
      ],
      [
        "der Anschluss, Anschlüsse",
        "connection",
        "Wann fährt der nächste Anschluss?",
      ],
      ["umsteigen", "change trains", "In Köln müssen Sie umsteigen."],
    ],
  ],
  [
    "gesellschaft",
    "Gesellschaft",
    "B2",
    "users",
    [
      [
        "die Entwicklung, -en",
        "development",
        "Diese Entwicklung betrifft viele Menschen.",
      ],
      [
        "Einfluss nehmen auf + Akk.",
        "influence",
        "Medien nehmen Einfluss auf die Debatte.",
      ],
      [
        "berücksichtigen",
        "consider",
        "Wir sollten verschiedene Perspektiven berücksichtigen.",
      ],
    ],
  ],
  [
    "geld",
    "Konsum & Geld",
    "B1",
    "wallet",
    [
      [
        "die Ausgabe, -n",
        "expense",
        "Meine monatlichen Ausgaben sind gestiegen.",
      ],
      ["sich leisten", "afford", "Das kann ich mir momentan nicht leisten."],
      ["Wert legen auf + Akk.", "value", "Ich lege Wert auf gute Qualität."],
    ],
  ],
  [
    "behoerden",
    "Behörden & Termine",
    "B2",
    "building",
    [
      [
        "der Antrag, Anträge",
        "application",
        "Den Antrag können Sie online stellen.",
      ],
      [
        "die Unterlage, -n",
        "document",
        "Bitte bringen Sie alle Unterlagen mit.",
      ],
      [
        "zuständig sein für + Akk.",
        "be responsible for",
        "Welche Stelle ist dafür zuständig?",
      ],
    ],
  ],
  [
    "telefon",
    "Telefonieren",
    "B1+",
    "phone",
    [
      [
        "verbinden mit + Dat.",
        "connect to",
        "Könnten Sie mich mit Frau Klein verbinden?",
      ],
      [
        "die Rückfrage, -n",
        "follow-up question",
        "Ich habe noch eine kurze Rückfrage.",
      ],
      [
        "etwas ausrichten",
        "pass on a message",
        "Kann ich ihm etwas ausrichten?",
      ],
    ],
  ],
  [
    "konflikte",
    "Konflikte & Lösungen",
    "B2",
    "message",
    [
      [
        "der Kompromiss, -e",
        "compromise",
        "Wir haben einen fairen Kompromiss gefunden.",
      ],
      [
        "Missverständnisse klären",
        "clear up misunderstandings",
        "Wir sollten das Missverständnis klären.",
      ],
      [
        "entgegenkommen",
        "accommodate",
        "Der Vermieter ist uns entgegengekommen.",
      ],
    ],
  ],
  [
    "diskussion",
    "Meinungen & Diskussionen",
    "B2",
    "mic",
    [
      [
        "die Auffassung, -en",
        "view",
        "Ich bin der Auffassung, dass wir handeln müssen.",
      ],
      [
        "in Betracht ziehen",
        "consider",
        "Wir sollten beide Optionen in Betracht ziehen.",
      ],
      ["zustimmen + Dat.", "agree with", "Diesem Argument kann ich zustimmen."],
    ],
  ],
].map(([id, title, level, icon, items]) => ({
  id,
  title,
  level,
  icon,
  items: (items as string[][]).map(([term, meaning, example]) => ({
    term,
    meaning,
    example,
  })),
})) as VocabularyTheme[];

export const redemittel = {
  Meinung: [
    "Meiner Ansicht nach …",
    "Ich bin der Auffassung, dass …",
    "Für mich steht fest, dass …",
  ],
  Begründen: [
    "Das liegt vor allem daran, dass …",
    "Ein wesentlicher Grund dafür ist …",
    "Dies lässt sich dadurch erklären, dass …",
  ],
  Diskutieren: [
    "Einerseits …, andererseits …",
    "Dem kann ich nur teilweise zustimmen.",
    "Darf ich kurz nachfragen, was Sie damit meinen?",
  ],
  Arbeitsplatz: [
    "Ich gebe Ihnen bis Freitag ein Update.",
    "Könnten wir die Prioritäten kurz abstimmen?",
    "Dabei ist leider ein Problem aufgetreten.",
  ],
  Telefon: [
    "Könnten Sie mich bitte mit … verbinden?",
    "Könnten Sie das bitte wiederholen?",
    "Vielen Dank für Ihren Rückruf.",
  ],
  Formal: [
    "Ich wende mich an Sie, weil …",
    "Für eine kurze Rückmeldung wäre ich Ihnen dankbar.",
    "Mit freundlichen Grüßen",
  ],
};
