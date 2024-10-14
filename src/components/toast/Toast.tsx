import { useEffect } from 'react'
import { usePinataContext } from '../../context/PinataContext'

const audio = new Audio('/assets/windows.wav')
const Toast: React.FC = () => {
    const pinataContext = usePinataContext()

    useEffect(() => {
        const playToastSound = async () => {
            await audio.play()
        }
        if (pinataContext && pinataContext.isToast) {
            playToastSound()
            const timer = setTimeout(() => {
                pinataContext?.setIsToast(false)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [pinataContext])

    if (!pinataContext || !pinataContext?.isToast) return null

    return (
        <div className={`${pinataContext?.isToast ? 'fixed' : 'hidden'} flex bottom-5 md:bottom-20 transition-all duration-300 text-sm bg-[#ffffff] text-gray-800 dark:text-gray-200 z-30 border-[0.5px] border-purple-600 left-4 md:left-8 shadow-lg items-center justify-center px-5 md:py-7 py-5 rounded-lg w-[90%] md:w-[30%] dark:bg-[#2e2e2e]`}>
            <i className="mx-3 fa-solid fa-bell md:text-md"></i>
            <p>{pinataContext?.toastMessage}</p>
        </div>
    )
}

export default Toast