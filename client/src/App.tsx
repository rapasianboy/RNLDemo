import { HashRouter } from "react-router-dom"
import { AppRoutes } from "./route/AppRoutes"

const App = () => {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  )
}

export default App