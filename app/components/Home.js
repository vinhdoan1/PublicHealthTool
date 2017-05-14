var React = require('react');
var Nav = require('./Nav');

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  //  this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div className = 'home-container'>
        <Nav
          selected = {0}
          history={this.props.history}
        />
        <p>[Heat Map goes here]</p>
      </div>
    )
  }
}

module.exports = Home;
