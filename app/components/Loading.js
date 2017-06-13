var React = require('react');
var PropTypes = require('prop-types');

var styles = {
  content: {
    textAlign: 'center',
    fontSize: '20px'
  }
};

class Loading extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: props.text
    };
  }
  componentDidMount() {
    var stopper = this.props.text + '...';
    this.interval = window.setInterval(function () {
      if (this.state.text === stopper) {
        this.setState(function () {
          return {
            text: this.props.text
          }
        })
      } else {
        this.setState(function (prevState) {
          return {
            text: prevState.text + '.'
          }
        });
      }
    }.bind(this), this.props.speed)
  }
  componentWillUnmount() {
    window.clearInterval(this.interval);
  }
  render() {
    var height = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
    return (
      <div className="loading-container">
      <p style={styles.content}>
        {this.state.text}
      </p>
      <div className="long-space"></div>
      </div>
    )
  }
}

Loading.propTypes = {
  text: PropTypes.string.isRequired,
  speed: PropTypes.number.isRequired,
};

Loading.defaultProps = {
  text: 'Loading',
  speed: 200
};

module.exports = Loading;
