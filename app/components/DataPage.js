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
      data: {},
      columns: [],
      rows: [],
    };

    this.rowGetter = this.rowGetter.bind(this);
  }

  convertColsForGrid(cols)
  {
    var gridCols = []
    for (var i = 0; i < cols.length; i++)
    {
      var gridCol = {
        key: cols[i],
        name: cols[i],
        editable: false,
        resizable: true,
      }
      gridCols.push(gridCol)
    }
    return gridCols;
  }

  convertRowsForGrid(rows)
  {

    var gridRows = []
    for (var i = 0; i < rows.length; i++)
    {
      var gridRow = {
        Name: "test",
        Indicator: "test2",
        Value: "test3",
      }
      gridRows.push(gridRow)
      //gridRows.push(rows[i])
    }
    return gridRows;
  }

  rowGetter(i) {
    return this.state.rows[i];
  }

  componentDidMount(){

    var url = this.props.location.pathname;
    var urlsplit = url.split("/");
    var type = urlsplit[3];
    var affliction = urlsplit[4];

    api.getDataFromAffliction(type, affliction)
    .then(
      function (data) {
        var cols = data.cols;
        var rows = JSON.parse(data.rows);
        var gridCols = this.convertColsForGrid(cols);
      //  var gridRows = this.convertRowsForGrid(rows);
        this.setState(function () {
          return {
            columns: gridCols,
            rows: rows
          }
        });
      }.bind(this));

    this.setState(function () {
      return {
        name: affliction,
      }
    });
  }

  render() {
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
