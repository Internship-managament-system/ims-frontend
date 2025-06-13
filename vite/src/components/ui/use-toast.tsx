import { useCallback } from "react";
import toast from "react-hot-toast";

export function useToast() {
  const showToast = useCallback(({ title, description, type = "success" }: { title: string; description?: string; type?: "success" | "error" | "info" }) => {
    if (type === "success") {
      toast.success(title + (description ? "\n" + description : ""));
    } else if (type === "error") {
      toast.error(title + (description ? "\n" + description : ""));
    } else {
      toast(title + (description ? "\n" + description : ""));
    }
  }, []);

  return { toast: showToast };
} 