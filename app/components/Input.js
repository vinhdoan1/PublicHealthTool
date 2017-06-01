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
var Glyphicon = require('react-bootstrap').Glyphicon;
var Modal = require('react-bootstrap').Modal;

import IHUpdate from 'immutability-helper';
import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek'


class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      name: "",
      description: "",
      tags: [],
      editOpen: false,
      columns: [],
      data: {},
      rows: [],
      deleteModal: false,
      deleteIndex: -1,
      newColNum: 0,
    };

    this.rowGetter = this.rowGetter.bind(this);
    this.handleGridRowsUpdated = this.handleGridRowsUpdated.bind(this);
    this.setColName = this.setColName.bind(this);
    this.deleteCol = this.deleteCol.bind(this);
    this.addCol = this.addCol.bind(this);
  }

  componentDidMount() {
   let columns = [
     {
       key: 'id',
       name: 'ID',
       editable: true,
       resizable: true,
     },
     {
       key: 'task',
       name: 'Title',
       editable: true,
       resizable: true,
     },
     {
       key: 'priority',
       name: 'Priority',
       editable: true,
       resizable: true,
     },
     {
       key: 'issueType',
       name: 'Issue Type',
       editable: true,
       resizable: true,
     },
     {
       key: 'complete',
       name: '% Complete',
       editable: true,
       resizable: true,
     },
     {
       key: 'startDate',
       name: 'Start Date',
       editable: true,
       resizable: true,
     },
     {
       key: 'completeDate',
       name: 'Expected Complete',
       editable: true,
       resizable: true,
     }
   ];

   let rows = this.createRows(1000);

   this.setState({ rows: rows,
                   columns: columns,
                   loading: false
   });
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

    return (
      <div className = 'input-container'>
        <Nav
          selected = {2}
          history={this.props.history}
        />
        <form>
          <Row className="show-grid">
              <Col xs={10} md={10}>
                  <FormGroup controlId="dataNameForm">
                    <ControlLabel>{"Name:"}</ControlLabel>
                    <FormControl type="text"
                    label="Name:"
                    placeholder="Enter name"
                    />
                  </FormGroup>

                  <FormGroup controlId="descriptionTextarea">
                    <ControlLabel>{"Description"}</ControlLabel>
                    <FormControl componentClass="textarea" placeholder="Enter Description" />
                  </FormGroup>
                  <FormGroup controlId="tagsTextarea">
                    <ControlLabel>{"Tags"}</ControlLabel>
                    <FormControl componentClass="textarea" placeholder="Enter Tags (separated by commas)" />
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
                    rowsCount={this.state.rows.length}
                    minHeight={500}
                    onGridRowsUpdated={this.handleGridRowsUpdated} />
              </Col>
          </Row>
        </form>
      </div>
    )
  }
}

module.exports = Input;
