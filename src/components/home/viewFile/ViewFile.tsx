import { usePinataContext } from '../../../context/PinataContext'
import { useState } from 'react'
import ViewAll from './ViewAll'
import ViewImages from './ViewImages'
import ViewVideos from './ViewVideos'
import ViewDocs from './ViewDoc'
import ViewAllTable from './ViewAllTable'
import './style.css'

enum ViewMethods {
    TABLE,
    ALL,
    IMAGES,
    VIDEOS,
    DOCUMENTS,
}

function ViewFile(): React.ReactElement {
    const pinataContext = usePinataContext()
    const [viewMethod, setViewMethod] = useState<number>(ViewMethods.TABLE)
    const [selectAllChecks, setSelectAllChecks] = useState<boolean>(false)
    const [showDeleteButton, setShowDeleteButton] = useState<boolean>(false)
    const [deleteSelectedItems, setDeleteSelectedItems] = useState<boolean>(false)
    const [deleteAllLoader, setDeleteAllLoader] = useState<boolean>(false)

    return (
        <div className='w-full flex flex-col items-center justify-center relative text-xs md:text-sm '>
            <img src="/assets/svg-blob.svg" className="absolute w-[70%] h-auto opacity-30 top-16 blur-[120px]"/>

            <div className="w-[90%] md:w-[60%] flex flex-col z-10 items-center justify-center border-[1px] bg-[#fdfdfd] dark:bg-[#1a1a1a] dark:border-[#1a1a1a] rounded-t-[70px] md:rounded-t-[90px] shadow-lg mt-20 md:mt-36 px-6 py-5 pb-24">
                <div className={`${pinataContext?.account ? 'hidden' : 'flex'} flex-col md:flex-row items-center justify-center md:px-12 py-2 w-full`}>
                    <div className='flex items-center justify-center'>
                        <img src="/assets/metat.png" className='w-[50px] h-auto object-cover' />
                        <p>Connect your <span className='text-orange-500 font-semibold'>MetaMask</span> account to see all your saved files</p>
                    </div>
                </div>

                <div className={`${pinataContext?.account ? 'flex' : 'hidden'} items-center justify-between md:px-16 py-2 w-full`}>
                    <div className='flex items-center justify-center'>
                        <img src="/assets/metat.png" className='w-[50px] animate-incoming-toast h-auto object-cover' />
                        <p><span className='text-orange-500 font-semibold'>MetaMask</span> wallet is connected</p>
                        <img src="/assets/right.png" className='mx-3 w-[17px] h-[17px] object-cover' />
                    </div>
                    <p className='md:hidden font-semibold'>{pinataContext?.account?.slice(0, 6)}....{pinataContext?.account?.slice(pinataContext?.account.length - 5, pinataContext?.account.length)}</p>
                    <p className='hidden md:block font-semibold'>{pinataContext?.account}</p>
                </div>

                <div className='flex flex-col items-center justify-center w-full'>
                    <div className='flex flex-col md:flex-row items-end justify-between w-full border-b-[0.5px] border-gray-300 dark:border-gray-700 pb-3 mt-5 md:px-16'>
                        <div className='flex flex-col items-center justify-center md:items-start md:justify-start w-full mb-5 md:mb-0'>
                            <p className='text-lg md:text-xl font-semibold'>Your space</p>
                            <p className='text-xs md:text-sm opacity-70'>All the uploaded files are shown down below</p>
                        </div>

                        <div className='text-xs md:text-sm flex items-center justify-between gap-1 px-6 md:px-0 md:justify-center text-gray-900 dark:text-gray-100 w-full md:w-auto'>
                            <button onClick={() => setViewMethod(ViewMethods.TABLE)} className={`${viewMethod === 0 ? 'text-purple-600 bg-[#343434]' : ''} w-[35px] h-[35px] flex items-center justify-center p-2 md:p-3 hover:opacity-70 rounded-full transition-all duration-200`}>
                                <i className="fa-solid fa-table"></i>
                            </button>

                            <button onClick={() => setViewMethod(ViewMethods.ALL)} className={`${viewMethod === 1 ? 'text-purple-600 bg-[#343434]' : ''} w-[35px] h-[35px] flex items-center justify-center p-2 md:p-3 hover:opacity-70 rounded-full transition-all duration-200`}>
                                <i className="fa-solid fa-photo-film"></i>
                            </button>

                            <button onClick={() => setViewMethod(ViewMethods.IMAGES)} className={`${viewMethod === 2 ? 'text-purple-600 bg-[#343434]' : ''} w-[35px] h-[35px] flex items-center justify-center p-2 md:p-3 hover:opacity-70 rounded-full transition-all duration-200`}>
                                <i className="fa-solid fa-image"></i>
                            </button>

                            <button onClick={() => setViewMethod(ViewMethods.VIDEOS)} className={`${viewMethod === 3 ? 'text-purple-600 bg-[#343434]' : ''} w-[35px] h-[35px] flex items-center justify-center p-2 md:p-3 hover:opacity-70 rounded-full transition-all duration-200`}>
                                <i className="fa-solid fa-video"></i>
                            </button>

                            <button onClick={() => setViewMethod(ViewMethods.DOCUMENTS)} className={`${viewMethod === 4 ? 'text-purple-600 bg-[#343434]' : ''} w-[35px] h-[35px] flex items-center justify-center p-2 md:p-3 hover:opacity-70 rounded-full transition-all duration-200`}>
                                <i className="fa-solid fa-file"></i>
                            </button>
                        </div>
                    </div>

                    {pinataContext && pinataContext?.files.length > 0 && viewMethod === 0 && <div className='w-full flex items-center justify-end md:px-16 mt-6 gap-2'>
                        <button onClick={() => setDeleteSelectedItems(true)} className={`${showDeleteButton ? 'flex' : 'hidden'} text-[10px] md:text-sm px-3 py-1 md:px-4 md:py-2 font-semibold rounded-md md:rounded-lg shadow-lg hover:opacity-70 border-[0.5px] text-white border-red-700 bg-red-700`}>
                            {deleteAllLoader ?
                                <p><div className="text-xs lds-ring"><div></div><div></div><div></div><div></div></div></p>: 
                                <p>Delete selected ones?</p>}
                        </button>
                        <button onClick={() => setSelectAllChecks(prev => !prev)} className='px-3 py-1 md:px-4 md:py-2 text-[10px] md:text-sm font-semibold rounded-md md:rounded-lg shadow-lg hover:opacity-70 bg-[#ffffff] border-[0.5px] border-purple-700 dark:border-[#313131] dark:bg-[#313131]'>{selectAllChecks ? 'Cancel - select all' : 'Select all'}</button>
                    </div>}

                    {pinataContext?.files?.length === 0 ? 
                    <div className='mt-16 my-10 flex flex-col items-center justify-center w-full'>
                        <i className="text-6xl fa-solid fa-photo-film"></i>
                        <p className='opacity-80 mt-5'>No files were uploaded from this account yet</p>
                        <p className='opacity-80 mt-1'>Or you might need to connect <span className='font-semibold text-orange-500'>MetaMask</span> wallet</p>
                    </div>:
                    <div className='my-3 md:my-5 md:mt-4 md:mb-9 flex flex-col items-center justify-center w-full md:px-16'>
                        {viewMethod === 0 && <ViewAllTable setDeleteAllLoader={setDeleteAllLoader} selectAllChecks={selectAllChecks} setShowDeleteButton={setShowDeleteButton} deleteSelectedItems={deleteSelectedItems} setDeleteSelectedItems={setDeleteSelectedItems} />}

                        {viewMethod === 1 && <ViewAll />}

                        {viewMethod === 2 && <ViewImages />}

                        {viewMethod === 3 && <ViewVideos />}

                        {viewMethod === 4 && <ViewDocs />}
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default ViewFile