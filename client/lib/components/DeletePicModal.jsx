import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Modal from './Modal';
import handleCommonErrors from '../handlers/commonErrorsHandler';

const DeletePicModal = ({picUrl, requestUrl, closeModal, authToken, onSuccess, onFailure}) => (
  <Modal show>
    <div className="delete-pic-form">
      <div className="message">
        <span>Deleting Pic</span>
        <img alt="" src={picUrl} />
      </div>

      <div className="action">
        <span>Are you sure you want to delete this pic?</span>
        <div className="button-holder">
          <button
            onClick={() => deletePic(
              requestUrl, authToken,
              onSuccess, onFailure
            )}
            className="yes"
          >Yes
          </button>
          <button onClick={closeModal} className="no">No</button>
        </div>
      </div>
    </div>
  </Modal>
);

const deletePic = (requestUrl, authToken, onSuccess, onFailure) => {
  axios.delete(requestUrl, {
    headers: {'x-auth': authToken}
  }).then(() => {
    onSuccess();
  }).catch(err => {
    handleCommonErrors(err);
    onFailure();
    console.log(err);
  });
};

DeletePicModal.propTypes = {
  picUrl: PropTypes.string.isRequired,
  requestUrl: PropTypes.string.isRequired,
  authToken: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired
};

export default DeletePicModal;
