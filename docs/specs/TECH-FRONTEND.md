# TECH-FRONTEND.md
# Haviji Sho (هویجی شو) — Frontend Implementation Guidelines

## 1. Stack & Specifications
- **Framework**: Next.js (Static Export / `output: 'export'`)
- **Styling**: Tailwind CSS with RTL support
- **State/Data Fetching**: React Hooks / SWR / TanStack Query

---

## 2. Key Pages & Routing

### `/join` (Onboarding & Identity Verification)
- **State Machine**:
  - `STEP_AUTH`: Displays Telegram Login Widget.
  - `STEP_PROFILE`: Form for Full Name, Job Title, Bio, Email, Public Profile toggle.
  - `STEP_RULES`: Community Covenant agreement.
  - `STEP_SUCCESS`: Confirmation and back-to-Telegram CTA button.

### `/community` (Member Directory & Leaderboard)
- Search bar (Filter by Name / Job Title).
- Tier filter buttons (All, هویج‌نشان, هویج‌دوست, ..., هویج‌طلا).
- User cards with avatar, name, carrot badge, and public stats.

### `/profile` (User Settings & Progression)
- Current carrot balance.
- Visual progress bar toward the next tier (e.g. `3 هویج تا هویج‌دوست`).
- Privacy toggle switch (`is_public`).

---

## 3. Telegram Login Widget Integration

```tsx
import React, { useEffect } from 'react';
import Script from 'next/script';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramLoginProps {
  botName: string;
  onAuth: (user: TelegramUser) => void;
}

export const TelegramLoginWidget: React.FC<TelegramLoginProps> = ({ botName, onAuth }) => {
  useEffect(() => {
    (window as any).onTelegramAuth = (user: TelegramUser) => {
      onAuth(user);
    };
  }, [onAuth]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10">
      <p className="mb-4 text-sm text-gray-300">برای شروع، با اکانت تلگرام خود وارد شوید:</p>
      <Script
        src="https://telegram.org/js/telegram-widget.js?22"
        data-telegram-login={botName}
        data-size="large"
        data-radius="12"
        data-onauth="onTelegramAuth(user)"
        data-request-access="write"
        strategy="lazyOnload"
      />
    </div>
  );
};
```