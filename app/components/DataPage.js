var React = require('react');
var Nav = require('./Nav');
var api = require('../utils/api');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var ReactDataGrid = require('react-data-grid');

class DataPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      category: "",
      date: 0,
      views: 0,
      columns: [],
      rows: [],
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

    api.getMapDataFromAffliction(type, affliction)
    .then(
      function (data) {
        //  console.log(data)
    }.bind(this));

    api.getDataFromAffliction(type, affliction)
    .then(
      function (data) {
        this.setState(function () {
          return {
            name: data.name,
            description: data.description,
            category: data.category,
            views: data.views,
            date: data.date,
            columns: data.columns,
            rows: data.rows,
          }
        });
      }.bind(this));

  }

  render() {
      console.log(this.state);
    return (
      <div className = 'data-page-container'>
        <Nav
          selected = {-1}
          history={this.props.history}
        />

        <Row className="show-grid">
            <Col xs={11} md={11}>
              <p>{this.state.name}</p>
              <ReactDataGrid
                enableCellSelect={true}
                columns={this.state.columns}
                rowGetter={this.rowGetter}
                rowsCount={this.state.rows.length}
                minHeight={500} />
          </Col>
        </Row>
      </div>
    )
  }
}

module.exports = DataPage;
