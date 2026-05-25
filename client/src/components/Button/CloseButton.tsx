import type { FC } from "react";

interface CloseButtonProps {
  label: string;
  onClose: () => void;
  newClassName?: string;
  className?: string;
}

const CloseButton: FC<CloseButtonProps> = ({
  label,
  onClose,
  newClassName,
  className,
}) => {
  return (
    <button
      type="button"
      className={
        newClassName
          ? newClassName
          : `px-4 py-3 bg-white hover:bg-teal-50 text-teal-700 hover:text-teal-800 border border-teal-200 text-sm font-medium cursor-pointer rounded-lg shadow-lg ${className}`
      }
      onClick={onClose}
    >
      {label}
    </button>
  );
};

export default CloseButton;