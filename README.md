# Study Corner — Student Learning Platform

**Tagline:** Make space to learn.

Study Corner is a student learning project with browser-based study planning, beginner-friendly web development resources, a short quiz, and revision flashcards. It is a static website; it does not currently provide user accounts, cloud synchronization, or an AI study assistant.

## Pages

- **Home** — `index.html`: study tips, a dashboard based on tasks saved in the current browser, a rotating study prompt, and a clearly labelled development roadmap.
- **Resources and Practice** — `resources.html`: a study planner, searchable learning links, a quiz with feedback, flashcards, and an embedded HTML lesson preview.
- **Contact** — `contact.html`: a form demonstrating common HTML form controls. It validates the form in the browser but does not send or save messages.
- **Privacy Policy** — `privacy.html`: explains the site's current data handling and limitations.
- **Terms and Conditions** — `terms.html`: describes the basic terms for this demonstration project.

The pages share `style.css` and use `favicon.svg) for the browser-tab icon. The visual style uses a restrained green and blue palette, translucent panels, and responsive layouts.

## What works now

- Study tasks can be added, marked complete, and removed.
- Tasks and flashcard progress are stored in the visitor's browser using `localStorage`; they are not synced between devices.
- The dashboard calculates task counts and completion from the saved tasks.
- The resource library can be searched and filtered.
- The quiz checks answers and gives immediate feedback.
- Flashcards can be flipped, navigated, and marked as known.
- The contact form demonstrates client-side validation and displays a notice explaining that no message is sent.

## Not implemented yet

User registration and login, secure accounts, cross-device cloud synchronization, an AI study assistant, and advanced learning analytics are planned ideas only. They are not active services on this website. The contact form is not connected to an email service or backend.

## Privacy and data

Study tasks and flashcard progress are saved in the browser on the device where the site is used. Clearing browser storage can remove that data. Do not enter sensitive personal information into this project. External learning links are operated by their respective providers and follow their own privacy policies.

## Run locally

Open `index.html` in a browser. Navigate between Home, Resources, Practice, and Contact using the site navigation. The site uses plain HTML, CSS, and JavaScript and has no build step.

## Learning resources

- [MDN Learn web development](https://developer.mozilla.org/en-US/docs/Learn)
- [W3Schools HTML tutorial](https://www.w3schools.com/html/)
- [W3Schools CSS tutorial](https://www.w3schools.com/css/)

This is an educational project. Study tips and example tasks are suggestions, not a guarantee of academic results.
