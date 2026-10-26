# Product Requirements Document (PRD) — Kudos V1 at CodeLink

**Authors:** Senior Product Owner & Senior Backend Engineer  
**Target Release:** Phase 1 (8-Week V1 Build)  
**Status:** Approved for Implementation  
**Organization:** CodeLink (~120 staff, 3 offices, hybrid work, Slack-based)

---

## 1. Summary
CodeLink is a ~120-person hybrid software outsourcing agency across three offices with an offline "Kudos Board" that fails remote staff, centralizes recognition on a physical wall in one building, and defaults to monthly "most received" prizes that reward the same vocal personas. Kudos V1 brings recognition directly into daily workflow via Slack and a lightweight companion web wall. Staff can give meaningful, guided praise in under 30 seconds with custom visibility (Team channel, Company `#kudos`, or Private DM), automatically notifying both the recipient and their direct manager. By removing gamified leaderboards, actively engaging managers, and celebrating givers alongside receivers, Kudos V1 transforms ad-hoc praise into an inclusive habit that bridges cross-office and cross-team silos.

---

## 2. Problem and Evidence

### Root Causes
1. **Friction:** Giving physical kudos requires walking to an offline board in a single physical office. For hybrid staff, remote teammates, and employees in the other two offices, participation is functionally impossible.
2. **Distance & Silos:** Work happens across distributed client teams and three regional offices. Peer accomplishments go unnoticed outside direct project bubbles, and cross-team collaboration is rarely surfaced.
3. **Fairness & Distrust:** The legacy monthly award ("most kudos received wins") creates a popularity contest won repeatedly by the same visible individuals. This alienates quieter contributors and creates skepticism around recognition sincerity.
4. **Decay:** Infrequent feedback loops and lack of reinforcement mean kudos wither after initial launch campaigns. Without personal recaps or leadership visibility, staff see little value in sustaining the habit.

### Directional Survey Evidence ($n = 6$)
While directional, qualitative and quantitative signals from staff highlight clear structural deficiencies:
* **6/6 (100%)** want their direct manager to notice their contributions.
* **5/6 (83%)** want granular control over visibility; only **1/6 (17%)** want every kudos posted publicly.
* **5/6 (83%)** desire a personal recognition recap.
* **3/6 (50%)** fear that gamification (points, badges, leaderboards) breeds superficial, insincere praise.
* **2/3 (67%)** of past users found the legacy kudos process boring or overly simplistic.
* **"I feel recognised"** averages **2.7 / 5.0**, signalling low baseline morale around appreciation.
* **Only 1/6 (17%)** would miss the current offline board, proving the problem lies in flawed delivery design rather than a lack of desire to appreciate peers.

---

## 3. Goals and Non-Goals

### Goals
* **G-1 (Frictionless Giving):** Enable any employee to compose and send peer kudos in $< 30$ seconds directly inside Slack.
* **G-2 (Manager Loop):** Ensure 100% of recipient direct managers are notified of incoming kudos via automated bot DM, closing the visibility gap.
* **G-3 (Inclusive Reach):** Reach an 80–85% 30-day interaction rate (giving or receiving) across all offices and teams within 3 months of launch.
* **G-4 (Cross-Boundary Appreciation):** Drive cross-team/cross-office recognition so at least 30% of all kudos cross organizational boundaries.
* **G-5 (Meaningful Content):** Enforce structured, quality praise (minimum 30 characters with guided prompts) to prevent empty "+1" spam.

### Non-Goals
* **NG-1:** No leaderboards, public scoreboards, or ranking employees by kudos received (explicitly out of scope across all versions).
* **NG-2:** No peer-to-peer monetary rewards, crypto, points redemption, or physical gift catalogs in V1.
* **NG-3:** No performance appraisal scoring, salary linkage, or automated HR bonus calculations.
* **NG-4:** No AI-generated or auto-completed praise text.
* **NG-5:** No support for chat tools other than Slack (e.g., Microsoft Teams, Discord).

### Release Roadmap Scope Boundary
| Item | Release | Rationale / Notes |
|---|---|---|
| Leaderboard of kudos received | **Won't do** | Encourages popularity contests; survey showed 3/6 fear gamification ruins sincerity |
| AI-suggested prompts | **Won't do** | Reduces sincerity and authenticity of peer praise |
| Weekly nudge | **V2** | Gentle reminder for inactive givers after baseline habit forms |
| Allowance | **V2 pilot** | Periodic giving quotas to encourage balanced distribution |
| Monthly recap DM | **V2** | Automated personal summary delivered via Slack bot DM |
| Fair awards | **V2** | Rotating categories judged on breadth and values, never raw volume |
| Anniversaries & onboarding | **V2** | Automated milestone celebration triggers |
| Points, badges, streaks | **V3** | Evaluated only after cultural habit stabilizes |
| Rewards catalog | **V3** | Tangible company perks and item redemption |
| GIF / custom images | **V3** | Rich media in Slack modals and web wall |
| Quests | **V3** | Team-based cultural challenges |
| Analytics dashboards | **V4** | Multi-dimensional self-serve BI for People Operations |
| Other chat platforms | **Contingent** | Evaluated only if CodeLink migrates off Slack |

---

## 4. Users, Roles, and Permissions

### User Personas
* **Employee (Giver / Receiver):** Individual contributors, project leads, and staff across all 3 offices. They give recognition via Slack shortcuts, view their own personal history in App Home, and browse the public Web Wall.
* **Manager:** Team leads, engineering managers, and department heads. In addition to standard employee capabilities, they receive automated DMs when their direct reports receive kudos so they can reinforce praise during 1:1s.
* **Talent Admin:** People Operations / HR team members. They manage company values, view aggregate adoption reports, download CSVs, access the "not recognised in 30 days" safety net, and select representative praise for company-wide monthly rituals.

### Permission Matrix

| Capability / Surface | Employee | Manager | Talent Admin |
|---|:---:|:---:|:---:|
| Give kudos via Slack (`/kudos`, shortcut, App Home) | Yes | Yes | Yes |
| View Public Kudos (Company `#kudos`, Team Channels, Web Wall) | Yes | Yes | Yes |
| View Private Kudos | Giver & Recipient(s) only | Giver & Recipient(s) only; Manager only if direct report is recipient | Giver & Recipient(s) only (*Admin cannot see private message text*) |
| View Personal Stats in App Home ("Gave X, Received Y") | Own data only | Own data only | Own data only |
| Edit/Delete own kudos within 15-minute window | Yes | Yes | Yes |
| Delete any kudos (content moderation) | No | No | Yes |
| Access Web Kudos Wall (public feed, person page, spotlight) | Yes | Yes | Yes |
| View "Not Recognised in 30 Days" list | No | No | **Yes (Restricted)** |
| Access Monthly Talent Metrics Report & CSV Export | No | No | **Yes** |
| Access Read-Out Helper (suggested kudos for monthly ritual) | No | No | **Yes** |
| Manage System Settings (Values, Offices, Teams, Sync) | No | No | **Yes** |

---

## 5. User Stories and Acceptance Criteria

### US-01: Give Kudos via Slack Slash Command and Shortcuts
* **As an** employee,  
* **I want to** trigger a guided kudos modal using `/kudos`, a message action shortcut, or an App Home button,  
* **so that** I can praise teammates in under 30 seconds without leaving my workflow.

#### Scenario 1.1: Successful creation with message shortcut
```gherkin
Given user "Alice" is viewing a helpful Slack message from "Bob" in channel "#eng-core"
When Alice clicks the message shortcut "Give Kudos"
Then a Slack modal opens titled "Give Kudos" in < 1 second
And the "Recipient(s)" field is pre-populated with "Bob"
And the "Linked Message" reference displays a permalink to Bob's message
And the prompt text displays "What did they do? Why did it matter?"
And the character count indicator shows "0 / 30 min characters"
And the "Send Kudos" button is disabled
```

#### Scenario 1.2: Minimum character validation and submission
```gherkin
Given Alice has selected recipient "Bob"
When Alice enters "Thanks Bob" (10 characters)
Then the character counter displays "10 / 30 characters (20 more needed)"
And the "Send Kudos" button remains disabled
When Alice types "Thanks Bob for staying late to hotfix the auth staging deployment!" (67 characters)
And Alice selects optional value tag "Extreme Ownership"
And Alice clicks "Send Kudos"
Then the modal closes immediately (< 1 second)
And the Kudos record is saved in the database
And an analytics event "kudos_sent" is emitted with compose duration
```

---

### US-02: Visibility Selection and Multi-Channel Delivery
* **As a** kudos giver,  
* **I want to** designate the visibility of the kudos (Team Channel, Company `#kudos`, or Private DM),  
* **so that** I can respect the recipient's preference for public praise or discreet recognition.

#### Scenario 2.1: Default Team Channel delivery
```gherkin
Given Alice is sending kudos to "Bob"
When Alice leaves visibility set to the default "Team channel (#client-alpha)"
And Alice submits the modal
Then the bot posts a formatted message into "#client-alpha" within 2 seconds
And the post mentions Alice, Bob, displays the value tag, and renders the message
And a private bot DM is delivered to Bob containing the kudos details
And a private bot DM is delivered to Bob's manager "Carol" stating "Your report Bob received kudos from Alice!"
```

#### Scenario 2.2: Company-wide public delivery
```gherkin
Given Alice selects visibility "Company #kudos"
When Alice submits the kudos
Then the bot posts the kudos into the central "#kudos" channel
And Bob and Bob's manager Carol both receive notification bot DMs
```

#### Scenario 2.3: Private DM visibility
```gherkin
Given Alice selects visibility "Private (Recipient & Manager only)"
When Alice submits the kudos
Then no post is published to "#kudos" or any team channel
And the bot sends a direct message to Bob with the kudos
And the bot sends a direct message to Bob's manager Carol with the kudos
And the kudos is marked "is_private = true" and excluded from the public Web Wall
```

---

### US-03: Edge Case — Recipient with No Manager
* **As the** Kudos notification engine,  
* **I want to** handle recipients who do not have an assigned manager (e.g., CEO, contractors, or unassigned new hires),  
* **so that** delivery succeeds without system exceptions.

```gherkin
Given Alice gives kudos to "David" (the CEO)
And David has "manager_id = NULL" in the database
When the system executes the delivery pipeline
Then the bot posts the kudos to the chosen public channel (if public)
And the bot sends the delivery DM to David
And the system logs an event "dm_delivery_skipped" with reason "NO_MANAGER"
And no manager notification error is raised
```

---

### US-04: Edge Case — Giver is the Recipient's Direct Manager
* **As a** manager giving kudos to a direct report,  
* **I want the** system to avoid sending me a redundant manager notification,  
* **so that** my Slack inbox is not cluttered with echoes of my own action.

```gherkin
Given manager "Carol" sends kudos to her direct report "Bob"
When the kudos is successfully processed
Then Bob receives the recipient DM notification
And Carol does NOT receive a "Your report Bob received kudos" notification
And the delivery record logs "MANAGER_IS_GIVER_SUPPRESSED"
```

---

### US-05: Edge Case — Deactivated or Departed User Handling
* **As a** user or system administrator,  
* **I want** deactivated accounts handled cleanly in modals and historical records,  
* **so that** users cannot praise departed staff, while past kudos remain intact.

```gherkin
Given employee "Evan" has been marked inactive (`is_active = false`) via Slack sync
When Alice opens the `/kudos` composer
Then Evan does not appear in the searchable Recipient dropdown
When viewing historical kudos on the Web Wall involving Evan
Then Evan's name displays as "Evan (Departed)" with avatar greyed out
And Evan's profile cannot be clicked as an active target
```

---

### US-06: Guardrail — Self-Kudos Prevention
* **As a** system guardrail,  
* **I want to** block users from selecting themselves as recipients,  
* **so that** the recognition ecosystem remains authentic.

```gherkin
Given Alice opens the Kudos composer modal
When Alice adds "Alice" to the Recipient picker
Then the modal displays an inline error: "You cannot give kudos to yourself."
And the "Send Kudos" button is disabled until Alice removes herself
```

---

### US-07: Guardrail — 15-Minute Edit and Delete Window
* **As a** kudos giver,  
* **I want to** edit typos or delete an accidental kudos within 15 minutes of sending,  
* **so that** I can rectify mistakes while preserving data integrity thereafter.

#### Scenario 7.1: Successful edit within 15 minutes
```gherkin
Given Alice sent kudos to Bob at 10:00 AM
When Alice opens App Home and clicks "Edit" on that kudos at 10:08 AM (8 minutes elapsed)
Then an edit modal appears pre-filled with the message and value tag
When Alice updates the text and submits
Then the Slack channel post and bot DMs update with the new text and an "(edited)" tag
And an audit record is stored in "kudos_audit_log" with the old and new text
```

#### Scenario 7.2: Edit rejected after 15 minutes
```gherkin
Given Alice sent kudos to Bob at 10:00 AM
When Alice attempts to edit the kudos at 10:16 AM (16 minutes elapsed)
Then the "Edit" and "Delete" buttons are disabled in App Home
If Alice sends an edit payload via API
Then the server responds with HTTP 403 Forbidden: "Edits are only allowed within 15 minutes of sending."
```

---

### US-08: Edge Case — Recipient in Multiple Teams
* **As an** employee working across multiple client engagements,  
* **I want to** choose which team channel to publish to when using "Team Channel" visibility,  
* **so that** the praise reaches the relevant project context.

```gherkin
Given recipient "Bob" belongs to Team "Fintech Core" and Team "Design System"
When Alice selects Bob and chooses visibility "Team channel"
Then a channel selector dropdown appears populated with "#proj-fintech-core" and "#proj-design-system"
And Alice can explicitly choose the appropriate channel context
```

---

### US-09: App Home Personal Recap
* **As an** employee,  
* **I want to** visit the Kudos App Home in Slack,  
* **so that** I can review my received and sent kudos and see a private summary of my monthly activity without comparison to others.

```gherkin
Given employee Alice navigates to the Kudos Slack App Home
Then the header displays: "This month you gave 3 kudos, and received 2 kudos."
And there is NO mention of leaderboard, rank, percentile, or colleague counts
And a tabbed list displays "Kudos Received" and "Kudos Sent" with timestamps and messages
And each item sent < 15 minutes ago includes "Edit" and "Delete" action buttons
```

---

### US-10: Web Kudos Wall and Spotlights
* **As an** employee or manager,  
* **I want to** browse a web wall filtered by team, office, month, and cross-team status,  
* **so that** I can discover contributions across the entire organization.

```gherkin
Given an authenticated employee visits "https://kudos.codelink.internal"
When the page loads
Then a feed of public kudos is displayed ordered by creation date descending
And filters are available for: Office (3 offices), Team, Month, Value Tag, and "Cross-Team Only"
And a "Spotlight" rail highlights:
  | Section | Criteria |
  | First-Time Recipients | Staff who received their first-ever kudos this month |
  | Cross-Office Kudos | Kudos where Giver and Recipient belong to different offices |
When the user clicks a person's name
Then they navigate to a personal profile showing their public kudos received and given
```

---

### US-11: Talent Admin Metrics, "Not Recognised" List, and Monthly Ritual Helper
* **As a** Talent Admin,  
* **I want** access to aggregate adoption metrics, a 30-day safety net list, and a ritual read-out helper,  
* **so that** I can ensure recognition is equitable and prepare monthly company all-hands celebrations.

#### Scenario 11.1: "Not recognised in 30 days" list access
```gherkin
Given user "Tina" is a verified Talent Admin
When Tina opens the Admin Portal "Recognition Safety Net" tab
Then Tina sees a list of active employees who have received 0 kudos in the trailing 30 days
And the list shows employee name, office, team, and their direct manager's name
And regular employees visiting this URL receive an HTTP 403 Forbidden
```

#### Scenario 11.2: Monthly Ritual Read-Out Helper
```gherkin
Given Tina is preparing for the monthly company all-hands
When Tina navigates to the "Ritual Read-Out Helper" tab
Then the system displays curated kudos recommendations categorized by:
  * "Cross-Office Collaboration" (inter-office impact)
  * "Core Value Champions" (deepest alignment with specific tags)
  * "Unsung Heroes" (first-time recipients with substantial praise length)
And the tool strictly suppresses any "Most Kudos Received" ranking or count sort
And Tina can click "Export CSV" to download filtered records for archival
```

---

## 6. Functional Requirements

| ID | Traceability | Description |
|---|---|---|
| **FR-01** | US-01 | The system shall provide three Slack entry points: `/kudos` command, message context shortcut ("Give Kudos"), and an App Home button ("Give Kudos"). |
| **FR-02** | US-01 | The Slack composer modal shall require selecting $\ge 1$ recipient, inputting text $\ge 30$ characters, and provide an optional single-select Company Value dropdown. |
| **FR-03** | US-01 | When opened via message context shortcut, the modal shall pre-fill the message author as recipient and store the message permalink reference. |
| **FR-04** | US-02 | The modal shall require selecting visibility: `Team channel` (default), `Company #kudos`, or `Private`. |
| **FR-05** | US-02 | Public kudos shall be posted via Slack Bot to the designated channel within 2 seconds of submission. |
| **FR-06** | US-02 | Every kudos shall trigger an automated Slack Bot direct message to every recipient. |
| **FR-07** | US-02 | Every kudos shall trigger an automated Slack Bot direct message to each recipient's direct manager, unless the manager is the giver. |
| **FR-08** | US-03 | If a recipient has no recorded manager (`manager_id IS NULL`), the manager notification step shall gracefully complete without throwing errors. |
| **FR-09** | US-06 | The system shall reject self-kudos both in the Slack modal UI and via database constraint. |
| **FR-10** | US-07 | Givers shall be permitted to edit message text or soft-delete kudos within exactly 15 minutes of submission (`created_at + 15 min`). |
| **FR-11** | US-07 | Any edit or deletion shall update the Slack channel message and bot DMs, and write an immutable row to `kudos_audit_log`. |
| **FR-12** | US-09 | App Home shall display a private monthly summary: `"This month you gave X, received Y"`. Under no circumstances shall ranks or percentiles be displayed. |
| **FR-13** | US-10 | The Web Kudos Wall shall require "Sign in with Slack" (OAuth2 / OIDC) and restrict access to active CodeLink domain accounts. |
| **FR-14** | US-10 | The Web Kudos Wall feed shall display public kudos only, with filter toggles for Office, Team, Value Tag, Month, and "Cross-Team Only". |
| **FR-15** | US-10 | The Web Wall shall feature a Spotlight module highlighting first-time recipients and cross-office kudos. |
| **FR-16** | US-11 | The Talent Admin portal shall provide a "Not Recognised in 30 Days" table restricted exclusively to `is_admin = true` users. |
| **FR-17** | US-11 | The Admin portal shall generate a Monthly Ritual Read-Out suggestion view grouping kudos by breadth and values, explicitly preventing volume sorting. |
| **FR-18** | US-11 | The Admin portal shall provide filtered CSV exports containing: date, giver, recipient(s), value tag, message text, cross-team flag, and reaction/reply counts (excluding private kudos content). |
| **FR-19** | US-05 | The system shall synchronize employee profiles (name, email, avatar, manager, team, active status) via nightly Slack SCIM/API sync or CSV HR import. |

---

## 7. Non-Functional Requirements

### 7.1 Performance
* **Modal Responsiveness:** The Slack composer modal must open in $< 1.0\text{ second}$ following command execution or shortcut trigger.
* **Delivery Latency:** Channel posts and direct messages must be delivered within $< 2.0\text{ seconds}$ of modal submission under normal conditions ($< 5.0\text{ seconds}$ at peak 99th percentile).
* **Web Feed Performance:** Web Kudos Wall initial server response (TTFB) must be $< 300\text{ ms}$, with total First Contentful Paint (FCP) $< 1.2\text{ seconds}$ on standard office connections.

### 7.2 Availability and Slack Platform Limits
* **Uptime:** The backend service shall maintain $\ge 99.5\%$ monthly uptime during operational working hours (07:00 to 20:00 across all 3 office timezones).
* **Rate Limit Handling:** Slack API tier rate limits (e.g., chat.postMessage Tier 4 = 100 requests/minute) must be safeguarded using an asynchronous message queue (Redis/BullMQ) with exponential backoff and jitter.

### 7.3 Security and Scopes
* **Principle of Least Privilege:** Request minimal required Slack OAuth scopes:
  * `commands` (slash command handler)
  * `chat:write` (posting channel announcements and bot DMs)
  * `users:read`, `users:read.email` (user profile synchronization)
  * `im:write` (opening bot direct message conversations)
  * `channels:read`, `groups:read` (resolving channel names for team delivery)
* **Message Privacy:** The Slack app must **never** request `channels:history`, `groups:history`, or `im:history`. It must never read ambient channel messages. When triggered via message shortcut, only the specific target message timestamp and author are read.
* **Tenant Isolation:** Single-tenant hosting in CodeLink’s private AWS/GCP cloud environment. Database access restricted via VPC and TLS 1.3 in-transit and AES-256 at-rest.

### 7.4 Privacy
* **Performance Decoupling:** Kudos data is strictly peer recognition. Under company policy, kudos totals are never utilized as an algorithmic input to formal performance appraisal scoring, salary increments, or retention decisions.
* **Data Residency:** All data remains inside CodeLink’s private database instance. No data is shared with third-party tracking or AI services.

### 7.5 Accessibility
* **Slack Accessibility:** Slack Block Kit components must adhere to native screen-reader labeling and keyboard navigation.
* **Web Wall Accessibility:** Web UI must comply with WCAG 2.1 AA guidelines, including minimum 4.5:1 color contrast ratios, focus rings, semantic heading trees (`h1`-`h3`), and ARIA labels on filter controls.

---

## 8. Analytics and Event Tracking

Every event is recorded in an append-only event log to power operational monitoring and metrics computation:

| Event Name | Trigger Condition | Key Event Properties | Target Metric Fed |
|---|---|---|---|
| `composer_opened` | User invokes `/kudos`, shortcut, or App Home button | `user_id`, `trigger_source` (`command`, `shortcut`, `app_home`), `opened_at` | Completion Rate, Median Time to Send |
| `kudos_sent` | User submits modal and backend validates | `kudos_id`, `giver_id`, `recipient_ids[]`, `visibility`, `value_id`, `char_length`, `is_cross_team`, `is_cross_office`, `duration_ms` | North Star (Weekly Givers), 30-Day Reach, Cross-Team Share, Value-Tag Share |
| `kudos_edited` | Giver edits message within 15 min | `kudos_id`, `giver_id`, `elapsed_seconds`, `char_diff` | Guardrail Audit / Operational Health |
| `kudos_deleted` | Giver deletes kudos within 15 min | `kudos_id`, `giver_id`, `elapsed_seconds` | Guardrail Audit / Operational Health |
| `dm_delivered` | Slack bot successfully sends DM to recipient or manager | `kudos_id`, `recipient_id`, `target_role` (`recipient`, `manager`), `latency_ms` | Manager Participation, Delivery SLA |
| `reaction_added` | Teammate adds Slack emoji reaction to a kudos post | `kudos_id`, `user_id`, `reaction_name` | Social Engagement Depth |
| `reply_added` | Teammate writes thread reply to a kudos post | `kudos_id`, `user_id` | Social Engagement Depth |
| `admin_report_viewed`| Talent Admin accesses metrics portal | `admin_user_id`, `tab_name`, `timestamp` | Admin Compliance & Utilization |

---

## 9. Success Metrics and Exact Formulas

| Metric Name | Exact Formula | Target |
|---|---|---|
| **North Star: Weekly Active Givers** | $\frac{\text{Staff who gave } \ge 1 \text{ kudos this week}}{\text{All eligible staff}} \text{ (4-week rolling average)}$ | 25% by Month 3; 40% by Month 6 |
| **30-Day Reach** | $\frac{\text{Staff who gave or received } \ge 1 \text{ kudos in last 30 days}}{\text{All eligible staff}} \times 100$ | 80% – 85% |
| **Recipient Coverage** | $\frac{\text{Staff who received } \ge 1 \text{ kudos in last 30 days}}{\text{All eligible staff}} \times 100$ | $\ge 80\%$ (always $\le$ Reach) |
| **Manager Participation** | $\frac{\text{Active managers who gave } \ge 1 \text{ kudos this calendar month}}{\text{All active managers}} \times 100$ | $\ge 80\%$ |
| **Cross-Team Share** | $\frac{\text{Kudos where } \ge 1 \text{ recipient is in different team or office}}{\text{Total kudos sent}} \times 100$ | $\ge 30\%$ |
| **Median Time to Send** | $\text{Median of } (\text{posted\_at} - \text{composer\_opened\_at})$ | $< 30\text{ seconds}$ |
| **Completion Rate** | $\frac{\text{Total kudos sent}}{\text{Total composer sessions opened}} \times 100$ | $\ge 70\%$ |
| **Value-Tag Share** | $\frac{\text{Kudos with a tagged company value}}{\text{Total kudos sent}} \times 100$ | Calibrated after trial |
| **"I Feel Recognised" Pulse** | Quarterly company-wide survey score (1.0 to 5.0 scale) | Baseline 2.7 $\rightarrow$ Target $\ge 3.5$ |

*Note: All numerical targets are hypotheses to be recalibrated upon completion of the 5-week trial in Office 1.*

---

## 10. Dependencies

1. **Slack Workspace Admin Approval:** Authorization to install a custom Slack App with required scopes in the primary CodeLink workspace.
2. **Organization Structure & Hierarchy Data:** Reliable synchronization of Employee Office, Team membership, and Manager-to-Report relations. Source: Slack custom profile fields or weekly Talent CSV import.
3. **Company Core Values:** Formal ratification by Talent leadership of the finalized list of 4–6 core company values and concise definitions.
4. **Cloud Infrastructure:** Provisioned VPC, PostgreSQL 15+ database instance, Redis queue, and Node.js hosting runtime inside CodeLink's cloud infrastructure.

---

## 11. Release Plan (Phase 1: 8-Week V1 Build)

```
W1: Discovery & Architecture ──► W2: Design & Prototypes ──► W3-W4: Sprint 1 (Core Engine) 
    ──► W5-W6: Sprint 2 (Web & Admin) ──► W7: QA & Trial Office Pilot ──► W8: Full Launch
```

### Detailed Schedule
* **Week 1 (Discovery & Architecture):** Finalize PRD/ERD, approve Slack App scopes with IT, configure cloud infrastructure, database schemas, and migration pipelines.
* **Week 2 (Design & System Prototypes):** Product designer finalizes Block Kit modal layouts, Web Wall responsive wireframes, design tokens, and states; validate prototypes with 3 trial users.
* **Week 3–4 (Sprint 1 — Core Slack Integration):**
  * Slack slash command, shortcuts, and Block Kit modal composer.
  * Backend delivery engine (channel posts, bot DMs, manager lookup).
  * 15-minute edit/delete guardrail and database transaction safety.
* **Week 5–6 (Sprint 2 — Web Wall & Talent Admin):**
  * Sign in with Slack (OAuth2/OIDC).
  * Public feed with multi-facet filtering (office, team, value tag, cross-team).
  * Talent Admin dashboard: 30-day safety net list, ritual read-out helper, CSV export.
* **Week 7 (QA & Office Pilot):**
  * End-to-end load testing, rate limit queue testing, and security penetration test.
  * 7-day shadow pilot in the initial trial office (~40 staff).
* **Week 8 (Company-wide Launch):** All-hands demonstration, company rollout across all 3 offices, and baseline telemetry tracking.

### Definition of Done (DoD)
A feature is considered complete and shippable only when:
1. Code is peer-reviewed by at least one Senior Engineer and merged to `main`.
2. Unit and integration test coverage exceeds 85% for business logic and delivery queues.
3. End-to-end Slack flow tested across mobile and desktop Slack clients.
4. Security audit passes: no unapproved Slack scopes, zero SQL injection / XSS vulnerabilities, strict tenant isolation.
5. Telemetry events accurately fire and are verified in reporting tables.
6. Talent leadership signs off on administrative screens, exports, and company values list.

---

## 12. Risks and Mitigations

| # | Risk | Impact | Likelihood | Mitigation Strategy |
|---|---|:---:|:---:|---|
| **R-1** | **Novelty Fades:** Usage drops sharply after the first 3 weeks. | High | High | Deliver App Home personal recaps; equip Talent team with the Ritual Read-Out helper to publicly celebrate givers at monthly all-hands meetings. |
| **R-2** | **Manager Loop Breaks:** Managers ignore DMs or fail to mention kudos during 1:1s. | High | Medium | Format manager DMs with an explicit 1:1 discussion prompt (`"Tip: Bring this up in your next 1:1 with Bob!"`); track the *Manager Participation* metric weekly. |
| **R-3** | **Unfairness & Popularity Contests Return:** A small clique dominates public recognition. | High | Low | Absolute ban on public leaderboards or "most received" awards. Provide Talent Admin with the "Not Recognised in 30 Days" safety net to prompt managers discreetly. |
| **R-4** | **Engineers Pulled to Client Work / Scope Creep:** Internal agency project loses velocity. | High | Medium | Rigidly frozen V1 scope. Out-of-scope items (points, allowances, AI, badges) are strictly rejected until V2 gate. Dedicated 50% allocations protected by leadership. |
| **R-5** | **Missing or Outdated Manager / Team Data:** Kudos notifications misdirected or fail due to bad org charts. | Medium | High | Graceful fallbacks (`manager_id = NULL` does not break flow); provide Talent Admins with an in-app manual hierarchy override screen and CSV import. |

---

## 13. Open Questions

1. **Company Values Ratification:** What is the finalized list of 4–6 approved CodeLink company values and their 1-sentence Slack helper tooltips? (*Owner: Talent Team*).
2. **Slack Plan & Channel Governance:** Does CodeLink use Slack Enterprise Grid or Slack Pro? If Pro, who holds Org Admin permissions to approve bot installation into private team channels? (*Owner: Internal IT*).
3. **Interns, Contractors, and Part-time Staff:** Are external contractors and probationary interns included as eligible givers and recipients in V1? (*Recommendation: Yes, inclusion by default prevents contractor exclusion*).
4. **Data Retention & Expiry:** What is the corporate data retention policy for kudos content (e.g., retain indefinitely vs. soft-archive after 24 months)? (*Owner: Legal / Talent*).
5. **Anonymous Kudos Consideration:** Survey showed 5/6 want to choose visibility, but should completely *anonymous* giving ever be permitted? (*Current V1 stance: Prohibited to ensure accountability and authentic praise; re-evaluate in V2*).
