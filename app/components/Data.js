var React = require('react');
var Nav = require('./Nav');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var FormGroup = require('react-bootstrap').FormGroup;
var FormControl = require('react-bootstrap').FormControl;
var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var Panel = require('react-bootstrap').Panel;
var InputGroup = require('react-bootstrap').InputGroup;
var Glyphicon = require('react-bootstrap').Glyphicon;

class Data extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      data: [],
      tags:[],
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  createDummyData(num)
  {
    let datas = [];
    for (var i = 1; i < num + 1; i++) {
      var entry = {
        name: "Data Entry " + i,
        data: {

        },
        description: "description " + i,
        //creating fake tags
        tags: ['all', 'tag' + i, 'random' + Math.floor((Math.random() * num / 2) + 1)]
      }
      datas.push(entry);
    }
    return datas;
  }

  handleSearch(e)
  {
    var result = e.target.value;
    this.setState(function () {
      return {
        search: result,
      }
    });
  }

  //take datas array and create array of tags
  extractTags(datas)
  {
    let tags = [];
    for (var i = 0; i < datas.length; i++) {
        for (var j = 0; j < datas[i].tags.length; j++)
        {
          var tag = datas[i].tags[j];
          if (tags.indexOf(tag) < 0)
            tags.push(tag);
        }
    }
    return tags;
  }

  // when component is created /
  componentDidMount(){

    var dummyData = this.createDummyData(5);
    var tags = this.extractTags(dummyData);
    this.setState(function () {
      return {
        data: dummyData,
        tags: tags,
      }
    });
  }

  render() {
    var hash = this.props.location.hash.substring(1);
    var search = this.state.search.toLowerCase();

    let tagListGroupItems = this.state.tags.map(function(tag) {
      return (<ListGroupItem key={tag} href={"#" + tag}>{tag}</ListGroupItem>);
    });

    //if tag chosen, filter out tags only
    let filteredData = this.state.data.filter(function(data){
        if (hash === "")
          return true;
        return data.tags.indexOf(hash) >= 0;
      }).filter(function(data){
          //check whether search term in name, description,tags
          return (data.name.toLowerCase().indexOf(search) >= 0) ||
                  (data.description.toLowerCase().indexOf(search) >= 0);
        });

    let dataPanels = filteredData.map(function(data) {
      var tags = data.tags;
      var tagsString = "Tags: ";
      for (var i = 0; i < tags.length; i++)
      {
        tagsString += tags[i] + ", "
      }

      tagsString = tagsString.substring(0, tagsString.length - 2);

      return (<Panel  header={data.name} bsStyle="primary" key={data.name}>
               <p>{data.description}</p>
               <hr></hr>
               <p>{tagsString}</p>
              </Panel>);
    });

    return (
      <div className = 'data-container'>
        <Nav
          selected = {1}
          history={this.props.history}
        />
        <div className = 'data-content-container'>
          <Row className="show-grid">
            <Col xs={12} md={8}>
              <form>
              <FormGroup>
                <InputGroup>
                  <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
                  <FormControl
                    type="text"
                    label="Text"
                    placeholder="Search"
                    onChange={this.handleSearch}/>
                  </InputGroup>
              </FormGroup>
              </form>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col xs={0} md={4}>
              <h2>Tags</h2>
              <ListGroup>
                {tagListGroupItems}
              </ListGroup>
            </Col>
            <Col xs={12} md={8}>
              <p> Result(s): {filteredData.length} </p>
              {dataPanels}
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

module.exports = Data;
