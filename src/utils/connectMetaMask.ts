import Web3 from "web3"
import ContractABI from '../ABI.json'

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

const connectMetaMask = async (pinataContext: PinataContextInterface | null): Promise<void> => {

    console.log('inside')
    if (!pinataContext?.account) {
        const ContractAddress = import.meta.env.VITE_APP_CONTRACT_ADDR

        if (window.ethereum) {
            console.log('found')
            const web3Instance = new Web3(window.ethereum)
            console.log(web3Instance)

            try {
                const account = await window.ethereum.request({ method: 'eth_requestAccounts' })
               
                pinataContext?.setWeb3(web3Instance) 
                pinataContext?.setAccount(account[0])

                const contractInstance = new web3Instance.eth.Contract(ContractABI, ContractAddress)

                pinataContext?.setContract(contractInstance)
                let files = await contractInstance.methods.getFiles().call({ from : account[0] })
                files = files.filter((file: _File) => file.fileName !== '' && file.fileType !== '' && file)
                files.reverse()

                const fetchedImages = files.filter((file: _File) => file.fileType === 'image' || file.fileType.split('/')[0] === 'image' && file)
                const fetchedVideos = files.filter((file: _File) => file.fileType === 'video' || file.fileType.split('/')[0] === 'video' && file)
                let fetchedDocs = files.filter((file: _File) => (file.fileType !== 'video' && file.fileType !== 'image') && (file.fileType.split('/')[0] !== 'video' && file.fileType.split('/')[0] !== 'image') && file)
                fetchedDocs = fetchedDocs.filter((file: _File) => file.fileName !== '' && file.fileType !== '' && file)

                pinataContext?.setFiles(files)
                pinataContext?.setImages(fetchedImages)
                pinataContext?.setVideos(fetchedVideos)
                pinataContext?.setDocs(fetchedDocs)

                pinataContext?.setToastMessage('Successfully connected to MetaMask wallet')
                pinataContext?.setIsToast(true)

            } catch (err) {
                console.error(err)
            }
        } else if (window.web3) {
            pinataContext?.setWeb3(new Web3(window.web3.currentProvider))
        } else {
            pinataContext?.setToastMessage('No Web3 was found, make sure you have MetaMask installed or if you are on android then open the site in MetaMask browser.')
            pinataContext?.setIsToast(true)
            console.log('Please use MetaMask')
        }
    }
}

export default connectMetaMask