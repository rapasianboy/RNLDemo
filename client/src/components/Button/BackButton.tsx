import type { FC } from "react";
import { Link } from "react-router-dom";

interface BackButtonProps {
  label: string;
  path: string;
  newClassName?: string;
  className?: string;
}

const BackButton: FC<BackButtonProps> = ({
  label,
  path,
  newClassName,
  className,
}) => {
  return (
    <Link
      to={path}
      className={`${
        newClassName
          ? newClassName
          : `px-4 py-3 bg-white hover:bg-teal-50 text-teal-700 hover:text-teal-800 border border-teal-200 text-sm font-medium cursor-pointer rounded-lg shadow-lg ${className}`
      }`}
    >
      {label}
    </Link>
  );
};

export default BackButton;