# SPEC-FLOWS.md
# Haviji Sho (هویجی شو) — Business Logic & User Flows

## Flow 1: Telegram-First Onboarding (Group Gatekeeper)
1. **Join Trigger**: User requests to join or joins the Telegram group.
2. **Bot Intervention**:
   - Bot calls `restrictChatMember` (sets `can_send_messages = FALSE`).
   - Bot sends a welcome message with an inline button:
     `[🥕 برای تایید عضویت و هویجی شدن کلیک کنید]` -> URL: `https://frontchapter.ir/join?tg_id={USER_ID}&chat_id={CHAT_ID}`.
3. **Website Verification**:
   - User opens `frontchapter.ir/join`.
   - User authenticates via **Telegram Login Widget**.
   - User fills in profile details (Full Name, Job Title, Bio, Email, Public Toggle).
   - User checks the community covenant & rules acceptance checkbox.
4. **Backend Finalization**:
   - Submits payload to PHP backend (`/api/v1/onboarding/complete`).
   - Backend validates cryptographic Telegram auth payload.
   - Backend creates/updates user in MySQL (`status = ACTIVE`).
   - Backend executes Telegram Bot API:
     - `restrictChatMember` (unlocks send permissions).
     - `setChatMemberTag` (sets custom title to `🥕 هویج‌نشان`).
   - Web UI presents a success card with a direct button `[بازگشت به گروه تلگرام]`.

---

## Flow 2: Website-First Onboarding (`/join`)
1. User visits `frontchapter.ir` and clicks "هویجی شو".
2. User authenticates via Telegram Login Widget.
3. User completes profile and accepts terms.
4. Backend checks membership status via Telegram API:
   - If not yet in group/channel, displays invitation links.
   - If already in group, lifts restrictions and applies carrot tag.

---

## Flow 3: `/useful` Message Recognition
1. A community member posts a helpful response or insight.
2. An authorized admin replies with `/useful` or `+هویج`.
3. Webhook catches the message update:
   - Checks if replier is a verified admin.
   - Checks if target user exists in `users` table.
   - Checks idempotency table to prevent duplicate rewards on the same message.
   - Increments user's `coins_balance` (+1).
   - Evaluates tier upgrade: if upgraded, updates `setChatMemberTag` and announces in group.

---

## Flow 4: Event Attendance Flow
- **Online (Google Meet)**: Meet attendance sheet processed via Google Apps Script -> API batch endpoint -> Coins credited.
- **In-Person**: Admin marks attendance via dashboard / QR scanner -> Credits +5 or +10 coins.