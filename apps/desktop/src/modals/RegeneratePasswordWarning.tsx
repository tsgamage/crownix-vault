export function RegeneratePasswordWarning() {
  return (
    <div className="space-y-4 py-2 text-left">
      {/* Risk Alert */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-destructive/5 border border-destructive/20">
        <div className="relative z-10 flex gap-4">
          <div className="space-y-2 flex-1">
            <h4 className="text-sm font-bold text-destructive leading-tight tracking-tight uppercase flex items-center gap-2">
              Access Risk Warning
            </h4>
            <p className="text-sm text-destructive/80 leading-relaxed font-semibold">
              Generating a new password will invalidate your current one. If you don't update it on the website first,
              you'll be{" "}
              <span className="text-red-600 font-extrabold underline decoration-red-500/30 underline-offset-2 bg-red-500/10 px-1 rounded-sm">
                locked out
              </span>{" "}
              of your account.
            </p>
          </div>
        </div>
      </div>

      {/* Recommendation Card */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-muted/20 border border-border/40">
        <div className="relative z-10 flex gap-4">
          <div className="space-y-2 flex-1">
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              <span className="text-foreground/90 font-bold underline decoration-emerald-500/30 underline-offset-2">
                Open the website's password settings first
              </span>
              , then generate and update the password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
