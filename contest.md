# Telegram JavaScript Contest Submission

## Approach Overview

This submission implements the required features for Telegram Web A, ensuring a seamless and performant user experience while adhering to the contest guidelines.

---

## Task 1: Text Editor Rework

### Edit History (Undo/Redo)

- Implemented a custom undo/redo stack to track changes reliably.
- Ensured proper state preservation using a transaction-based approach.
- Optimized keyboard event handling to align with user expectations for `Ctrl+Z / Cmd+Z`.

### Editing Quotes

- Added logic to detect and correctly format quotes within the editor.
- Implemented cursor positioning adjustments for a smooth editing experience.

### Markdown Syntax Support

- Enhanced the existing RegExp-based Markdown parsing approach to improve reliability and handle more complex formatting scenarios.
- Ensured compatibility with all Telegram formatting entities.
- Improved text selection and formatting operations to provide a more intuitive UX.

---

## Task 2: Chat Folders Appearance

- Implemented the new Chat Folders design according to the provided mockups.
- Ensured responsiveness across different screen sizes.
- Preserved the existing UX patterns in Telegram Web A for consistency.
- Optimized CSS and JavaScript to minimize rendering overhead and improve performance.

---

## Additional Notes

- All changes adhere strictly to the contest requirements, avoiding third-party frameworks and libraries.
- Extensive testing was conducted on Chrome (Linux, macOS, Windows) and Safari (iOS, macOS) to ensure compatibility.
- Performance optimizations were applied to maintain stability and responsiveness.

---

## Submission Structure

- `dist/` – Compiled build of the application.
- `src/` – Source code with organized components and logic.
- `contest.md` – This document describing the implementation approach.
- Public GitHub repository link: [Insert your GitHub repository link here]

This submission follows the official Telegram Web A repository structure and is ready for evaluation. Thank you for the opportunity!

