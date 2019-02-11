const randomDate = require('./randomDate');

module.exports = function(groupName, _arr, mettings) {
  var _tArr = [];
  var _tArray = [];
  var _tDates = randomDate(new Date(2019, 0, 15));
  
  if (mettings) {
    for (var i = 0; i < _arr.length; i++) {
      for (var j = i + 1; j < _arr.length; j++) {
        _tArr.push([groupName, _arr[i], _arr[j], _tDates[i]]);
        _tArr.push([groupName, _arr[j], _arr[i], _tDates[i++]]);
      }
    }
  } else {
    for (var i = 0; i < _arr.length; i++) {
      for (var j = i + 1; j < _arr.length; j++) {
        _tArr.push([groupName, _arr[i], _arr[j], _tDates[i]]);
      }
    }
  }

  for (var i = 1; i < _tArr.length; i++) {
    if (i > _tArr.length / 2) break;
    _tArray.push([_tArr[i - 1], _tArr[_tArr.length - i]]);
  }
  
  return _tArray;
}
