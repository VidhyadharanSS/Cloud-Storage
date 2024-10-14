import { useState } from "react"
import connectMetaMask from "../../utils/connectMetaMask"
import { usePinataContext } from '../../context/PinataContext'

function Navbar(): React.ReactElement {
    const pinataContext = usePinataContext()

    let theme = false

    if (localStorage.getItem('theme'))
        theme = Boolean(localStorage.getItem('theme'))

    const [isDarkMode, setIsDarkMode] = useState<boolean>(theme)

    const handleThemeMode = (): void => {
        const root = document.documentElement
        const isDark = root.classList.contains('dark')

        if (isDark) {
            root.classList.remove('dark')
            setIsDarkMode(false)
            localStorage.setItem('theme', 'false')
        } else {
            root.classList.add('dark')
            setIsDarkMode(true)
            localStorage.setItem('theme', 'true')
        }
    }

    const handleConnectWeb3 = async (): Promise<void> => {
        if (pinataContext) 
            await connectMetaMask(pinataContext)
    }

    return (
        <div className="flex items-center justify-between px-6 md:px-48 py-4 md:py-6 w-full">
            <div onClick={() => window.location.reload()} className="flex flex-col items-start justify-center hover:cursor-pointer">
                <div className="flex items-center justify-center gap-1 md:gap-2">
                    <img src="/assets/pinlogo.png" className="w-[17px] mb-1 md:w-[20px] h-auto object-center" />
                    <h1 className="text-lg md:text-2xl font-bold font-moderustic">CloudX</h1>
                </div>
                <p className="opacity-60 text-xs md:text-sm font-medium">Team Binaries</p>
            </div>

            <div className="text-xs md:text-sm flex items-center justify-center gap-3 md:gap-5">
                <button onClick={handleThemeMode} className="flex items-center justify-center rounded-full px-3 py-[10px] shadow-lg bg-[#fff] hover:opacity-80 border-[1px] border-purple-700 dark:border-[#282828] dark:bg-[#282828]">
                    <i className={`fa-regular ${isDarkMode ? 'fa-sun' : 'fa-moon'} dark:text-gray-200 text-gray-900`}></i>
                </button>

                {pinataContext && pinataContext?.account ? 
                <div className="flex items-center justify-center bg-[#fff] shadow-lg dark:bg-[#1f1f1f] rounded-3xl px-3 py-2 md:px-5 md:py-4">
                    <img src="/assets/metat.png" className='w-[30px] h-auto object-cover' />
                    <p className="hidden md:block font-medium">{pinataContext?.account}</p>
                    <p className='md:hidden font-medium'>{pinataContext?.account?.slice(0, 6)}....{pinataContext?.account?.slice(pinataContext?.account.length - 5, pinataContext?.account.length)}</p>
                </div>:
                <button onClick={handleConnectWeb3} className="rounded-3xl px-3 py-2 md:px-5 md:py-3 border-[0.5px] border-orange-600 bg-orange-600 text-white shadow-lg dark:bg-[#151515] hover:bg-transparent hover:text-gray-800 dark:hover:bg-orange-600 transition-all duration-200 flex items-center justify-center">
                    <img src="/assets/metat.png" className='w-[30px] h-auto object-cover' />
                    <p className="font-semibold">Connect wallet</p>
                </button>}
            </div>
        </div>
    )
}

export default Navbar