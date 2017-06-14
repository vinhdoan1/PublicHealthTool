var React = require('react');
var Nav = require('./Nav');
var Loading = require('./Loading');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var FormGroup = require('react-bootstrap').FormGroup;
var FormControl = require('react-bootstrap').FormControl;
var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var InputGroup = require('react-bootstrap').InputGroup;
var ControlLabel = require('react-bootstrap').ControlLabel;
var Panel = require('react-bootstrap').Panel;
var Button = require('react-bootstrap').Button;
var ReactDataGrid = require('react-data-grid');
const { Toolbar } = require('react-data-grid-addons');
var Glyphicon = require('react-bootstrap').Glyphicon;
var Modal = require('react-bootstrap').Modal;
import { connect } from "react-redux";
var api = require('../utils/api');
var Confirm = require('react-confirm-bootstrap');


import IHUpdate from 'immutability-helper';
import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek'


@connect((store) => {
  return {
    onestep: (store.google.loggedIn && store.google.isOneStep),
    reduxLoaded: true
  }
})
class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      affliction: "",
      loading: true,
      name: "",
      description: "",
      category: "",
      categories: [], // different categories for choosing
      editOpen: false,
      columns: [],
      data: {},
      rows: [],
      prevInfo: {},
      prevCols: [],
      prevRows: [],
      prevType: "",
      saveButtonText: "",
      isSaving: false,
      fromDataPage: false,
      deleteModal: false,
      deleteIndex: -1,
      newColNum: 0,
      selectedRows: [],
    };

    this.rowGetter = this.rowGetter.bind(this);
    this.handleGridRowsUpdated = this.handleGridRowsUpdated.bind(this);
    this.setColName = this.setColName.bind(this);
    this.deleteCol = this.deleteCol.bind(this);
    this.addCol = this.addCol.bind(this);
    this.addRow = this.addRow.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.handleSourceChange = this.handleSourceChange.bind(this);
    this.saveInfo = this.saveInfo.bind(this);
    this.onRowsSelected = this.onRowsSelected.bind(this);
    this.onRowsDeselected = this.onRowsDeselected.bind(this);
    this.getSize = this.getSize.bind(this);
    this.deleteSelectedRows = this.deleteSelectedRows.bind(this);
    this.readFileAndSetData = this.readFileAndSetData.bind(this);
    this.resetFields = this.resetFields.bind(this);
    this.handleGridSort = this.handleGridSort.bind(this);
    this.deleteData = this.deleteData.bind(this);
  }

  componentDidMount() {
    var url = this.props.location.pathname;
    var urlsplit = url.split("/");
    var type = urlsplit[2];
    var affliction = urlsplit[3];
    api.getCategories()
    .then(
      function (categories) {
        if (type !== undefined)
        {
          api.getDataFromAffliction(type, affliction, true)
          .then(
            function (data) {

              var prevInfo = {
                name: data.name,
                views: data.views,
                description: data.description,
                date: data.date,
                source: data.source
              }
              var prevCols = data.columns.slice();
              var prevRows = data.rows.slice();
              var prevType = type;

              this.setState(function () {
                return {
                  ...data,
                  category: type,
                  loading: false,
                  prevInfo,
                  prevRows,
                  prevCols,
                  prevType,
                  affliction,
                  fromDataPage: true,
                  saveButtonText: "Save Data",
                  categories,
                }
              });
          }.bind(this))
        }
        else {
            this.setState({ loading: false, saveButtonText: "Add to Database", categories });
        }
      }.bind(this))
    }


 handleNameChange(e)
 {
   this.setState({ name: e.target.value });
 }

 handleDescChange(e)
 {
   this.setState({ description: e.target.value });
 }

 handleSourceChange(e)
 {
   this.setState({ source: e.target.value });
 }

 handleGridSort(sortColumn, sortDirection) {
   const comparer = (a, b) => {
     if (sortDirection === 'ASC') {
       return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
     } else if (sortDirection === 'DESC') {
       return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
     }
   };

   const rows = sortDirection === 'NONE' ? this.state.prevRows.slice(0) : this.state.rows.sort(comparer);

   this.setState({ rows });
 }

 getRandomDate(start, end) {
   return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
 }

 createRows(numberOfRows) {
   let rows = [];
   for (let i = 1; i < numberOfRows; i++) {
     rows.push({
       id: i,
       task: 'Task ' + i,
       complete: Math.min(100, Math.round(Math.random() * 110)),
       priority: ['Critical', 'High', 'Medium', 'Low'][Math.floor((Math.random() * 3) + 1)],
       issueType: ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor((Math.random() * 3) + 1)],
       startDate: this.getRandomDate(new Date(2015, 3, 1), new Date()),
       completeDate: this.getRandomDate(new Date(), new Date(2016, 0, 1))
     });
   }
   return rows;
 }

 rowGetter(i) {
   return this.state.rows[i];
 }

 handleGridRowsUpdated({ fromRow, toRow, updated }) {

   let rows = this.state.rows.slice();
   for (let i = fromRow; i <= toRow; i++) {
     let rowToUpdate = rows[i];
     let updatedRow = IHUpdate(rowToUpdate, {$merge: updated});
     rows[i] = updatedRow;
   }

   this.setState({ rows: rows });

 }

 getColumnNames()
 {
   let colNames = [];
   for (var i = 0; i < this.state.columns.length; i++)
   {
     colNames.push(this.state.columns[i].name)
   }
   return colNames;
 }

 setColName(i, newName)
 {
   //IMMUTABLE (slow)
   let cols = this.state.columns.slice();
   let colsI = cols[i];
   colsI = Object.keys(colsI).reduce((result, key) => {
      result[key] = colsI[key];
      return result;
    }, {});
   colsI.name = newName;
   cols[i] = colsI;

   this.setState({ columns: cols });
 }

 deleteCol(i)
 {
   let cols = this.state.columns.slice();
   let oldCol = cols.splice(i, 1);
   let oldKey = oldCol[0].key;
   let rows = this.state.rows.slice();
   for (var i = 0; i < rows.length; i++)
   {
     let row = rows[i];
     rows[i]= Object.keys(row).reduce((result, key) => {
        if (key !== oldKey) {
            result[key] = row[key];
        }
        return result;
      }, {});
   }
   this.setState({ columns: cols,
                   rows: rows});
 }
 addCol()
 {
   let cols = this.state.columns.slice();
   let newColName = "column" + this.state.newColNum;
   let newColEntry = {
     key: newColName,
     name: newColName,
     editable: true,
     resizable: true,
   }
   cols.push(newColEntry);
   let rows = this.state.rows.slice();
   for (var i = 0; i < rows.length; i++)
   {
     let row = rows[i];
     rows[i]= Object.keys(row).reduce((result, key) => {
        result[key] = row[key];
        return result;
      }, {});
     rows[i][newColName] = "";
   }
   this.setState({ columns: cols,
                   rows: rows,
                   newColNum: this.state.newColNum + 1});
 }

 addRow()
 {
   let rows = this.state.rows.slice();
   let newRow = {};
   for (var i = 0; i < this.state.columns.length; i++)
   {
     newRow[this.state.columns[i].key] = "";
   }
   rows.push(newRow);
   this.setState({ rows: rows});
 }

 deleteSelectedRows()
 {
   let rows = this.state.rows.slice();
   let selectedRowsSorted = this.state.selectedRows.sort(function(a, b) {
     return b - a;
    });
    for (var i = 0; i < selectedRowsSorted.length; i++)
    {
      rows.splice(selectedRowsSorted[i], 1)
    }

   this.setState({ rows: rows, selectedRows: []});
 }

 getSize()
 {
   return this.state.rows.length
 }



 onRowsSelected(rows) {
    this.setState({selectedRows: this.state.selectedRows.concat(rows.map(r => r.rowIdx))});
  }

  onRowsDeselected(rows) {
    let rowIndexes = rows.map(r => r.rowIdx);
    this.setState({selectedRows: this.state.selectedRows.filter(i => rowIndexes.indexOf(i) === -1 )});
  }

 getColsForSending(cols)
 {
   var retCols = [];
   for (var i = 0; i < cols.length; i++)
   {
     retCols.push(cols[i].name);
   }
   return retCols;
 }

 resetFields()
 {
   this.setState({
     name: this.state.prevInfo.name,
     source: this.state.prevInfo.source,
     description: this.state.prevInfo.description,
     columns: this.state.prevCols,
     rows: this.state.prevRows,
     category: this.state.prevType
   });
   window.scrollTo(0, 0);
 }

 saveInfo()
 {
   this.setState({isSaving: true, saveButtonText: "Saving Data"});
   var type = this.state.category;
   var affliction = this.state.affliction;
   var d=new Date();
   var newDate =d.getTime();
   var newInfo = {
     ...this.state.prevInfo,
     name: this.state.name,
     description: this.state.description,
     date: newDate,
     source: this.state.source
   }

   if (this.state.category !== this.state.prevType)
   {
     // restructure data
   }

   if (this.state.fromDataPage)
   {
     api.setInfo(type,affliction,newInfo)
     .then (
       function (data) {
       this.setState({
         isSaving: false,
         saveButtonText: "Save Data",
       })
     }.bind(this))
   }
   else {
     /*
      api.addDataSet(type, affliction, newInfo)
       .then (
         function (data) {
           this.props.history.push({
             pathname: '/data',
           });
       }.bind(this))
      */
   }
   var newCols = this.getColsForSending(this.state.columns);
   var newRows = JSON.stringify(this.state.rows);
  // console.log(newCols, newRows);
  }

  deleteData()
  {/*
    api.deleteData(type,affliction)
    .then (
      function (data) {
        this.props.history.push({
          pathname: '/data',
        });
    }.bind(this))*/
    this.props.history.push({
      pathname: '/data',
    });
  }

 readFileAndSetData(filename)
 {
   // read csv and set things
   var file = filename.target.files[0];
   var fileReader = new FileReader();
    fileReader.onload = function (event) {
        var fileName = file.name.substring(0, file.name.lastIndexOf("."))
        var fileContents = event.target.result;
        var fileLineSplit = fileContents.split("\n")
        var cols = fileLineSplit[0].split(",")
        var rows = [];
        for (var i = 1; i < fileLineSplit.length; i++)
        {
          rows.push(fileLineSplit[i].split(","))
        }

        var stateCols = [];
        var stateRows = [];

        // convert col array to stateable
        for (var i = 0; i < cols.length; i++)
        {
          var col = {
            key: i + "",
            name: cols[i],
            editable: true,
            resizable: true,
          }
          stateCols.push(col)
        }

        // convert row array to stateable
        for (var i = 0; i < rows.length; i++)
        {
          var row = {};
          for (var j = 0; j < cols.length; j++)
          {
            row[j + ""] = rows[i][j]
          }
          stateRows.push(row)
        }
        console.log("WUT")
        this.setState({
          name: file.name,
          affliction: file.name,
          rows: stateRows,
          columns: stateCols
        });
    }.bind(this);
    fileReader.readAsText(file);
 }

  render() {
    let loading = this.state.loading;
    if (loading)
    {
      return(<div className = 'input-container'>
        <Nav
          selected = {2}
          history={this.props.history}
        />
        <Loading/>
      </div>);
    }

    if (!this.props.onestep && this.props.reduxLoaded)
    {
      return (
        <div className = 'input-container'>
          <Nav
            selected = {2}
            history={this.props.history}
          />
        <center>
          <br/>
          <p>{"Access Restricted: Please Sign In as a One Step User."}</p>
        </center>
          <div className="long-space"></div>
        </div>)
    }

    let name = "";
    let description = "";
    let source = "";

    let colNames = this.getColumnNames();
    let colNamesEdit = colNames.map(function(colName, i) {
      return (
        <div key={i}>
        <FormGroup>
          <InputGroup>
            <FormControl type="text"
                         value={colName}
                         onChange= {(change) => {this.setColName(i, change.target.value)}}/>
            <InputGroup.Button>
              <Button onClick={()=> this.setState({ deleteModal: true,
                                                  deleteIndex: i})}>
              <Glyphicon glyph="trash" />
            </Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
        <hr></hr>
        </div>);
    }.bind(this));

    // for modal (delete popup)
    let deletingText = ""
    if (this.state.deleteIndex >= 0)
      deletingText = this.state.columns[this.state.deleteIndex].name

    // category options to choose
    let categoryOptions = this.state.categories.map( function(categ){
      return (<option key={categ} value={categ}>{categ}</option>)
    });

    return (
      <div className = 'input-container'>
        <Nav
          selected = {2}
          history={this.props.history}
        />
        <form>
          <Row className="show-grid">
              <Col xs={11} md={11}>
                <Button className="btn btn-default btn-file upload-csv-button">
                    Upload from .csv file
                    <input type="file" onChange={this.readFileAndSetData}/>
                </Button>
                  <FormGroup controlId="dataNameForm">
                    <ControlLabel>{"Edit Name:"}</ControlLabel>
                    <FormControl type="text"
                    placeholder="Enter name"
                    value= {this.state.name}
                    onChange={this.handleNameChange}
                    />
                  </FormGroup>
                  <FormGroup controlId="formControlsSelect">
                   <ControlLabel>Edit Category:</ControlLabel>
                   <FormControl componentClass="select" placeholder={this.state.category} onChange={(e) => {this.setState({category: e.target.value});}}>
                     {categoryOptions}
                   </FormControl>
                 </FormGroup>
                  <FormGroup controlId="descriptionTextarea">
                    <ControlLabel>{"Edit Description:"}</ControlLabel>
                    <FormControl componentClass="textarea" placeholder="Enter Description"
                      value= {this.state.description}
                      onChange={this.handleDescChange} />
                  </FormGroup>
                  <FormGroup controlId="tagsTextarea">
                    <ControlLabel>{"Edit Source:"}</ControlLabel>
                    <FormControl type="text" placeholder="Enter Source"
                      value= {this.state.source}
                      onChange={this.handleSourceChange}/>
                  </FormGroup>
                  <FormGroup controlId="editDataText">
                    <ControlLabel>{"Edit Data:"}</ControlLabel>
                  </FormGroup>
                  <Button onClick={ ()=> this.setState({ editOpen: !this.state.editOpen })}>
                    Edit Columns
                  </Button>
                  <Panel collapsible expanded={this.state.editOpen}>
                    {colNamesEdit}
                    <Button className="add-col-btn" onClick={this.addCol}>
                      Add Column
                    </Button>
                  </Panel>
                  <Modal show={this.state.deleteModal} onHide={()=> this.setState({ deleteModal: !this.state.deleteModal })}>
                    <Modal.Header closeButton>
                      <Modal.Title>Warning</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p>{"Are you sure you want to delete column: " + deletingText + "?"}</p>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button onClick={()=> this.setState({ deleteModal: !this.state.deleteModal })}>Cancel</Button>
                      <Button bsStyle="danger" onClick={() => {this.deleteCol(this.state.deleteIndex);
                                                               this.setState({ deleteModal: !this.state.deleteModal,
                                                                               deleteIndex: -1});}
                                                        }>Delete</Button>
                    </Modal.Footer>
                  </Modal>
                  <ReactDataGrid
                    enableCellSelect={true}
                    columns={this.state.columns}
                    rowGetter={this.rowGetter}
                    rowsCount={this.getSize()}
                    onGridSort={this.handleGridSort}
                    minHeight={500}
                    onGridRowsUpdated={this.handleGridRowsUpdated}
                    rowSelection={{
                      showCheckbox: true,
                      enableShiftSelect: true,
                      onRowsSelected: this.onRowsSelected,
                      onRowsDeselected: this.onRowsDeselected,
                      selectBy: {
                        indexes: this.state.selectedRows
                      }
                    }}  />
                    <Button onClick={this.addRow}>
                      Add Row
                    </Button>
                    <Button className="delet-row-btn" onClick={ this.deleteSelectedRows}>
                      Delete Selected Rows
                    </Button>

              </Col>
          </Row>
          <Row className="input-page-buttons">
            <Col xs={11} md={11}>
              <center>
              { this.state.fromDataPage &&
                <div style={{display: 'inline'}}>
                  <Confirm
                    onConfirm={this.deleteData}
                    body="Are you sure you want to delete this data set?"
                    confirmText="Delete"
                    title="Deleting Stuff">
                  <Button className="reset-data-btn" bsStyle="danger">
                    Delete Dataset
                  </Button>
                </Confirm>
                  <Button className="reset-data-btn" bsStyle="default" onClick={this.resetFields}>
                    Reset Changes
                  </Button>
                </div>
              }
              <Button bsStyle="primary" onClick={this.saveInfo} disabled={this.state.isSaving}>
                {this.state.saveButtonText}
              </Button>
            </center>
            </Col>
          </Row>
        </form>
      </div>
    )
  }
}

module.exports = Input;
