import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import TeamMemberUpdaterForm from './TeamPanel/TeamMemberUpdaterForm';
import {updatedTeamMember, deletedTeamMember} from '../../actions';
import StatusPanel from '../../lib/components/StatusPanel';

class TrusteesPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      statusBoxToAdd: null
    };

    this.addStatusBox = this.addStatusBox.bind(this);
  }

  addStatusBox(statusBox) {
    this.setState({statusBoxToAdd: statusBox});
  }

  render() {
    return (
      <TrusteesPanelView
        {...this.props}
        statusBoxToAdd={this.state.statusBoxToAdd}
        addStatusBox={this.addStatusBox}
      />
    );
  }
}

const TrusteesPanelView = ({
  trustees, authToken, updatedTeamMember, statusBoxToAdd, addStatusBox, deletedTeamMember
}) => (
  <div className="controller team-panel">
    <h1>Trustees Panel</h1>

    <div className="add-team-member">
      <h2>Add Trustee</h2>
      <div className="link-holder">
        <NavLink
          className="success-button"
          to="/admin/team-member/add?type=trustee"
        >
          Add a New Trustee
        </NavLink>
      </div>
    </div>

    <div className="update-team-member">
      <h2>Update Trustee Info</h2>
      <section className="member-info-holder">{trustees.map((member, index) => (
        <TeamMemberUpdaterForm
          key={member._id}
          index={index}
          member={member}
          authToken={authToken}
          updatedTeamMember={updatedTeamMember}
          addStatusBox={addStatusBox}
          deletedTeamMember={deletedTeamMember}
        />))}
      </section>
      <StatusPanel statusBoxToAdd={statusBoxToAdd} />
    </div>
  </div>
);

const mapStateToProps = state => ({
  trustees: state.team.teamMembers.filter(m => m.type === 'trustee'),
  authToken: state.userAuth.authToken
});

const mapDispatchToProps = {updatedTeamMember, deletedTeamMember};

TrusteesPanelView.defaultProps = {
  statusBoxToAdd: null
};

TrusteesPanelView.propTypes = {
  trustees: PropTypes.arrayOf(PropTypes.object).isRequired,
  authToken: PropTypes.string.isRequired,
  updatedTeamMember: PropTypes.func.isRequired,
  addStatusBox: PropTypes.func.isRequired,
  statusBoxToAdd: PropTypes.element,
  deletedTeamMember: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(TrusteesPanel);
