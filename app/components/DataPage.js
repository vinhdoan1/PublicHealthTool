var React = require('react');
var Nav = require('./Nav');
var api = require('../utils/api');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Label = require('react-bootstrap').Label;
var ReactDataGrid = require('react-data-grid');
var Button = require('react-bootstrap').Button;
var Well = require('react-bootstrap').Well;
var Loading = require('./Loading');

import { connect } from "react-redux";


@connect((store) => {
  //console.log(store)
  return {
    onestep: (store.google.loggedIn && store.google.isOneStep)
  }
})
class DataPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      affliction: "",
      name: "",
      description: "",
      category: "",
      source: "",
      date: 0,
      views: 0,
      columns: [],
      rows: [],
      loading: true,
    };

    this.rowGetter = this.rowGetter.bind(this);
  }



  rowGetter(i) {
    return this.state.rows[i];
  }

  componentDidMount(){

    var url = this.props.location.pathname;
    var urlsplit = url.split("/");
    var type = urlsplit[3];
    var affliction = urlsplit[4];

    api.getDataFromAffliction(type, affliction, false)
    .then(
      function (data) {
        var newViews = data.views + 1;
        var newData = {
          ...data,
          views: newViews,
        }
        // Change views
        api.setInfo(type,affliction,newData)
        .then (
          function(data2) {
            this.setState(function () {
              return {
                ...newData,
                affliction,
                category: type,
                loading: false,
              }
            });
          }.bind(this)
        )
    }.bind(this))

  }

  render() {
    let loading = this.state.loading;
    if (loading)
    {
      return(<div className = 'input-container'>
        <Nav
          selected = {-1}
          history={this.props.history}
        />
        <Loading/>
      </div>);
    }

    //link to edit data page
    var toDataEdit = () => {
      this.props.history.push({
        pathname: "/input/" + this.state.category + "/" +this.state.affliction,
      });
    }

    var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
    date.setUTCMilliseconds(this.state.date);

    return (
      <div className = 'data-page-container'>
        <Nav
          selected = {-1}
          history={this.props.history}
        />

        <Row className="show-grid">
            <Col xs={11} md={11}>
              <div className="data-header"><h1>{this.state.name} <Label>{this.state.category}</Label> </h1> </div>
              <hr></hr>
              <Well>{this.state.description}</Well>
              <ReactDataGrid
                enableCellSelect={true}
                columns={this.state.columns}
                rowGetter={this.rowGetter}
                rowsCount={this.state.rows.length}
                minHeight={500} />
              <p className="updated-date"><b>Source: </b> {this.state.source} &nbsp;&nbsp;&nbsp;<b>Last Updated: </b>{date.toDateString()}&nbsp;&nbsp;&nbsp;<b>Views:</b> {this.state.views}</p>

              {
                this.props.onestep &&
                <center><Button bsStyle="primary" onClick={toDataEdit}>Edit Data</Button></center>
              }
          </Col>
        </Row>
      </div>
    )
  }
}

module.exports = DataPage;
