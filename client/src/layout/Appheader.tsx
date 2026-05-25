import { useNavigate } from "react-router-dom";
import { useSidebar } from "../contexts/SidebarContext";
import { useHeader } from "../contexts/HeaderContext";
import AuthService from "../services/AuthService";

interface StoredUser {
  first_name?: string;
  last_name?: string;
  username?: string;
}

const AppHeader = () => {
  const {isOpen, toggleUserMenu} = useHeader()
  const { toggleSidebar } = useSidebar()
  const navigate = useNavigate();
  const storedUserRaw = localStorage.getItem("user");
  let storedUser: StoredUser = {};

  try {
    storedUser = storedUserRaw ? (JSON.parse(storedUserRaw) as StoredUser) : {};
  } catch {
    storedUser = {};
  }

  const displayName =
    `${storedUser.first_name ?? ""} ${storedUser.last_name ?? ""}`.trim() || storedUser.username || "User";
  const displayUsername = storedUser.username || "Not available";
  const userInitials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "U";

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Unexpected server error occurred during logout:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      <nav className="fixed top-0 z-50 h-16 w-full border-b border-teal-800 bg-teal-900">
  <div className="px-3 py-3 lg:px-5 lg:pl-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-start rtl:justify-end">
        <button aria-controls="top-bar-sidebar" type="button" onClick={toggleSidebar} className="sm:hidden text-white bg-transparent box-border border border-transparent hover:bg-teal-800 focus:ring-4 focus:ring-teal-500 font-medium leading-5 rounded-md text-sm p-2 focus:outline-none">
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h10"/>
   </svg>
         </button>
        <div className="flex items-center ms-2 md:me-24">
          <div className="me-3 flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-sm font-semibold text-teal-700">
            RN
          </div>
          <span className="self-center whitespace-nowrap text-lg font-semibold text-white">RNLDemo</span>
        </div>
      </div>
      <div className="flex items-center">
          <div className="relative flex items-center ms-3">
            <div>
              <button type="button" onClick={toggleUserMenu} className="flex rounded-full bg-teal-800 text-sm focus:ring-4 focus:ring-teal-500" aria-expanded={isOpen}>
                <span className="sr-only">Open user menu</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-200 text-xs font-semibold text-teal-800">
                  {userInitials}
                </span>
              </button>
            </div>
            <div className={`absolute right-0 top-full mt-2 z-[60] ${isOpen ? "block" : "hidden"} bg-teal-900 border border-teal-800 rounded-md shadow-lg w-44`} id="dropdown-user">
              <div className="px-4 py-3 border-b border-teal-800" role="none">
                <p className="text-sm font-medium text-white" role="none">
                  {displayName}
                </p>
                <p className="text-sm text-teal-200 truncate" role="none">
                  {displayUsername}
                </p>
              </div>
              <ul className="p-2 text-sm text-teal-50 font-medium" role="none">
                <li>
                  <button
                    type="button"
                    className="inline-flex items-center w-full p-2 hover:bg-teal-800 hover:text-white rounded-md cursor-pointer"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </div>
  </div>
</nav>

    </>
  );
};

export default AppHeader;