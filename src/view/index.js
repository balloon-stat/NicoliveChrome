(function() {
  var live_info, nicolive;
  live_info = $.nlcm.Live.getLiveInfo(document.URL);
  document.title = live_info['title'];
  nicolive = new $.nlcm.Live(live_info['id']);
  window.onbeforeunload = function() {
    return nicolive.close();
  };
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
  nicolive.startComment(function(comments) {
    $('#comments').comment(comments);
    nicolive.comment.commentUpdate();
    $('#comments tr').menu(nicolive.comment);
    return console.log(comments);
  });
}).call(this);
