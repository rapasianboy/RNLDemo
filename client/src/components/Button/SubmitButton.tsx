import type { FC } from "react";
import Spinner from "../Spinner/Spinner";

interface SubmitButtonProps {
  label: string;
  newClassName?: string;
  className?: string;
  loading?: boolean;
  loadinglabel?: string;
}

const SubmitButton: FC<SubmitButtonProps> = ({
  label,
  newClassName,
  className,
  loading,
  loadinglabel,
}) => {
  return (
    <>
      <button
        type="submit"
        className={
          newClassName
            ? newClassName
            : `px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg ${className}`
        }
        disabled={loading}
      >
        {loading ? (
          <div className="flex gap-1 items-center">
            <Spinner size="xs" />
            {loadinglabel}
          </div>
        ) : (
          label
        )}
      </button>
    </>
  );
};

export default SubmitButton;