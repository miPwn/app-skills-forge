
# GuildForge - RPG-Themed Team Skill Matrix

Note: This repository ships with privacy-safe sample data. No real personal data is included.

GuildForge is a **React** application for managing team skills, designed with a **RPG** twist to make tracking and developing team capabilities more engaging. The app features **leaderboards**, **adventurer profiles**, **lore editors**, and a **command center** for team leads to manage technologies and skills.

---

##  Features

- **Adventurer Profiles:** Create and manage team member profiles with skill ratings, roles, and personalized avatars.
- **Leaderboards:** Track the top adventurers in each class, including **Front End**, **Back End**, **Full Stack**, **DevOps**, and **AQA**.
- **Lore Editor:** Add rich, RPG-style backstories for each adventurer.
- **Skill Management:** Create, edit, and organize skills across multiple areas, including **Fundamentals**, **Front End**, **Back End**, **AQA**, **Cloud & DevOps**, and **Others**.
- **Profile Image Upload:** Customize adventurer avatars with image upload, cropping, and preview capabilities.
- **Command Center:** Secure area for team leads to manage skills, technologies, and profiles.
- **Global Leaderboards:** Showcase the top adventurers across all classes.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.

---

##  Technologies Used

- **React** - Frontend framework
- **Vite** - Fast development server and bundler
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Advanced animations
- **React Router** - Client-side routing
- **DiceBear Avatars** - Dynamic profile images
- **React Dropzone** - File handling for image uploads
- **React Cropper** - Image cropping

---

##  Project Structure

```
src/
│
├── components/
│   ├── adventurer/
│   │   └── AdventurerCard.jsx
│   ├── command/
│   │   ├── CommandCenterPage.jsx
│   │   ├── SkillEditor.jsx
│   │   └── ProfileImageEditor.jsx
│   └── guild/
│       └── GuildHallPage.jsx
│
├── data/
│   └── skill-data.js
│
├── pages/
│   ├── HomePage.jsx
│   ├── LeaderboardsPage.jsx
│   ├── AdventurerPage.jsx
│   └── CommandCenterPage.jsx
│
├── utils/
│   ├── constants.js
│   └── helpers.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

##  Setup and Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/guild-forge-app.git
   cd guild-forge-app
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

---

##  Admin Access

- The **Command Center** is protected by a simple password gate.
- Default password is **"rpgteamplayers"** (update this for production).

---

##  Deployment

Security and quality gates run in CI:
- Linting (eslint)
- Build (vite)
- Vulnerability scan (npm audit, Trivy)
- Release on tag push (v1.1.0+)

- The app is pre-configured for deployment to **Netlify** or **Vercel**.
- Make sure to update any API keys or environment variables before deploying.

---

##  To-Do

- Add **drag-and-drop** skill editing.
- Implement **role-specific leaderboards**.
- Add support for **custom badges** and **achievements**.
- Improve mobile responsiveness for the command center.
- Add analytics for skill progression tracking.

---

##  Contributing

Contributions are welcome! Please open an **issue** or **pull request** for any improvements or bug fixes.

---

##  Environment Variables

Create a local .env file based on .env.example and set:
- VITE_ADMIN_PASSWORD

The .env file is ignored by git.

---

##  License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. See LICENSE for details.
