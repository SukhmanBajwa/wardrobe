import { X } from "lucide-react";
import { useEffect } from "react";

export default function ErrorBanner({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="animate-slide-down z-100">
      <div className="flex items-center gap-3 rounded-xl bg-red-900/90 border border-red-700 px-4 py-3 text-sm text-red-200 shadow-xl backdrop-blur-sm">
        <span>{message}</span>

        <button onClick={onClose} className="text-red-300 hover:text-white">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
