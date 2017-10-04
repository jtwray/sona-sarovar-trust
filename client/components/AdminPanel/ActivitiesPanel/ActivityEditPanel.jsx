import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {
  updatedActivityNameAndDescription, addedPicToActivity,
  updatedActivityPic, deletedPicFromActivity
}  from '../../../actions';
import StatusBox from '../../../lib/components/StatusBox';
import handleCommonErrors from '../../../lib/handlers/commonErrorsHandler';
import ActivityEditPanelView from './ActivityEditPanel/ActivityEditPanelView';

const createStateFromActivityProp = activity => {
  let name = '', description = '', pics = [];
  if (activity) {
    ({name, description, pics} = activity);
  }
  return {name, description, pics};
};

const createUXState = () => ({
  nameError: '',
  descriptionError: '',
  updatingPic: false,
  deletingPic: false,
  selectedPic: null
});

const createInitState = props => ({
  ...createStateFromActivityProp(props.activity),
  ...createUXState(),
  statusBoxToAdd: null
});

class ActivityEditPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...createInitState(props)
    };

    this.updateStateField = this.updateStateField.bind(this);
    this.updateActivity = this.updateActivity.bind(this);
    this.updatePic = this.updatePic.bind(this);
    this.deletePic = this.deletePic.bind(this);
    this.updatedActivityPic = this.updatedActivityPic.bind(this);
    this.updateActivityPicFailed = this.updateActivityPicFailed.bind(this);
    this.deletedActivityPic = this.deletedActivityPic.bind(this);
    this.deleteActivityPicFailed = this.deleteActivityPicFailed.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(createStateFromActivityProp(nextProps.activity));
  }

  closeModal() {
    this.setState({updatingPic: false, deletingPic: false});
  }

  deleteActivityPicFailed() {
    this.closeModal();
    this.addStatusBox(
      <StatusBox success={false}>
        <div><h3>Failure!</h3></div>
        <div><span>Activity pic could not be deleted.</span></div>
      </StatusBox>
    );
  }

  deletedActivityPic() {
    this.closeModal();
    this.props.deletedPicFromActivity(this.state.selectedPic, this.props.match.params.index);
    this.addStatusBox(
      <StatusBox success={true}>
        <div><h3>Success!</h3></div>
        <div><span>Deleted Activity pic Successfully</span></div>
      </StatusBox>
    );
  }

  updateActivityPicFailed() {
    this.setState({updatingPic: false, deletingPic: false});
    this.addStatusBox(
      <StatusBox success={false}>
        <div><h3>Failure!</h3></div>
        <div>Activity Pic could not be updated.</div>
      </StatusBox>
    );
  }

  updatedActivityPic({url}) {
    this.props.updatedActivityPic(this.props.match.params.index, this.state.selectedPic._id, url);
    this.setState({updatingPic: false, deletingPic: false});
    this.addStatusBox(
      <StatusBox success={true}>
        <div><h3>Success!</h3></div>
        <div>Activity Pic Updated Successfully.</div>
      </StatusBox>
    );
  }

  addStatusBox(statusBox) {
    this.setState({statusBoxToAdd: statusBox});
  }

  updatePic(pic) {
    this.setState({updatingPic: true, selectedPic: pic});
  }

  deletePic(pic) {
    this.setState({deletingPic: true, selectedPic: pic});
  }

  clearValidation() {
    this.setState({nameError: '', descriptionError: ''});
  }

  validateFields() {
    let {name, description} = this.state;
    this.clearValidation();

    let isValid = true;

    if (!name) {
      this.setState({nameError: 'Name field cannot be empty'});
      isValid = false;
    }

    if (!description) {
      this.setState({descriptionError: 'Description field cannot be empty'});
      isValid = false;
    }

    return isValid;
  }

  updateNameAndDescription() {
    let {name, description} = this.state;
    axios.patch(`/api/activity/${this.props.activity._id}`, {name, description}, {
      headers: {'x-auth': this.props.authToken}
    })
      .then(() => {
        this.props.updatedActivityNameAndDescription(name, description, this.props.match.params.index);
        this.addStatusBox(
          <StatusBox success={true}>
            <div><h3>Success!</h3></div>
            <div>Updated Activity Name and Description.</div>
          </StatusBox>
        );
      })
      .catch(err => {
        console.log(err);
        handleCommonErrors(err);
        this.addStatusBox(
          <StatusBox success={false}>
            <div><h3>Failure!</h3></div>
            <div>Activity Name and Description updation failed.</div>
          </StatusBox>
        );
      });
  }

  uploadMorePics() {
    let pics = document.getElementById('edit-panel-pic').files;
    if (pics.length === 0) return;

    let uploadPicPromises = Object.keys(pics).map(key => {
      let pic = pics[key];
      let data = new FormData();
      data.append('pic', pic);

      return axios.put(`/api/activity/pic/${this.props.activity._id}`, data, {headers: {'x-auth': this.props.authToken}})
        .then(res => {
          this.props.addedPicToActivity(res.data, this.props.match.params.index);
          this.addStatusBox(
            <StatusBox success={true}>
              <div><h3>Success!</h3></div>
              <div>{pic.name} added to Activity successfully.</div>
            </StatusBox>
          );
        })
        .catch(err => {
          console.log(err);
          this.addStatusBox(
            <StatusBox success={false}>
              <div><h3>Failure!</h3></div>
              <div>Adding pic {pic.name} to activity failed.</div>
            </StatusBox>
          );
        });
    });

    Promise.all(uploadPicPromises).then(() =>
      document.getElementById('edit-panel-pic').value = null);
  }

  updateActivity() {
    if (!this.validateFields()) return;

    this.updateNameAndDescription();
    this.uploadMorePics();
  }

  updateStateField(field, value) {
    let updateObj = {};
    updateObj[field] = value;
    this.setState(updateObj);
  };

  render() {
    return (
      <ActivityEditPanelView
        {...this.state}
        updateStateField={this.updateStateField}
        updateActivity={this.updateActivity}
        updatePic={this.updatePic}
        deletePic={this.deletePic}
        closeModal={this.closeModal}
        authToken={this.props.authToken}
        updatedActivityPic={this.updatedActivityPic}
        updateActivityPicFailed={this.updateActivityPicFailed}
        deletedActivityPic={this.deletedActivityPic}
        deleteActivityPicFailed={this.deleteActivityPicFailed}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  activity: state.activities.activitiesUndertaken[ownProps.match.params.index],
  authToken: state.userAuth.authToken
});

const mapDispatchToProps = {
  updatedActivityNameAndDescription,
  addedPicToActivity,
  updatedActivityPic,
  deletedPicFromActivity
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityEditPanel);
