import React from "react";

const ImageDetails = (props) => {
    return (
        <div className="row mt-5">
            <div className="col-md-6 m-auto">
                <h3 className="text-center">{props.imgName}</h3>
                <img style={{ width: '100%' }} src={props.imgPath} alt=""/>
            </div>
        </div>
    );
};

export default ImageDetails;