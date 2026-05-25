import { useState, type FC, type FormEvent } from "react";
import type { AxiosError } from "axios";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import GenderService from "../../../services/GenderService";
import type { GenderFieldErrors } from "../../../interfaces/GenderFieldErrors";

interface AddGenderFormProps {
  onGenderAdded: (message: string) => void;
  refreshKey: () => void
}

interface ValidationErrorResponse {
  errors: GenderFieldErrors;
}

const AddGenderForm: FC<AddGenderFormProps> = ({ onGenderAdded, refreshKey }) => {
  const [loadingStore, setLoadingStore] = useState(false);
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState<GenderFieldErrors>({});

  const handleStoreGender = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoadingStore(true);

      const res = await GenderService.storeGender({gender});

      if (res.status === 200) {
        setGender("");
        setErrors({});
        onGenderAdded(res.data.message);
        refreshKey()
        setErrors({});
      } else {
        console.error(
          "Unexpected error occurred during store gender:",
          res.data?.message
        );
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ValidationErrorResponse>;
      if (axiosError.response?.status === 422 && axiosError.response.data?.errors) {
        setErrors(axiosError.response.data.errors);
      } else {
        console.error("Unexpected error occurred during store gender:", error);
      }
    } finally {
      setLoadingStore(false);
    }
  };

  return (
    <form onSubmit={handleStoreGender}>
      <div className="mb-4">
        <FloatingLabelInput
          label="Gender"
          type="text"
          name="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          autoFocus
          errors={errors.gender}
        />
      </div>

      <div className="flex justify-end">
        <SubmitButton
          label="Save Gender"
          loading={loadingStore}
          loadinglabel="Saving Gender..."
        />
      </div>
    </form>
  );
};

export default AddGenderForm;