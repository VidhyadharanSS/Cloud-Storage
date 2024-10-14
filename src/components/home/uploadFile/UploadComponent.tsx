import { useState, useRef } from "react"
import short from 'short-uuid'
import { usePinataContext } from '../../../context/PinataContext'
import './style.css'
import uploadFile from "../../../utils/uploadFile"

function UploadComponent(): React.ReactElement {
    const pinataContext = usePinataContext()
    const [inFiles, setInFiles] = useState<File[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploadingLoader, setUploadingLoader] = useState<boolean>(false)
    const [uploadedFileCounter, setUploadedFileCounter] = useState<number>(0)
    const [showInfo, setShowInfo] = useState<boolean>(false)
    const [customPinata, setCustomPinata] = useState<boolean>(false)
    const [insideDragArea, setInsideDragArea] = useState<boolean>(false)

    const [customJWT, setCustomJWT] = useState<string>('')
    const [customGateway, setCustomGateway] = useState<string>('')
    const [customAccessAPI, setCustomAccessAPI] = useState<string>('')

    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault()
        e.stopPropagation()

        const file = e.dataTransfer.files
        if (file && file.length > 0 && inFiles.length < 5) {
            setInFiles(prev => [...prev, file[0]])
            setInsideDragArea(false)
        } else {
            pinataContext?.setToastMessage('Only 5 files can be uploaded at a time')
            pinataContext?.setIsToast(true)
            window.scrollTo(0, 0)
        }
    }

    const handleOnDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault()
        e.stopPropagation()

        setInsideDragArea(true)
    }

    const handleOnDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault()
        e.stopPropagation()

        setInsideDragArea(false)
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault()
        e.stopPropagation()

        const file = e.target.files;
        if (file && file.length > 0 && inFiles.length < 5) {
            console.log('taking')
            setInFiles(prev => [...prev, file[0]])
            setInsideDragArea(false)
        } else {
            pinataContext?.setToastMessage('Only 5 files can be uploaded at a time')
            pinataContext?.setIsToast(true)
        }
    }

    const openDialog = (): void => {
        fileInputRef.current?.click()
    }

    const handleClearFiles = (): void => {
        setInFiles([])
    }

    const handleUploadFiles = async (): Promise<void> => {
        if (pinataContext)
            await uploadFile(pinataContext, inFiles, setInFiles, setUploadingLoader, setUploadedFileCounter)
    }

    const handleCustomization = (): void => {
        if (customJWT && customGateway && customAccessAPI) {
            localStorage.setItem('userPinataJWT', customJWT)
            localStorage.setItem('userPinataGateway', customGateway)
            localStorage.setItem('userPinataAccessAPI', customAccessAPI)

            pinataContext?.setToastMessage('Successfuly saved all three fields, now all your files will be uploaded on your own account.')
            pinataContext?.setIsToast(true)

            setCustomJWT('')
            setCustomGateway('')
            setCustomAccessAPI('')
            setCustomPinata(false)
        } else {
            pinataContext?.setToastMessage('You forgot to fill either JWT or Gateway or Access API, fill all three fields')
            pinataContext?.setIsToast(true)
        }
    }

    const handleSwitchBackToDefault = ():void => {
        localStorage.setItem('userPinataJWT', '')
        localStorage.setItem('userPinataGateway', '')
        localStorage.setItem('userPinataAccessAPI', '')

        pinataContext?.setToastMessage('Switched back to default gateway, now the files will not be uploaded on your pinata account')
        pinataContext?.setIsToast(true)
    }

    return (
        <div className="flex flex-col md:flex-row items-center md:items-start justify-start w-[90%] md:w-[60%] gap-16 mt-7 md:mt-24 text-gray-700 dark:text-gray-400 transition-all duration-300">
            <div className="relative flex mt-12 w-[250px] z-10 md:w-[35%] items-center justify-center">
                <img src="/assets/pin.png" className="z-30 md:mt-3 animate-pinata-anim w-full h-auto object-cover" />
                <img src="/assets/svg-blob.svg" className="absolute w-[60%] opacity-40 -top-1 blur-2xl" />
                <img src="/assets/svg-blob.svg" className="absolute w-[20%] opacity-60 rotate-45 blur-2xl -bottom-8 left-8" />
            </div>

            <div className="w-full md:w-[65%] z-10 flex flex-col items-center justify-center text-xs md:text-sm">
                <div className="relative my-3 font-medium w-full flex items-center justify-between px-3 py-2 rounded-md border-[0.5px] border-[#242424]">
                    <button onClick={() => setCustomPinata(prev => !prev)} className="rounded-md shadow-lg bg-[#7158c5] hover:bg-[#5b42ab] text-white px-3 py-2 dark:bg-[#222222] dark:hover:bg-gray-700 transition-all duration-200">Use your own Pinata IPFS?</button>
                    <button onClick={() => setShowInfo(prev => !prev)} className={`rounded-full shadow-lg flex items-center justify-center w-[20px] h-[20px] text-white bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-700 dark:bg-gray-800 transition-all duration-200`}>i</button>
                </div>

                {showInfo && 
                    <div className="mb-12 w-full backdrop-blur-sm rounded-lg shadow-lg border-[0.5px] border-purple-600 bg-[#d7d7d77e] dark:bg-[#1c1c1c5f] flex flex-col items-center justify-center p-5">
                        <button onClick={() => setShowInfo(false)} className="w-[20px] h-[20px] flex items-center justify-center text-white bg-red-600 absolute right-2 top-2 rounded-full hover:bg-red-700">x</button>
                        <p className="font-bold w-full text-left text-sm mb-2 md:text-lg text-gray-800 dark:text-gray-300">Info</p>
                        <p className="font-semibold text-xs md:text-sm text-gray-600 dark:text-gray-400">All the files which you will be uploading will be stored on your own pinata account using your own credentials and all those files can only be viewd by you. No server is being used for such process and it's all on client side and your credentials regarding pinata account will be revealed to any server.</p>
                    </div>}

                {localStorage.getItem('userPinataJWT') && localStorage.getItem('userPinataGateway') && localStorage.getItem('userPinataAccessAPI') && 
                    <div className="flex flex-col rounded-md mb-3 items-start justify-center px-3 py-2 md:px-4 md:py-3 w-full border-[0.5px] border-[#242424]">
                        <p>Currently using your own gateway</p>
                        <div className="w-full flex flex-col mt-1 md:flex-row items-center justify-between">
                            <p className="px-3 py-2 w-full md:w-auto text-xs md:text-sm rounded-md font-semibold bg-[#fff] text-black shadow-md dark:text-white dark:bg-[#242424]">{localStorage.getItem('userPinataGateway')}</p>
                            <button onClick={handleSwitchBackToDefault} className="px-3 py-2 w-full md:w-auto mt-1 text-xs md:text-sm rounded-md font-semibold shadow-lg bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800">Switch back to default</button>
                        </div>
                    </div>}

                {customPinata && 
                    <div className="w-full relative flex flex-col items-center justify-center rounded-md bg-[#fff] shadow-lg mb-12 dark:bg-[#171717]">
                        <button onClick={() => setCustomPinata(false)} className="w-[20px] h-[20px] absolute right-2 top-2 rounded-full shadow-lg flex items-center justify-center bg-red-600 text-white hover:bg-red-500">x</button>
                        <div className="flex flex-col w-full items-start mt-5 justify-center overflow-x-hidden overflow-y-auto px-4 py-3 md:px-5 md:py-4">
                            <p className="text-lg md:text-xl font-bold dark:text-gray-200">Custom Pinata</p>
                            <p>No credentials will be saved in any backend server. The below creds will only be stored on client's local storage of the browser.</p>
                            <p className="text-red-500 mb-6 mt-2">Make sure to fill correct cred details or else it won't be uploading or saving your files and may act strange</p>

                            <p className="text-xs md:text-sm mb-1 dark:text-gray-600">Enter your Pinata JWT below</p>
                            <input 
                                type="text" 
                                value={customJWT} 
                                onChange={e => setCustomJWT(e.target.value)}
                                className="px-3 py-2 w-full rounded-md bg-transparent border-[0.5px] outline-none focus:border-purple-300 border-purple-600 text-xs md:text-sm" 
                                placeholder="Pinata JWT" />

                            <p className="mt-5 text-xs md:text-sm mb-1 dark:text-gray-600">Enter your Pinata Gateway URL</p>
                            <input 
                                type="text" 
                                value={customGateway}
                                onChange={e => setCustomGateway(e.target.value)}
                                className="px-3 py-2 w-full rounded-md bg-transparent border-[0.5px] outline-none focus:border-purple-300 border-purple-600 text-xs md:text-sm" 
                                placeholder="Pinata Gateway URL" />

                            <p className="mt-5 text-xs md:text-sm mb-1 dark:text-gray-600">Enter your Pinata Gateway key</p>
                            <input 
                                type="password" 
                                value={customAccessAPI}
                                onChange={e => setCustomAccessAPI(e.target.value)}
                                className="px-3 py-2 w-full rounded-md bg-transparent border-[0.5px] outline-none focus:border-purple-300 border-purple-600 text-xs md:text-sm" 
                                placeholder="Gateway Key" />

                            <button onClick={handleCustomization} className="px-3 py-2 md:px-6 rounded-md font-semibold border-[0.5px] transition-all duration-200 w-full border-green-600 mt-5 bg-green-600 hover:bg-green-700 text-white shadow-lg">Submit</button>

                            {/* <p className="mt-10 text-lg md:text-xl text-gray-600 dark:text-gray-300 font-semibold"></p> */}
                            <p className="text-sm md:text-lg text-gray-500 dark:text-gray-400 mt-10">How do I get my JWT, Gateway and Access token?</p>
                            <p className="mt-7 md:mt-10">Refer to the document of pinata below (click to redirect)</p>
                            <a href="https://docs.pinata.cloud/account-management/api-keys" target="_blank" className="p-2 font-semibold mt-1 rounded-md border-[0.5px] hover:bg-purple-600 hover:text-white transition-all duration-200 border-purple-600">https://docs.pinata.cloud/account-management/api-keys</a>

                            <div className="mt-5 flex flex-col items-start justify-center w-full">
                                <p className="font-semibold">How do I get my JWT token?</p>
                                <p>Signin into your Pinata account, once signed in, go to the API keys section in dashboard. Pinata does give you your JWT token after signing in, but incase you didn't saved it, then create a new API key which will contain JWT token which looks like this: eyJKGjcihiJIUfI14NiInRt5cCI6sIkpXs.eyf1c2V4SWa5sb3J...</p>

                                <img src="/assets/tut.gif" className="w-full h-full mt-5 object-cover rounded-md"/>

                                <p className="mt-5 font-semibold">How do I get my Gateway URL?</p>
                                <p>In your dashboard, go to the Gateways section to get your gateway. It can also be retrieved from directly the Files section in dashboard, there in thr right upper side, a gateway will be provided which looks like: amaranth-mango-machin-134.mypinata.cloud (the given gateway is just an example)</p>

                                <p className="mt-5 font-semibold">How do I get my Gateway Key?</p>
                                <p>Go to Gateways section in dashboard, click on the Actions of your gateway (there you will be able to see info regarding your gateway like Access, Created and Actions), after clicking on the Actions, go to the Security Options, and there on the top you have the Gateway Keys. If you don't have any Gateway keys then create one by clicking on "Request Key".</p>
                            </div>

                            {/* <p className="mt-8 md:mt-10">Or you can even watch the video of theirs, first go to <a href="https://www.pinata.cloud/" target="_blank" className="hover:text-purple-600 text-purple-500">https://www.pinata.cloud/</a> and then signup, after signing up go to your dasboard and follow the video, you might get it.</p> */}
                        </div>
                    </div>}

                <p className="w-full px-2 my-1">Drag and drop your file which is to be uploaded or click on the below box to open the file dialogue</p>

                <div className={`${uploadingLoader ? 'block' : 'hidden'} flex flex-col items-center justify-center w-full p-2 bg-[#1a1a1a] rounded-lg shadow-lg`}>
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                    <p>Uploading, wait for a while</p>
                    <p className="mb-5">Uploaded files : {uploadedFileCounter}/{inFiles.length}</p>
                </div>

                <div onClick={openDialog} onDrop={handleDrop} onDragEnter={handleOnDragEnter} onDragLeave={handleOnDragLeave} onDragOver={handleOnDragEnter} className={`${(inFiles.length > 0 && !uploadingLoader) ? 'block' : 'hidden'} w-full flex flex-col items-center justify-center p-2 ${insideDragArea ? 'bg-[#eaeaea] dark:bg-[#424242]' : 'bg-[#fff] dark:bg-[#1a1a1a]'} hover:bg-[#eaeaea] dark:hover:bg-[#424242] rounded-lg shadow-lg hover:cursor-pointer`}>
                    <div className="w-full p-3 flex flex-col items-center justify-center rounded-lg border-dashed border-[3px] border-purple-500">
                        <div className="md:text-sm w-[98%] h-full rounded-lg">
                            <div className="flex items-center justify-center gap-3">
                                <i className="text-3xl mt-1 fa-brands fa-dropbox mb-2"></i>
                                <p className="hidden md:block">Drop your file or click to upload more</p>
                                <p className="md:hidden">Click to upload more</p>
                            </div>
                            {
                                inFiles.length > 0 && inFiles.map((file: File): React.ReactElement => {
                                    console.log(file)
                                    let name = file.name

                                    if (name.length > 20)
                                        name = name.slice(0, 5) + '...' + name.slice(name.length - 9, name.length)

                                    const size = (file.size * 0.001).toFixed(2)
                                    return (
                                        <div key={short.generate()} className="shadow-lg text-xs md:text-sm w-full my-2 px-4 py-3 flex items-center justify-between bg-[#eaeaea] dark:bg-[#2f2f2f] rounded-lg">
                                            <p>{name}</p>
                                            <p>{size} kb</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

                <div onClick={openDialog} onDrop={handleDrop} onDragEnter={handleOnDragEnter} onDragLeave={handleOnDragLeave} onDragOver={handleOnDragEnter} className={`${inFiles.length > 0 ? 'hidden' : 'block'} w-full flex flex-col items-center justify-center p-2 ${insideDragArea ? 'bg-[#eaeaea] dark:bg-[#424242]' : 'bg-[#fff] dark:bg-[#1a1a1a]'} hover:bg-[#eaeaea] dark:hover:bg-[#424242] rounded-lg shadow-lg hover:cursor-pointer`}>
                    <div className="w-full py-5 md:py-20 flex flex-col items-center justify-center rounded-lg border-dashed border-[3px] border-purple-500">
                        <i className="text-3xl md:text-6xl fa-brands fa-dropbox mb-2"></i> 
                        <p className="hidden md:block text-sm">Drop your image or video</p>
                        <p className="hidden md:block text-xs md:text-sm">Or click to drop</p>
                        <p className="md:hidden text-xs md:text-sm">Click to upload</p>
                        <input
                            type="file"
                            onChange={handleFileInput}
                            className="hidden"
                            ref={fileInputRef}
                        />
                    </div>
                </div>

                <button onClick={handleClearFiles} className={`${inFiles.length > 0 ? 'block' : 'hidden'} mt-4 md:mt-6 px-4 py-2.5 rounded-lg border-[1px] w-full md:text-sm bg-[#ffffff] hover:bg-[#eaeaea] hover:border-[#eaeaea] dark:hover:bg-[#222222] dark:bg-[#2f2f2f] font-medium shadow-lg border-[#fdfdfd] dark:border-[#2f2f2f]`}>
                    Clear Dropbox
                </button>

                <button disabled={uploadingLoader} onClick={handleUploadFiles} className={`${inFiles.length > 0 ? 'block' : 'hidden'} ${uploadingLoader ? 'opacity-50': 'opacity-100'} mt-3 w-full relative inline-flex items-center justify-center p-0.5 overflow-hidden md:text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800`}>
                    <span className="w-full relative px-4 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Upload
                    </span>
                </button>
            </div>
        </div>
    )
}   

export default UploadComponent