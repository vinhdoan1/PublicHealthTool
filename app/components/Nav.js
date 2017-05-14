var React = require('react');
var NavLink = require('react-router-dom').NavLink;
var PropTypes = require('prop-types');
var Tabs = require('react-bootstrap').Tabs;
var Tab = require('react-bootstrap').Tab;

class Nav extends React.Component {
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
          <p>Public Health Tool</p>
          <div className = 'nav-boottabs'>
            <Tabs defaultActiveKey={this.props.selected} animation={false} onSelect={this.handleSubmit} id='nav-tab-id'>
              {tabComponent}
            </Tabs>
        </div>
      </div>
    )
  }
}

Nav.propTypes = {
  selected: PropTypes.number.isRequired,
};

module.exports = Nav;
