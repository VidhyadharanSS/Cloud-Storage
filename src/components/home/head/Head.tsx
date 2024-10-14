import { usePinataContext } from '../../../context/PinataContext';
import connectMetaMask from '../../../utils/connectMetaMask';

function Head(): React.ReactElement {
    const pinataContext = usePinataContext();

    const handleConnectWeb3 = async (): Promise<void> => {
        if (pinataContext) 
            await connectMetaMask(pinataContext);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full my-10">
            <h2 className="font-bold text-6xl font-moderustic">CloudX</h2>
            <br />
            <p className="opacity-120 text-lg md:text-xl">Upload your files and keep them safe on the blockchain.</p>
            <p className="opacity-120 text-lg md:text-xl mt-2">Experience unparalleled security and privacy as your files are stored in a decentralized manner, ensuring that only you have access.</p>
            <p className="opacity-120 text-lg md:text-xl mt-2">With CloudX, you can easily manage your files and enjoy the benefits of blockchain technology, such as immutability and transparency.</p>
            <p className="opacity-120 text-lg md:text-xl mt-2">Join our community of users who value data ownership and security in the digital age.</p>
            <button 
                onClick={() => alert("Read more about CloudX")} 
                className='text-lg md:text-xl my-4 px-6 py-3 rounded-3xl border-[0.5px] border-orange-600 bg-orange-600 text-white shadow-lg dark:bg-[#151515] dark:hover:bg-orange-600 transition-all duration-200 font-semibold'
            >
                Read more about CloudX
            </button>
            
            {pinataContext && !pinataContext?.account && (
                <div className="w-full flex flex-col items-center justify-center mt-10">
                    <p className="w-[80%] text-center opacity-80">
                        (Connect your <span className="font-semibold text-red-500">MetaMask</span> to view and upload files. Change network to Ethereum <span className='text-red-500'>Sepolia</span> testnet of your wallet.)
                    </p>
                    <button 
                        onClick={handleConnectWeb3} 
                        className='text-lg md:text-xl hover:bg-transparent hover:text-gray-800 my-3 md:my-2 px-6 py-3 rounded-3xl border-[0.5px] border-orange-600 bg-orange-600 text-white shadow-lg dark:bg-[#151515] dark:hover:bg-orange-600 transition-all duration-200 font-semibold'
                    >
                        Connect Wallet
                    </button>
                </div>
            )}
        </div>
    );
}

export default Head;
