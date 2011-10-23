(function() {
  var is_first;
  is_first = true;
  $('#comments').flexigrid({
    colModel: [
      {
        display: 'No.',
        name: 'no',
        width: 25,
        align: 'center'
      }, {
        display: 'コメント',
        name: 'message',
        width: 520,
        align: 'left'
      }, {
        display: 'ユーザー',
        name: 'user_id',
        width: 80,
        align: 'center'
      }, {
        display: '時刻',
        name: 'date',
        width: 40,
        align: 'center'
      }
    ],
    height: '300',
    resizable: false,
    nowrap: false,
    singleSelect: true,
    striped: false,
    dataType: 'json'
  });
  $('.hDivBox tr th :eq(1)').css('text-align', 'center');
  $.fn.comment = function(comments) {
    var bDiv, s_offset;
    bDiv = $('.flexigrid .bDiv');
    s_offset = bDiv[0].scrollHeight - bDiv.scrollTop() - bDiv[0].clientHeight;
    if (is_first) {
      is_first = false;
      this.flexAddData({
        total: 1,
        page: 1,
        rows: comments
      });
      bDiv.scrollTop(bDiv[0].scrollHeight);
    } else {
      this.flexAppendData({
        total: 1,
        page: 1,
        rows: comments
      }, ':last');
    }
    if (s_offset === 0) {
      return bDiv.scrollTop(bDiv[0].scrollHeight);
    }
  };
}).call(this);
