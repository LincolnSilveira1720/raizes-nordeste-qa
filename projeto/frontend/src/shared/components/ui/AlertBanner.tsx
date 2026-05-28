import type { ReactNode } from "react";

interface AlertBannerProps {
  icon: ReactNode;
  title: string;
  message: string;
}

export function AlertBanner({ icon, title, message }: AlertBannerProps) {
  return (
    <section className="alert-banner" aria-live="polite">
      <span className="alert-icon">{icon}</span>
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
    </section>
  );
}
