"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, HelpCircle, Info } from "lucide-react";

const helpItems = [
  ["Dashboard", "Dein persönlicher Ausgangspunkt.", "Öffne die Startseite, um Woche, Tagesplan, Fokus und nächsten Meilenstein zu sehen.", "Zeigt gespeicherte Aufgaben und Empfehlungen; bloßes Öffnen zählt nicht als Lernen."],
  ["Today plan", "Ein sinnvoller Plan für heute.", "Arbeite die Aufgaben von oben nach unten ab und tippe eine Aufgabe zum Abhaken erneut an, um sie rückgängig zu machen.", "Erledigte Aufgaben erhöhen Lernzeit und Wochenfortschritt."],
  ["Light session", "Eine kürzere Einheit für volle Tage.", "Wähle die 20–30-Minuten-Version auf dem Dashboard. Kernschritte bleiben, Zeitblöcke werden gekürzt.", "Eine vollständig erledigte Light Session zählt als meaningful activity."],
  ["Roadmap", "Der flexible 30-Wochen-Weg von B1 zu B2.", "Filtere nach Niveau oder öffne eine Woche. Wiederholen und Verlängern ist ausdrücklich erlaubt.", "Abgeschlossene Aufgaben bestimmen den Lernfortschritt; die Roadmap ist kein Zertifikat."],
  ["Week page", "Dein konkreter Wochenplan.", "Klappe einen Tag auf, erledige Aufgaben und markiere den Tag als done, partial, skipped, moved oder repeat.", "Jeder Status bleibt lokal gespeichert und hilft bei Empfehlungen."],
  ["Grammar library", "Kompakte Regeln an einem Ort.", "Suche nach Thema, filtere nach Niveau und markiere dein Vertrauen.", "Unsicher markierte Themen erscheinen unter Needs Review."],
  ["Grammar details", "Regel, Struktur, Beispiele und typische Fehler.", "Lies kurz, starte dann Quick oder Full Practice und schließe mit aktivem Output ab.", "Die Vertrauensmarkierung und Quizwerte werden getrennt gespeichert."],
  ["Exercises", "Datenbasierte Fragen mit Erklärung.", "Wähle Schwierigkeit, beantworte, prüfe und lies die Begründung vor der nächsten Frage.", "Jeder Versuch speichert letzten und besten Wert sowie falsche Fragen."],
  ["Exercise scores", "Ein Lernsignal, keine CEFR-Prüfung.", "Unter 60% bedeutet Needs Review, 60–79% Okay, 80–89% Good, ab 90% Strong.", "Schwache Ergebnisse setzen das Thema auf Unsicher; starke auf Sicher."],
  ["Review Mistakes", "Nur deine zuletzt falsch beantworteten Fragen.", "Der Modus wird nach einem Versuch verfügbar. Ohne Fehler ist er deaktiviert und erklärt warum.", "Ein neuer Versuch ersetzt die aktuelle Fehlerliste des Themas."],
  ["Vocabulary", "Praktische Wörter, Muster und Kollokationen.", "Wähle ein Alltagsthema, blende Englisch ein oder aus und markiere schwierige Wörter.", "Markierungen und Übungsergebnisse fließen in Wiederholungsempfehlungen ein."],
  ["Reading", "Originale Kurztexte für B1 und B2.", "Lies einmal global, dann detailliert; beantworte anschließend die Fragen.", "Die Aufgaben trainieren Hauptidee, Details, Wortschatz und Schlussfolgerungen."],
  ["Listening", "Browserbasierte Ausspracheübung mit Originaltranskript.", "Höre normal oder langsamer, wiederhole und zeige das Transkript erst danach.", "Die Stimme ist synthetisch und wird nicht als authentische Aufnahme ausgegeben."],
  ["Writing", "Geführte Schreibaufgaben mit Wortzähler.", "Nutze Struktur und Konnektoren, schreibe im Editor und speichere den Entwurf.", "Entwürfe bleiben lokal; das Speichern allein verändert keinen CEFR-Status."],
  ["Speaking", "Freies Sprechen mit Vorbereitungs- und Sprechzeit.", "Starte den Timer, nutze Redemittel nur als Stütze und bewerte dich danach ehrlich.", "Es wird nichts aufgenommen oder hochgeladen."],
  ["Skills dashboard", "Getrennte Sicht auf Lesen, Hören, Schreiben und Sprechen.", "Nutze den vorgeschlagenen nächsten Schritt bei unausgeglichenem Fortschritt.", "B2-Bereitschaft basiert nicht nur auf Grammatik-Häkchen."],
  ["Resources", "Legale offizielle Übungen.", "Filtere Anbieter und öffne Klett, Hueber oder Goethe in einem neuen Tab.", "Externe Seiten beeinflussen den lokalen Fortschritt erst, wenn du eine Aufgabe markierst."],
  ["Exam preparation", "Strategien und offizielle Prüfungsmaterialien.", "Nutze Goethe-Sets in den Checkpoint-Wochen unter realistischen Zeitbedingungen.", "Prüfungsfortschritt bleibt getrennt von der Aussage, offiziell B2 zu sein."],
  ["Progress", "Zusammenfassung von Lernzeit, Aufgaben und Skills.", "Suche nach Mustern, nicht nach Perfektion.", "Prozentwerte sind auf 0–100 begrenzt und dienen nur der Planung."],
  ["Confidence system", "Deine subjektive Sicherheit.", "Unsicher = mehr Wiederholung; Okay = meist anwendbar; Sicher = zuverlässig anwendbar.", "Vertrauen und Quizwerte können sich widersprechen; dann wird vorsichtig empfohlen."],
  ["Needs Review", "Automatisch priorisierte Schwächen.", "Ein Thema erscheint bei Unsicher oder einem Quiz unter 60%.", "Nach erfolgreicher Wiederholung kannst du Vertrauen neu markieren."],
  ["Streak", "Tage mit meaningful study activity.", "Schließe mindestens eine Kernaufgabe oder Light Session ab. Öffnen allein zählt nicht.", "Pro Kalendertag zählt höchstens ein Tag; geplanter Ruhetag unterbricht nicht."],
  ["Notes", "Eigene Regeln, Fehler und Redemittel.", "Erstelle, bearbeite oder lösche Notizen und nutze die Suche.", "Notizen bleiben lokal und verändern keine Quizwerte."],
  ["Notifications", "Respektvolle In-App-Erinnerungen.", "Öffne die Glocke, markiere einzeln oder alle als gelesen und entferne alte Einträge.", "In-App-Erinnerungen funktionieren auch ohne Browser-Berechtigung."],
  ["Settings", "Passe Rhythmus und Erklärungen an.", "Ändere Tagesziel, Lerntage, Sonntag, Sprache und Benachrichtigungen.", "Jede Einstellung wird sofort lokal gespeichert und beeinflusst den Tagesplan."],
  ["Export progress", "Erstellt eine JSON-Sicherung.", "Lade die Datei herunter und bewahre sie privat auf.", "Export ändert den Fortschritt nicht."],
  ["Import progress", "Stellt eine gültige Sicherung wieder her.", "Wähle eine v1- oder v2-Datei; ältere Daten werden sicher migriert.", "Ungültige Dateien werden abgelehnt, ohne vorhandene Daten zu überschreiben."],
  ["Reset progress", "Setzt das Gerät auf den Ausgangszustand.", "Exportiere vorher und bestätige den Warnhinweis.", "Ohne Sicherung ist der Reset nicht rückgängig zu machen."],
  ["PWA / Add to Home Screen", "Installiert die Website wie eine App.", "Auf iPhone/iPad: Teilen → Zum Home-Bildschirm. Andere Browser können eine Installieren-Aktion zeigen.", "Offline-Grundgerüst und App-Symbol ändern deine Lerndaten nicht."],
  ["Data & privacy", "Alle persönlichen Daten bleiben in diesem Browser.", "Nutze Export/Import für Gerätewechsel und lösche Browserdaten nur mit Sicherung.", "Kein Konto, keine Datenbank und kein Upload von Texten oder Audio."],
] as const;

export function HelpCenter() {
  const [query,setQuery]=useState("");
  const filtered=helpItems.filter(item=>item.join(" ").toLowerCase().includes(query.toLowerCase()));
  return <div className="help-page"><div className="page-title"><p>HILFE & DATENSCHUTZ</p><div><section><h1>So funktioniert Kenil&apos;s German Roadmap</h1><span>Was jede Funktion macht, warum sie nützlich ist und wie sie deinen Fortschritt beeinflusst.</span></section></div></div><label className="help-search"><HelpCircle size={18}/><span className="sr-only">Hilfe durchsuchen</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Funktion suchen …"/></label><div className="help-grid">{filtered.map(([name,what,how,progress],index)=><details key={name} open={index===0&&!query}><summary><span>{String(index+1).padStart(2,"0")}</span><strong>{name}</strong><ChevronDown size={17}/></summary><div><section><b>Was ist das?</b><p>{what}</p></section><section><b>Wie nutze ich es?</b><p>{how}</p></section><section><b>Fortschritt & Wirkung</b><p>{progress}</p></section></div></details>)}</div><section className="help-callout"><Info/><div><h2>Wichtig zur B2-Bereitschaft</h2><p>Roadmap-, Quiz- und Vertrauenswerte unterstützen deine Lernplanung. Sie ersetzen weder eine offizielle Prüfung noch eine professionelle CEFR-Einstufung.</p></div><Link href="/practice">Übungen öffnen <ArrowRight size={16}/></Link></section></div>;
}

export function InfoTip({ label, children }: { label:string; children:React.ReactNode }) {
  return <span className="info-tip"><button aria-label={label} title={label}><Info size={14}/></button><span role="tooltip">{children}</span></span>;
}
