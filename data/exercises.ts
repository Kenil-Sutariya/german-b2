import { grammarTopics, vocabularyThemes } from "@/data/curriculum";
import type {
  Exercise,
  ExerciseDifficulty,
  ExerciseType,
  Level,
} from "@/types/learning";

type Cloze = [
  prompt: string,
  answer: string,
  wrongOne: string,
  wrongTwo: string,
];
type PracticeSeed = { first: Cloze; second: Cloze; principle: string };

const seeds: Record<string, PracticeSeed> = {
  "wortstellung-hauptsatz": {
    first: [
      "Heute ___ ich im Homeoffice.",
      "arbeite",
      "ich arbeite",
      "arbeiten",
    ],
    second: [
      "Am Abend ___ wir einen Deutschkurs.",
      "besuchen",
      "wir besuchen",
      "besucht",
    ],
    principle:
      "Im deutschen Hauptsatz steht das konjugierte Verb an Position 2.",
  },
  satzklammer: {
    first: [
      "Ich ___ meine Kollegin später ___.",
      "rufe … an",
      "anrufe … —",
      "rufe an … —",
    ],
    second: [
      "Wir ___ den Termin leider ___.",
      "müssen … verschieben",
      "verschieben … müssen",
      "müssen verschieben … —",
    ],
    principle:
      "Die konjugierte Verbform steht an Position 2; der zweite Verbteil steht am Satzende.",
  },
  nebensaetze: {
    first: [
      "Ich bleibe zu Hause, weil ich krank ___.",
      "bin",
      "ich bin",
      "sein",
    ],
    second: [
      "Sie sagt, dass sie morgen später ___.",
      "kommt",
      "sie kommt",
      "kommen",
    ],
    principle: "In einem Nebensatz steht das konjugierte Verb am Ende.",
  },
  "weil-dass-obwohl-wenn": {
    first: ["Ich lerne weiter, ___ ich müde bin.", "obwohl", "weil", "dass"],
    second: ["Ruf mich an, ___ du angekommen bist.", "wenn", "dass", "obwohl"],
    principle:
      "Der Konnektor bestimmt die Bedeutung; bei diesen Subjunktionen steht das Verb am Ende.",
  },
  "deshalb-trotzdem": {
    first: ["Es regnet. ___ gehe ich spazieren.", "Trotzdem", "Obwohl", "Weil"],
    second: [
      "Ich bin krank. ___ bleibe ich zu Hause.",
      "Deshalb",
      "Trotzdem",
      "Denn",
    ],
    principle:
      "Deshalb und trotzdem besetzen Position 1; direkt danach folgt das konjugierte Verb.",
  },
  faelle: {
    first: ["Ich helfe ___ neuen Kollegen.", "dem", "den", "der"],
    second: ["Sie sieht ___ neuen Kollegen.", "den", "dem", "des"],
    principle:
      "Der Kasus richtet sich nach Verb, Präposition und Funktion im Satz.",
  },
  wechselpraepositionen: {
    first: ["Das Bild hängt ___ der Wand.", "an", "auf die", "in den"],
    second: ["Ich hänge das Bild ___ die Wand.", "an", "an der", "bei der"],
    principle:
      "Ort ohne Richtungswechsel verlangt Dativ; Bewegung zu einem Ziel verlangt Akkusativ.",
  },
  adjektivdeklination: {
    first: ["Ich spreche mit einem ___ Kollegen.", "netten", "nette", "netter"],
    second: ["Das ist eine ___ Idee.", "gute", "guten", "guter"],
    principle:
      "Artikel, Genus und Kasus bestimmen gemeinsam die Adjektivendung.",
  },
  "komparativ-superlativ": {
    first: [
      "Der Zug ist ___ als der Bus.",
      "schneller",
      "am schnellsten",
      "schnell",
    ],
    second: [
      "Diese Verbindung ist am ___.",
      "günstigsten",
      "günstiger",
      "günstigste",
    ],
    principle:
      "Der Komparativ steht meist mit als; der adverbiale Superlativ wird mit am …-sten gebildet.",
  },
  perfekt: {
    first: ["Ich ___ gestern lange gearbeitet.", "habe", "bin", "hatte"],
    second: ["Wir ___ nach Berlin gefahren.", "sind", "haben", "werden"],
    principle:
      "Das Perfekt besteht aus haben oder sein und dem Partizip II am Satzende.",
  },
  praeteritum: {
    first: [
      "Früher ___ ich jeden Tag mit dem Rad.",
      "fuhr",
      "bin gefahren",
      "fahre",
    ],
    second: ["Gestern ___ ich keine Zeit.", "hatte", "habe", "hätte"],
    principle:
      "Das Präteritum ist typisch für schriftliche Erzählungen sowie sein, haben und Modalverben.",
  },
  plusquamperfekt: {
    first: [
      "Nachdem ich gegessen ___, ging ich los.",
      "hatte",
      "habe",
      "hätte",
    ],
    second: [
      "Sie war müde, weil sie schlecht geschlafen ___.",
      "hatte",
      "hat",
      "würde",
    ],
    principle:
      "Das Plusquamperfekt zeigt eine Handlung, die vor einer anderen vergangenen Handlung lag.",
  },
  "futur-i": {
    first: ["Morgen ___ ich früher anfangen.", "werde", "würde", "bin"],
    second: ["Es ___ wahrscheinlich regnen.", "wird", "ist", "hat"],
    principle: "Futur I besteht aus werden und dem Infinitiv am Satzende.",
  },
  modalverben: {
    first: [
      "Ich ___ den Antrag heute abgeben.",
      "muss",
      "habe",
      "werde müssen",
    ],
    second: ["Hier ___ man nicht parken.", "darf", "will", "kannst"],
    principle:
      "Das Modalverb wird konjugiert; der Vollverb steht als Infinitiv am Ende.",
  },
  "reflexive-verben": {
    first: ["Ich interessiere ___ für Technik.", "mich", "mir", "sich"],
    second: ["Wir freuen ___ auf das Wochenende.", "uns", "euch", "sich"],
    principle:
      "Das Reflexivpronomen stimmt mit dem Subjekt überein und steht je nach Verb im Akkusativ oder Dativ.",
  },
  "verben-mit-praepositionen": {
    first: ["Ich warte ___ den Bus.", "auf", "an", "mit"],
    second: ["Sie nimmt ___ dem Kurs teil.", "an", "auf", "für"],
    principle: "Verb, Präposition und Kasus werden als feste Einheit gelernt.",
  },
  "da-wo-komposita": {
    first: ["___ wartest du? – Auf den Bus.", "Worauf", "Darauf", "Auf was"],
    second: ["Ich freue mich ___, dich zu sehen.", "darauf", "worauf", "daran"],
    principle:
      "Wo(r)- fragt nach Dingen; da(r)- verweist auf Dinge oder ganze Aussagen.",
  },
  relativsaetze: {
    first: ["Das ist der Kollege, ___ mir geholfen hat.", "der", "den", "dem"],
    second: [
      "Das ist die Aufgabe, ___ ich erledigt habe.",
      "die",
      "der",
      "den",
    ],
    principle:
      "Genus und Numerus kommen vom Bezugswort; der Kasus ergibt sich aus der Funktion im Relativsatz.",
  },
  "indirekte-fragen": {
    first: [
      "Können Sie mir sagen, wann der Zug ___.",
      "fährt",
      "der Zug fährt",
      "fahren",
    ],
    second: ["Ich weiß nicht, ___ sie heute kommt.", "ob", "wenn", "dass"],
    principle:
      "Indirekte Fragen sind Nebensätze: Das konjugierte Verb steht am Ende.",
  },
  "infinitiv-mit-zu": {
    first: [
      "Ich versuche, früher ___.",
      "anzufangen",
      "zu anfangen",
      "anfangen zu",
    ],
    second: [
      "Er hat vergessen, die Datei ___.",
      "zu speichern",
      "speichern zu",
      "gespeichert",
    ],
    principle:
      "Zu steht vor dem Infinitiv; bei trennbaren Verben steht es zwischen Präfix und Stamm.",
  },
  "um-zu": {
    first: [
      "Ich lerne Deutsch, ___ in Deutschland zu arbeiten.",
      "um",
      "damit",
      "weil",
    ],
    second: [
      "Sie fährt früher los, um den Zug ___.",
      "zu erreichen",
      "erreichen zu",
      "erreicht",
    ],
    principle:
      "Um … zu drückt ein Ziel aus, wenn Haupt- und Infinitivsatz dasselbe Subjekt haben.",
  },
  passiv: {
    first: ["Der Antrag ___ heute bearbeitet.", "wird", "ist geworden", "hat"],
    second: ["Die Dokumente müssen geprüft ___.", "werden", "sein", "worden"],
    principle:
      "Das Vorgangspassiv wird mit werden und Partizip II gebildet; bei Modalverben steht werden am Ende.",
  },
  "konjunktiv-ii": {
    first: [
      "Ich ___ gern einen Termin vereinbaren.",
      "würde",
      "werde",
      "wurde",
    ],
    second: [
      "An deiner Stelle ___ ich früher anfangen.",
      "würde",
      "werde",
      "habe",
    ],
    principle:
      "Konjunktiv II formuliert Wünsche, Höflichkeit, Ratschläge und irreale Situationen.",
  },
  "n-deklination": {
    first: ["Ich spreche mit dem ___.", "Kollegen", "Kollege", "Kolleges"],
    second: ["Wir suchen einen ___.", "Experten", "Experte", "Expertes"],
    principle:
      "Viele maskuline Nomen erhalten außerhalb des Nominativ Singular die Endung -(e)n.",
  },
  "temporale-nebensaetze": {
    first: [
      "___ ich klein war, wohnte ich in Surat.",
      "Als",
      "Wenn",
      "Nachdem",
    ],
    second: [
      "Nachdem ich gegessen hatte, ___ ich los.",
      "ging",
      "ich ging",
      "gehe",
    ],
    principle:
      "Als steht für einmalige Vergangenheit; nachdem zeigt Vorzeitigkeit und verlangt Verbendstellung im Nebensatz.",
  },
  "advanced-connectors": {
    first: [
      "Die Lösung ist teuer; ___ ist sie langfristig sinnvoll.",
      "dennoch",
      "obwohl",
      "indem",
    ],
    second: [
      "___ die Kosten steigen, bleibt das Projekt wichtig.",
      "Obgleich",
      "Dennoch",
      "Dadurch",
    ],
    principle:
      "B2-Konnektoren drücken präzise logische Beziehungen aus und steuern die Wortstellung.",
  },
  "relativ-mit-praeposition": {
    first: [
      "Das ist die Stelle, ___ ich mich beworben habe.",
      "auf die",
      "für die",
      "an der",
    ],
    second: [
      "Die Kollegin, ___ ich telefoniere, hilft mir.",
      "mit der",
      "für die",
      "an die",
    ],
    principle:
      "Die vom Verb verlangte Präposition steht vor dem Relativpronomen und bestimmt dessen Kasus.",
  },
  "je-desto": {
    first: [
      "Je mehr ich übe, ___ sicherer spreche ich.",
      "desto",
      "obwohl",
      "sodass",
    ],
    second: [
      "Je früher wir starten, ___ schneller sind wir fertig.",
      "umso",
      "damit",
      "dennoch",
    ],
    principle:
      "Je leitet einen Nebensatz ein; desto oder umso leitet den Hauptsatz mit Inversion ein.",
  },
  indem: {
    first: [
      "Man verbessert die Aussprache, ___ man laut nachspricht.",
      "indem",
      "sodass",
      "obwohl",
    ],
    second: [
      "Sie spart Zeit, indem sie Termine online ___.",
      "bucht",
      "sie bucht",
      "buchen",
    ],
    principle:
      "Indem nennt die Methode oder Art und Weise; das Verb steht am Ende des Nebensatzes.",
  },
  "dadurch-dass": {
    first: [
      "Er lernt schneller dadurch, ___ er täglich wiederholt.",
      "dass",
      "weil",
      "indem",
    ],
    second: [
      "Dadurch, dass wir digital arbeiten, ___ wir Papier.",
      "sparen",
      "wir sparen",
      "gespart",
    ],
    principle:
      "Dadurch, dass hebt das Mittel oder die Ursache hervor und bildet einen Nebensatz.",
  },
  "ohne-statt-dass": {
    first: [
      "Er ging, ohne dass er sich ___.",
      "verabschiedete",
      "er verabschiedete",
      "verabschieden",
    ],
    second: [
      "Statt dass du nur liest, ___ du auch sprechen.",
      "solltest",
      "du solltest",
      "sollen",
    ],
    principle:
      "Ohne dass und statt dass verbinden Handlungen mit unterschiedlichen Subjekten; das Nebensatzverb steht am Ende.",
  },
  sodass: {
    first: [
      "Der Zug hatte Verspätung, ___ ich den Anschluss verpasste.",
      "sodass",
      "obwohl",
      "falls",
    ],
    second: [
      "Es war so laut, dass ich nichts ___.",
      "verstand",
      "ich verstand",
      "verstehen",
    ],
    principle: "Sodass beziehungsweise so … dass drückt eine Folge aus.",
  },
  "falls-sofern": {
    first: [
      "___ Sie Fragen haben, rufen Sie uns an.",
      "Falls",
      "Obwohl",
      "Indem",
    ],
    second: [
      "Die Teilnahme ist möglich, ___ Plätze frei sind.",
      "sofern",
      "dennoch",
      "sodass",
    ],
    principle:
      "Falls formuliert eine mögliche Bedingung; sofern betont zusätzlich eine Einschränkung.",
  },
  "passiv-alternativen": {
    first: [
      "Das Problem ___ leicht lösen.",
      "lässt sich",
      "wird sich",
      "hat zu",
    ],
    second: [
      "Der Antrag ist bis Freitag ___.",
      "zu bearbeiten",
      "bearbeitet werden",
      "bearbeiten",
    ],
    principle:
      "Sich lassen + Infinitiv und sein + zu + Infinitiv können modale Passivbedeutungen ausdrücken.",
  },
  zustandspassiv: {
    first: ["Die Tür ___ geschlossen.", "ist", "wird", "hat"],
    second: [
      "Nach der Reparatur waren alle Geräte ___.",
      "geprüft",
      "prüfen",
      "geworden",
    ],
    principle:
      "Das Zustandspassiv mit sein + Partizip II beschreibt das Ergebnis einer Handlung.",
  },
  "konjunktiv-ii-vergangenheit": {
    first: [
      "Wenn ich mehr Zeit gehabt hätte, ___ ich mitgekommen.",
      "wäre",
      "würde",
      "bin",
    ],
    second: [
      "Ich hätte den Termin nicht ___.",
      "vergessen",
      "vergesst",
      "vergessen würde",
    ],
    principle:
      "Irreale Vergangenheit wird mit hätte oder wäre + Partizip II gebildet.",
  },
  "konjunktiv-i": {
    first: ["Er sagt, er ___ keine Zeit.", "habe", "hat", "hätte"],
    second: [
      "Die Sprecherin erklärt, das Projekt ___ erfolgreich.",
      "sei",
      "ist",
      "wäre",
    ],
    principle:
      "Konjunktiv I kennzeichnet indirekte Rede und schafft Distanz zur wiedergegebenen Aussage.",
  },
  "partizipien-als-adjektive": {
    first: [
      "Die ___ Kosten belasten das Budget.",
      "steigenden",
      "gestiegen",
      "steigen",
    ],
    second: [
      "Der gestern ___ Vertrag liegt hier.",
      "unterschriebene",
      "unterschreibende",
      "unterschreiben",
    ],
    principle:
      "Partizip I beschreibt einen aktiven Verlauf; Partizip II meist ein Ergebnis oder eine abgeschlossene Handlung.",
  },
  nominalisierung: {
    first: [
      "___ von Fremdsprachen ist im Beruf hilfreich.",
      "Das Lernen",
      "Lernen man",
      "Zu lernen",
    ],
    second: [
      "Nach ___ des Antrags erhalten Sie eine Antwort.",
      "der Prüfung",
      "prüfen",
      "geprüft",
    ],
    principle:
      "Nominalisierungen werden großgeschrieben und stehen häufig mit Präposition plus Genitiv oder von.",
  },
  verbalisierung: {
    first: [
      "Nach der Prüfung des Antrags … → Nachdem der Antrag ___ …",
      "geprüft wurde",
      "die Prüfung",
      "prüfen",
    ],
    second: [
      "Bei einer Verbesserung der Lage … → Wenn sich die Lage ___ …",
      "verbessert",
      "Verbesserung",
      "verbessern wird sein",
    ],
    principle:
      "Verbalisierung löst dichte Nominalgruppen in klare Haupt- oder Nebensätze auf.",
  },
  funktionsverbgefuege: {
    first: [
      "Wir müssen heute eine Entscheidung ___.",
      "treffen",
      "machen an",
      "nehmen",
    ],
    second: [
      "Die Daten stehen allen Mitarbeitenden zur Verfügung ___.",
      "—",
      "machen",
      "nehmen",
    ],
    principle:
      "Funktionsverbgefüge sind feste Nomen-Verb-Verbindungen; das Verb trägt oft wenig eigene Bedeutung.",
  },
  "advanced-word-order": {
    first: [
      "Morgen ___ ich meiner Kollegin die Unterlagen schicken.",
      "werde",
      "ich werde",
      "schicken",
    ],
    second: [
      "Obwohl es spät war, ___ wir die Aufgabe noch beendet.",
      "haben",
      "wir haben",
      "beendet",
    ],
    principle:
      "Auch in komplexen Sätzen bleiben Satzklammer und Verbposition die wichtigsten Orientierungspunkte.",
  },
  "reference-words": {
    first: [
      "Viele pendeln täglich. ___ belastet die Umwelt.",
      "Das",
      "Was",
      "Dieses Menschen",
    ],
    second: [
      "Die Kosten sind gestiegen. ___ müssen wir reagieren.",
      "Darauf",
      "Worauf",
      "Damit dass",
    ],
    principle:
      "Verweiswörter beziehen sich klar auf vorherige Aussagen und vermeiden unnötige Wiederholungen.",
  },
};

const difficulties: ExerciseDifficulty[] = [
  "easy",
  "easy",
  "medium",
  "medium",
  "medium",
  "hard",
  "hard",
  "hard",
];
const types: ExerciseType[] = [
  "multiple-choice",
  "fill-blank",
  "multiple-choice",
  "connector",
  "correct-mistake",
  "sentence-order",
  "transformation",
  "word-order",
];

function options(item: Cloze) {
  return [item[1], item[2], item[3]];
}
function completed(item: Cloze, answer = item[1]) {
  return item[0].replace("___", answer === "—" ? "" : answer);
}

export const grammarExercises: Exercise[] = grammarTopics.flatMap((topic) => {
  const seed = seeds[topic.slug];
  if (!seed) return [];
  const prompts = [
    seed.first[0],
    seed.second[0],
    `Ergänze sinnvoll: ${seed.first[0]}`,
    `Wähle die passende Form: ${seed.second[0]}`,
    `Welche Aussage zu „${topic.title}“ ist richtig?`,
    `Welche Variante hat die korrekte Struktur?`,
    `Welche Umformung verwendet „${topic.title}“ korrekt?`,
    `Wähle den natürlichen und grammatisch korrekten Satz.`,
  ];
  const answers = [
    seed.first[1],
    seed.second[1],
    seed.first[1],
    seed.second[1],
    seed.principle,
    completed(seed.first),
    completed(seed.second),
    completed(seed.first),
  ];
  const optionSets = [
    options(seed.first),
    options(seed.second),
    options(seed.first),
    options(seed.second),
    [
      seed.principle,
      "Die Wortstellung und die Form sind bei diesem Thema immer frei wählbar.",
      "Dieses Thema wird nur in Fragen verwendet.",
    ],
    [
      completed(seed.first),
      completed(seed.first, seed.first[2]),
      completed(seed.first, seed.first[3]),
    ],
    [
      completed(seed.second),
      completed(seed.second, seed.second[2]),
      completed(seed.second, seed.second[3]),
    ],
    [
      completed(seed.first),
      completed(seed.first, seed.first[2]),
      completed(seed.first, seed.first[3]),
    ],
  ];
  return prompts.map((prompt, index) => ({
    id: `${topic.slug}-${index + 1}`,
    topicId: topic.slug,
    level: topic.level,
    difficulty: difficulties[index],
    type: types[index],
    prompt,
    options: optionSets[index],
    correctAnswer: answers[index],
    explanation:
      index === 4
        ? seed.principle
        : `Richtig ist „${answers[index]}“. ${seed.principle}`,
    rule: topic.rule,
  }));
});

export const vocabularyExercises: Exercise[] = vocabularyThemes.flatMap(
  (theme) =>
    theme.items.flatMap((item, index) => {
      const otherMeanings = theme.items
        .filter((other) => other.term !== item.term)
        .map((other) => other.meaning);
      const otherTerms = theme.items
        .filter((other) => other.term !== item.term)
        .map((other) => other.term);
      return [
        {
          id: `vocab-${theme.id}-${index + 1}-de`,
          topicId: `vocab-${theme.id}`,
          level: theme.level,
          difficulty: "easy" as const,
          type: "multiple-choice" as const,
          prompt: `Was bedeutet „${item.term}“?`,
          options: [item.meaning, ...otherMeanings],
          correctAnswer: item.meaning,
          explanation: `„${item.term}“ bedeutet „${item.meaning}“. Beispiel: ${item.example}`,
          rule: "Learn the word together with its article, pattern or collocation.",
        },
        {
          id: `vocab-${theme.id}-${index + 1}-en`,
          topicId: `vocab-${theme.id}`,
          level: theme.level,
          difficulty: "medium" as const,
          type: "fill-blank" as const,
          prompt: `Welche deutsche Form passt zu „${item.meaning}“?`,
          options: [item.term, ...otherTerms],
          correctAnswer: item.term,
          explanation: `Die passende Form ist „${item.term}“. ${item.example}`,
          rule: "Recall the complete German phrase, not only a single translation.",
        },
      ];
    }),
);

export const readingPractice = [
  {
    id: "reading-b1-appointments",
    level: "B1" as Level,
    title: "Ein Termin bei der Stadt",
    minutes: 8,
    text: "Mira hat vor drei Wochen einen neuen Reisepass beantragt. Heute erhält sie eine E-Mail vom Bürgeramt: Der Pass ist fertig und kann ohne neuen Termin abgeholt werden. Mira soll ihren alten Pass und die Abholbestätigung mitbringen. Am Donnerstag arbeitet sie lange, deshalb plant sie die Abholung für Freitagvormittag.",
    questions: [
      {
        prompt: "Was ist die Hauptaussage?",
        options: [
          "Miras Reisepass ist zur Abholung bereit.",
          "Mira muss einen neuen Antrag stellen.",
          "Das Bürgeramt ist geschlossen.",
        ],
        answer: "Miras Reisepass ist zur Abholung bereit.",
        explanation:
          "Die E-Mail informiert über den fertigen Pass und die Abholung.",
      },
      {
        prompt: "Was muss Mira mitbringen?",
        options: [
          "Den alten Pass und die Bestätigung.",
          "Nur ein Foto.",
          "Einen Arbeitsvertrag.",
        ],
        answer: "Den alten Pass und die Bestätigung.",
        explanation: "Beide Dokumente werden ausdrücklich genannt.",
      },
      {
        prompt: "Was bedeutet „beantragt“ im Text?",
        options: [
          "offiziell angefordert",
          "sofort abgeholt",
          "versehentlich verloren",
        ],
        answer: "offiziell angefordert",
        explanation:
          "Einen Pass beantragen bedeutet, ihn bei einer Behörde offiziell anzufordern.",
      },
      {
        prompt: "Warum geht Mira wahrscheinlich nicht am Donnerstag?",
        options: [
          "Weil sie lange arbeitet.",
          "Weil ihr Pass noch nicht fertig ist.",
          "Weil sie einen neuen Termin braucht.",
        ],
        answer: "Weil sie lange arbeitet.",
        explanation:
          "Aus ihrem langen Arbeitstag und der Planung für Freitag lässt sich dieser Grund erschließen.",
      },
    ],
  },
  {
    id: "reading-b1-work",
    level: "B1" as Level,
    title: "Neue Arbeitszeiten",
    minutes: 9,
    text: "Ab September führt das Team flexible Arbeitszeiten ein. Alle Mitarbeitenden müssen zwischen 10 und 15 Uhr erreichbar sein. Den Beginn und das Ende des Arbeitstags können sie selbst wählen. Die Teamleitung erwartet jedoch, dass Besprechungen weiterhin pünktlich beginnen und Änderungen im Kalender eingetragen werden.",
    questions: [
      {
        prompt: "Was ändert sich?",
        options: [
          "Beginn und Ende werden flexibler.",
          "Alle arbeiten nur fünf Stunden.",
          "Besprechungen entfallen.",
        ],
        answer: "Beginn und Ende werden flexibler.",
        explanation: "Die Kernzeit bleibt, aber Beginn und Ende sind wählbar.",
      },
      {
        prompt: "Was erwartet die Teamleitung?",
        options: [
          "Pünktlichkeit und aktuelle Kalender.",
          "Tägliche Berichte.",
          "Arbeit nur im Büro.",
        ],
        answer: "Pünktlichkeit und aktuelle Kalender.",
        explanation: "Diese beiden Bedingungen stehen im letzten Satz.",
      },
      {
        prompt: "Was bedeutet „erreichbar“ hier?",
        options: [
          "für die Arbeit ansprechbar",
          "auf dem Arbeitsweg",
          "mit Urlaub beschäftigt",
        ],
        answer: "für die Arbeit ansprechbar",
        explanation:
          "Während der Kernzeit müssen Kolleginnen und Kollegen Kontakt aufnehmen können.",
      },
      {
        prompt: "Kann eine Person um 8 Uhr beginnen?",
        options: [
          "Ja, wenn sie von 10 bis 15 Uhr erreichbar bleibt.",
          "Nein, alle beginnen um 10 Uhr.",
          "Nur mit einem täglichen Bericht.",
        ],
        answer: "Ja, wenn sie von 10 bis 15 Uhr erreichbar bleibt.",
        explanation:
          "Beginn und Ende sind frei wählbar; verbindlich ist nur die Erreichbarkeit in der Kernzeit.",
      },
    ],
  },
  {
    id: "reading-b2-hybrid",
    level: "B2" as Level,
    title: "Hybrid arbeiten – aber wie?",
    minutes: 12,
    text: "Viele Unternehmen betrachten hybrides Arbeiten inzwischen nicht mehr als Übergangslösung, sondern als festen Bestandteil ihrer Organisation. Entscheidend ist dabei weniger die Zahl der Bürotage als die Frage, welche Aufgaben persönliche Abstimmung erfordern. Während konzentrierte Einzelarbeit zu Hause oft leichter fällt, profitieren kreative Prozesse und schwierige Gespräche häufig von direkter Begegnung. Eine starre Regel kann daher zwar Planungssicherheit schaffen, wird den unterschiedlichen Tätigkeiten jedoch nicht immer gerecht.",
    questions: [
      {
        prompt: "Welche Position vertritt der Text?",
        options: [
          "Arbeitsort sollte sich nach der Aufgabe richten.",
          "Homeoffice ist immer produktiver.",
          "Feste Regeln sind grundsätzlich falsch.",
        ],
        answer: "Arbeitsort sollte sich nach der Aufgabe richten.",
        explanation:
          "Der Text wägt Vorteile ab und priorisiert die Art der Tätigkeit.",
      },
      {
        prompt: "Welche Aufgaben profitieren laut Text von direkter Begegnung?",
        options: [
          "Kreative Prozesse und schwierige Gespräche.",
          "Nur konzentrierte Einzelarbeit.",
          "Ausschließlich Verwaltungsaufgaben.",
        ],
        answer: "Kreative Prozesse und schwierige Gespräche.",
        explanation:
          "Diese beiden Tätigkeiten werden ausdrücklich als Beispiele genannt.",
      },
      {
        prompt: "Was bedeutet „wird … nicht immer gerecht“?",
        options: [
          "berücksichtigt nicht alle Unterschiede",
          "ist gesetzlich verboten",
          "kostet zu viel",
        ],
        answer: "berücksichtigt nicht alle Unterschiede",
        explanation:
          "Die Wendung bedeutet, einer Sache nicht angemessen zu entsprechen.",
      },
      {
        prompt: "Welche Regel würde der Autor vermutlich bevorzugen?",
        options: [
          "Eine flexible Regel nach Aufgabenart.",
          "Fünf feste Bürotage für alle.",
          "Dauerhaftes Homeoffice ohne Ausnahmen.",
        ],
        answer: "Eine flexible Regel nach Aufgabenart.",
        explanation:
          "Die Argumentation kritisiert starre Vorgaben, ohne Büro oder Homeoffice grundsätzlich abzulehnen.",
      },
    ],
  },
  {
    id: "reading-b2-mobility",
    level: "B2" as Level,
    title: "Mobilität im Quartier",
    minutes: 12,
    text: "Ein Stadtviertel plant, Parkplätze teilweise in Grünflächen und Fahrradabstellplätze umzuwandeln. Befürworter verweisen auf bessere Luft und mehr Aufenthaltsqualität. Gewerbetreibende befürchten dagegen, dass Kundinnen und Kunden aus dem Umland ausbleiben könnten. Die Stadt schlägt deshalb eine sechsmonatige Testphase vor, während der Verkehrs- und Umsatzdaten erhoben werden. Erst danach soll dauerhaft entschieden werden.",
    questions: [
      {
        prompt: "Was ist der zentrale Konflikt?",
        options: [
          "Lebensqualität und Radverkehr stehen wirtschaftlichen Sorgen gegenüber.",
          "Die Stadt will alle Geschäfte schließen.",
          "Niemand möchte Grünflächen.",
        ],
        answer:
          "Lebensqualität und Radverkehr stehen wirtschaftlichen Sorgen gegenüber.",
        explanation:
          "Der Text stellt Vorteile des Umbaus den Befürchtungen der Gewerbetreibenden gegenüber.",
      },
      {
        prompt: "Warum gibt es eine Testphase?",
        options: [
          "Damit die Entscheidung auf Daten basiert.",
          "Weil keine Grünflächen geplant sind.",
          "Damit Geschäfte sofort schließen.",
        ],
        answer: "Damit die Entscheidung auf Daten basiert.",
        explanation:
          "Verkehrs- und Umsatzdaten sollen vor der endgültigen Entscheidung ausgewertet werden.",
      },
      {
        prompt: "Was bedeutet „ausbleiben“ in diesem Zusammenhang?",
        options: [
          "nicht mehr kommen",
          "länger einkaufen",
          "mit dem Fahrrad anreisen",
        ],
        answer: "nicht mehr kommen",
        explanation:
          "Die Geschäfte fürchten, Kundschaft aus dem Umland zu verlieren.",
      },
      {
        prompt: "Welche Haltung hat die Stadt?",
        options: [
          "abwägend und ergebnisoffen",
          "klar gegen Fahrräder",
          "vollständig unbeteiligt",
        ],
        answer: "abwägend und ergebnisoffen",
        explanation:
          "Die Stadt schlägt einen begrenzten Versuch vor und entscheidet erst danach.",
      },
    ],
  },
];

export const listeningPractice = [
  {
    id: "listen-appointment",
    level: "B1" as Level,
    title: "Termin verschieben",
    transcript:
      "Guten Tag, hier ist die Praxis Dr. Weber. Ihr Termin am Donnerstag um fünfzehn Uhr muss leider verschoben werden. Wir können Ihnen Freitag um neun Uhr oder Montag um sechzehn Uhr anbieten. Bitte rufen Sie uns kurz zurück.",
    question: "Welche zwei neuen Termine werden angeboten?",
    options: [
      "Freitag 9 Uhr oder Montag 16 Uhr",
      "Donnerstag 15 Uhr oder Freitag 16 Uhr",
      "Montag 9 Uhr oder Dienstag 16 Uhr",
    ],
    answer: "Freitag 9 Uhr oder Montag 16 Uhr",
    explanation:
      "Beide Alternativen werden im zweiten Teil der Nachricht genannt.",
  },
  {
    id: "listen-work",
    level: "B2" as Level,
    title: "Projektupdate",
    transcript:
      "Kurzes Update zum Website-Projekt: Die Inhalte sind vollständig eingepflegt. Beim Testen auf Tablets haben wir allerdings festgestellt, dass einige Filter zu viel Platz brauchen. Das Designteam passt sie heute an. Wenn die Prüfung morgen ohne neue Fehler durchläuft, können wir am Freitag veröffentlichen.",
    question: "Wovon hängt die Veröffentlichung am Freitag ab?",
    options: [
      "Von einer fehlerfreien Prüfung am Donnerstag.",
      "Von neuen Inhalten.",
      "Von einem Kundentermin am Montag.",
    ],
    answer: "Von einer fehlerfreien Prüfung am Donnerstag.",
    explanation: "Der Wenn-Satz nennt die Bedingung für die Veröffentlichung.",
  },
];

export const writingPractice = [
  {
    id: "writing-appointment",
    level: "B1" as Level,
    title: "Termin verschieben",
    target: [70, 90],
    task: "Schreibe eine E-Mail an eine Arztpraxis. Du kannst einen Termin nicht wahrnehmen, begründest kurz und schlägst zwei Alternativen vor.",
    structure: [
      "Anrede und Anlass",
      "kurze Begründung",
      "zwei Alternativen",
      "höflicher Abschluss",
    ],
    connectors: ["weil", "deshalb", "wenn", "leider"],
    checklist: [
      "Alle vier Inhaltspunkte enthalten",
      "Verbposition nach weil geprüft",
      "Anrede und Gruß passend",
    ],
  },
  {
    id: "writing-complaint",
    level: "B1" as Level,
    title: "Reklamation",
    target: [90, 110],
    task: "Schreibe an einen Online-Shop: Ein Gerät funktioniert nicht. Beschreibe das Problem und nenne deine gewünschte Lösung.",
    structure: [
      "Bestellung nennen",
      "Problem beschreiben",
      "Lösung verlangen",
      "Frist und Gruß",
    ],
    connectors: ["obwohl", "deshalb", "außerdem", "wenn"],
    checklist: [
      "Bestellung eindeutig genannt",
      "Problem konkret beschrieben",
      "Gewünschte Lösung höflich formuliert",
    ],
  },
  {
    id: "writing-opinion",
    level: "B2" as Level,
    title: "Strukturierte Meinung",
    target: [150, 180],
    task: "Sollten Unternehmen feste Bürotage vorgeben? Nimm Stellung, nenne zwei Argumente und ein konkretes Beispiel.",
    structure: [
      "Einleitung und Position",
      "Argument 1 + Beispiel",
      "Argument 2 / Gegenposition",
      "Fazit",
    ],
    connectors: [
      "einerseits … andererseits",
      "darüber hinaus",
      "dennoch",
      "abschließend",
    ],
    checklist: [
      "Klare Position erkennbar",
      "Argumente mit Beispielen belegt",
      "Absätze und Konnektoren geprüft",
    ],
  },
  {
    id: "writing-workplace",
    level: "B2" as Level,
    title: "Arbeitsplatz-Update",
    target: [120, 150],
    task: "Informiere dein Team sachlich über eine Verzögerung, erkläre die Ursache und schlage einen neuen Ablauf vor.",
    structure: [
      "Status",
      "Ursache",
      "Auswirkung",
      "Lösung und nächster Termin",
    ],
    connectors: ["aufgrund", "dadurch", "daher", "sofern"],
    checklist: [
      "Sachlicher Ton",
      "Verantwortung und nächster Schritt klar",
      "Datum oder Frist genannt",
    ],
  },
];

export const speakingPractice = [
  {
    id: "speak-clarify",
    level: "B1" as Level,
    title: "Um Klärung bitten",
    prep: 20,
    seconds: 60,
    prompt:
      "Ein Kollege erklärt eine Aufgabe zu schnell. Bitte höflich um Wiederholung und fasse dein Verständnis zusammen.",
    phrases: [
      "Könnten Sie das bitte wiederholen?",
      "Habe ich richtig verstanden, dass …?",
      "Dann mache ich also zuerst …",
    ],
  },
  {
    id: "speak-appointment",
    level: "B1" as Level,
    title: "Einen Termin vereinbaren",
    prep: 20,
    seconds: 60,
    prompt:
      "Rufe in einer Praxis an, erkläre dein Anliegen und reagiere auf einen unpassenden Terminvorschlag.",
    phrases: [
      "Ich möchte gern einen Termin vereinbaren.",
      "Dieser Termin passt mir leider nicht.",
      "Wäre … möglich?",
    ],
  },
  {
    id: "speak-opinion",
    level: "B2" as Level,
    title: "90-Sekunden-Meinung",
    prep: 30,
    seconds: 90,
    prompt:
      "Sollten Innenstädte weitgehend autofrei sein? Begründe deine Position und nenne ein Beispiel.",
    phrases: [
      "Meiner Ansicht nach …",
      "Ein wesentlicher Grund dafür ist …",
      "Ein gutes Beispiel dafür ist …",
    ],
  },
  {
    id: "speak-presentation",
    level: "B2" as Level,
    title: "Mini-Präsentation",
    prep: 60,
    seconds: 120,
    prompt:
      "Stelle eine digitale Gewohnheit vor, die deinen Alltag verbessert hat. Erkläre Vorteile, Nachteile und dein Fazit.",
    phrases: [
      "Zunächst möchte ich …",
      "Hinzu kommt, dass …",
      "Abschließend lässt sich sagen …",
    ],
  },
];

export function exercisesForTopic(topicId: string) {
  return grammarExercises.filter((exercise) => exercise.topicId === topicId);
}
export function vocabularyExercisesForTheme(themeId: string) {
  return vocabularyExercises.filter(
    (exercise) => exercise.topicId === `vocab-${themeId}`,
  );
}
