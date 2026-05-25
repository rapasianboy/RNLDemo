import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddGenderForm from "./components/AddGenderForm";
import GenderList from "./components/GenderList";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/UseToastmessage";
import { useRefresh } from "../../hooks/UseRefresh";

const GenderMainPage = () => {

const {
message: toastMessage,
isVisible: toastMessageIsVisible,
showToastMessage,
closeToastMessage,
} = useToastMessage("", false);

const location = useLocation();
const navigate = useNavigate();

const { refresh, handleRefresh } = useRefresh(false);

useEffect(() => {
document.title = "Gender Main Page";
}, []);

useEffect(() => {
const messageFromState = (location.state as { toastMessage?: string } | null)?.toastMessage;
if (messageFromState) {
showToastMessage(messageFromState);
navigate(location.pathname, { replace: true, state: null });
}
}, [location.pathname, location.state, navigate, showToastMessage]);

return (
<>
<ToastMessage
message={toastMessage}
isVisible={toastMessageIsVisible}
onClose={closeToastMessage}
/>

<div className="grid grid-cols-2 gap-4">
<div className="col-span-2 md:col-span-1">
<AddGenderForm onGenderAdded={showToastMessage} refreshKey={handleRefresh} />
</div>
<div className="col-span-2 md:col-span-1">
<GenderList refreshKey={refresh} />
</div>
</div>
</>
);

};

export default GenderMainPage;