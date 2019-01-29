const randomDate = require('./randomDate');

module.exports = function (_arr, mettings) {
  var _tArr = [];
  var _tArray = [];

  if (mettings) {
    for (var i = 0; i < _arr.length; i++) {
      for (var j = i + 1; j < _arr.length; j++) {
        _tArr.push([_arr[i], _arr[j]]);
        _tArr.push([_arr[j], _arr[i]]);
      }
    }
  } else {
    for (var i = 0; i < _arr.length; i++) {
      for (var j = i + 1; j < _arr.length; j++) {
        _tArr.push([_arr[i], _arr[j]]);
      }
    }
  }

  for (var i = 1; i < _tArr.length; i++) {
    if (i > _tArr.length / 2) break;
    _tArray.push(_tArr[i - 1], _tArr[_tArr.length - i]);
  }

  return _tArray;
}
