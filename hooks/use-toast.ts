"use client";

import hotToast from "react-hot-toast";
import "../styles/toast.css";

type ToastVariant =
  | "default"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "loading";

interface ToastOptions {
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export const toastStyles: Record<ToastVariant, string> = {
  default: "custom-toast",
  success: "custom-toast success",
  destructive: "custom-toast destructive",
  warning: "custom-toast warning",
  info: "custom-toast info",
  loading: "custom-toast loading",
};

function getToastConfig(variant: ToastVariant, duration?: number) {
  return {
    duration: duration ?? 4000,
    className: toastStyles[variant],
  };
}

export function toast({
  description,
  variant = "default",
  duration,
}: ToastOptions) {
  const message = description || "Notificação";
  const config = getToastConfig(variant, duration);
  switch (variant) {
    case "destructive":
      return hotToast.error(message, config);
    case "success":
      return hotToast.success(message, config);
    case "loading":
      return hotToast.loading(message, config);
    case "warning":
      return hotToast(message, { ...config, icon: "⚠️" });
    case "info":
      return hotToast(message, { ...config, icon: "ℹ️️" });
    default:
      return hotToast(message, config);
  }
}

type ToastShortcut = (message: string, options?: { duration?: number }) => void;

const createToastShortcut =
  (variant: ToastVariant): ToastShortcut =>
  (message, options) =>
    toast({ description: message, variant, duration: options?.duration });

(toast as any).success = createToastShortcut("success");
(toast as any).error = createToastShortcut("destructive");
(toast as any).warning = createToastShortcut("warning");
(toast as any).info = createToastShortcut("info");
(toast as any).loading = (message: string) =>
  toast({ description: message, variant: "loading" });
