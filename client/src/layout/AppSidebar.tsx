import { Link } from "react-router-dom";
import { useSidebar } from "../contexts/SidebarContext";
export const AppSidebar = () => {
  const { isOpen } = useSidebar();

const sidebarItems = [
  {
    path: "/gender",
    text: "Genders",
  },
  {
    path: "/users",
    text: "Users",
  },
];

  return (
    <>
    <aside id="top-bar-sidebar" className={`fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`} aria-label="Sidebar">
   <div className="h-full px-3 py-4 overflow-y-auto bg-teal-900 border-e border-teal-800">
      <ul className="space-y-2 font-medium">
            {sidebarItems.map((sidebarItem) => (
               <li key={sidebarItem.text}>
            <Link to={sidebarItem.path} className="flex items-center px-2 py-1.5 text-teal-50 rounded-md hover:bg-teal-800 hover:text-white group">
               <svg className="w-5 h-5 transition duration-75 text-teal-200 group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z"/></svg>
               <span className="ms-3">{sidebarItem.text}</span>
            </Link>
         </li>
            ))}
      </ul>
   </div>
</aside>
    </>
    
  )
}

export default AppSidebar;