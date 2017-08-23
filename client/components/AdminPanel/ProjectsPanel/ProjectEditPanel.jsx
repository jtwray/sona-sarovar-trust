import React, {Component, cloneElement} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {updatedProjectNameAndDescription, addedPicToProject, updatedProjectPic} from '../../../actions';
import StatusBox from '../../../lib/components/StatusBox';
import StatusPanel from '../../../lib/components/StatusPanel';
import Modal from '../../../lib/components/Modal';
import PicForm from '../../../lib/components/PicForm';

const createStateFromProject = project => {
  let name = "", description = "", pics = [];
  if (project) {
    ({name, description, pics} = project);
  }
  return {name, description, pics};
};

const createInitState = () => ({
  nameError: "",
  descriptionError: "",

  statusBoxes: [],

  updatingPic: false,
  deletingPic: false,
  selectedPic: null
});

class ProjectEditPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...createInitState(),
      ...createStateFromProject(props.project)
    };

    this.updateStateField = this.updateStateField.bind(this);
    this.updateProject = this.updateProject.bind(this);
    this.updatePic = this.updatePic.bind(this);
    this.deletePic = this.deletePic.bind(this);
    this.updatedProjectPic = this.updatedProjectPic.bind(this);
    this.updateProjectPicFailed = this.updateProjectPicFailed.bind(this);
  }

  updateProjectPicFailed() {
    this.setState({updatingPic: false, deletingPic: false});
    this.addStatusBox(
      <StatusBox success={false}>
        <div><h3>Failure!</h3></div>
        <div>Project Pic could not be updated</div>
      </StatusBox>
    );
  }

  updatedProjectPic({url}) {
    this.props.updatedProjectPic(this.props.match.params.index, this.state.selectedPic._id, url);
    this.setState({updatingPic: false, deletingPic: false});
    this.addStatusBox(
      <StatusBox success={true}>
        <div><h3>Success!</h3></div>
        <div>Project Pic Updated Successfully</div>
      </StatusBox>
    );
  }

  addStatusBox(statusBox) {
    this.setState({
      statusBoxes: [
        ...this.state.statusBoxes,
        cloneElement(statusBox, {key: this.state.statusBoxes.length})
      ]
    });
  }

  updatePic(pic) {
    this.setState({updatingPic: true, selectedPic: pic});
  }

  deletePic(pic) {
    this.setState({deletingPic: true, selectedPic: pic});
  }

  clearValidation() {
    this.setState({nameError: "", descriptionError: ""});
  }

  validateFields() {
    let {name, description} = this.state;
    this.clearValidation();

    let isValid = true;

    if (!name) {
      this.setState({nameError: "Name field cannot be empty"});
      isValid = false;
    }

    if (!description) {
      this.setState({descriptionError: "Description field cannot be empty"});
      isValid = false;
    }

    return isValid;
  }

  updateNameAndDescription() {
    let {name, description} = this.state;
    axios
      .patch(`/api/project/${this.props.project._id}`, {
        name,
        description
      }, {
        headers: {'x-auth': this.props.authToken}
      })
      .then(res => {
        this.props.updatedProjectNameAndDescription(name, description, this.props.match.params.index);
        this.addStatusBox(
          <StatusBox success={true}>
            <div><h3>Success!</h3></div>
            <div>Updated Project Name and Description</div>
          </StatusBox>
        )
      })
      .catch(err => {
        console.log(err);
        this.addStatusBox(
          <StatusBox success={false}>
            <div><h3>Failure!</h3></div>
            <div>Project Name and Description updation failed</div>
          </StatusBox>
        )
      });
  }

  uploadMorePics() {
    let pics = document.getElementById("edit-panel-pic").files;
    if (pics.length === 0) return;

    for (let i = 0; i < pics.length; i++) {
      let data = new FormData();
      data.append('pic', pics[i]);

      axios.put(`/api/project/pic/${this.props.project._id}`, data, {headers: {'x-auth': this.props.authToken}})
        .then(res => {
          this.props.addedPicToProject(res.data, this.props.match.params.index);
          this.addStatusBox(
            <StatusBox success={true}>
              <div><h3>Success!</h3></div>
              <div>More Pics added to Project</div>
            </StatusBox>
          )
        })
        .catch(err => {
          console.log(err);
          this.addStatusBox(
            <StatusBox success={false}>
              <div><h3>Failure!</h3></div>
              <div>Adding more pics to project failed!</div>
            </StatusBox>
          )
        });
    }

    document.getElementById("edit-panel-pic").value = null;
  }

  updateProject() {
    if (!this.validateFields()) return;

    this.updateNameAndDescription();
    this.uploadMorePics();
  }

  updateStateField(field, value) {
    let updateObj = {};
    updateObj[field] = value;
    this.setState(updateObj);
  };

  componentWillReceiveProps(nextProps) {
    this.setState(createStateFromProject(nextProps.project));
  }

  render() {
    return (
      <PanelView
        {...this.state}
        updateStateField={this.updateStateField}
        updateProject={this.updateProject}
        updatePic={this.updatePic}
        deletePic={this.deletePic}
        closeModal={() => this.setState({updatingPic: false, deletingPic: false})}
        authToken={this.props.authToken}
        updatedProjectPic={this.updatedProjectPic}
        updateProjectPicFailed={this.updateProjectPicFailed}
      />
    );
  }
}

const getUpdatePicModal = (pic, closeModal, authToken, updatedProjectPic, updateProjectPicFailed) => (
  <Modal show={true}>
    <div className="update-pic-form">
      <div className="message">
        <span>Modifying Pic</span>
        <img src={pic.url}/>
      </div>
      <PicForm
        close={closeModal}
        authToken={authToken}
        mode="update"
        url={`/api/project/pic/${pic._id}`}
        onSuccess={updatedProjectPic}
        onFailure={updateProjectPicFailed}
      />
    </div>
  </Modal>
);

const getDeletePicModal = (pic, closeModal, authToken, updatedProjectPic, updateProjectPicFailed) => (
  <Modal show={true}>
    {`Deleting pic ${pic._id}`}
  </Modal>
);

const getModal = (updatingPic, deletingPic, selectedPic, closeModal, authToken, updatedProjectPic, updateProjectPicFailed) => {
  if (updatingPic) {
    return getUpdatePicModal(selectedPic, closeModal, authToken, updatedProjectPic, updateProjectPicFailed);
  } else if (deletingPic) {
    return getDeletePicModal(selectedPic, closeModal, authToken, updatedProjectPic, updateProjectPicFailed);
  } else {
    return <Modal show={false}/>
  }
};


const PanelView = ({
                     name, description, pics, nameError,
                     descriptionError, updateStateField, updateProject,
                     statusBoxes, updatingPic, deletingPic, selectedPic,
                     updatePic, deletePic, closeModal, authToken,
                     updatedProjectPic, updateProjectPicFailed
                   }) => (
  <div className="project-edit-panel">
    <h2>Edit Project</h2>
    <ProjectEditForm
      name={name}
      description={description}
      pics={pics}
      nameError={nameError}
      descriptionError={descriptionError}
      updateStateField={updateStateField}
      updateProject={updateProject}
      updatePic={updatePic}
      deletePic={deletePic}
    />
    <StatusPanel>
      {statusBoxes}
    </StatusPanel>
    {getModal(updatingPic, deletingPic, selectedPic, closeModal, authToken, updatedProjectPic, updateProjectPicFailed)}
  </div>
);

const ProjectEditForm = ({
                           name, description, pics, nameError,
                           descriptionError, updateStateField, updateProject,
                           updatePic, deletePic
                         }) => (
  <div className="form-holder">
    <section className="name">
      <div className="field">
        <div className="label">
          <label>Name</label>
        </div>

        <div className="input">
          <input type="text" value={name} onChange={e => updateStateField('name', e.target.value)}/>
        </div>
      </div>

      <div className={`field-error ${nameError ? "show-field-error" : ""}`}>
        {nameError}
      </div>
    </section>

    <section className="description">
      <div className="field">
        <div className="label">
          <label>Description</label>
        </div>

        <div className="input">
          <textarea value={description} onChange={e => updateStateField('description', e.target.value)}/>
        </div>
      </div>

      <div className={`field-error ${descriptionError ? "show-field-error" : ""}`}>
        {descriptionError}
      </div>
    </section>

    <section className="current-pics">
      <h4>Project Pics</h4>
      <div className="picture-holder-wrapper">{pics.map(pic => (
        <div className="pic-holder" key={pic._id}>
          <img src={pic.url}/>
          <div className="button-holder">
            <button onClick={e => updatePic(pic)}>Update</button>
            <button onClick={e => deletePic(pic)}>Delete</button>
          </div>
        </div>))}
      </div>
    </section>

    <section className="pics">
      <div className="field">
        <div className="label">
          <label>Add new Pictures</label>
        </div>

        <div className="input">
          <input id="edit-panel-pic" type="file" multiple/>
        </div>
      </div>
    </section>

    <section className="button-holder">
      <button onClick={updateProject}>Update</button>
    </section>
  </div>
);

const mapStateToProps = (state, ownProps) => ({
  project: state.projects.projectsDone[ownProps.match.params.index],
  authToken: state.userAuth.authToken
});

const mapDispatchToProps = {updatedProjectNameAndDescription, addedPicToProject, updatedProjectPic};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectEditPanel);