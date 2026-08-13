import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

function configuredTestPassword() {
  const value = process.env.E2E_SITE_PASSWORD;
  if (!value)
    throw new Error("Playwright did not configure its ephemeral test password.");
  return value;
}

const TEST_PASSWORD = configuredTestPassword();

const state = {
  version: 2,
  completedTasks: [],
  dayStatuses: {},
  confidence: { "relativ-mit-praeposition": "unsicher" },
  difficultWords: [],
  testScores: {},
  exerciseProgress: {
    "relativ-mit-praeposition": {
      attempts: 1,
      latestScore: 50,
      bestScore: 50,
      incorrectQuestionIds: ["relativ-mit-praeposition-1"],
      lastPracticeDate: "2026-08-13",
    },
  },
  vocabularyProgress: {},
  skillProgress: {},
  notes: [],
  writingDrafts: {},
  currentWeek: 7,
  streak: 1,
  lastStudyDate: "",
  totalMinutes: 0,
  onboardingComplete: true,
  notifications: [
    {
      id: "test",
      category: "Study",
      title: "Zeit für Deutsch",
      body: "Heute lernen",
      timestamp: "2026-08-13T08:00:00.000Z",
      read: false,
    },
  ],
  settings: {
    dailyTarget: 55,
    studyDays: 6,
    showEnglish: true,
    sundayMode: "catch-up",
    notifications: {
      enabled: true,
      dailyReminder: false,
      reminderTime: "18:30",
      weeklyReview: true,
      weeklyReviewDay: 6,
      reviewReminders: true,
      milestoneNotifications: true,
      browserNotifications: false,
    },
  },
};

async function unlock(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByLabel("Password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Unlock" }).click();
  await expect(page).toHaveURL(/\/$/);
}

async function waitForSync(page: import("@playwright/test").Page) {
  await expect(page.getByTitle("Synced")).toBeVisible({ timeout: 10_000 });
}

async function waitForUploaded(page: import("@playwright/test").Page) {
  await expect(page.getByTitle("Syncing…")).toBeVisible({ timeout: 5_000 });
  await waitForSync(page);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript((value) => {
    if (!localStorage.getItem("kenil-german-roadmap:v2"))
      localStorage.setItem("kenil-german-roadmap:v2", JSON.stringify(value));
  }, state);
  await unlock(page);
  const response = await page.request.put("/api/progress", {
    data: { state },
  });
  expect(response.ok()).toBeTruthy();
  await page.goto("/");
  await waitForSync(page);
});

test("password gate and progress API require an authenticated session", async ({
  browser,
}) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("/roadmap");
  await expect(page).toHaveURL(/\/login\?returnTo=%2Froadmap/);
  await expect(
    page.getByRole("heading", { name: "Kenil's German Roadmap" }),
  ).toBeVisible();
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Unlock" }).click();
  await expect(page.locator(".login-error")).toContainText("not correct");
  const unauthorized = await context.request.get("/api/progress");
  expect(unauthorized.status()).toBe(401);
  await page.getByLabel("Password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Unlock" }).click();
  await expect(page).toHaveURL(/\/roadmap$/);
  await context.close();
});

test("migrates an existing device cache to an empty cloud record", async ({
  browser,
}) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await unlock(page);
  expect((await context.request.delete("/api/progress")).status()).toBe(204);
  await page.evaluate((value) => {
    localStorage.setItem("kenil-german-roadmap:v2", JSON.stringify(value));
  }, { ...state, currentWeek: 9 });
  await page.goto("/");
  await expect(page.getByText(/migrated to the cloud/i)).toBeVisible();
  await waitForSync(page);
  const stored = await (await context.request.get("/api/progress")).json();
  expect(stored.state.currentWeek).toBe(9);
  await context.close();
});

test("synchronizes progress between two separate browser contexts", async ({
  browser,
}) => {
  const contextA = await browser.newContext();
  const contextB = await browser.newContext();
  const pageA = await contextA.newPage();
  const pageB = await contextB.newPage();
  await unlock(pageA);
  await unlock(pageB);
  expect(
    (
      await contextA.request.put("/api/progress", {
        data: { state },
      })
    ).ok(),
  ).toBeTruthy();
  await pageA.goto("/");
  await waitForSync(pageA);
  const taskId = await pageA.locator(".task").first().getAttribute("data-task-id");
  await pageA.locator(".task").first().click();
  await expect(pageA.locator(".task").first()).toHaveClass(/done/);
  await waitForUploaded(pageA);
  await pageB.goto("/");
  await waitForSync(pageB);
  const matchingTask = taskId
    ? pageB.locator(`.task[data-task-id="${taskId}"]`)
    : pageB.locator(".task").first();
  await expect(matchingTask).toHaveClass(/done/);
  await contextA.close();
  await contextB.close();
});

test("keeps offline changes across a page lifecycle and syncs on reconnect", async ({
  browser,
  context,
  page,
}) => {
  await page.goto("/");
  const taskId = await page.locator(".task").first().getAttribute("data-task-id");
  await context.setOffline(true);
  await page.locator(".task").first().click();
  await expect(page.locator(".task").first()).toHaveClass(/done/);
  await expect(
    page.getByTitle("Offline — saved on this device"),
  ).toBeVisible();
  await page.close();

  await context.setOffline(false);
  const reconnectedPage = await context.newPage();
  await reconnectedPage.goto("/");
  await waitForSync(reconnectedPage);

  const contextB = await browser.newContext();
  const pageB = await contextB.newPage();
  await unlock(pageB);
  await pageB.goto("/");
  await waitForSync(pageB);
  const matchingTask = taskId
    ? pageB.locator(`.task[data-task-id="${taskId}"]`)
    : pageB.locator(".task").first();
  await expect(matchingTask).toHaveClass(/done/);
  await contextB.close();
});

test("primary navigation and routes load", async ({ page }) => {
  for (const route of [
    "/",
    "/roadmap",
    "/grammar",
    "/vocabulary",
    "/practice",
    "/skills",
    "/resources",
    "/exam",
    "/progress",
    "/notes",
    "/settings",
    "/help",
  ]) {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.locator("h1").first()).toBeVisible();
    expect((await page.title()).length).toBeGreaterThan(0);
  }
});

test("dashboard task completion persists and Continue Learning opens week", async ({
  page,
}) => {
  await page.goto("/");
  const task = page.locator(".task").first();
  await task.click();
  await expect(task).toHaveClass(/done/);
  await waitForUploaded(page);
  await page.reload();
  await expect(page.locator(".task").first()).toHaveClass(/done/);
  await page.getByRole("link", { name: /Weiterlernen/ }).click();
  await expect(page).toHaveURL(/week\/week-7/);
  await expect(page.getByText(/Woche 7:/)).toBeVisible();
});

test("roadmap opens week and day status works", async ({ page }) => {
  await page.goto("/roadmap");
  await page.getByLabel("Open week 7").click();
  const secondDay = page.locator(".day-card").nth(1);
  await secondDay.locator(".day-toggle").click();
  const repeat = secondDay.getByRole("button", {
    name: "repeat",
    exact: true,
  });
  await repeat.click();
  await expect(repeat).toHaveClass(/active/);
});

test("grammar search, filter and topic practice", async ({ page }) => {
  await page.goto("/grammar");
  await page.getByLabel("Grammatik suchen").fill("Relativsätze mit");
  const card = page
    .locator(".grammar-card")
    .filter({ hasText: "Relativsätze mit Präpositionen" });
  await expect(card).toBeVisible();
  await card.getByRole("link", { name: "Thema öffnen" }).click();
  await page.getByRole("link", { name: /Quick Practice/ }).click();
  await expect(page.getByText(/Frage 1 von 5/)).toBeVisible();
  await page.goto("/grammar/relativ-mit-praeposition");
  await page.getByRole("link", { name: /Full Practice/ }).click();
  await expect(page.getByText(/Frage 1 von 8/)).toBeVisible();
});

test("exercise submit, explanation, result and mistakes", async ({ page }) => {
  await page.goto("/practice/relativ-mit-praeposition?mode=quick");
  for (let i = 0; i < 5; i++) {
    await page.locator(".quiz-options button").last().click();
    await page.getByRole("button", { name: "Prüfen" }).click();
    await expect(page.locator(".answer-feedback")).toBeVisible();
    await page
      .getByRole("button", {
        name: i === 4 ? "Ergebnis ansehen" : "Nächste Frage",
      })
      .click();
  }
  await expect(page.getByText(/ERGEBNIS/)).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const saved = JSON.parse(
          localStorage.getItem("kenil-german-roadmap:v2") ?? "{}",
        );
        return saved.exerciseProgress?.["relativ-mit-praeposition"]?.attempts;
      }),
    )
    .toBeGreaterThan(1);
  await page.getByRole("button", { name: /Fehler wiederholen/ }).click();
  await expect(page).toHaveURL(/mode=mistakes/);
  await expect(page.getByText(/Frage 1 von/)).toBeVisible();
});

test("vocabulary theme and practice open", async ({ page }) => {
  await page.goto("/vocabulary");
  await page.getByRole("button", { name: /Wohnen/ }).click();
  await expect(
    page.locator(".vocab-main").getByRole("heading", { name: "Wohnen" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Markieren" }).first().click();
  await expect(
    page.getByRole("button", { name: "Schwierig" }).first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "English shown" }).click();
  await expect(
    page.getByRole("button", { name: "English hidden" }),
  ).toBeVisible();
  await waitForUploaded(page);
  await page.reload();
  await page.getByRole("button", { name: /Wohnen/ }).click();
  await expect(
    page.getByRole("button", { name: "English hidden" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Schwierig" }).first(),
  ).toBeVisible();
  await page.getByRole("link", { name: "Thema üben" }).click();
  await expect(page.getByRole("heading", { name: "Wohnen" })).toBeVisible();
});

test("notes create edit delete", async ({ page }) => {
  await page.goto("/notes");
  await page.getByRole("button", { name: /Erste Notiz/ }).click();
  await page.getByPlaceholder("Titel der Notiz").fill("Kasus");
  await page.getByPlaceholder(/Regel, Beispiel/).fill("helfen + Dativ");
  await page.getByRole("button", { name: "Speichern" }).click();
  await expect(page.getByRole("heading", { name: "Kasus" })).toBeVisible();
  await waitForUploaded(page);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Kasus" })).toBeVisible();
  await page.getByLabel("Edit Kasus").click();
  await page.getByPlaceholder("Titel der Notiz").fill("Kasus-Regel");
  await page.getByRole("button", { name: "Änderungen speichern" }).click();
  await expect(
    page.getByRole("heading", { name: "Kasus-Regel" }),
  ).toBeVisible();
  page.on("dialog", (dialog) => dialog.accept());
  await page.getByLabel("Delete Kasus-Regel").click();
  await expect(page.getByText("Noch keine Notizen.")).toBeVisible();
});

test("writing draft persists", async ({ page }) => {
  await page.goto("/practice/writing");
  await page
    .getByPlaceholder(/Schreibe deinen Text/)
    .fill(
      "Guten Tag, ich möchte meinen Termin verschieben, weil ich arbeiten muss.",
    );
  await page.getByRole("button", { name: /Entwurf speichern/ }).click();
  await waitForUploaded(page);
  await page.reload();
  await expect(page.getByPlaceholder(/Schreibe deinen Text/)).toHaveValue(
    /Guten Tag/,
  );
});

test("reading, listening and speaking practice controls work", async ({
  page,
}) => {
  await page.goto("/practice/reading");
  const readingQuestions = page.locator(".skill-question");
  await expect(readingQuestions).toHaveCount(4);
  for (let index = 0; index < 4; index++)
    await readingQuestions.nth(index).locator("button").first().click();
  await page.getByRole("button", { name: "Antworten prüfen" }).click();
  await expect(page.locator(".skill-question p.correct")).toHaveCount(4);

  await page.goto("/practice/listening");
  await page.getByRole("button", { name: "Transkript anzeigen" }).click();
  await expect(page.locator(".transcript")).toBeVisible();
  await page.getByRole("button", { name: "Langsamer" }).click();
  await expect(page.getByRole("button", { name: "Normal" })).toBeVisible();
  await page.locator(".skill-question button").first().click();
  await page.getByRole("button", { name: "Antwort prüfen" }).click();
  await expect(page.locator(".skill-question p.correct")).toBeVisible();

  await page.goto("/practice/speaking");
  await page.getByRole("button", { name: "Vorbereitung starten" }).click();
  await expect(page.getByText("VORBEREITEN")).toBeVisible();
  await page.getByRole("button", { name: "Abbrechen" }).click();
  await expect(page.getByText("BEREIT", { exact: true })).toBeVisible();
});

test("notification center and settings persist", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel(/Notifications/).click();
  await expect(
    page.getByRole("dialog", { name: "Notification center" }),
  ).toBeVisible();
  await page.getByText("Alle als gelesen markieren").click();
  await page.goto("/settings");
  await page.getByRole("button", { name: "30 min" }).click();
  await page.getByLabel("Weekly review day").selectOption("5");
  await waitForUploaded(page);
  await page.reload();
  await expect(page.getByRole("button", { name: "30 min" })).toHaveClass(
    /active/,
  );
  await expect(page.getByLabel("Weekly review day")).toHaveValue("5");
});

test("export, invalid import and reset confirmation", async ({ page }) => {
  await page.goto("/settings");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: /Fortschritt exportieren/ }).click();
  expect((await download).suggestedFilename()).toBe(
    "kenil-german-progress.json",
  );
  await page.locator('input[type="file"]').setInputFiles({
    name: "valid-progress.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        ...state,
        settings: { ...state.settings, dailyTarget: 45 },
      }),
    ),
  });
  await expect(page.getByText(/erfolgreich importiert/)).toBeVisible();
  await expect(page.getByRole("button", { name: "45 min" })).toHaveClass(
    /active/,
  );
  await page.locator('input[type="file"]').setInputFiles({
    name: "invalid.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"not":"progress"}'),
  });
  await expect(page.getByText(/keine gültigen Roadmap/)).toBeVisible();
  page.on("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: /Zurücksetzen/ }).click();
  await expect(
    page.getByRole("heading", { name: "Einstellungen" }),
  ).toBeVisible();
});

test("onboarding supports back, next, finish and reopening", async ({
  page,
}) => {
  await page.goto("/");
  expect(
    (
      await page.request.put("/api/progress", {
        data: { state: { ...state, onboardingComplete: false } },
      })
    ).ok(),
  ).toBeTruthy();
  await page.reload();
  const dialog = page.getByRole("dialog", { name: "Heute" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Weiter" }).click();
  await expect(page.getByRole("dialog", { name: "Roadmap" })).toBeVisible();
  await page.getByRole("button", { name: "Zurück" }).click();
  await expect(page.getByRole("dialog", { name: "Heute" })).toBeVisible();
  for (let step = 0; step < 4; step++)
    await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByRole("button", { name: "Fertig" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await waitForUploaded(page);
  await page.goto("/settings");
  await page.getByRole("button", { name: /Onboarding erneut/ }).click();
  await expect(page.getByRole("dialog", { name: "Heute" })).toBeVisible();
  await page.getByRole("button", { name: "Überspringen" }).click();
});

test("mobile layout has no horizontal overflow and navigation is reachable", async ({
  page,
}, testInfo) => {
  test.skip(
    !testInfo.project.name.includes("mobile") &&
      !testInfo.project.name.includes("ipad"),
  );
  await page.goto("/");
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.locator(".bottom-nav")).toBeVisible();
  await page
    .locator(".bottom-nav")
    .getByRole("link", { name: "Roadmap" })
    .click();
  await expect(page).toHaveURL(/roadmap/);
});

test("major page has no serious accessibility violations", async ({ page }) => {
  await page.goto("/grammar");
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((item) =>
      ["serious", "critical"].includes(item.impact ?? ""),
    ),
  ).toEqual([]);
});

test("required viewport matrix has no horizontal overflow", async ({
  page,
}, testInfo) => {
  test.setTimeout(120_000);
  test.skip(!["chromium", "webkit"].includes(testInfo.project.name));
  const viewports = [
    [320, 568],
    [360, 800],
    [375, 667],
    [390, 844],
    [393, 852],
    [430, 932],
    [844, 390],
    [744, 1133],
    [768, 1024],
    [1024, 768],
    [820, 1180],
    [1180, 820],
    [834, 1194],
    [1024, 1366],
    [1280, 800],
    [1366, 768],
    [1440, 900],
    [1920, 1080],
  ] as const;
  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height });
    for (const route of ["/", "/grammar", "/practice", "/settings"]) {
      await page.goto(route, { waitUntil: "networkidle" });
      const metrics = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(
        metrics.scroll - metrics.client,
        `${route} overflowed at ${width}x${height}`,
      ).toBeLessThanOrEqual(1);
    }
  }
});

test("key routes produce no console or page errors", async ({ context }) => {
  for (const route of ["/", "/roadmap", "/grammar", "/practice", "/settings"]) {
    const routePage = await context.newPage();
    const errors: string[] = [];
    routePage.on("pageerror", (error) =>
      errors.push(`pageerror: ${error.message}`),
    );
    routePage.on("console", (message) => {
      if (message.type() === "error") errors.push(`console: ${message.text()}`);
    });
    await routePage.goto(route, { waitUntil: "networkidle" });
    await routePage.waitForTimeout(250);
    expect(errors, `${route} produced browser errors`).toEqual([]);
    await routePage.close();
  }
});
