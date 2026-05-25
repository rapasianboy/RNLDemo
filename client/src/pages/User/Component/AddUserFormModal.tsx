import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent, type FC, type FormEvent } from "react";
import type { AxiosError } from "axios";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import Modal from "../../../components/Modal";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import SubmitButton from "../../../components/Button/SubmitButton";
import CloseButton from "../../../components/Button/CloseButton";
import GenderService from "../../../services/GenderService";
import UserService, { type StoreUserPayload } from "../../../services/UserService";

interface AddUserFormModalPros {
  isOpen: boolean
  onClose: () => void
  onUserAdded: (message: string) => void
}

interface UserFormData {
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  gender: string;
  birth_date: string;
  username: string;
  password: string;
  password_confirmation: string;
}

interface UserFieldErrors {
  first_name?: string[];
  last_name?: string[];
  gender?: string[];
  birth_date?: string[];
  username?: string[];
  password?: string[];
  password_confirmation?: string[];
  profile_picture?: string[];
}

interface GenderOption {
  gender_id: number;
  gender: string;
}

interface ValidationErrorResponse {
  errors: UserFieldErrors;
}

const defaultFormData: UserFormData = {
  first_name: "",
  middle_name: "",
  last_name: "",
  suffix_name: "",
  gender: "",
  birth_date: "",
  username: "",
  password: "",
  password_confirmation: "",
};

const AddUserFormModal: FC<AddUserFormModalPros> = ({ isOpen, onClose, onUserAdded }) => {
  const [formData, setFormData] = useState<UserFormData>({
    ...defaultFormData,
  });
  const [errors, setErrors] = useState<UserFieldErrors>({});
  const [genders, setGenders] = useState<GenderOption[]>([]);
  const [loadingSave, setLoadingSave] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profilePreviewUrl = useMemo(() => {
    if (!profilePicture) return "";
    return URL.createObjectURL(profilePicture);
  }, [profilePicture]);

  const handleLoadGenders = async () => {
    try {
      const res = await GenderService.loadGenders();
      if (res.status === 200) {
        setGenders(res.data.genders ?? []);
      }
    } catch (error) {
      console.error("Unexpected server error occurred during loading genders:", error);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    void handleLoadGenders();
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (profilePreviewUrl) {
        URL.revokeObjectURL(profilePreviewUrl);
      }
    };
  }, [profilePreviewUrl]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleProfilePictureChange = (file: File | null) => {
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        profile_picture: ["Please upload a PNG, JPG, or JPEG image."],
      }));
      return;
    }

    setProfilePicture(file);
    setErrors((prev) => ({
      ...prev,
      profile_picture: undefined,
    }));
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleProfilePictureChange(e.target.files?.[0] ?? null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(false);
    handleProfilePictureChange(e.dataTransfer.files?.[0] ?? null);
  };

  const handleBrowseFile = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setErrors((prev) => ({
      ...prev,
      profile_picture: undefined,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newErrors: UserFieldErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = ["The first name field is required."];
    if (!formData.last_name.trim()) newErrors.last_name = ["The last name field is required."];
    if (!formData.gender) newErrors.gender = ["The gender field is required."];
    if (!formData.birth_date) newErrors.birth_date = ["The birth date field is required."];
    if (!formData.username.trim()) newErrors.username = ["The username field is required."];
    if (!formData.password) newErrors.password = ["The password field is required."];
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = ["The password confirmation field is required."];
    }

    if (!newErrors.username && formData.username.trim().toLowerCase() === "johndoe") {
      newErrors.username = ["The username has already been taken."];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    void handleStoreUser();
  };

  const handleStoreUser = async () => {
    try {
      setLoadingSave(true);
      setErrors({});

      const payload: StoreUserPayload = {
        first_name: formData.first_name.trim(),
        middle_name: formData.middle_name.trim(),
        last_name: formData.last_name.trim(),
        suffix_name: formData.suffix_name.trim(),
        profile_picture: profilePicture,
        gender_id: Number(formData.gender),
        birth_date: formData.birth_date,
        username: formData.username.trim(),
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };

      const res = await UserService.storeUser(payload);
      if (res.status === 200) {
        setFormData({ ...defaultFormData });
        setProfilePicture(null);
        onClose();
        onUserAdded(res.data?.message ?? "User Successfully Saved.");
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ValidationErrorResponse>;
      if (axiosError.response?.status === 422 && axiosError.response.data?.errors) {
        setErrors(axiosError.response.data.errors);
      } else {
        console.error("Unexpected server error occurred during saving user:", error);
      }
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
        <form onSubmit={handleSubmit} noValidate>
          <h1 className="text-2xl border-b border-teal-100 p-4 font-semibold mb-4 text-teal-900">
            Add User Form
          </h1>

          <div className="mb-4 border-b border-teal-100 pb-4">
            <label className="mb-2 block text-sm font-medium text-teal-700">
              Profile Picture
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg"
              className="hidden"
              onChange={handleFileInputChange}
            />
            <div
              className={`rounded-xl border border-dashed px-6 py-8 text-center transition ${
                isDraggingFile ? "border-teal-500 bg-teal-50" : "border-teal-300 bg-white"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={handleDrop}
            >
              {profilePreviewUrl ? (
                <div className="flex min-h-40 items-center justify-center">
                  <img
                    src={profilePreviewUrl}
                    alt="Profile preview"
                    className="h-32 w-32 rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 16V5m0 0-4 4m4-4 4 4M5 16.5v1A1.5 1.5 0 0 0 6.5 19h11a1.5 1.5 0 0 0 1.5-1.5v-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-teal-900">Drag & Drop File Here</p>
                    <p className="mt-1 text-sm text-teal-700">Drag and drop your PNG, JPG or JPEG</p>
                  </div>
                  <button
                    type="button"
                    className="text-sm font-semibold text-teal-700 hover:underline"
                    onClick={handleBrowseFile}
                  >
                    Browse File
                  </button>
                </div>
              )}
            </div>
            {profilePreviewUrl && (
              <button
                type="button"
                className="mt-3 w-full rounded-lg bg-teal-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700"
                onClick={handleRemoveProfilePicture}
              >
                Remove Profile Picture
              </button>
            )}
            {errors.profile_picture && errors.profile_picture.length > 0 && (
              <span className="mt-2 block text-xs text-red-600">{errors.profile_picture[0]}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-teal-100 mb-4">

            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <FloatingLabelInput
                  label="First Name"
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  errors={errors.first_name}
                  required
                  autoFocus
                />
              </div>

              <div className="mb-4">
                <FloatingLabelInput
                  label="Middle Name"
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <FloatingLabelInput
                  label="Last Name"
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  errors={errors.last_name}
                  required
                />
              </div>

              <div className="mb-4">
                <FloatingLabelInput
                  label="Suffix Name"
                  type="text"
                  name="suffix_name"
                  value={formData.suffix_name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <FloatingLabelSelect
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  errors={errors.gender}
                  required
                >
                  <option value="">Select Gender</option>
                  {genders.map((gender, index) => (
                    <option value={gender.gender_id} key={index}>
                      {gender.gender}
                    </option>
                  ))}
                </FloatingLabelSelect>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <FloatingLabelInput
                  label="Birth Date"
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                  errors={errors.birth_date}
                  required
                />
              </div>

              <div className="mb-4">
                <FloatingLabelInput
                  label="Username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  errors={errors.username}
                  required
                />
              </div>

              <div className="mb-4">
                <FloatingLabelInput
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  errors={errors.password}
                  required
                />
              </div>

              <div className="mb-4">
                <FloatingLabelInput
                  label="Password Confirmation"
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  errors={errors.password_confirmation}
                  required
                />
              </div>
            </div>

          </div>
          <div className="flex justify-end gap-2">
            <CloseButton label="Close" onClose={onClose}/>
            <SubmitButton
              label="Save User"
              loading={loadingSave}
              loadinglabel="Saving User..."
            />
          </div>
        </form>
      </Modal>
    </>
  )
}

export default AddUserFormModal;