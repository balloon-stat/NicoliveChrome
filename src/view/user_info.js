(function() {
  var user_id, user_info, user_link_to;
  user_id = document.URL.match(/user_id=(\S*)/)[1];
  user_info = {};
  user_link_to = function(content) {
    return "<a href='http://www.nicovideo.jp/user/" + user_id + "'>" + content + "</a>";
  };
  $.nlcm.User.getUserInfo(user_id, function(info) {
    return user_info = info;
  }, false);
  $('#user_profile').children('#user_id').html(user_link_to(user_id)).end().children('#user_name').html(user_link_to(user_info['name'])).end().children('#user_thumbnail').html(user_link_to("<img src='" + user_info['thumbnail'] + "'>")).end().children('#user_color').text("").end().end();
}).call(this);
