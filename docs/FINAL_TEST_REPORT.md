# Final Test Report

Date: 2026-08-13

## Result

All required static checks, content validation, production build, and the final cross-browser Playwright run passed.

| Check              | Result                                                                                                            |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| TypeScript         | Passed (`tsc --noEmit`)                                                                                           |
| ESLint             | Passed with no errors or warnings                                                                                 |
| Content validation | Passed: 43 grammar topics, 344 grammar questions, 12 vocabulary themes, 72 vocabulary questions, 30 roadmap weeks |
| Playwright         | Passed: 89 tests, 7 intentional project skips, 0 failures across 96 project/test combinations                     |
| Accessibility      | Passed: no serious or critical axe violations in all six browser/device projects                                  |
| Runtime console    | Passed on Chromium, Firefox, WebKit, mobile Chromium, mobile WebKit, and iPad WebKit                              |
| Production build   | Passed; all application routes were emitted                                                                       |

## Browser/device projects

- Chromium at 1440 × 900
- Firefox at 1280 × 800
- Desktop WebKit at 1440 × 900
- Mobile Chrome at 390 × 844
- Mobile WebKit at 390 × 844
- iPad WebKit at 820 × 1180

Chromium and desktop WebKit also ran the complete required viewport matrix: 320 × 568, 360 × 800, 375 × 667, 390 × 844, 393 × 852, 430 × 932, 844 × 390, 744 × 1133, 768 × 1024, 1024 × 768, 820 × 1180, 1180 × 820, 834 × 1194, 1024 × 1366, 1280 × 800, 1366 × 768, 1440 × 900, and 1920 × 1080. The matrix checked the dashboard, grammar library, practice hub, and settings for horizontal overflow in portrait and landscape orientations.

## Notes

Playwright uses a fresh Vinext production build on port 4173, one worker, and a dedicated server. Serial execution prevents development-module graph races from being mistaken for application errors. The seven skipped combinations are intentional: the dedicated mobile-navigation test only applies to the three mobile/tablet projects, while the full viewport matrix only applies to Chromium and desktop WebKit.

Critical controls covered include Continue Learning, week/day states, grammar search and filters, Quick/Full practice, answer submission and explanations, score persistence, Review Mistakes, vocabulary state, notes CRUD, reading/listening/speaking controls, writing persistence, notification read/settings behavior, onboarding controls, export, valid/invalid import, reset confirmation, and mobile navigation.

Browser notifications remain subject to permission, platform policy, and the absence of a push backend. The service worker provides a PWA shell/navigation foundation, not guaranteed closed-browser scheduled delivery.
