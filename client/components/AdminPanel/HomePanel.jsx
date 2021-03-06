import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BrandLogoPanel from './HomePanel/BrandLogoPanel';
import CenterPicsPanel from './HomePanel/CenterPicsPanel';
import CaptionsPanel from './HomePanel/CaptionsPanel';
import StatusPanel from '../../lib/components/StatusPanel';

class HomePanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      statusBoxToAdd: null
    };

    this.addStatusBox = this.addStatusBox.bind(this);
  }

  addStatusBox(statusBox) {
    this.setState({
      statusBoxToAdd: statusBox
    });
  }

  render() {
    return (
      <HomePanelView
        addStatusBox={this.addStatusBox}
        statusBoxToAdd={this.state.statusBoxToAdd}
      />
    );
  }
}

const HomePanelView = ({addStatusBox, statusBoxToAdd}) => (
  <div className="controller home-panel">
    <h1>Home Panel</h1>
    <section className="sub-panel">
      <BrandLogoPanel addStatusBox={addStatusBox} />
      <CenterPicsPanel addStatusBox={addStatusBox} />
      <CaptionsPanel addStatusBox={addStatusBox} />
    </section>
    <StatusPanel statusBoxToAdd={statusBoxToAdd} />
  </div>
);

HomePanelView.defaultProps = {
  statusBoxToAdd: null
};

HomePanelView.propTypes = {
  addStatusBox: PropTypes.func.isRequired,
  statusBoxToAdd: PropTypes.element
};

export default HomePanel;
