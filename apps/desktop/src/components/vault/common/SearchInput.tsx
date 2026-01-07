import { Search, X } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  shortcut?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
  shortcut = "k",
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in another input
      if (
        e.key === shortcut &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcut]);

  return (
    <InputGroup
      className={cn(
        "h-9 bg-muted/30 border-transparent hover:bg-muted/50 transition-all duration-200 group focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500/30 focus-within:bg-background shadow-sm",
        className
      )}
    >
      <InputGroupAddon>
        <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
      </InputGroupAddon>
      <InputGroupInput
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm placeholder:text-muted-foreground/50 h-full"
        autoComplete="one-time-code"
      />
      <InputGroupAddon align="inline-end" className="gap-1.5">
        {value ? (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            onClick={() => onChange("")}
            className="hover:bg-muted text-muted-foreground hover:text-foreground rounded-full h-6 w-6"
          >
            <X className="w-3.5 h-3.5" />
          </InputGroupButton>
        ) : (
          shortcut && (
            <Kbd className="bg-background border border-border/50 text-[10px] h-4.5 min-w-4.5 px-1 opacity-60 group-focus-within:opacity-0 transition-opacity">
              {shortcut}
            </Kbd>
          )
        )}
      </InputGroupAddon>
    </InputGroup>
  );
}
