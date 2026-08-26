# AGY-ROADMAP.md
# Haviji Sho (هویجی شو) — Step-by-Step Implementation Roadmap for Agents

### Phase 1: Backend & Database Foundation
- [ ] **Task 1.1**: Execute SQL schema creation on MySQL (`roostkit.site`).
- [ ] **Task 1.2**: Implement `cors.php` and `verifyTelegramAuth.php` utility modules.
- [ ] **Task 1.3**: Create REST endpoint `POST /api/v1/onboarding/complete`.
- [ ] **Task 1.4**: Setup Telegram Webhook dispatcher (`telegram-webhook.php`).
- [ ] **Task 1.5**: Implement Telegram API client wrapper (`restrictChatMember`, `setChatMemberTag`, `sendMessage`).

### Phase 2: Static Frontend Implementation (FrontChapter Repo)
- [ ] **Task 2.1**: Implement `TelegramLoginWidget` component in Next.js.
- [ ] **Task 2.2**: Build `/join` onboarding wizard page with Tailwind RTL layout.
- [ ] **Task 2.3**: Build `/community` directory page with member cards and tier badges.
- [ ] **Task 2.4**: Build user profile summary and tier progress bar.

### Phase 3: Bot Interactivity & Group Loop
- [ ] **Task 3.1**: Handle `new_chat_members` event: restrict permissions and post welcome card with join button.
- [ ] **Task 3.2**: Handle `/useful` and `+هویج` replies by admins.
- [ ] **Task 3.3**: Implement automatic tier threshold evaluation and Telegram tag updates.

### Phase 4: Event Integrations & Automated Sync
- [ ] **Task 4.1**: Implement `POST /api/v1/events/sync-attendance` endpoint with API key auth.
- [ ] **Task 4.2**: Configure Google Apps Script in Google Meet attendance sheet.
- [ ] **Task 4.3**: End-to-end integration test across Telegram group and web pages.