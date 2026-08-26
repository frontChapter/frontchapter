# SPEC-GAMIFICATION.md
# Haviji Sho (هویجی شو) — Gamification & Progression Spec

## 1. Core Loop & Motivational Framework
- **Core Loop**: `Action (Group Help / Event Attendance) -> Validation (Admin / Auto-Sync) -> Reward (Carrot Coins) -> Recognition (Telegram Chat Tag + Web Leaderboard) -> Status Reinforcement`.
- **Primary Psychological Trigger**: **Social Status & Recognition**. The Telegram custom title (`setChatMemberTag`) is visible right next to the user's name in the group, transforming participation into instant social capital.
- **Pacing**: Progressive threshold intervals (Early dopamine hit -> Sustained long-term engagement).

---

## 2. Tier & Status Hierarchy

| Level | Tier Title (FA) | Level Key | Required Coins | Telegram Custom Title / Tag | Perks & Privileges |
|:---|:---|:---|:---|:---|:---|
| **0** | هویج‌نشان | `havij_neshan` | 0 – 9 | `🥕 هویج‌نشان` | Basic chat permissions, public profile created |
| **1** | هویج‌دوست | `havij_doost` | 10 – 19 | `🥕 هویج‌دوست` | Profile featured in member directory |
| **2** | هویج‌جو | `havij_joo` | 20 – 29 | `🥕 هویج‌جو` | Voting rights in community polls |
| **3** | هویج‌باز | `havij_baz` | 30 – 39 | `🥕 هویج‌باز` | Priority Q&A in online meetups |
| **4** | هویج‌خواه | `havij_khah` | 40 – 49 | `🥕 هویج‌خواه` | Early-bird registration for annual conferences |
| **5** | هویج‌طلا | `havij_tala` | 50+ | `👑 هویج‌طلا` | VIP community role, speaker nomination eligibility |

---

## 3. Reward Point Matrix

| Activity Key | Display Name | Coins Awarded | Trigger / Verification Mechanism |
|:---|:---|:---|:---|
| `ONBOARDING_COMPLETED` | تکمیل ثبت‌نام و قوانین | **0** (Activates Status) | Completed Telegram login & verified rules on site |
| `USEFUL_REPLY` | پیام یا بحث مفید در گروه | **+1** | Admin replies `/useful` or `+هویج` to the user's message |
| `MEET_ATTENDANCE` | شرکت در رویداد آنلاین (Google Meet) | **+2** | Automated sync via Google Apps Script or Meet report |
| `WORKSHOP_ATTENDANCE`| شرکت در دورهمی حضوری | **+5** | Admin manual check-in or QR check-in scan |
| `ANNUAL_CONF_ATTENDANCE`| شرکت در همایش سالانه فرانت‌چپتر | **+10** | Event check-in ticket validation |

---

## 4. Anti-Abuse & Guardrails
1. **Idempotency**: Repetitive replies on the same `message_id` by multiple admins award coins only once.
2. **Admin Audit Trail**: Every coin awarded records `admin_telegram_id`, `source_message_id`, and timestamp.
3. **Threshold Calculation**: After each coin transaction, the system recalculates total coins and upgrades the tag if the user crossed a boundary.