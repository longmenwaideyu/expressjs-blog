$(document).ready(function () {
    bindEvent();
    window.collectData = [];
});
function bindEvent() {
    $('#collect').change(function () {
        var sel = $(this).children('option:selected').val();
        updateList(sel);
    });
    $('#newCollect').click(function () {
        newCollect();
        return false;
    });
    $('#add').click(function () {
        showAddArticle();
        return false;
    });
    $('#addbtn').click(function () {
        addArticle();
        return false;
    });
}
function addArticle() {
    $('#addContainer').slideUp();
    var data = $('#article').val();
    var length = data.length;
    var seq = window.collectData.length;
    for (var i = 0; i < length; i++) {
        var j;
        for (j = window.collectData.length - 1; j >= 0; j--) {
            if (window.collectData[j].articleID == data[i]) break;
        }
        //新添文章不在原有列表中
        data[i] = data[i].split('-');
        if (j < 0) {
            window.collectData.push({
                articleID: data[i][0],
                customURL: data[i][1],
                title: $('#article option[value="' + data[i][0] + '-' + data[i][1] + '"]').text(),
                seq: i + seq
            });
        }
    }
    genList(window.collectData);
}
function showAddArticle() {
    if (!$('#collect').val()) return;
    $('#addContainer').slideDown(500);
}
function moveUp(me) {
    var data = window.collectData;
    var seq = $(me).attr('id').split('-')[1];
    seq = parseInt(seq);
    if (seq == 0) return;
    var t = data[seq];
    data[seq] = data[seq - 1];
    data[seq - 1] = t;
    data[seq].seq = seq;
    data[seq - 1].seq = seq - 1;
    genList(data);
}
function moveDown(me) {
    var data = window.collectData;
    var seq = $(me).attr('id').split('-')[1];
    seq = parseInt(seq);
    if (seq == data.length - 1) return;
    var t = data[seq];
    data[seq] = data[seq + 1];
    data[seq + 1] = t;
    data[seq].seq = seq;
    data[seq + 1].seq = seq + 1;
    genList(data);
}
function removeArticle(me) {
    var data = window.collectData;
    var seq = $(me).attr('id').split('-')[1];
    seq = parseInt(seq);
    data.splice(seq, 1);
    for (var i = data.length - 1; i >= seq; i--) {
        data[i].seq = i;
    }
    window.collectData = data;
    genList(data);
}
function newCollect() {
    $('#collect-c').empty();
    window.collectData = [];
    removeList();
    $('#collect-c').append('<input class="form-control" id="collect" name="collect" type="text" placeholder="输入文集名称"/>');
}
function updateList(sel) {
    if (!sel) {
        //$('#collectDetail').empty();
        return;
    }
    $.get('/get/collectdetail', {
            collectID: sel
        }, function (data) {
            //console.log(data);
            genList(data);
            window.collectData = data;
    });
}
function genList(data) {
    removeList();
    var len = data.length;
    var s = '<div class="col-sm-12 collect-title">'
        +       '<span id="up-#{seq}" class="glyphicon glyphicon-arrow-up collect-arrow mr3"></span>'
        +       '<span id="down-#{seq}" class="glyphicon glyphicon-arrow-down collect-arrow mr3"></span>'
        +       '<span id="remove-#{seq}" class="glyphicon glyphicon-remove collect-red"></span>'
        +       '<span> #{index}. </span>'
        +       '<span><a href="/article/#{customURL}">#{title}</a></span>'
        +       '<input class="hide" name = "article[#{seq}]" value = "#{articleID}"/>'
        +   '</div>';
    var res = '';
    for (var i = 0; i < len; i++) {
        data[i].seq = i;
        data[i].index = i + 1;
        res += tpl.render(s, data[i]);
    }
    $('#collectDetail').append(res);
    $('span[id^=up-]').click(function () {
        moveUp(this);
        return false;
    });
    $('span[id^=down-]').click(function () {
        moveDown(this);
        return false;
    });
    $('span[id^=remove-]').click(function () {
        removeArticle(this);
        return false;
    });
}
function removeList() {
    $('#collectDetail').empty();
}
function check() {
    if (!$('#collect').val()) {
        alert('请选择或输入文集名称');
        return false;
    }
    if (!$('input[name^=article]').length) {
        alert('请选择至少一篇文章');
        return false;
    }
    return true;
}