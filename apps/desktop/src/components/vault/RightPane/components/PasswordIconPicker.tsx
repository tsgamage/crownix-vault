import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { KeyRoundIcon } from "lucide-react";
import { useState } from "react";
import EmojiPicker, {
  type EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";

interface PasswordIconPickerProps {
  icon?: string;
  isEditing: boolean;
  onChange: (icon: string) => void;
}

export function PasswordIconPicker({
  icon,
  isEditing,
  onChange,
}: PasswordIconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen && isEditing} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          disabled={!isEditing}
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all",
            "bg-linear-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-600",
            isEditing
              ? "hover:bg-emerald-500/20 cursor-pointer border-stone-500/50 hover:border-emerald-500/30"
              : "cursor-default"
          )}
        >
          {icon || <KeyRoundIcon className="w-8 h-8" />}
          {/* {isEditing && !icon && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 hover:opacity-100 transition-opacity">
              <Smile className="text-white w-6 h-6" />
            </div>
          )} */}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 border-none ">
        <EmojiPicker
          onEmojiClick={(emoji: EmojiClickData) => onChange(emoji.emoji)}
          theme={Theme.DARK}
          emojiStyle={EmojiStyle.NATIVE}
          skinTonesDisabled
          previewConfig={{
            showPreview: false,
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
