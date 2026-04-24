const SectionCard = ({ title, subtitle, right, children, className = "" }) => {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-border/70 bg-surface/95 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm ${className}`}
    >
      <header className="flex items-start justify-between gap-3 pb-2">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-text-main">
            {title}
          </h3>

          {subtitle ? (
            <p className="mt-0.5 text-xs text-text-muted">{subtitle}</p>
          ) : null}
        </div>

        {right ? <div className="shrink-0">{right}</div> : null}
      </header>

      <div className="min-w-0">{children}</div>
    </section>
  );
};

export { SectionCard };
