import React from "react";
import PropTypes from 'prop-types'

const Message = (props) => {
    return (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
            {props.msg}
            <button
                type="button"
                className="close"
                data-dismiss="alert"
                aria-label="Close"
            >
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    );
};

Message.prototype = {
    msg: PropTypes.string.isRequired
};

export default Message;