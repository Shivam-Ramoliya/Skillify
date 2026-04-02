import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
    iconColor: "text-green-500",
    progress: "bg-green-500",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    iconColor: "text-red-500",
    progress: "bg-red-500",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    iconColor: "text-amber-500",
    progress: "bg-amber-500",
  },
  info: {
    icon: Info,
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    iconColor: "text-blue-500",
    progress: "bg-blue-500",
  },
};

function Toast({ toast, onDismiss }) {
  const config = toastConfig[toast.type] || toastConfig.info;
  const Icon = config.icon;

  return (
    <div
      className={`relative flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm overflow-hidden animate-slide-in-right ${config.bg} ${config.border}`}
      role="alert"
    >
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
      <p className={`text-sm font-medium flex-1 pr-6 ${config.text}`}>
        {toast.message}
      </p>
      <button
        onClick={() => onDismiss(toast.id)}
        className={`absolute top-3 right-3 p-1 rounded-lg hover:bg-black/5 transition-colors ${config.text}`}
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
      <div
        className={`absolute bottom-0 left-0 h-1 ${config.progress} animate-progress`}
        style={{ animationDuration: `${toast.duration}ms` }}
      />
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, type, message, duration };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (message, duration) => addToast("success", message, duration),
    [addToast],
  );

  const error = useCallback(
    (message, duration) => addToast("error", message, duration),
    [addToast],
  );

  const warning = useCallback(
    (message, duration) => addToast("warning", message, duration),
    [addToast],
  );

  const info = useCallback(
    (message, duration) => addToast("info", message, duration),
    [addToast],
  );

  const value = {
    toasts,
    addToast,
    dismissToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Container */}
      <div
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onDismiss={dismissToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastContext;
