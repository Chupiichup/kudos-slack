# CodeLink Kudos V1 — Slack-First Peer Recognition Prototype

A clickable V1 prototype built for **CodeLink** (~120 staff in 3 offices, working hybrid) to replace their failed offline "Kudos Board" with an authentic, weekly Slack-first recognition habit.

---

## 🎯 Design Principles & Core Context
* **Under 30 seconds, inside Slack:** Fast modal composer with live character counting ($\ge 30$ chars) and duration telemetry.
* **Celebrate the giver, not only the receiver:** Highlight everyday collaboration without toxic popularity contests.
* **Seen by the right people (the manager):** Automated bot DM sent to every recipient's direct manager to close the feedback loop for 1:1 check-ins.
* **Strictly NO leaderboards anywhere:** Removes gamification fear and ensures quiet contributors are not alienated.
* **Single-tenant & privacy first:** Private kudos are DM-only, excluded from the public wall, and masked in exports.

---

## 🚀 How to Run Locally

### Prerequisites
* **Node.js:** v18.17+ or v20+
* **npm:** v9+ or v10+

### Installation & Launch
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🎬 3-Minute Demo Walkthrough Script

You can run this demo manually, or click the **"3-Min Demo Script"** button in the top navigation bar for automated step-by-step shortcuts:

### Step 1: Give Kudos as Employee (Linh Nguyen) via Message Shortcut
1. Ensure the top navigation is set to **Slack Simulator** and viewing as **Linh Nguyen**.
2. Navigate to channel **`#team-engineering`**.
3. Hover over Minh Tran's message:
   > *"Hey team, staging auth token refresh is fixed now. Ready for client demo."*
4. Click the **"Give kudos"** action shortcut (or the `...` menu $\rightarrow$ *"Give kudos"*).
5. The Block Kit modal opens in $< 1\text{s}$ with:
   * **To:** Pre-filled with **Minh Tran**.
   * **Linked message:** Pre-attached reference to the message.
   * **Timer:** Live stopwatch measuring elapsed seconds.
6. In the guided prompt textarea, write:
   > *"Huge thanks for staying late to hotfix the staging auth token refresh before the client demo. The presentation ran smoothly with zero errors!"*
   *(Notice the live counter turn green at $\ge 30$ characters).*
7. Click the **`🔥 Own it`** company value tag chip.
8. Set **Share to:** **Company `#kudos`**.
9. Click **"Send Kudos"**.
10. Watch the celebration confetti burst and note the dev toast notification: **`🎉 Kudos sent in ~14s!`**.

### Step 2: Verify the Automated Bot DMs (Recipient & Manager)
1. In the top-right persona switcher, select **Minh Tran (Recipient)**.
   * Under **Direct Messages**, click **`Kudos Bot`**.
   * See the personal delivery notification: *"You received kudos from Linh Nguyen!"*.
2. In the persona switcher, select **Huy Dang (Minh's Engineering Manager)**.
   * Under **Direct Messages**, click **`Kudos Bot`**.
   * See the automated manager DM: *"🌟 Your report Minh Tran received kudos from Linh Nguyen!"* with a proactive prompt to discuss it in their next 1:1.

### Step 3: Amplify with Emoji Reactions & Thread Replies
1. In the sidebar, click channel **`#kudos`**.
2. Locate the freshly published post from Linh to Minh.
3. Click an emoji reaction (e.g. `🔥` or `👏`) to see the reaction counter increment in real time.
4. Click the **"Reply in thread"** icon to slide open the Thread panel, type:
   > *"Super proud of this teamwork! True ownership."*
   and submit.

### Step 4: Explore the Web Kudos Wall & Spotlights
1. In the top navigation, switch to **Kudos Web App**.
2. Notice the top **"This Month's Spotlights"** strip highlighting:
   * First-time recipients.
   * Cross-office collaborations bridging HCMC, Da Nang, and Hanoi.
3. Click the **"Cross-Team Only"** filter button to view kudos spanning different squads and offices.
4. Click on **Minh Tran** to open his personal profile page, showing all received and given appreciation.
5. Verify that **NO leaderboard** exists anywhere on the page.

### Step 5: Talent Admin Monthly Reports & Ritual Read-Out Helper
1. In the persona switcher, select **Sarah Jenkins (Talent Admin)**.
2. Click the **Talent Admin** tab.
3. Review the **9 live calculated metrics**:
   * **Weekly Active Givers (North Star):** ~24% (4-week rolling average with mini trendline).
   * **30-Day Reach:** ~82% of eligible staff.
   * **Recipient Coverage:** ~80% (strictly $\le$ Reach).
   * **Manager Participation:** $\ge 80\%$ of managers active this month.
   * **Cross-Team Share:** ~25%.
   * **Median Time to Send:** ~18s ($< 30\text{s}$ target).
   * **Composer Completion Rate:** ~74%.
4. Open the **"Fairness Safety Net"** tab:
   * View the active staff who have not been recognized in the trailing 30 days (fairness aid for People Ops).
5. Open the **"Ritual Read-Out Helper"** tab:
   * Review curated suggestions for the monthly all-hands meeting (grouped by values, cross-office, and first-time recipients — *never sorted by count*).
6. Click **"Export CSV"** to download an anonymized CSV export.

---

## 🏗 Tech Stack & Architecture
* **Framework:** Next.js (App Router) + TypeScript
* **Styling:** Tailwind CSS with custom CodeLink tokens:
  * Background: `#FAF7F2`
  * Cards: `#FFFDF9`
  * Text: `#1E2633`
  * Primary Accent: `#C2462E`
  * Secondary: `#1F6F6B`
  * Fonts: `Bricolage Grotesque` (Headings) & `DM Sans` (Body)
* **State Management:** In-memory context store backed by `localStorage` persistence with graceful fallback and one-click data reset.
* **Seed Data:** 120 realistic users across 3 offices (HCMC, Da Nang, Hanoi), 8 teams, and ~400 realistic agency-work kudos over the past 90 days.

---

## 📄 Related Documents
* [PRD.md](file:///d:/Me%20mine/PM/Vibecode/kudos%20codelink/kudos%20vibe%20code/PRD.md) — Comprehensive Product Requirements Document for V1.
* [ERD.md](file:///d:/Me%20mine/PM/Vibecode/kudos%20codelink/kudos%20vibe%20code/ERD.md) — Full Entity-Relationship Diagram, database schema, constraints, and pseudo-SQL metric calculations.
