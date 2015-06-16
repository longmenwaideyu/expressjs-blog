function path() {
    var args = arguments,
    result = [];
    for(var i = 0; i < args.length; i++)
        result.push(args[i].replace('@', '/syntaxhighlighter/scripts/'));
    return result;
};
$(document).ready(function() {
    SyntaxHighlighter.autoloader.apply(null, path(
    'applescript            @shBrushAppleScript.js',
    'actionscript3 as3      @shBrushAS3.js', 
    'bash shell             @shBrushBash.js', 
    'coldfusion cf          @shBrushColdFusion.js',
    'cpp c                  @shBrushCpp.js',
    'c# c-sharp csharp      @shBrushCSharp.js', 
    'css                    @shBrushCss.js', 
    'delphi pascal          @shBrushDelphi.js', 
    'diff patch pas         @shBrushDiff.js', 
    'erl erlang             @shBrushErlang.js',
    'groovy                 @shBrushGroovy.js', 
    'java                   @shBrushJava.js',
    'jfx javafx             @shBrushJavaFX.js', 
    'js jscript javascript  @shBrushJScript.js',
    'perl pl                @shBrushPerl.js',
    'php                    @shBrushPhp.js', 
    'text plain             @shBrushPlain.js', 
    'py python              @shBrushPython.js',
    'ruby rails ror rb      @shBrushRuby.js',
    'sass scss              @shBrushSass.js',
    'scala                  @shBrushScala.js',
    'sql                    @shBrushSql.js', 
    'vb vbnet               @shBrushVb.js',
    'xml xhtml xslt html    @shBrushXml.js'
    ));
    SyntaxHighlighter.defaults['smart-tabs'] = true;
    SyntaxHighlighter.defaults['tab-size'] = 4;
    SyntaxHighlighter.all();
    setTimeout(function () {
        var ue = UE.getEditor('editor', {
            elementPathEnabled : false,
            toolbars: [["bold","italic","underline","fontborder","strikethrough",'superscript', 'subscript',"forecolor","backcolor","justifyleft","justifycenter","justifyright","justifyjustify","fontfamily","fontsize","emotion","insertcode","removeformat","unlink","link","undo","redo"]]
        });
    }, 2000);
    $('button[id^=reply-]').click(function (e) {
        //console.log(e);
        processReplyBox(this);
    });
    makeOutline();
});
function makeOutline() {
    $("#article_id h1,h2,h3,h4,h5").each(function(e) {
        $(this).attr("id", this.tagName.toLowerCase() + '_' + $(this).text().replace(/[\r|\n| |\'|\"|\\|\/]/g, ""));
    });
}
function processReplyBox(me) {
    var replyWhoID = $(me).attr('replyWhoID');
    if ($('#reply-' + replyWhoID).text() == '回复') {
        showReply(me);
        $('#reply-' + replyWhoID).text('收起');
    } else {
        $('#container-' + replyWhoID).slideUp(500);
        $('#reply-' + replyWhoID).text('回复');
    }
}
function showReply(me) {
    var replyWhoID = $(me).attr('replyWhoID');
    if ($('#container-' + replyWhoID).attr('hasBox') == 'true') {
        $('#container-' + replyWhoID).slideDown(500);
    } else {
        genReply(me);
    }
}
function genReply(me) {
    var data = $(me).attr('data-reply');
    var replyWhoID = $(me).attr('replyWhoID');
    var str = '<form action="/reply" onsubmit="javascript: return check(\'' + replyWhoID + '\')" class="form-horizontal article-reply row">'
        +       '<div class="row"><label for="nick" class="col-sm-2 control-label">昵称:</label><div class="col-sm-10"><input type="text" id="nick' + replyWhoID + '" name="nick" placeholder="输入显示的昵称" class="form-control"></div></div>'
        +       '<div class="row"><label for="email" class="col-sm-2 control-label">邮箱:</label><div class="col-sm-10"><input type="text" id="email' + replyWhoID + '" name="email" placeholder="输入邮箱，不公开" class="form-control"></div></div>'
        +       '<div class="row"><label for="website" class="col-sm-2 control-label">网址:</label><div class="col-sm-10"><input type="text" id="website' + replyWhoID + '" name="website" placeholder="输入个人网站，可不填" class="form-control"></div></div>'
        +       '<script id="editor-' + replyWhoID + '" type="text/plain" style="width:100%;height:200px;"></script>'
        +       '<input name = "data_reply" value = \'' + data + '\' class="hide"/>'
        +       '<div class="row"><div class="col-sm-offset-10 col-sm-2"><input id= "replybtn-' + replyWhoID + '" type="submit" value="提交" class="btn btn-primary btn-block"></div></div>'
        +      '</form>';
    var container = $('#container-' + replyWhoID);
    container.html(str).hide();
    container.attr('hasBox', 'true');
    container.removeClass('hide');
    UE.getEditor('editor-' + replyWhoID, {
        elementPathEnabled : false,
        toolbars: [["bold","italic","underline","fontborder","strikethrough",'superscript', 'subscript',"forecolor","backcolor","justifyleft","justifycenter","justifyright","justifyjustify","fontfamily","fontsize","simpleupload","emotion","insertcode","removeformat","unlink","link","undo","redo"]]
    });
    container.slideDown(500);
}

function check(id) {
    //console.log(id);
    var selecter;
    if (id) {
        selecter = '#replybtn-' +id;
    } else {
        selecter = '#reply-000';
    }
    $(selecter).attr("disabled","true");
    var editor;
    id = id || '';
    if (id) {
        editor = 'editor-' + id;
    } else {
        editor = 'editor';
    }
    var nick = $('#nick' + id).val().trim();
    var email = $('#email' + id).val().trim();
    var website = $('#website' + id).val().trim();
    var content = UE.getEditor(editor).getContent().trim();
    if ($(content).text().trim().length < 10) {
        alert('留言过短,不少于十个字');
        $(selecter).attr("disabled", false);
        return false;
    }
    if (!nick || !email) {
        alert('请填写完整信息');
        $(selecter).attr("disabled", false);
        return false;
    }
    if (!isEmail(email)) {
        alert('请输入正确的邮箱');
        $(selecter).attr("disabled", false);
        return false;
    }
    if (!website) {
        $('#website' + id).val('javascript:void(0)');
    }
    return true;
}
