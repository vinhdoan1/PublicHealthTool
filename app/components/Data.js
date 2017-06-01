var React = require('react');
var NavHealth = require('./Nav');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var FormGroup = require('react-bootstrap').FormGroup;
var ControlLabel = require('react-bootstrap').ControlLabel;
var FormControl = require('react-bootstrap').FormControl;
var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var Panel = require('react-bootstrap').Panel;
var InputGroup = require('react-bootstrap').InputGroup;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Pagination = require('react-bootstrap').Pagination;
var Label = require('react-bootstrap').Label;
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;
var NavDropdown = require('react-bootstrap').NavDropdown;
var MenuItem = require('react-bootstrap').MenuItem;


import ShowMore from 'react-show-more';
var queryString = require('query-string');

class Data extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      data: [],
      tags:[],
      sorts: ["Most Recent", "Alphabetical","Most Viewed"],
      results: [10, 25, 50],
      tagsModal: false,
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handlePages = this.handlePages.bind(this);
    this.handleResultsPer = this.handleResultsPer.bind(this);
    this.handleSortType = this.handleSortType.bind(this);
    this.handleTags = this.handleTags.bind(this);
  }

  createDummyData(num)
  {
    let datas = [];
    for (var i = 1; i < num + 1; i++) {
      var d = new Date();
      var entry = {
        name: "Data Entry " + i,
        dataId: i,
        views: Math.floor((Math.random() * 1000)),
        date: d,
        description: "This is a long description and these should be many words." +
                      "Here are more words to make the description longer. " +
                      "Here are more words to make the description longer. " +
                      "Here are more words to make the description longer. " +
                      "Here are more words to make the description longer. " +
                      "Here are more words to make the description longer. " +
                      "Here are more words to make the description longer." + i,
        //creating fake tags
        tags: ['random' + Math.floor((Math.random() * num / 10) + 1), 'random' + Math.floor((Math.random() * num / 10) + 1)]
      }
      datas.push(entry);
    }
    return datas;
  }

  // onChange for tags
  handleTags(e)
  {
    //tag's X just clicked
    if (e == -1)
    {
      var querystring = queryString.parse(this.props.location.hash);
      querystring.tags = undefined;
      var hashqs = queryString.stringify(querystring)
      location.hash = '#' + hashqs;
      return;
    }
    // change hash with new page, while keeping old other hash query string
    var querystring = queryString.parse(this.props.location.hash);
    querystring.tags = e;
    var hashqs = queryString.stringify(querystring)
    location.hash = '#' + hashqs;
    window.scrollTo(0, 0); // scroll to top as well
  }

  // on change for search bar
  handleSearch(e)
  {
    var result = e.target.value;
    this.setState(function () {
      return {
        search: result,
      }
    });
  }

  // onChange for pagination
  handlePages(e)
  {
    // change hash with new page, while keeping old other hash query string
    var querystring = queryString.parse(this.props.location.hash);
    querystring.page = e;
    var hashqs = queryString.stringify(querystring)
    location.hash = '#' + hashqs;
    window.scrollTo(0, 0); // scroll to top as well
  }

  // onChange for results per page
  handleResultsPer(e)
  {
    // change hash with new page, while keeping old other hash query string
    var querystring = queryString.parse(this.props.location.hash);
    querystring.results = e.target.value;
    var hashqs = queryString.stringify(querystring)
    location.hash = '#' + hashqs;
    window.scrollTo(0, 0); // scroll to top as well
  }

  // onChange for results per page
  handleSortType(e)
  {
    // change hash with new page, while keeping old other hash query string
    var querystring = queryString.parse(this.props.location.hash);
    querystring.sort = e.target.value; // get index of which sort
    var hashqs = queryString.stringify(querystring)
    location.hash = '#' + hashqs;
  }

  //take datas array and create array of tags
  extractTags(datas)
  {
    let tagsObj = {};
    let tags = [];
    for (var i = 0; i < datas.length; i++) {
        for (var j = 0; j < datas[i].tags.length; j++)
        {
          var tag = datas[i].tags[j];
          if (tag in tagsObj)
            tagsObj[tag]++;
          else
            tagsObj[tag] = 1;
        }
    }

    for (var key in tagsObj) {
      tags.push({
        name: key,
        count: tagsObj[key]
      })
    }
    tags = tags.sort(function (a,b){
      return b.count - a.count;
    })
    return tags;
  }

  //take in sort id and returns corresponding function
  getSortFunc(sortId)
  {
    switch(parseInt(sortId)) {
    case 1: //Alphabetical
        return (function (a,b) {
          if (a.name < b.name)
            return -1;
          if (a.name > b.name)
            return 1;
          return 0;
        });
        break;
    case 0: // date
        return (function (a,b) {
          if (a.date < b.date)
            return -1;
          if (a.date > b.date)
            return 1;
          return 0;
        });
        break;
    case 2: // views
        return (function (a,b) {
          return b.views - a.views;
        });
        break;
    default:
        return (a,b) => {return 1;}
      }
  }

  // when component is created /
  componentDidMount(){

    var dummyData = this.createDummyData(500);
    var tags = this.extractTags(dummyData);
    this.setState(function () {
      return {
        data: dummyData,
        tags: tags,
      }
    });
  }

  render() {
    let activePage; // what page pagination is on
    let resultsPerPage; // how many results per page
    let numPages; // total pages for pagination
    let numResults; // total number of results
    let tags; // tags for data (in hash)
    let sortType; // sort type in hash

    var hash = this.props.location.hash.substring(1);
    var querystring = queryString.parse(this.props.location.hash);

    //set page if page is set
    if ('page' in querystring)
      activePage = parseInt(querystring.page);
    else
      activePage = 1

    //set results if page is set
    if ('results' in querystring)
      resultsPerPage = parseInt(querystring.results);
    else
      resultsPerPage = 10;

    //set tags if page is set
      if ('tags' in querystring)
        tags = querystring.tags;
      else
        tags = -1;

    //set sort if hash is set
      if ('sort' in querystring)
        sortType = querystring.sort;
      else
        sortType = -1;

    var search = this.state.search.toLowerCase();

    //generate tags list (right side)
    let tagListGroupItems = this.state.tags.map(function(tag) {
      return (<ListGroupItem key={tag.name} onClick={() => {this.handleTags(tag.name); this.setState({ tagsModal: false });}}>{tag.name + " (" + tag.count + ")"}</ListGroupItem>);
    }.bind(this));

    // filter tags list (first 10)
    let tagListGroupItemsFiltered = tagListGroupItems.filter(function (tag, i) {
      return i < 10;
    });

    //if tag chosen, filter out tags only
    let filteredData = this.state.data.filter(function(data){
        if (tags === -1)
          return true;
        return data.tags.indexOf(tags) >= 0;
      }).filter(function(data){
          //check whether search term in name, description,tags
          return (data.name.toLowerCase().indexOf(search) >= 0) ||
                  (data.description.toLowerCase().indexOf(search) >= 0);
        });

    numResults = filteredData.length; // total # of results after filters
    numPages = Math.ceil(numResults / resultsPerPage); // total pages to use

    //get sort then sort
    let sortFunct = this.getSortFunc(sortType);
    filteredData = filteredData.sort(sortFunct);

    //fit data per page based on results per page
    filteredData = filteredData.filter(function(data, i){
        return (i < activePage * resultsPerPage && i >= (activePage - 1) * resultsPerPage);
      });


    // create data panels
    let dataPanels = filteredData.map(function(data) {
      var tags = data.tags;
      var tagsString = "Tags: ";
      for (var i = 0; i < tags.length; i++)
      {
        tagsString += tags[i] + ", "
      }

      tagsString = tagsString.substring(0, tagsString.length - 2);
      let header = (<a href={"/data/display/" + data.dataId}>{data.name}</a>);

      return (<Panel header={header} bsStyle="primary" key={data.name}>
               <p className="updated-date"><b>Updated: </b>{data.date.toDateString()}&nbsp;&nbsp;&nbsp;<b>Views:</b> {data.views}</p>
                 <ShowMore
                   lines={3}
                   more='Show more'
                   less='Show less'
                   anchorClass='' >
                  {data.description}
               </ShowMore>
               <hr></hr>
               <p>{tagsString}</p>
              </Panel>);
    });

    let displayNumOptions = this.state.results.map(function(num) {
      return (<option value={num} key={num}>{"Display " + num + " Results Per Page"}</option>);
    })

    let sortOptions = this.state.sorts.map(function(num, i) {
      return (<option value={i} key={i}>{num}</option>);
    })

    return (
      <div className = 'data-container'>
        <NavHealth
          selected = {1}
          history={this.props.history}
        />
        <Row className="filter-row">
        <Col lgHidden mdHidden smHidden xs={12}>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Filter Results</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href="#">Link</NavItem>
              <NavItem eventKey={2} href="#">Link</NavItem>
              <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
                <MenuItem eventKey={3.1}>Action</MenuItem>
                <MenuItem eventKey={3.2}>Another action</MenuItem>
                <MenuItem eventKey={3.3}>Something else here</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey={3.3}>Separated link</MenuItem>
              </NavDropdown>
            </Nav>
            <Nav pullRight>
              <NavItem eventKey={1} href="#">Link Right</NavItem>
              <NavItem eventKey={2} href="#">Link Right</NavItem>
            </Nav>
          </Navbar.Collapse>
          </Navbar>
        </Col>
        </Row>
        <div className = 'data-content-container'>

          <Row className="search-row">
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
          <Row className="data-row">
            <Col xsHidden md={4} className="data-tabs">
              <h2>Tags</h2>
              <ListGroup>
                {tagListGroupItemsFiltered}
                <ListGroupItem bsStyle="info" onClick={() => {this.setState({ tagsModal: true })}}>{"Show All"}</ListGroupItem>
              </ListGroup>

              <Modal show={this.state.tagsModal} onHide={()=> this.setState({ tagsModal: !this.state.tagsModal })}>
                <Modal.Header closeButton>
                  <Modal.Title>Tags</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <ListGroup>
                  {tagListGroupItems}
                </ListGroup>
                </Modal.Body>
              </Modal>
            </Col>
            <Col xs={12} md={8} className="data-row-right">
              <Row className="results-row">
                <Col xsHidden md={4} className="results-col">
                  <p> Result(s): {numResults}&nbsp;</p>
                   {tags !==  -1 &&
                     <Label bsStyle="primary">Tag: {tags} <a onClick={() => this.handleTags(-1)}>&nbsp;X&nbsp;</a></Label>
                   }
                </Col>
                <Col xsHidden md={8} className="data-sort-by">
                  <p>Sort by: </p>
                  <FormGroup controlId="formControlsSelect">
                    <FormControl componentClass="select" placeholder={sortFunct} onChange={this.handleSortType}>
                      {sortOptions}
                    </FormControl>
                  </FormGroup>
                </Col>
              </Row>
              {dataPanels}
            </Col>
          </Row>
          <Row className="data-nav-row">
            <Col mdOffset={4} md={6} xsHidden>
              <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                items={numPages}
                maxButtons={5}
                activePage={activePage}
                onSelect={this.handlePages} />
              </Col>
              <Col mdOffset={4} md={6} xs={12}>
                <Pagination
                  prev
                  next
                  first
                  last
                  ellipsis
                  boundaryLinks
                  items={numPages}
                  maxButtons={2}
                  activePage={activePage}
                  onSelect={this.handlePages} />
                </Col>
              <Col md={3} xsHidden>
                <FormGroup controlId="formControlsSelect">
                  <FormControl componentClass="select" placeholder={resultsPerPage} onChange={this.handleResultsPer}>
                    {displayNumOptions}
                  </FormControl>
                </FormGroup>
              </Col>
          </Row>
        </div>
      </div>
    )
  }
}

module.exports = Data;
