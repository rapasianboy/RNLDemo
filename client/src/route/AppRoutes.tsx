import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import GenderMainPage from "../pages/Gender/GenderMainPage";
import EditGenderPage from "../pages/Gender/EditGenderPage";
import DeleteGenderPage from "../pages/Gender/DeleteGenderPage";
import UserMainPage from "../pages/User/UserMainPage";
import LoginPage from "../pages/Auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<GenderMainPage />} />
          <Route path="/gender" element={<GenderMainPage />} />
          <Route path="/gender/edit/:gender_id" element={<EditGenderPage />} />
          <Route path="/gender/delete/:gender_id" element={<DeleteGenderPage />} />
          <Route path="/users" element={<UserMainPage />}/>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
export { AppRoutes };