import ImagePanorama from "../components/ImagePanorama";
import ImageUploader from "../components/ImageUploader";


function HomePage() {
    return (
        <div>
            <h1>Upload Images</h1>
            <ImageUploader />
            {/* <ImagePanorama /> */}
        </div>
    )
}

export default HomePage;