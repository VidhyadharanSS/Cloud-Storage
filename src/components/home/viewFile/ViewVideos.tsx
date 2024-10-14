import { usePinataContext } from '../../../context/PinataContext'
import short from 'short-uuid'
import { useState } from 'react'

interface _File {
    ind: bigint
    url: string
    fileName: string
    time: number
    fileType: string
    storedPinataJWT: string
    storedPinataGateWayKey: string
}

interface ViewStatus {
    view: boolean
    url: string
    type: string
}

function ViewVideos(): React.ReactElement {
    const [deleteFileNumber, setDeleteFileNumber] = useState<number | null>(-1)
    const [deleteLoader, setDeleteLoader] = useState<boolean>(false)
    const pinataContext = usePinataContext()
    const [viewFileStatus, setViewFileStatus] = useState<ViewStatus>({view: false, url: '', type: ''})

    const handleDelete = async(ind: bigint[], hash: string[], storedPinataJWT: string[], storedPinataGateWayKey: string[]): Promise<void> => {
        setDeleteLoader(true)

        await pinataContext?.handleDeleteFile(ind, hash, pinataContext, storedPinataJWT, storedPinataGateWayKey)
        
        setDeleteLoader(false)
        setDeleteFileNumber(-1)
    }

    return (
        <div className={`grid ${pinataContext && pinataContext?.videos.length === 0 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'} w-full items-start justify-start gap-3`}>
            {pinataContext && pinataContext?.videos.length === 0 &&
                <div className='mt-10 flex flex-col items-center justify-center text-gray-800 dark:text-gray-100'>
                    <i className="text-4xl md:text-6xl fa-regular fa-folder-open"></i>
                    <p className='mt-1'>No videos uploaded yet</p>    
                </div>}

            {pinataContext && pinataContext?.videos && pinataContext?.videos.map((file: _File, index: number): React.ReactElement | null => {
                const filetype = file.fileType.split('/')

                if (filetype[0] === "" && file.fileName === "")
                    return null

                return (
                    <div key={short.generate()} className={`transition-all row-span-1 relative h-full w-full rounded-lg shadow-lg outline-none bg-[#e8e8e8] dark:bg-[#2b2b2b] hover:cursor-pointer`}>
                        {viewFileStatus.view && viewFileStatus.url !== '' &&
                            <div className='w-full flex flex-col items-center justify-center h-screen z-40 fixed inset-0 bg-[#0000003f]'>
                                <div className={`w-[90%] md:w-[40%] max-h-screen flex items-center justify-center relative`}>
                                <button onClick={() => {
                                    setViewFileStatus({ view: false, url: '', type: ''})
                                }} className='absolute text-md md:text-xl z-50 flex items-center justify-center w-[20px] h-[20px] md:w-[30px] md:h-[30px] rounded-full right-2 top-2 text-gray-100 hover:bg-red-800 bg-red-700'><i className="fa-solid fa-xmark"></i></button>

                                    {viewFileStatus.type === 'video' &&   
                                    <a href={viewFileStatus.url} target='_blank'>
                                        <div className='flex items-center justify-center w-full h-full'>
                                            <video src={viewFileStatus.url} autoPlay playsInline muted className='rounded-lg w-full h-full object-cover'></video>
                                        </div></a>}
                                </div>
                            </div>}

                        <div onClick={() => { 
                                if(deleteFileNumber === index)
                                    setDeleteFileNumber(-1) 
                                else setDeleteFileNumber(index)
                            }} className='absolute right-3 top-3 z-20 text-white flex items-center justify-center px-3 py-2 shadow-md rounded-full bg-[#3c3c3c]'>
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                        </div>
                        
                        {deleteFileNumber === index && 
                            <div onClick={() => handleDelete([file.ind], [file.url.split('/')[4]?.split('?')[0]], [file.storedPinataJWT], [file.storedPinataGateWayKey])} className='w-full inset-0 relative z-20 bg-black'>
                                <div className='absolute top-12 text-white font-semibold right-1 px-3 py-2 rounded-lg shadow-lg hover:opacity-70 bg-red-600'>
                                    {deleteLoader ? 
                                    <p>
                                        <div className="text-xs lds-ring"><div></div><div></div><div></div><div></div></div>
                                    </p>
                                    :<p>Delete</p>}
                                </div>
                            </div>}

                        <div onClick={() => {
                            setViewFileStatus({ view: true, url: file.url, type: filetype[0]})
                        }} className='hover:opacity-60 h-full'>
                            {filetype[0] === 'video' &&
                                <div className='flex items-center justify-center w-full h-full'>
                                    <video src={file.url} muted className='rounded-lg w-full h-full object-cover'></video>
                                    <i className="fa-solid fa-play absolute text-white shadow-lg text-3xl md:text-6xl"></i>
                                </div>}
                        </div>
                        <div className='hidden flex-col items-start justify-start w-full gap-2 font-semibold'>
                            <p>Filename: {file.fileName}</p>
                            <p>Uploaded at: 3:06 pm Thursday, January, 2004</p>
                        </div>
                    </div>
                )
            })} 
        </div>
    )
}

export default ViewVideos