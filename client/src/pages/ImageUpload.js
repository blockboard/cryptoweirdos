import React, { Component } from "react";
import Layout from "../components/Layout";
import ImageUploader from "../components/Uploader/ImageUploader";

class ImageUpload extends Component{
    render() {
        return (
            <div>
                <Layout>
                    <div className="container mt-4">
                        <h4 className="display-4 text-center mb-4">
                            <i className="fab fa-react" /> Upload new CRYPTOFACE
                        </h4>
                        <ImageUploader />
                    </div>
                </Layout>
            </div>
        );
    }
}

export default ImageUpload;