$(document).ready(function () {
    bindEvent();
});
function bindEvent() {
    $('.del-reply').click(function (e) {
        if (confirm("确定要删除该条评论吗？")) {
            var replyID = $(this).attr('replyid');
            window.location.href='/delete_reply?replyID=' + replyID;
        }
    });
}
