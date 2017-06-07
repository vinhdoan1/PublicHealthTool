var axios = require('axios');

function getAfflictionList() {
  return axios.get('https://eng100d-project.herokuapp.com/list')
    .then(function (user) {
      return user.data;
    });
}

function getAllData() {
  return axios.get('https://eng100d-project.herokuapp.com/list/all')
    .then(function (user) {
      return user.data;
    });
}



module.exports = {
  getAfflictionList: getAfflictionList,
  getAllData: getAllData,
};
