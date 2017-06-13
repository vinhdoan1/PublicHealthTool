var React = require('react');
var NavLink = require('react-router-dom').NavLink;
var PropTypes = require('prop-types');
var Tabs = require('react-bootstrap').Tabs;
var Tab = require('react-bootstrap').Tab;
var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;
var Button = require('react-bootstrap').Button;
//import GoogleLogin from 'react-google-login';
var GoogleLoginComponent = require('./GoogleLoginComponent');


class NavHealth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(eventKey) {
    if (eventKey != this.props.selected)
    {
      let path = '';
      if (eventKey === 0)
        path = '';
      else if (eventKey == 1) {
        path = 'data'
      }
      else {
        path = 'input'
      }

      this.props.history.push({
        pathname: '/' + path,
      });
    }

  }


  render() {
    var tabs = ['Map', 'Data', 'Input'];
    var tabComponent = tabs.map(function(tab, i) {
      return (<Tab eventKey={i} title={tab} key={i}></Tab>);
    });

    return (
      <div className = 'nav-container'>
          <h1>One Step Public Health UI</h1>
          <div className = 'nav-boottabs'>
            <Tabs defaultActiveKey={this.props.selected} animation={false} onSelect={this.handleSubmit} id='nav-tab-id'>
              {tabComponent}
            </Tabs>
        </div>
        <GoogleLoginComponent/>
      </div>
    )
  }
}

NavHealth.propTypes = {
  selected: PropTypes.number.isRequired,
};

module.exports = NavHealth;
