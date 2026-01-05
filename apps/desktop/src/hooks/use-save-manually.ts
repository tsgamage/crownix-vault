import { useFileStore } from "@/store/file.store";

export default function useSaveManually() {
  const saveFile = useFileStore((state) => state.saveFile);
  const isSavingFile = useFileStore((state) => state.isSavingFile);
  const isSaved = useFileStore((state) => state.isSaved);

  const handleSaveFileManually = () => {
    if (!isSavingFile) {
      saveFile();
    }
  };

  return {
    saveFile: handleSaveFileManually,
    isSavingFile,
    isSaved,
  };
}
