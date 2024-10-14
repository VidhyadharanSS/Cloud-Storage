import { createContext, useContext, useEffect, useState } from "react"
import { PinataSDK } from 'pinata'

interface Response {
    code: number
    msg: string
}

interface PinataContextInterface {
    isToast: boolean
    setIsToast: React.Dispatch<React.SetStateAction<boolean>>
    toastMessage: string
    setToastMessage: React.Dispatch<React.SetStateAction<string>>
    web3: any
    setWeb3(web3: any): void
    contract: any
    setContract(contract: any): void
    account: any
    setAccount(account: any): void
    files: _File[]
    setFiles(files: _File[]): void
    images: _File[]
    setImages(files: _File[]): void
    videos: _File[]
    setVideos(files: _File[]): void
    docs: _File[]
    setDocs(files: _File[]): void
    handleDeleteFile(ind: bigint[], hash: string[], pinataContext: PinataContextInterface, storedPinataJWT: string[], storedPinataGateWayKey: string[]): Promise<Response>
}

interface PinataContextProps {
    children: React.ReactNode
}

interface _File {
    ind: bigint
    url: string
    fileName: string
    time: number
    fileType: string
    storedPinataJWT: string
    storedPinataGateWayKey: string
}

interface JwtMap {
    [jwt: string]: { 
        gateway: string, 
        hashes: string[] 
    }
}

const PinataContext = createContext<PinataContextInterface | null>(null)

export const PinataProvider: React.FC<PinataContextProps> = (props) => {
    useEffect(() => {
        let themeMode = false
        const root = document.documentElement

        if (localStorage.getItem('theme') === 'true') 
            themeMode = Boolean(localStorage.getItem('theme'))

        if (themeMode) {
            root.classList.add('dark')
            localStorage.setItem('theme', 'true')
        } else {
            root.classList.remove('dark')
            localStorage.setItem('theme', 'false')
        }
    }, [])
    

    const [web3, setWeb3] = useState<any>()
    const [contract, setContract] = useState<any>()
    const [account, setAccount] = useState<any>()

    const [files, setFiles] = useState<_File[]>([])
    const [images, setImages] = useState<_File[]>([])
    const [videos, setVideos] = useState<_File[]>([])
    const [docs, setDocs] = useState<_File[]>([])

    const [isToast, setIsToast] = useState<boolean>(false)
    const [toastMessage, setToastMessage] = useState<string>('')

    const handleDeleteFile = async(ind: bigint[], hash: string[], pinataContext: PinataContextInterface, storedPinataJWT: string[], storedPinataGateWayKey: string[]): Promise<Response> => {
        try {
            await pinataContext?.contract.methods.deleteFile(ind).send({ from: pinataContext?.account })
            
            let fetchedFiles = await pinataContext?.contract.methods.getFiles().call({ from : pinataContext?.account })
            fetchedFiles = fetchedFiles.filter((file: _File) => file.fileName !== '' && file.fileType !== '' && file)
            fetchedFiles.reverse()
            
            const fetchedImages = fetchedFiles.filter((file: _File) => file.fileType === 'image' || file.fileType.split('/')[0] === 'image' && file)
            const fetchedVideos = fetchedFiles.filter((file: _File) => file.fileType === 'video' || file.fileType.split('/')[0] === 'video' && file)
            let fetchedDocs = fetchedFiles.filter((file: _File) => (file.fileType !== 'video' && file.fileType !== 'image') && (file.fileType.split('/')[0] !== 'video' && file.fileType.split('/')[0] !== 'image') && file)
            fetchedDocs = fetchedDocs.filter((file: _File) => file.fileName && file.fileType && file)

            pinataContext?.setFiles(fetchedFiles)
            pinataContext?.setImages(fetchedImages)
            pinataContext?.setVideos(fetchedVideos)
            pinataContext?.setDocs(fetchedDocs)

            let pinata, response
            // const customPinataJWT = localStorage.getItem('userPinataJWT')
            // const customGatewayKey = localStorage.getItem('userPinataGateway')
            // const customGatewayToken = localStorage.getItem('userPinataAccessAPI')

            // if (!customGateway && !customPinataJWT && !customGatewayKey && !customGatewayToken) {
            if (storedPinataJWT.length === 1 && storedPinataGateWayKey.length === 1) {
                pinata = new PinataSDK({
                    pinataJwt: storedPinataJWT[0],
                    pinataGatewayKey: storedPinataGateWayKey[0]
                })

                const unpin = await pinata?.unpin(hash)
                console.log('here', unpin![0].status)

                if (unpin![0].status) {
                    pinataContext?.setToastMessage('Successfully deleted!')
                    pinataContext?.setIsToast(true)
                } else {
                    pinataContext?.setToastMessage('Something went wrong!')
                    pinataContext?.setIsToast(true)
                }

                response = { code: 1, msg: 'success'}

            } else {
                let jwtMap: JwtMap = {
                    [storedPinataJWT[0]]: {
                        gateway: storedPinataGateWayKey[0],
                        hashes: [hash[0]]
                    }
                }

                if (hash.length === storedPinataJWT.length) {
                    for (let i = 1; i < hash.length; i++) {
                        if (!jwtMap[storedPinataJWT[i]]) {
                            jwtMap[storedPinataJWT[i]] = { gateway: storedPinataGateWayKey[i], hashes: [hash[i]] }
                        } else {
                            jwtMap[storedPinataJWT[i]].hashes.push(hash[i])
                        }
                    }
                }

                let flag = false

                for (let jwt in jwtMap) {
                    console.log(jwt, jwtMap[jwt].gateway, jwtMap[jwt].hashes)

                    pinata = new PinataSDK({
                        pinataJwt: jwt,
                        pinataGatewayKey: jwtMap[jwt].gateway
                    })

                    const unpin = await pinata?.unpin(jwtMap[jwt].hashes)

                    if (unpin![0].status !== 'OK') 
                        flag = true
                }

                if (!flag) {
                    pinataContext?.setToastMessage('Successfully deleted!')
                    pinataContext?.setIsToast(true)
                } else {
                    pinataContext?.setToastMessage('Something went wrong!')
                    pinataContext?.setIsToast(true)
                }

                response = { code: 1, msg: 'success'}
            }

            return response!

        } catch (err) {
            console.log(err)
            return { code: 0, msg: 'failure'}
        }
    }

    return (
        <PinataContext.Provider value={{ isToast, setIsToast, toastMessage, setToastMessage, contract, setContract, web3, setWeb3, account, setAccount, files, setFiles, handleDeleteFile, images, setImages, videos, setVideos, docs, setDocs }}>
            {props.children}
        </PinataContext.Provider>
    )
}

export const usePinataContext = (): PinataContextInterface | null => {
    return useContext(PinataContext)
}