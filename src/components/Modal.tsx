import { useEffect } from "react";
import type { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  primaryLabel?: string;
  showDefaultAction?: boolean;
};

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  primaryLabel = "OK",
  showDefaultAction = true,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-75 flex items-start justify-center bg-black/50 px-4 pt-[20vh]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {title ? (
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        ) : null}
        <div className="mt-3 text-gray-700">{children}</div>
        {showDefaultAction ? (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
            >
              {primaryLabel}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
