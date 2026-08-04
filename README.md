# Personal Portfolio Page
Source code for my personal portfolio page.

Deployed by AWS Amplify

Link: https://katerina.wang

---

### Version History

#### `2026.08` — Blog & Admin System *(vibe coded with Claude)*
- Added blog page with timeline layout, tag filtering, and search
- Added individual post pages with Editor.js block rendering
- Built admin tool for writing/editing posts with live preview
  - Save and delete posts directly to filesystem via Node.js API server
  - Auto-updates `index.json` on save/delete
- Hash-based routing (`#home`, `#blog`, `#post/...`) for session persistence
- Refactored JS and CSS into per-page modules (`home.js/css`, `blog.js/css`, etc.)
- Blog entry hover effect with shifted text shadow
- Full date display on individual post pages

#### `2025.12` — Portfolio Redesign
- Rebuilt site as a single-page app with dynamic content loading via JS and JSON
- New visual identity: custom fonts (Caveat, Gugi, Tomorrow, Ubuntu Sans), animated avatar with morphing border
- Typed.js intro animation on home page
- Projects and experience sections populated dynamically from JSON data
- Image and video lightbox support (GLightbox)
- Swiper.js skill carousel with marquee effect
- Responsive layout for desktop, tablet, and mobile
- Page fade-in transitions
- Sidebar footer with rotated text

#### `2026.01–07` — Content & Polish
- Updated experience and work history
- Added resume and custom favicon
- Freepik icons credit

#### `2023` — Initial Launch
- Class projects for CSIS 1430 (HTML, CSS, JS, Bootstrap)
- Includes: birthday greetings, lottery game, madlibs, tic-tac-toe, pizza-strap, and final project
- Deployed as course project page

---

### Credits
- [Typed.js](https://github.com/mattboldt/typed.js)
- [Creating Personalised Memoji Gifs in Keynote](https://youtu.be/ayAlAX8ZfH4?si=7QdDFTDMIZMxgrRs)
- [glightbox](https://github.com/biati-digital/glightbox)
- [Swiper.js](https://swiperjs.com/)
- Icons made by [Freepik](https://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com/)
