import { useEffect } from "react";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/UseToastmessage";
import EditGenderForm from "./components/EditGenderForm";

const EditGenderPage = () => {
  useEffect(() => {
    document.title = "Gender Edit Page";
  }, []);

  const {
    message: toastMessage,
    isVisible: toastMessageIsVisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false);

  return (
    <>
      <ToastMessage
        message={toastMessage}
        isVisible={toastMessageIsVisible}
        onClose={closeToastMessage}
      />
      <EditGenderForm onGenderUpdated={showToastMessage} />
    </>
  );
};

export default EditGenderPage;