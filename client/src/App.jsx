import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
function App() {


  return (
    <main>
      <Outlet />
      <Toaster />
    </main>
  )
}

export default App;