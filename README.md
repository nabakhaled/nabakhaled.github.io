# LawFirm — English homepage

Static HTML, CSS, and JavaScript implementation of the selected Figma screen (167:63).

## Run
Open index.html directly in a browser, or use a local preview extension such as Live Server. No build or installation is required. All images, icons, and fonts are stored locally.

## Files
- index.html — page sections and accessible form markup.
- assets/css/style.css — layout, design tokens, local fonts, desktop and mobile styles.
- assets/js/main.js — mobile navigation, practice-area navigation, page search, policy dialogs, and email enquiry preparation.
- assets/images/ — original assets exported from Figma; some exports belong to clipped design layers and are retained for reference.
- assets/fonts/ — Archivo, Marcellus, and Italianno.

## Before launch
- The enquiry form submits to the existing Formspree endpoint published on the legacy website. It prevents duplicate pending requests and preserves input on failure, with an email fallback. Live delivery has not been tested.
- Phone, email, office hours, address, Facebook, Instagram, and the map location were checked against the legacy website on 2026-11-08. LinkedIn remains unavailable because no account URL was published.
- Terms and privacy dialogs contain clearly marked publication placeholders and require approved copy.
- The navigation labels the existing Why Choose Us section. The legacy case-study page contains generic entries; no detailed case outcomes have been invented. Arabic is available in index-ar.html.
- The decorative map uses the original Figma layers. Its link searches for the office in Amman on Google Maps.
- The design's proprietary hero signature font was unavailable; Italianno is used for that signature.

## Verification
Local asset references, fragment destinations, and JavaScript syntax were checked. Automated visual browser verification could not finish because the preview browser could not connect to localhost in this environment.

