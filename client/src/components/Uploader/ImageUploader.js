import React, { Fragment, useState } from "react";
//import axios from "axios";

import ipfs from "../../util/ipfs";

//import ImageDetails from "./Details/ImageDetails";
import Message from "./Message";
import Progress from "./Progress";

const ImageUploader = (props) => {
    const [image, setImage] = useState('undefined');
    const [imgaeBinary, setImageBinary] = useState();
    const [imageHash, setImageHash] = useState('');
    const [imageName, setImageName] = useState('choose image');
    const [imageType, setImageType] = useState('image/undefined');
    const [imageSize, setImageSize] = useState('0 bytes');
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const onChange = e => {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        setImage(uploadedImage);
        setImageName(uploadedImage.name);
        setImageType(uploadedImage.type);
        setImageSize(uploadedImage.size + " bytes");
        const IReader = new FileReader();
        IReader.readAsArrayBuffer(uploadedImage);
        IReader.onloadend = (e) => {
            const bufferResult = Buffer(IReader.result);
            setImageBinary(bufferResult);
        };
    };

    const onSubmit = async e => {
        e.preventDefault();
        ipfs.add(imgaeBinary, (err, result) => {
            if (err) {
                console.error(err)
            }
            const resultHash = result[0].hash;
            setImageHash(resultHash);
            console.log(resultHash);
        })
    };

    // dev-client-server-contracts
    /*const onSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', image);

        try {
            const res = await axios.post('/artist/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: progressEvent => {
                    setUploadPercentage(
                        parseInt(
                            Math.round(
                                (progressEvent.loaded * 100 / progressEvent.total)
                            )
                        )
                    );

                    // Clear Percentage
                    setTimeout(() => setUploadPercentage(0), 10000)
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
    };*/

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

                <Progress percentage={uploadPercentage}/>

                <input type="submit"
                       value="Upload"
                       className="btn btn-primary btn-block mt-4"
                />
            </form>
            {/*{ uploadedImage ?
                <ImageDetails imgName={uploadedImage.imageName} imgPath={uploadedImage.imagePath}/> :
                <ImageDetails imgName={"undefined"} imgPath={"undefined"}/>
            }*/}
            {imageHash ? (
                <div className='row mt-5'>
                    <div className='col-md-6 m-auto'>
                        <h3 className='text-center'>{imageName}</h3>
                        <img style={{ width: '100%' }} src={`https://ipfs.io/ipfs/${imageHash}`} alt='' />
                    </div>
                </div>
            ) : null}
        </Fragment>
    );
};

export default ImageUploader;