import { useState } from "react";
import { useModal } from "../../hooks/UseModal";
import { useRefresh } from "../../hooks/UseRefresh";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/UseToastmessage";
import AddUserFormModal from "./Component/AddUserFormModal";
import DeleteUserFormModal from "./Component/DeleteUserFormModal";
import EditUserFormModal from "./Component/EditUserFormModal";
import UserList from "./Component/UserList";

const UserMainPage = () => {
const { isOpen, openModal, closeModal } = useModal(false);
const [isEditOpen, setIsEditOpen] = useState(false);
const [isDeleteOpen, setIsDeleteOpen] = useState(false);
const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
const { refresh, handleRefresh } = useRefresh(false);
const {
  message: toastMessage,
  isVisible: toastMessageIsVisible,
  showToastMessage,
  closeToastMessage,
} = useToastMessage("", false);

const handleUserAdded = (message: string) => {
  showToastMessage(message);
  handleRefresh();
};

const openEditModal = (userId: number) => {
  setSelectedUserId(userId);
  setIsEditOpen(true);
};

const closeEditModal = () => {
  setIsEditOpen(false);
  setSelectedUserId(null);
};

const openDeleteModal = (userId: number) => {
  setSelectedUserId(userId);
  setIsDeleteOpen(true);
};

const closeDeleteModal = () => {
  setIsDeleteOpen(false);
  setSelectedUserId(null);
};

const handleUserUpdated = (message: string) => {
  showToastMessage(message);
  handleRefresh();
};

const handleUserDeleted = (message: string) => {
  showToastMessage(message);
  handleRefresh();
};

return (
  <>
    <ToastMessage
      message={toastMessage}
      isVisible={toastMessageIsVisible}
      onClose={closeToastMessage}
    />
    <AddUserFormModal isOpen={isOpen} onClose={closeModal} onUserAdded={handleUserAdded} />
    <EditUserFormModal
      isOpen={isEditOpen}
      userId={selectedUserId}
      onClose={closeEditModal}
      onUserUpdated={handleUserUpdated}
    />
    <DeleteUserFormModal
      isOpen={isDeleteOpen}
      userId={selectedUserId}
      onClose={closeDeleteModal}
      onUserDeleted={handleUserDeleted}
    />
    <UserList onAdduser={openModal} onEditUser={openEditModal} onDeleteUser={openDeleteModal} refreshKey={refresh} />
  </>
);
};

export default UserMainPage;