import { useCallback } from "react";

export function useToast() {
  // Basit bir mock: alert ile göster
  const toast = useCallback(({ title, description }: { title: string; description?: string }) => {
    window.alert(title + (description ? "\n" + description : ""));
  }, []);
  return { toast };
} 