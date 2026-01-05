import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useSaveManually from "@/hooks/use-save-manually";
import { SaveIcon, Loader2Icon, CircleCheckBigIcon } from "lucide-react";

export default function ManuallySaveButton() {
  const { saveFile, isSavingFile, isSaved } = useSaveManually();

  return (
    <Tooltip>
      <TooltipTrigger
        className="h-7 w-7 cursor-pointer"
        title="Save Changes & Refresh"
        disabled={isSavingFile || isSaved}
        onClick={saveFile}
      >
        {isSavingFile ? (
          <Loader2Icon className="w-4 h-4 animate-spin" />
        ) : isSaved ? (
          <CircleCheckBigIcon className="w-4 h-4 text-emerald-600" opacity={20} />
        ) : (
          <SaveIcon className="w-4 h-4" />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <p>{isSavingFile ? "Saving..." : isSaved ? "Saved" : "Save Changes"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
