import React, { Fragment, useState } from "react";
import axios from "axios";

//import ImageDetails from "./Details/ImageDetails";
import Message from "./Message";

const ImageUploader = (props) => {
    const [image, setImage] = useState('undefined');
    const [imageName, setImageName] = useState('choose image');
    const [imageType, setImageType] = useState('image/undefined');
    const [imageSize, setImageSize] = useState('0 bytes');
    const [uploadedImage, setUploadedImage] = useState({
        imageName: '',
        imagePath: ''
    });
    const [message, setMessage] = useState('');

    const onChange = e => {
        setImage(e.target.files[0]);
        setImageName(e.target.files[0].name);
        setImageType(e.target.files[0].type);
        setImageSize(e.target.files[0].size + " bytes");
    };

    const onSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', image);

        try {
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const { imageName, imagePath } = res.data;

            setUploadedImage({
                imageName: imageName,
                imagePath: imagePath
            });

            setMessage('Image Uploaded');
        } catch (e) {
            if (e.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(e.response.data.msg);
            }
        }
    };

    return (
        <Fragment>
            {message ? <Message msg={message} /> : null}
            <form onSubmit={onSubmit}>
                <div className="custom-file mt-4">
                    <input type="file"
                           className="custom-file-input"
                           id="customFile"
                           onChange={onChange}
                    />
                    <label className="custom-file-label"
                           htmlFor="customFile">
                        {imageName}
                    </label>
                </div>

                <input type="submit"
                       value="Upload"
                       className="btn btn-primary btn-block mt-4"
                />
            </form>
            {/*{ uploadedImage ?
                <ImageDetails imgName={uploadedImage.imageName} imgPath={uploadedImage.imagePath}/> :
                <ImageDetails imgName={"undefined"} imgPath={"undefined"}/>
            }*/}
            {uploadedImage ? (
                <div className='row mt-5'>
                    <div className='col-md-6 m-auto'>
                        <h3 className='text-center'>{uploadedImage.imageName}</h3>
                        <img style={{ width: '100%' }} src={uploadedImage.imagePath} alt='' />
                    </div>
                </div>
            ) : null}
        </Fragment>
    );
};

export default ImageUploader;