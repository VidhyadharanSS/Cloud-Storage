import Navbar from "../navbar/Navbar"
import Head from "./head/Head"
import UploadComponent from "./uploadFile/UploadComponent"
import ViewFile from "./viewFile/ViewFile"

function Home(): React.ReactElement {
    return (
        <div className="flex flex-col items-center justify-start w-full min-h-screen">
            <Navbar />
            <Head />
            <UploadComponent />
            <ViewFile />
        </div>
    )
}

export default Home