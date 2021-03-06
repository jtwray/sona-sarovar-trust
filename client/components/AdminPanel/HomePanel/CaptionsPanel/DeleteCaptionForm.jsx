import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import handleCommonErrors from '../../../../lib/handlers/commonErrorsHandler';

const DeleteCaptionForm = ({caption, authToken, onSuccess, close, onFailure}) => (
  <div className="delete-caption-form">
    <span>Are you sure you want to delete this caption?</span>
    <span className="caption-text">{caption.text}</span>
    <div className="button-holder">
      <button
        onClick={() => deleteCaption(caption._id, onSuccess, onFailure, authToken)}
      >
        Yes
      </button>
      <button onClick={close}>No</button>
    </div>
  </div>
);

const deleteCaption = (_id, onSuccess, onFailure, authToken) => {
  axios.delete(`/api/home-page/caption/${_id}`, {headers: {'x-auth': authToken}})
    .then(() => {
      onSuccess();
    })
    .catch(err => {
      handleCommonErrors(err);
      if (onFailure) onFailure();
      console.log(err);
    });
};

DeleteCaptionForm.defaultProps = {
  onFailure: null
};

DeleteCaptionForm.propTypes = {
  authToken: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  caption: PropTypes.object.isRequired,
  onFailure: PropTypes.func
};

export default DeleteCaptionForm;
