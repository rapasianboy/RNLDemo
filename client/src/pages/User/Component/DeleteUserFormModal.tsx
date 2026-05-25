import { useEffect, useState, type FC, type FormEvent } from "react";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import Modal from "../../../components/Modal";
import UserService from "../../../services/UserService";

interface DeleteUserFormModalProps {
  isOpen: boolean;
  userId: number | null;
  onClose: () => void;
  onUserDeleted: (message: string) => void;
}

interface UserFormData {
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  gender: string;
  birth_date: string;
  username: string;
}

const defaultFormData: UserFormData = {
  first_name: "",
  middle_name: "",
  last_name: "",
  suffix_name: "",
  gender: "",
  birth_date: "",
  username: "",
};

const DisplayField: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="mb-4">
    <p className="text-3 font-semibold text-teal-900">{label}</p>
    <p className="text-3 text-teal-700">{value || ""}</p>
  </div>
);

const DeleteUserFormModal: FC<DeleteUserFormModalProps> = ({ isOpen, userId, onClose, onUserDeleted }) => {
  const [formData, setFormData] = useState<UserFormData>({ ...defaultFormData });
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleLoadUser = async (id: number) => {
    try {
      const res = await UserService.getUser(id);
      if (res.status === 200 && res.data.user) {
        const user = res.data.user;
        const formattedBirthDate = user.birth_date ? String(user.birth_date).split("T")[0] : "";

        setFormData({
          first_name: user.first_name ?? "",
          middle_name: user.middle_name ?? "",
          last_name: user.last_name ?? "",
          suffix_name: user.suffix_name ?? "",
          gender: String(user.gender_id ?? ""),
          birth_date: formattedBirthDate,
          username: user.username ?? "",
        });
      }
    } catch (error) {
      console.error("Unexpected server error occurred during getting user:", error);
    }
  };

  useEffect(() => {
    if (!isOpen || !userId) return;
    void handleLoadUser(userId);
  }, [isOpen, userId]);

  const handleDeleteUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setLoadingDelete(true);
      const res = await UserService.deleteUser(userId);
      if (res.status === 200) {
        onClose();
        onUserDeleted(res.data?.message ?? "User Successfully Deleted.");
      }
    } catch (error) {
      console.error("Unexpected server error occurred during deleting user:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <form onSubmit={handleDeleteUser}>
        <h1 className="text-2xl border-b border-teal-100 p-4 font-semibold mb-4 text-teal-900">Delete User Form</h1>

        <div className="grid grid-cols-2 gap-4 border-b border-teal-100 mb-4">
          <div className="col-span-2 md:col-span-1">
            <DisplayField label="First Name" value={formData.first_name} />
            <DisplayField label="Middle Name" value={formData.middle_name} />
            <DisplayField label="Last Name" value={formData.last_name} />
            <DisplayField label="Suffix Name" value={formData.suffix_name} />
            <DisplayField label="Gender" value={formData.gender} />
          </div>

          <div className="col-span-2 md:col-span-1">
            <DisplayField label="Birth Date" value={formData.birth_date} />
            <DisplayField label="First Name" value={formData.username} />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <CloseButton label="Close" onClose={onClose} />
          <SubmitButton
            label="Delete User"
            loading={loadingDelete}
            loadinglabel="Deleting User..."
            newClassName="px-4 py-3 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg"
          />
        </div>
      </form>
    </Modal>
  );
};

export default DeleteUserFormModal;
