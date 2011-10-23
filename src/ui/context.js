(function() {
  var comment, comment_data, contextSelect, openUserProfile, setColoring, setNamig, userCommentHide;
  comment = {};
  comment_data = {};
  openUserProfile = function() {
    return window.open("../user_info.html?user_id=" + comment_data['user_id'], 'user_window', 'status=-1, height=360, width=350');
  };
  setNamig = function() {
    var comment_info;
    comment_info = comment.getComemntInfo(comment_data['no']);
    if (comment_info['id'] === comment_info['name']) {
      if (comment_data['anonymity'] === '0') {
        $.nlcm.User.getUserInfo(comment_data['user_id'], function(name, thumbnail) {
          return $('#naming_text').val(name);
        }, false);
      }
    } else {
      $('#naming_text').val(comment_info['name']);
    }
    return $('#naming_dialog').dialog({
      modal: true,
      buttons: [
        {
          text: 'OK',
          click: function() {
            var naming;
            naming = $(this).find('input:text');
            comment.updateComment(comment_no, {
              name: naming.val()
            });
            console.log(comment_info['user_id'] + 'を' + naming.val() + 'に名前を変更しました.');
            comment.commentUpdate();
            naming.val('');
            return $(this).dialog('close');
          }
        }
      ]
    });
  };
  setColoring = function() {
    return $('#coloring_dialog').dialog({
      modal: true,
      width: 500,
      buttons: [
        {
          text: 'OK',
          click: function() {
            var RGB, b, g, r;
            r = $('#red').slider('value');
            g = $('#green').slider('value');
            b = $('#blue').slider('value');
            RGB = '#' + $.hexFromRGB(r, g, b);
            console.log("R : " + r + ", G : " + g + ", B : " + b);
            comment.updateComment(comment_no, {
              color: RGB
            });
            console.log(user_id + 'の色を' + RGB + 'に変更しました.');
            comment.commentUpdate();
            return $(this).dialog('close');
          }
        }
      ]
    });
  };
  userCommentHide = function() {
    return $('comments tr').each(function() {
      var $$, _comment;
      $$ = $(this);
      if ($$.find('td').eq(2).children('div').text() !== comment_data['user_id']) {
        return;
      }
      _comment = $$.find('td').eq(1).children('div');
      if (_comment.data('cache')) {
        _comment.text(_comment.data('cache'));
        return _comment.data('cache', null);
      } else {
        _comment.data('cache', _comment.text());
        return _comment.text('非表示です');
      }
    });
  };
  contextSelect = function(type, target) {
    var comment_no;
    comment_no = target.find('td').eq(0).text();
    comment_data = comment.getCommentByNo(comment_no);
    switch (type) {
      case 'user_info':
        return openUserProfile();
      case 'naming':
        return setNamig();
      case 'coloring':
        return setColoring();
      case 'tmp_hide':
        return userCommentHide();
      case 'profile_page':
        return $.nico.User.jumpUserProfile();
      default:
        return false;
    }
  };
  $.fn.menu = function(_comment) {
    comment = _comment;
    return $(this).jeegoocontext('custom_context', {
      widthOverflowOffset: 0,
      heightOverflowOffset: 3,
      onSelect: function(e, target) {
        var type;
        type = $(this).attr('id');
        return contextSelect(type, $(target));
      }
    });
  };
}).call(this);
