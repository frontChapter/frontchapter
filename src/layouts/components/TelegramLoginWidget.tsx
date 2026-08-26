'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TelegramUser } from '../../types/gamification';

/* eslint-disable no-unused-vars */
interface TelegramLoginProps {
  botName?: string;
  onAuth: (_user: TelegramUser) => void;
  buttonSize?: 'small' | 'medium' | 'large';
  cornerRadius?: number;
  requestAccess?: 'write' | 'read';
  className?: string;
}
/* eslint-enable no-unused-vars */

export const TelegramLoginWidget: React.FC<TelegramLoginProps> = ({
  botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || 'FrontChapterBot',
  onAuth,
  buttonSize = 'large',
  cornerRadius = 12,
  requestAccess = 'write',
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDevMode, setIsDevMode] = useState<boolean>(false);
  const [devUser, setDevUser] = useState<string>('');

  useEffect(() => {
    (window as any).onTelegramAuth = (user: TelegramUser) => {
      onAuth(user);
    };

    if (containerRef.current) {
      containerRef.current.innerHTML = '';

      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', botName);
      script.setAttribute('data-size', buttonSize);
      script.setAttribute('data-radius', cornerRadius.toString());
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', requestAccess);
      script.async = true;

      containerRef.current.appendChild(script);
    }

    return () => {
      delete (window as any).onTelegramAuth;
    };
  }, [botName, buttonSize, cornerRadius, requestAccess, onAuth]);

  // Handler for simulated login in development
  const handleDevLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const fakeTgId = Math.floor(100000000 + Math.random() * 900000000);
    const mockUser: TelegramUser = {
      id: fakeTgId,
      first_name: devUser.trim() || 'کاربر تستی فرانت‌چپتر',
      username: devUser.trim()
        ? devUser.trim().replace(/\s+/g, '_')
        : 'dev_user',
      photo_url:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      auth_date: Math.floor(Date.now() / 1000),
      hash: 'dev_mock_hash_' + Date.now(),
    };
    onAuth(mockUser);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-border bg-surface-solid p-6 text-center ${
        className || ''
      }`}
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-2xl text-sky-500">
        ✈️
      </div>
      <h3 className="mb-1 text-base font-bold text-dark md:text-lg">
        ورود با حساب تلگرام
      </h3>
      <p className="mb-6 max-w-sm text-xs text-muted md:text-sm">
        برای همگام‌سازی تگ و امتیازهای هویجی در گروه فرانت‌چپتر، با اکانت تلگرام
        خود وارد شوید:
      </p>

      {/* Official Telegram Widget Container */}
      <div
        ref={containerRef}
        className="flex min-h-[48px] items-center justify-center"
      />

      {/* Local Dev Helper Fallback Toggle */}
      <div className="mt-6 w-full border-t border-border/40 pt-4 text-center">
        <button
          type="button"
          onClick={() => setIsDevMode(!isDevMode)}
          className="text-2xs text-muted/80 underline transition-colors hover:text-primary"
        >
          {isDevMode
            ? 'بستن پنل شبیه‌ساز ورود'
            : 'مشکل در لود ویجت تلگرام در لوکال‌هاست؟ (ورود تستی)'}
        </button>

        {isDevMode && (
          <form
            onSubmit={handleDevLogin}
            className="mt-3 flex flex-col items-center justify-center gap-2 sm:flex-row"
          >
            <input
              type="text"
              value={devUser}
              onChange={(e) => setDevUser(e.target.value)}
              placeholder="نام نمایشی شما"
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-dark focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-sky-500"
            >
              شبیه‌سازی ورود
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TelegramLoginWidget;
