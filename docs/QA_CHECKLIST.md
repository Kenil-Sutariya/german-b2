# QA Checklist

## Automated commands

- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run validate:content`
- [x] `npm run test:e2e`
- [x] `npm run build`

## Functional coverage

- [x] Primary navigation and every top-level route
- [x] Dashboard task completion and reload persistence
- [x] Continue Learning opens the current week
- [x] Roadmap week opening and persistent day status
- [x] Grammar search, topic navigation, Quick Practice, answer feedback, results, and Review Mistakes
- [x] Full Practice navigation and persisted exercise attempts/scores
- [x] Vocabulary category, difficult-word state, English toggle persistence, and practice navigation
- [x] Reading feedback, listening transcript/speed/answer controls, and speaking start/cancel timer controls
- [x] Notes create, reload persistence, edit, delete, and confirmation
- [x] Writing draft save and reload persistence
- [x] Notification center and unread handling
- [x] Settings daily target and weekly review day persistence
- [x] JSON export, valid/invalid import handling, and reset confirmation
- [x] Onboarding Back, Next, Finish, Skip, and reopen
- [x] Key routes produce no page or console errors in all configured engines

## Responsive coverage

- [x] 320 × 568
- [x] 360 × 800
- [x] 375 × 667
- [x] 390 × 844
- [x] 393 × 852
- [x] 430 × 932
- [x] 844 × 390 (phone landscape)
- [x] 744 × 1133
- [x] 768 × 1024
- [x] 1024 × 768 (tablet landscape)
- [x] 820 × 1180
- [x] 1180 × 820 (tablet landscape)
- [x] 834 × 1194
- [x] 1024 × 1366
- [x] 1280 × 800
- [x] 1366 × 768
- [x] 1440 × 900
- [x] 1920 × 1080
- [x] Mobile Chrome navigation and overflow
- [x] Mobile WebKit navigation and overflow
- [x] iPad WebKit navigation and overflow

## Accessibility and content

- [x] Axe serious/critical scan, including color contrast, on the grammar library
- [x] Keyboard-visible focus styles
- [x] Named navigation, dialogs, and icon controls
- [x] Content validator confirms every grammar topic and vocabulary theme has practice
- [x] Every exercise includes an answer, explanation, and rule
