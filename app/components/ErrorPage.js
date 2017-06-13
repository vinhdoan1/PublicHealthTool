var React = require('react');
var NavHealth = require('./Nav');


class ErrorPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: props.text
    };
  }

  render() {
    return (
      <div className="error-container">
      <NavHealth
        selected = {-1}
        history={this.props.history}
        />
      <br/>
      <center>
      <p >
        Page Not Found
      </p>
      </center>
      <div className="long-space"></div>
      </div>
    )
  }
}


module.exports = ErrorPage;
