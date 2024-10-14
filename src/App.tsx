import { Outlet } from "react-router-dom"
import { PinataProvider } from './context/PinataContext'
import Toast from "./components/toast/Toast.tsx"
import './style.css'

function App(): React.ReactElement {

  return (
    <PinataProvider>
      <div className='flex items-center overflow-hidden justify-start font-inter bg-[#f1f1f1] text-gray-800 dark:bg-[#101010] dark:text-white w-full min-h-screen text-sm md:text-lg transition-all duration-200'>
        <Toast />
        <Outlet />
      </div>
    </PinataProvider>
  )
}

export default App
