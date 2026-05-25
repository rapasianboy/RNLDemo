import { Outlet } from "react-router-dom"
import { HeaderProvider } from "../contexts/HeaderContext"
import { SidebarProvider } from "../contexts/SidebarContext"
import AppHeader from "./Appheader"
import AppSidebar from "./AppSidebar"



export const AppLayout = () => {
  return (
    <SidebarProvider>
      <HeaderProvider>
        <>
          <div>
            <AppSidebar />
          </div>
          <div>
            <AppHeader />
          </div>
          <div className="min-h-screen bg-teal-50 px-6 pt-20 sm:ml-64">
            <Outlet />
          </div>
        </>
      </HeaderProvider>
    </SidebarProvider>
  )
}

export default AppLayout;
