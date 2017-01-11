import React, {Component} from 'react';

import SidebarContainer from '../containers/SidebarContainer';
import PlayerContainer from '../containers/PlayerContainer';
import styles from '../styles/App.css';
import CSSModules from 'react-css-modules';

class App extends Component {
  render () {
    return (
      <div id="main" className="container-fluid" styleName="main">
        <div className="col-xs-2">
          <SidebarContainer />
        </div>
        <div className="col-xs-10">
          {
            this.props.children && React.cloneElement(this.props.children, this.props)
          }
        </div>
        <PlayerContainer />
      </div>
    );
  }
}

export default CSSModules(App, styles)