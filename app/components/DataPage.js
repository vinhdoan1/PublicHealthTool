var React = require('react');
var Nav = require('./Nav');

class DataPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataId: "",
      data: {}
    };

  //  this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){

    var url = this.props.location.pathname;
    var id = url.substring(url.lastIndexOf("/") + 1)
    console.log(id)
    this.setState(function () {
      return {
        dataId: id,
      }
    });
  }

  render() {
    console.log(this.props)
    return (
      <div className = 'data-page-container'>
        <Nav
          selected = {-1}
          history={this.props.history}
        />
        <p>{this.state.dataId}</p>
      </div>
    )
  }
}

module.exports = DataPage;
