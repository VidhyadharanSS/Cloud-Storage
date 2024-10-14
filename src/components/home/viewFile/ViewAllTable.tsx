import { usePinataContext } from '../../../context/PinataContext'
import short from 'short-uuid'
import { useEffect, useState } from 'react'

interface _File {
    ind: bigint
    url: string
    fileName: string
    time: number
    fileType: string
    storedPinataJWT: string
    storedPinataGateWayKey: string
}

interface params {
    selectAllChecks: boolean
    setShowDeleteButton: React.Dispatch<React.SetStateAction<boolean>>
    deleteSelectedItems: boolean
    setDeleteSelectedItems: React.Dispatch<React.SetStateAction<boolean>>
    setDeleteAllLoader: React.Dispatch<React.SetStateAction<boolean>>
}

interface ViewStatus {
    view: boolean
    url: string
    type: string
}

function ViewAllTable({ setDeleteAllLoader, selectAllChecks, setShowDeleteButton, deleteSelectedItems, setDeleteSelectedItems }: params): React.ReactElement {
    const pinataContext = usePinataContext()

    const [deleteFileNumber, setDeleteFileNumber] = useState<number | null>(-1)
    const [deleteLoaderNumber, setDeleteLoaderNumber] = useState<number | null>(-1)
    const [selectedNumber, setSelectedNumber] = useState<{ [key: number]: boolean }>({})
    const [selectedNumberInd, setSelectedNumberInd] = useState<bigint[]>([])
    const [deleteLoader, setDeleteLoader] = useState<boolean>(false)
    const [viewFileStatus, setViewFileStatus] = useState<ViewStatus>({view: false, url: '', type: ''})

    const handleDelete = async(ind: bigint[], hash: string[], storedPinataJWT: string[], storedPinataGateWayKey: string[]): Promise<void> => {
        setDeleteLoader(true)

        try {
            // let response 
            
            // if (!localStorage.getItem('userPinataJWT') && !localStorage.getItem('userPinataGateway') && !localStorage.getItem('userPinataAccessAPI'))
            //     response = await pinataContext?.handleDeleteFile(ind, hash, pinataContext, false)
            // else response = await pinataContext?.handleDeleteFile(ind, hash, pinataContext, true)
            const response = await pinataContext?.handleDeleteFile(ind, hash, pinataContext, storedPinataJWT, storedPinataGateWayKey)
            
             if (response?.code === 1) {
                pinataContext?.setToastMessage('Successfully deleted the file')
                pinataContext?.setIsToast(true)
             } else {
                pinataContext?.setToastMessage('User rejected the payment or something went wrong')
                pinataContext?.setIsToast(true)
             }
        } catch (err) {
            console.log(err)
        }

        setDeleteLoader(false)
        setDeleteLoaderNumber(-1)
    }

    const TimestampConverter = (timestamp: bigint | number): string => {
        const timeInSeconds = Number(timestamp.toString().replace('n', ''));
      
        const date = new Date(timeInSeconds * 1000); 

        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        })
      
        return formattedDate
    }

    const handleSelectCheck = (index: number, indexOfFile: bigint): void => {
        setSelectedNumber(prev => ({...prev, [index]: !prev[index]})) 
        
        if (selectedNumberInd.includes(indexOfFile)) {
            setSelectedNumberInd(prev => prev.filter((ind: bigint) => ind !== indexOfFile))
        }
        else {
            setSelectedNumberInd(prev => [...prev, indexOfFile])
        }

        console.log(selectedNumberInd)
    }

    useEffect(() => {
        if (selectAllChecks) {
            pinataContext?.files.map((file: _File, index: number) => {
                setSelectedNumber(prev => ({...prev, [index]: true})) 
                setSelectedNumberInd(prev => [...prev, file.ind])
            })

        } else {
            setSelectedNumber({})
            setSelectedNumberInd([])
        }
    }, [selectAllChecks, pinataContext])

    useEffect(() => {
        if (selectedNumberInd.length) 
            setShowDeleteButton(true)
        else setShowDeleteButton(false)

    }, [selectedNumberInd, selectedNumberInd.length])

    useEffect(() => {
        if (deleteSelectedItems) {
            console.log('delete clicked')
            const callDeleteFunc = async(): Promise<void> => {
                setDeleteAllLoader(true)

                await handleDelete(selectedNumberInd, hashes, storedPinataJWT, storedPinataGateWayKey)

                setDeleteSelectedItems(false)
                setDeleteAllLoader(false)
            }

            let hashes: string[] = []
            let storedPinataJWT: string[] = []
            let storedPinataGateWayKey: string[] = []

            console.log('doing', storedPinataJWT)

            pinataContext?.files.map((file: _File, index: number) => {
                if (selectedNumber[index]) {
                    hashes.push(file.url.split('/')[4]?.split('?')[0])
                    storedPinataJWT.push(file.storedPinataJWT)
                    storedPinataGateWayKey.push(file.storedPinataGateWayKey)
                }
            })

            callDeleteFunc()
        }   
    }, [deleteSelectedItems, pinataContext])

    return (
        <div className='relative grid grid-cols-1 w-full items-start justify-start gap-4'>
            {pinataContext && pinataContext?.files && pinataContext?.files.map((file: _File, index: number): React.ReactElement | null => {
                const filetype = file.fileType.split('/')

                if (filetype[0] === "" && file.fileName === "")
                    return null

                return (
                    <div key={short.generate()} className={`${selectedNumber[index] ? 'bg-[#b6b6b6] dark:bg-[#1d1d1d]' : 'bg-[#e8e8e8] dark:bg-[#2b2b2b]'} transition-all duration-300 flex items-center justify-between p-2 row-span-1 relative h-full w-full rounded-lg shadow-lg outline-none `}>
                            {viewFileStatus.view && viewFileStatus.url !== '' &&
                            <div className='w-full flex flex-col items-center justify-center h-screen z-40 fixed inset-0 bg-[#0000003f]'>
                                <div className={`w-[90%] md:w-[40%] max-h-screen flex items-center justify-center relative`}>
                                <button onClick={() => {
                                    setViewFileStatus({ view: false, url: '', type: ''})
                                }} className='absolute text-md md:text-xl z-50 flex items-center justify-center w-[20px] h-[20px] md:w-[30px] md:h-[30px] rounded-full right-2 top-2 text-gray-100 hover:bg-red-800 bg-red-700'><i className="fa-solid fa-xmark"></i></button>

                                    {viewFileStatus.type === 'image' &&
                                    <a href={viewFileStatus.url} target='_blank' className='hover:cursor-pointer hover:bg-[#1b1b1b7e]'><img src={viewFileStatus.url} alt="img" className='rounded-lg w-full h-full object-cover' /></a>}
                                    
                                    {viewFileStatus.type === 'video' &&  
                                        <a href={viewFileStatus.url} target='_blank'> 
                                        <div className='flex items-center justify-center w-full h-full'>
                                            <video src={viewFileStatus.url} autoPlay playsInline muted className='rounded-lg w-full h-full object-cover'></video>
                                        </div></a>}
                                </div>
                            </div>}

                            <input checked={selectedNumber[index] || false} onChange={() => handleSelectCheck(index, file.ind)} type="checkbox" className={`absolute hover:cursor-pointer w-[10px] h-[10px] md:w-[13px] md:h-[13px] -left-4 md:-left-6 z-40`}/>

                            <div className='w-[45px] h-[45px] flex items-center justify-center overflow-hidden'>
                                <div onClick={() => {
                                    setViewFileStatus({ view: true, url: file.url, type: filetype[0]})
                                }} className='outline-none w-full h-full hover:cursor-pointer'>
                                    {filetype[0] === 'image' &&
                                        <img src={file.url} alt="img" className='rounded-md w-full h-full object-cover' />}
                                    
                                    {filetype[0] === 'video' &&   
                                        <div className='flex items-center justify-center w-full h-full'>
                                            <video src={file.url} muted className='rounded-md w-full h-full object-cover'></video>
                                            <i className="fa-solid fa-play absolute text-white shadow-lg text-md md:text-lg"></i>
                                        </div>}
                                    
                                    {filetype[0] !== 'image' && filetype[0] !== 'video' && 
                                        <div className='w-full h-full row-span-1 rounded-md flex flex-col items-center justify-center'>
                                            <i className="text-lg md:text-xl fa-solid fa-file"></i>
                                        </div>}
                                </div>
                            </div>

                            <div className='flex flex-col gap-1 md:gap-0 md:flex-row items-start md:items-center justify-between w-[60%]'>
                                <p className='font-semibold'>{file.fileName}</p>
                                <p className='opacity-60 text-[10px] md:text-xs'>{TimestampConverter(file.time)}</p>
                            </div>

                            <div onClick={() => {
                                if(deleteFileNumber === index)
                                    setDeleteFileNumber(-1) 
                                else setDeleteFileNumber(index)
                            }} className='hover:cursor-pointer dark:hover:bg-[#1c1c1c] hover:text-red-700 text-red-600 transition-all duration-200 rounded-full flex items-center justify-center w-[30px] h-[30px] px-3'>
                                <i className="fa-solid fa-trash"></i>
                            </div>

                            <div className={`${deleteFileNumber === index ? 'block' : 'hidden'} transition-all duration-300`}>
                                <div className='flex items-center justify-center gap-1 md:gap-3'>
                                    <button onClick={() => {
                                        setDeleteLoaderNumber(index)
                                        setDeleteFileNumber(-1)
                                        handleDelete([file.ind], [file.url.split('/')[4]?.split('?')[0]], [file.storedPinataJWT], [file.storedPinataGateWayKey])
                                    }} className='text-green-600 w-[25px] h-[25px] md:w-[35px] md:h-[35px] rounded-full dark:hover:bg-[#1c1c1c]'>
                                        <i className="fa-solid fa-check"></i>
                                    </button>

                                    <button onClick={() => {
                                        if(deleteFileNumber === index)
                                            setDeleteFileNumber(-1) 
                                        else setDeleteFileNumber(index)
                                    }} className='text-red-600 w-[25px] h-[25px] md:w-[35px] md:h-[35px] rounded-full dark:hover:bg-[#1c1c1c]'>
                                        <i className="fa-solid fa-xmark"></i>   
                                    </button>                                 
                                </div>
                            </div>

                            {deleteLoader && deleteLoaderNumber === index &&
                                <p><div className="text-xs lds-ring"><div></div><div></div><div></div><div></div></div></p>}
                    </div>
                )
            })} 
        </div>
    )
}

export default ViewAllTable