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

interface _File {
    ind: bigint
    url: string
    fileName: string
    time: number
    fileType: string
    storedPinataJWT: string
    storedPinataGateWayKey: string
}


async function uploadFile(pinataContext: PinataContextInterface, inFiles: File[], setInFiles: React.Dispatch<React.SetStateAction<File[]>>, setUploadingLoader: React.Dispatch<React.SetStateAction<boolean>>, setUploadedFileCounter: React.Dispatch<React.SetStateAction<number>>): Promise<void> {
    if (!pinataContext?.account) {
        pinataContext?.setToastMessage('Connect MetaMask wallet by clicking on the button "Connect Wallet" down below in the space area.')
        pinataContext?.setIsToast(true)
    } else {
        const pinataCustomJWT = localStorage.getItem('userPinataJWT')
        const pinataCustomGateway = localStorage.getItem('userPinataGateway')
        const _pinataCustomGateway = 'https://' + pinataCustomGateway
        const pinataCustomAccessAPI = localStorage.getItem('userPinataAccessAPI')

        const defaultPinataJWT = import.meta.env.VITE_APP_PINATA_JWT
        const defaultPinataGatewayKey = import.meta.env.VITE_APP_PINATA_GATEWAY_KEY

        let pinata
        if (!pinataCustomJWT && !pinataCustomGateway && !pinataCustomAccessAPI) {
            pinata = new PinataSDK({
                pinataJwt: import.meta.env.VITE_APP_PINATA_JWT,
                pinataGatewayKey: import.meta.env.VITE_APP_PINATA_GATEWAY_KEY
            })
            console.log('taking')
        } else {
            console.log('throwinfg')
            pinata = new PinataSDK({
                pinataJwt: pinataCustomJWT!,
                pinataGatewayKey: `https://${pinataCustomGateway!}`
            })

            pinataContext?.setToastMessage(`Uploading on your own gateway: ${pinataCustomGateway}`)
            pinataContext?.setIsToast(true)
        }
        

        if (inFiles.length > 0) {
            setUploadingLoader(true)
            let success = false

            for (let i = 0; i < inFiles.length; i++) {
                let formData = new FormData()
                formData.append("file", inFiles[i])

                const upload = await pinata.upload.file(inFiles[i])
                console.log(upload)
                setUploadingLoader(true)
                
                // setting url based on the custom gateway
                let url
                if (!pinataCustomJWT && !pinataCustomGateway && !pinataCustomAccessAPI)
                    url = `${import.meta.env.VITE_APP_PINATA_GATEWAY}${upload.IpfsHash}?pinataGatewayToken=${import.meta.env.VITE_APP_PINATA_GATEWAY_TOKEN}`
                else 
                    url = `https://${pinataCustomGateway}/ipfs/${upload.IpfsHash}?pinataGatewayToken=${pinataCustomAccessAPI}`

                // posting on blokckchain
                try {
                    if (!pinataCustomJWT && !pinataCustomGateway && !pinataCustomAccessAPI)
                        await pinataContext?.contract?.methods.setFile(url, inFiles[i].name, inFiles[i].type, defaultPinataJWT, defaultPinataGatewayKey).send({ from: pinataContext?.account })
                    else await pinataContext?.contract?.methods.setFile(url, inFiles[i].name, inFiles[i].type, pinataCustomJWT, _pinataCustomGateway).send({ from: pinataContext?.account })

                    success = true

                    pinataContext.setToastMessage('Successfully uploaded!')
                    pinataContext.setIsToast(true)
                } catch (err) {
                    console.log(err)
                }
            }
            setUploadingLoader(false)
            setInFiles([])
            setUploadedFileCounter(0)
            
            if (success) {
                let fetchedFiles = await pinataContext?.contract.methods.getFiles().call({ from : pinataContext?.account })
                fetchedFiles = fetchedFiles.filter((file: _File) => file.fileType !== '' && file.fileName !== '' && file)
                fetchedFiles.reverse()

                const fetchedImages = fetchedFiles.filter((file: _File) => file.fileType === 'image' || file.fileType.split('/')[0] === 'image' && file)
                const fetchedVideos = fetchedFiles.filter((file: _File) => file.fileType === 'video' || file.fileType.split('/')[0] === 'video' && file)
                let fetchedDocs = fetchedFiles.filter((file: _File) => (file.fileType !== 'video' && file.fileType !== 'image') && (file.fileType.split('/')[0] !== 'video' && file.fileType.split('/')[0] !== 'image') && file)
                fetchedDocs = fetchedDocs.filter((file: _File) => file.fileName && file.fileType && file)

                pinataContext?.setFiles(fetchedFiles)
                pinataContext?.setImages(fetchedImages)
                pinataContext?.setVideos(fetchedVideos)
                pinataContext?.setDocs(fetchedDocs)
            }
        }   
    }
}

export default uploadFile