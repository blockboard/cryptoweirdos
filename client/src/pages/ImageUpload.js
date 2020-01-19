import React, { Component } from "react";
import Layout from "../Components/Layout";
import ImageUploader from "../Components/Uploader/ImageUploader";

class ImageUpload extends Component{
    render() {
        return (
            <div>
                <Layout>
                    <div className="container mt-4">
                        <h4 className="display-4 text-center mb-4">
                            <i className="fab fa-react" /> React File Upload
                        </h4>

                        <ImageUploader />
                        <ImageUploader />
                        <ImageUploader />
                        <ImageUploader />
                    </div>
                </Layout>
            </div>
        );
    }
}

export default ImageUpload;