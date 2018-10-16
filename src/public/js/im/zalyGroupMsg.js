
$(".left-body-chatsession").html("");
$(".right-chatbox").html("");


function showWebNotification(msg, msgContent)
{
    var msgId = msg.msgId;
    var nickname="";
    var name='';
    var notification;

    if(msg.roomType == "MessageRoomGroup") {
        name = msg.name;
        nickname=msg.nickname;
    } else {
         name=msg.nickname;
    }

    if(name == undefined || name.length<1) {
        name = "通知";
    }

    if(nickname == "") {
         notification = "["+name+"] "+ msgContent;
    } else {
         notification = "["+name+"] "+nickname+":" + msgContent;
    }
    var icon = $(".info-avatar-"+msg.chatSessionId).attr("src");
    if(window.Notification && Notification.permission !== "denied"){
        new Notification(notification, {"tag":msg.msgId, "icon":icon});
    }
}


//点击触发一个对象的点击
function uploadFile(obj)
{
    $("#"+obj).val("");
    $("#"+obj).click();
}

token = $('.token').attr("data");
nickname = $(".nickname").attr("data");
loginName=$(".loginName").attr("data");
avatar = $(".self_avatar").attr("data");
jumpPage = $(".jumpPage").attr("data");
jumpRoomType = $(".jumpRoomType").attr("data");
jumpRoomId = $(".jumpRoomId").attr("data");
jumpRelation = $(".jumpRelation").attr("data");

jump();

function jump()
{
    //群，好友
    if(jumpRoomType != "" && jumpRoomId != "") {
        if(jumpRoomType == GROUP_MSG) {
            if(jumpRelation == 0) {
                ///todo add group
                var userIds = [];
                userIds.push(token);
                addMemberToGroup(userIds, jumpRoomId);
            } else if(jumpRelation == 1) {
                localStorage.setItem(chatSessionIdKey, jumpRoomId);
                localStorage.setItem(jumpRoomId, jumpRoomType);
                handleClickRowGroupProfile(jumpRoomId);
            }
        } else if(jumpRoomType == U2_MSG) {
            if(jumpRelation == 0) {
                ///todo sendAddFriend
                sendFriendApplyReq(jumpRoomId, "", handleSendFriendApplyReq);
            } else if(jumpRelation == 1) {
                localStorage.setItem(chatSessionIdKey, jumpRoomId);
                localStorage.setItem(jumpRoomId, jumpRoomType);
                sendFriendProfileReq(jumpRoomId);
                insertU2Room(undefined, jumpRoomId);
            }
        }
    }
}

//display unread msg
function displayRoomListMsgUnReadNum()
{
    if(!judgeDefaultChat()){
        return false;
    }
    var data = $(".l-sb-item-active").attr("data");
    if(data != "chatSession") {
        var unReadAllNum = localStorage.getItem(roomListMsgUnReadNum);
        if(unReadAllNum>0) {
            if(unReadAllNum>99) {
                unReadAllNum = "99+";
            }
            localStorage.setItem(newSiteTipKey, "new_msg");
            setDocumentTitle();
            $(".room-list-msg-unread")[0].style.display = 'block';
            $(".room-list-msg-unread").html(unReadAllNum);
        } else {
            var mute = localStorage.getItem(roomListMsgMuteUnReadNumKey);
            if(mute >= 1) {
                $(".unread-num-mute")[0].style.display = "block";
            } else {
                localStorage.setItem(newSiteTipKey, "clear");
                setDocumentTitle();
                $(".room-list-msg-unread")[0].style.display = 'none';
            }
        }
    } else {
        $(".room-list-msg-unread")[0].style.display = 'none';
        $(".unread-num-mute")[0].style.display = "none";
    }
    if(data == "friend") {
        $(".apply_friend_list_num")[0].style.display = "none";
    } else {
        $(".apply_friend_list_num")[0].style.display = "block";
    }

    var friendListNum = localStorage.getItem(applyFriendListNumKey);

    if(friendListNum > 0 && friendListNum != undefined && data != "friend" ) {
        localStorage.setItem(newSiteTipKey, "add_friend");
        setDocumentTitle();
        $(".apply_friend_list_num")[0].style.display = "block";
    } else {
        $(".apply_friend_list_num")[0].style.display = "none";
    }
}

$(document).on("click", ".l-sb-item", function(){
    var currentActive = $(".left-sidebar").find(".l-sb-item-active");
    $(currentActive).removeClass("l-sb-item-active");
    $(this).addClass("l-sb-item-active");

    var dataType  = $(this).attr("data");
    var selectClassName   = dataType + "-select";
    var unselectClassName = dataType + "-unselect";

    var itemImgs = $(".left-sidebar").find(".item-img");
    var length = itemImgs.length;
    for(i=0; i<length; i++) {
        var item = itemImgs[i];
        var data = $(item).attr("data");
        if(data == "select") {
            $(item)[0].style.display = "none";
        } else {
            $(item)[0].style.display = "block";
        }
    }
    if($("."+unselectClassName)[0]) {
        $("."+unselectClassName)[0].style.display = "none";
        $("."+selectClassName)[0].style.display = "block";
    }

    switch (dataType){
        case "group":
            $(".group-lists")[0].style.display = "block";
            $(".chatsession-lists")[0].style.display = "none";
            $(".friend-lists")[0].style.display = "none";
            groupOffset = 0;
            getGroupList(initGroupList);
            break;
        case "chatSession" :
            getRoomList();
            $(".chatsession-lists")[0].style.display = "block";
            $(".group-lists")[0].style.display = "none";
            $(".friend-lists")[0].style.display = "none";
            break;
        case "friend":
            $(".friend-lists")[0].style.display = "block";
            $(".chatsession-lists")[0].style.display = "none";
            $(".group-lists")[0].style.display = "none";
            friendOffset = 0;
            getFriendList(initFriendList);
            break;
        case "more":
            displayDownloadApp();
            break;
    }
    displayRoomListMsgUnReadNum();
});

window.onresize = function(){
    if(!judgeDefaultChat()) {
        return ;
    }
    try{
        if ($(".right-head")[0].clientWidth<680) {
            $(".right-body-sidebar").hide();
        }
    }catch (error) {
        // console.log(error.message);
    }
}

function handleSendFriendApplyReq()
{
    alert("已经发送好友请求");
}


//check is enter back
function checkIsEnterBack(event)
{
    var event = event || window.event;
    var isIE = (document.all) ? true : false;
    var key;

    if(isIE) {
        key = event.keyCode;
    } else {
        key = event.which;
    }

    if(key != 13) {
        return false;
    }
    return true;
}

//--------------------------------------http.file.downloadFile----------------------------------------------
function getNotMsgImg(userId, avatarImgId)
{
    if(avatarImgId == undefined || avatarImgId == "" || avatarImgId.length<1) {
        return false;
    }
    var userImgKey = userId+avatarImgId;
    var isReqTime = sessionStorage.getItem(userImgKey);

    var nowTimeStamp = Date.parse(new Date());
    ////5分钟的过期时间，如果还没有请求回来，下一个请求会继续冲重新请求
    if(isReqTime != false &&  nowTimeStamp-isReqTime<reqTimeout && isReqTime != null) {
        return ;
    }
    sessionStorage.setItem(userImgKey, Date.parse(new Date()));

    var requestUrl =  downloadFileUrl + "&fileId="+avatarImgId+"&returnBase64=0&lang="+languageNum;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status == 200 || this.status == 304)) {
            var blob = this.response;
            var src = window.URL.createObjectURL(blob);
            // Typical action to be performed when the document is ready:
            var img = new Image();
            img.src = src;
            img.onload = function(){
                $(".info-avatar-"+userId).attr("src", src);
                if(userId == token) {
                    localStorage.setItem(selfInfoAvatar, src);
                }
            }
            img.onerror = function (ev) {
            }
        }
        sessionStorage.removeItem(userImgKey);
    };
    xhttp.open("GET", requestUrl, true);
    xhttp.responseType = "blob";
    xhttp.setRequestHeader('Cache-Control', "max-age=84600, public");
    xhttp.send();
}


function getMsgImg(imgId, isGroupMessage, msgId)
{
    if(imgId == undefined || imgId == "" || imgId.length<1) {
        return false;
    }
    var requestUrl = downloadFileUrl +  "&fileId="+imgId + "&returnBase64=0&isGroupMessage="+isGroupMessage+"&messageId="+msgId+"&lang="+languageNum;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status == 200 || this.status == 304)) {
            var blob = this.response;
            var src = window.URL.createObjectURL(blob);
            // Typical action to be performed when the document is ready:
            $(".msg-img-"+msgId).attr("src", src);
        }
    };
    xhttp.open("GET", requestUrl, true);
    xhttp.responseType = "blob";
    xhttp.setRequestHeader('Cache-Control', "max-age=2592000, public");
    xhttp.send();
}
///下载自己头像
getNotMsgImg(token, avatar);

//--------------------------------------site share---------------------------------------------

function changeZalySchemeToDuckChat(chatSessionId, type)
{
    var siteConfigJsonStr = localStorage.getItem(siteConfigKey);
    var siteName = "";
    if(siteConfigJsonStr ) {
        siteConfig = JSON.parse(siteConfigJsonStr);
    }
    serverAddress = siteConfig.serverAddressForApi;

    var parser = document.createElement('a');
    parser.href = serverAddress;
    var domain = serverAddress;
    if(parser.protocol == 'zaly:') {
        var protocol = "duckchat:";
        var hostname = parser.hostname;
        var pathname = parser.pathname;
        domain =  protocol+"//"+hostname+pathname;
    }
    var urlLink = domain;
    if(chatSessionId != "") {
        urlLink = domain.indexOf("?") > -1 ? domain+"&x="+type+"-"+chatSessionId : domain+"/?x="+type+"-"+chatSessionId;
    }
    urlLink = jumpPage.indexOf("?") > -1 ? jumpPage+"&jumpUrl="+encodeURI(urlLink) :jumpPage+"?jumpUrl="+encodeURI(urlLink);
    return encodeURI(urlLink);
}


function displayDownloadApp() {
    var html = template("tpl-download-app-div", {});
    html = handleHtmlLanguage(html);
    $("#download-app-div").html(html);
    var urlLink = changeZalySchemeToDuckChat("", "download_app");
    var src = "../../public/img/duckchat.png";
    generateQrcode($('#qrcodeCanvas'), urlLink, src, false, "more");
    showWindow($("#download-app-div"));
}

//--------------------------------------generate qrcode---------------------------------------------

function generateQrcode(qrCodeObj, urlLink, src, isCircle, type)
{
    var idName, className,width,height,canvasWidth,canvasHeight;

    if(type == "self") {
         idName = "selfQrcode";
         className = "selfCanvas";
        width  = getRemPx()*17;
        height = getRemPx()*17;
        canvasWidth = getRemPx()*15;
        canvasHeight = getRemPx()*15;
    } else if(type == 'group') {
         width  = getRemPx()*24.5;
         height = getRemPx()*24.5;
         canvasWidth = getRemPx()*22;
         canvasHeight = getRemPx()*22;
         className = "qrcodeCanvas";
         idName = "groupQrcode";
    } else {
         width  = getRemPx()*24.5;
         height = getRemPx()*24.5;
         canvasWidth = getRemPx()*22;
         canvasHeight = getRemPx()*22;
         idName = "appDownload";
         className = "appDownload";
    }

    qrCodeObj.qrcode({
        idName:idName,
        render : "canvas",
        text    :urlLink,
        className : className,
        canvasWidth:canvasWidth,
        canvasHeight:canvasHeight,
        width : width,               //二维码的宽度
        height : height,              //二维码的高度
        background : "#ffffff",       //二维码的后景色
        foreground : "#000000",        //二维码的前景色
        src: src, //二维码中间的图片
        isCircle:isCircle
    });
}

//download qrcode img
function downloadImgFormQrcode(idName)
{
    var canvas = document.getElementById(idName);
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); //Convert image to 'octet-stream' (Just a download, really)
    window.location.href = image;
}

//--------------------------------------set document tile---------------------------------------------
intervalId = undefined
function setDocumentTitle()
{
    iconNum = 0;
    if(document.hidden == true) {
        var siteTip = localStorage.getItem(newSiteTipKey);
        if(intervalId == undefined && siteTip != "clear") {
            intervalId = setInterval(function () {
                if(siteTip == "clear") {
                    $(".icon").attr("href", "favicon.ico?_v="+intervalId);
                    iconNum = 0;
                } else {
                    if(Number(iconNum%2) == 0) {
                        $(".icon").attr("href", "favicon.ico?_v="+intervalId);
                    } else {
                        $(".icon").attr("href", "tip.png?_v="+intervalId);
                    }

                    iconNum = Number(iconNum+1);
                }
            }, 100);
        }
        return ;
    }
    $(".icon").attr("href", "favicon.ico");
    iconNum = 0;
    clearInterval(intervalId);
    intervalId = undefined
}
document.addEventListener('visibilitychange', function(){
   setDocumentTitle();
}, false);

//--------------------------------------logout----------------------------------------------
$(document).on("click", "#logout", function (event) {
    logout(event);
});

function logout(event)
{
    event.stopPropagation();
    var tip = $.i18n.map['logoutJsTip'] != undefined ? $.i18n.map['logoutJsTip']: "退出账号，将会清空聊天记录";
    if(confirm(tip)) {
        $.ajax({
            method: "POST",
            url:"./index.php?action=page.logout",
            data: "",
            success:function (resp) {
                localStorage.clear();
                window.location.href = landingPageUrl;
            }
        });
    }
}

//------------------------------------*********Group*********--------------------------------------------


$(document).on("click", ".see_group_profile", function () {
    var chatSessionId   = localStorage.getItem(chatSessionIdKey);
    var chatSessionType = localStorage.getItem(chatSessionId);
    var isShowProfile = $(this).attr("is_show_profile");
    if(1 == Number(isShowProfile)) {
        $('.right-body-sidebar').hide();
        $(this).attr("is_show_profile", 0);
    } else {
        $(this).attr("is_show_profile", 1);
        if(chatSessionType == U2_MSG) {
            sendFriendProfileReq(chatSessionId);
            $('.right-body-sidebar').show();
        } else if(chatSessionType == GROUP_MSG) {
            sendGroupProfileReq(chatSessionId, handleClickSeeGroupProfile);
        } else {
            $('.right-body-sidebar').hide();
        }
    }
});

function  handleClickSeeGroupProfile(results)
{

    var groupProfile = results.profile;
    if(!groupProfile) {
        var tip = $.i18n.map['notInGroupTip'] != undefined ? $.i18n.map['notInGroupTip'] : "你已不在此群";
        $(this).attr("is_show_profile", 0);
        alert(tip);
    } else {
        $('.right-body-sidebar').show();
    }
    handleGetGroupProfile(results);
}


////check is group speaker
function checkGroupMemberSpeakerType(userId, groupProfile)
{
    var users = groupProfile.speakers;
    if(users == null ){
        return false;
    }
    var length = users.length;
    var i;
    for(i=0; i<length; i++) {
        var user = users[i];
        if(user.userId == userId) {
            return user;
        }
    }
    return false;
}

////check is group admin
function checkGroupMemberAdminType(userId, groupProfile)
{
    var users = groupProfile.admins;
    if(users == null ){
        return false;
    }
    var length = users.length;
    var i;
    for(i=0; i<length; i++) {
        var user = users[i];
        if(user.userId == userId) {
            return user;
        }
    }
    return false;
}
////check is group owner
function checkGroupOwnerType(userId, groupProfile)
{
    var owner = groupProfile.owner;
    ///检查是否为群主
    if(owner.userId == userId) {
        return true;
    }
    return false;
}
////get  group admins
function getGroupAdmins(groupProfile)
{
    var users = groupProfile.admins;
    var groupAdminId =[];
    if(users == null ){
        return false;
    }
    var length = users.length;
    var i;
    for(i=0; i<length; i++) {
        var user = users[i];
        groupAdminId.push(user.userId);
    }
    return groupAdminId;
}
////get  group speakers
function getGroupSpeakers(groupProfile)
{
    var groupSpeakerId = [];

    var users = groupProfile.speakers;
    if(users == null ){
        return groupSpeakerId;
    }
    var length = users.length;
    var i;
    for(i=0; i<length; i++) {
        var user = users[i];
        groupSpeakerId.push(user.userId);
    }
    return groupSpeakerId;
}
////get  group owner
function  getGroupOwner(groupProfile)
{
    var owner = groupProfile.owner;
    return  owner.userId;
}


//-------------------------------------------api.group.list-------------------------------------------------

/// group operation - api.group.list
function getGroupList(callback)
{
    var action = "api.group.list";
    var reqData = {
        "offset" : groupOffset,
        "count"  : defaultCountKey,
    }
    handleClientSendRequest(action, reqData, callback);
}
/// group operation - api.group.list - init html
function initGroupList(results)
{
    $(".group-list-contact-row").html("");
    if(results.hasOwnProperty("list")) {
        appendGroupListHtml(results);
    }
}
/// group operation - api.group.list - append html
function appendGroupListHtml(results) {
    var html = "";
    if(results == undefined || !results.hasOwnProperty("list")) {
        return ;
    }
    var groupList = results.list;
    if(groupList) {
        groupOffset = Number(groupOffset + defaultCountKey);
        var groupLength = groupList.length;
        html = "";
        for(i=0; i<groupLength; i++) {
            var group = groupList[i];
            html = template("tpl-group-contact", {
                groupId : group.id,
                groupName : group.name,
            });
            html = handleHtmlLanguage(html);
            $(".group-list-contact-row").append(html);
            getNotMsgImg(group.id, group.avatar)
        }
        var groupsDivHeight = $(".left-body-groups")[0].clientHeight;
        var groupToolsHeight = $(".group-tools")[0].clientHeight;
        $(".group-list-contact-row")[0].style.height = Number(groupsDivHeight-groupToolsHeight)+"px";
    }
}

/// group operation - api.group.list - scroll append html
$(function () {
    ////加载群组列表
    $('.group-lists').scroll(function(){
        var pwLeft = $(".group-lists")[0];
        var ch  = pwLeft.clientHeight;
        var sh = pwLeft.scrollHeight;
        var st = $('.group-lists').scrollTop();
        ////文档的高度-视口的高度-滚动条的高度
        if((sh - ch - st) == 0){
            getGroupList(appendGroupListHtml);
        }
    });
});

//-------------------------------------------api.group.invitableFriends-------------------------------------------------
unselectMemberOffset = 0;

////group operation -  api.group.invitableFriends - init
$(document).on("click", ".invite_people", function () {
    unselectMemberOffset = 0;
    var action = "api.group.invitableFriends";
    var groupId = localStorage.getItem(chatSessionIdKey);
    var reqData = {
        "groupId": groupId,
        "offset" : unselectMemberOffset,
        "count" : defaultCountKey,
    }
    handleClientSendRequest(action, reqData, initUnselectMemberList);
});

////group operation -  api.group.invitableFriends - init html
function initUnselectMemberList(results)
{
    $(".pw-right-body").html("");
    $(".pw-left").html("");
    var list = results.list;
    var html = "";
    if(list) {
        getUnselectMemberListHtml(results);
    } else {
        html = template("tpl-invite-member-no-data", {});
        html = handleHtmlLanguage(html);
        $(".pw-left").append(html);
    }
    showWindow($("#group-invite-people"));
}

////group operation -  api.group.invitableFriends - append html
function getUnselectMemberListHtml(results)
{
    var list = results.list;
    var html = "";
    if(list) {
        $(".pw-left").html("");
        var i;
        unselectMemberOffset = Number(unselectMemberOffset+defaultCountKey);
        var length = list.length;
        for(i=0; i<length ; i++) {
            var user = list[i];
            html = template("tpl-invite-member", {
                userId : user.userId,
                nickname:user.nickname ?  user.nickname : defaultUserName
            });
            html = handleHtmlLanguage(html);
            $(".pw-left").append(html);
            getNotMsgImg(user.userId, user.avatar);
        }
    }
}
////group operation -  api.group.invitableFriends - append html
$(function(){
    ////加载邀请好友入群列表
    $('.pw-left').scroll(function(){
        var pwLeft = $(".pw-left")[0];
        var ch  = pwLeft.clientHeight;
        var sh = pwLeft.scrollHeight;
        var st = $('.pw-left').scrollTop();
        ////文档的高度-视口的高度-滚动条的高度
        if((sh - ch - st) == 0){
            groupId = localStorage.getItem(chatSessionIdKey);
            var action = "api.group.invitableFriends";
            var reqData = {
                "groupId": groupId,
                "offset" : unselectMemberOffset,
                "count"  : defaultCountKey
            }
            handleClientSendRequest(action, reqData, getUnselectMemberListHtml);
        }
    });
});

//---------------------------------------api.group.profile-----------------------------------------------

$(document).on("click", ".group-desc-body", function () {
    var length = $(".group-desc-body textarea").length;
    if(length >0){
        return ;
    }
    var groupId = localStorage.getItem(chatSessionIdKey);
    var groupProfile = getGroupProfile(groupId);
    var descBody = "";
    if(groupProfile != false && groupProfile!= null && groupProfile.hasOwnProperty("description")){
        descBody = groupProfile.description["body"];
    }
    descBody = descBody == undefined ? "" : descBody;
    var html = '<textarea class="group-introduce">'+descBody+'</textarea>';
    $(".group-desc-body").html(html);
    $(".group-introduce").focus();
});


function getGroupProfile(groupId)
{
    var groupInfoKey = profileKey + groupId;
    var groupProfileStr = localStorage.getItem(groupInfoKey);

    var groupInfoReqKey = reqProfile+groupId;
    var nowTimestamp = Date.parse(new Date());
    var reqProfileTime = sessionStorage.getItem(groupInfoReqKey);
    var groupProfile = false;

    if(groupProfileStr != false && groupProfileStr != null) {
        try{
            groupProfile = JSON.parse(groupProfileStr);
            if(groupProfile && (nowTimestamp - groupProfile['updateTime'])<ProfileTimeout) {
                return groupProfile;
            }
        }catch (error) {

        }
    }

    if(reqProfileTime != false && reqProfileTime != null && reqProfileTime !=undefined  && ((nowTimestamp-reqProfileTime)<reqTimeout) ) {
        return false;
    }
    sessionStorage.setItem(groupInfoReqKey, nowTimestamp);
    sendGroupProfileReq(groupId, handleGetGroupProfile);
    return groupProfile;
}

function sendGroupProfileReq(groupId, callback)
{
    if(!groupId || groupId == undefined) {
        return null;
    }
    var action = "api.group.profile";
    var reqData = {
        "groupId": groupId
    };
    handleClientSendRequest(action, reqData, callback);
}


function handleGetGroupProfile(result)
{
    var groupProfile = result.profile;
    if(groupProfile) {
        groupProfile.memberType = result.memberType ? result.memberType : GroupMemberType.GroupMemberGuest;
        groupProfile.canAddFriend = results.canAddFriend ? results.canAddFriend : false;

        groupProfile.permissionJoin = groupProfile.permissionJoin ? groupProfile.permissionJoin : GroupJoinPermissionType.GroupJoinPermissionPublic;
        groupProfile['updateTime'] = Date.parse(new Date());
        localStorage.setItem(groupProfile.id, GROUP_MSG);

        var groupInfoKey = profileKey + groupProfile.id;
        localStorage.setItem(groupInfoKey, JSON.stringify(groupProfile));

        sessionStorage.removeItem(reqProfile+groupProfile.id);

        var muteKey = msgMuteKey + groupProfile.id;
        localStorage.setItem(muteKey, (result.isMute ? 1 : 0) );
        displayProfile(groupProfile.id, GROUP_MSG);
        return;
    }

}

//---------------------------------------api.group.members-----------------------------------------------
////group operation - api.group.members - get member list
function getGroupMembers(groupId, offset, count, callback)
{
    var action = "api.group.members";
    var currentGroupId = localStorage.getItem(chatSessionIdKey);
    var type = localStorage.getItem(currentGroupId);

    if(type == U2_MSG) {
        return;
    }
    //not current group
    if(currentGroupId != groupId) {
        return;
    }
    var reqData = {
        "groupId": currentGroupId,
        "offset" : offset,
        "count" : count,
    }
    handleClientSendRequest(action, reqData, callback);
}


// reload group members for group profile
function displayGroupMemberForGroupInfo(results)
{
    var list = results.list;
    $(".group-member-body").html("");
    if(list) {
        var length = list.length;
        var html = "";
        var bodyDivNum = undefined;
        var divNum = 0;
        var groupId = localStorage.getItem(chatSessionIdKey);
        for(i=0; i<length ; i++) {
            var newBodyNum=Math.floor((i/6));
            if(newBodyNum != bodyDivNum) {
                divNum = divNum+1;
                html = template("tpl-group-member-body", {
                    num:divNum
                })
                $(".group-member-body").append(html);
            }
            var user = list[i].profile;
            html = template("tpl-group-member-body-detail", {
                userId : user.userId,
                nickname:user.nickname
            });
            html = handleHtmlLanguage(html);
            $(".member_body_"+divNum).append(html);
            getNotMsgImg(user.userId, user.avatar);
            bodyDivNum = newBodyNum;
        }
    }
}


//---------------------------------------api.group.inviteFriends-----------------------------------------------

$(document).on("click", ".cancle_invite_people", function () {
    removeWindow($("#group-invite-people"));
});

$(document).on("click", ".del_select_people", function () {
    var userId = $(this).attr("user-id");
    $(this).parent().remove();
    var selectHtml = '<img src="../../public/img/msg/member_unselect.png" /> ';
    $("."+userId).find(".select_people").attr("is_select", "not_selected");
    $("."+userId).find(".select_people").html(selectHtml);
});

//click invite friends
$(document).on("click", ".pw-left .choose-member", function(){
    var isSelect = $(this).find(".select_people").attr("is_select");
    if(isSelect != "is_select") {
        var userId = $(this).attr("user-id");
        var selectHtml = '<img src="../../public/img/msg/member_select.png" /> ';
        $(this).find(".select_people").attr("is_select", "is_select");
        $(this).find(".select_people").html(selectHtml);
        var obj = $(this).clone();
        obj.find(".select_people").remove();
        var html = '<div class="pw-contact-row-checkbox del_select_people " user-id="'+userId+'"> <img src="../../public/img/msg/btn-x.png" /> </div>';
        obj.append(html);
        obj.appendTo(".pw-right-body");
    } else {
        var userId = $(this).attr("user-id");
        $(".pw-right .pw-right-body ."+userId).remove();
        var selectHtml = '<img src="../../public/img/msg/member_unselect.png" /> ';
        $(this).find(".select_people").attr("is_select", "no_select");
        $(this).find(".select_people").html(selectHtml);
    }
});

//---------------------------------------api.group.invite-----------------------------------------------

function handleAddMemberToGroup()
{
    removeWindow($("#group-invite-people"));
    syncMsgForRoom();
    var groupId = localStorage.getItem(chatSessionIdKey);
    getGroupMembers(groupId, 0, 18, displayGroupMemberForGroupInfo);
}

function addMemberToGroup(userIds, groupId)
{
    var action  = "api.group.invite";
    var reqData = {
        "groupId": groupId,
        "userIds" : userIds,
    }
    handleClientSendRequest(action, reqData, handleAddMemberToGroup);
}

$(document).on("click", ".add_member_to_group", function () {
    var rowList = $(".pw-right-body .pw-contact-row");
    var userIds = [];
    rowList.each(function(index, row) {
        var userId = $(row).attr("user-id");
        userIds.push(userId);
    });
    var groupId = localStorage.getItem(chatSessionIdKey);

    addMemberToGroup(userIds, groupId)
});


//---------------------------------------api.group.create-----------------------------------------------

$(".create_group_box_div_input").bind('input porpertychange',function() {
    if($(".create_group_box_div_input").val().length>0) {
        $(".create_group_box_div_input").addClass("rgb108");
    }
});


function groupCreateSuccess(results) {
    removeWindow($("#create-group"));

    var groupProfile = results.profile["profile"];

    localStorage.setItem(chatSessionIdKey, groupProfile.id);
    localStorage.setItem(groupProfile.id, GROUP_MSG);

    var groupName = groupProfile.name;
    groupName = template("tpl-string", {
        string : groupName
    });

    $(".chatsession-title").html(groupName);
    getGroupMembers(groupProfile.id, 0, 18, displayGroupMemberForGroupInfo);
    handleGetGroupProfile(results);
    insertGroupRoom(groupProfile.id, groupProfile.name);
    handleMsgRelation(undefined, groupProfile.id);
    $(".l-sb-item[data='chatSession']").click();
}


function createGroup()
{
    var enableCreateGroup = getEnableCreateGroup();
    if(!enableCreateGroup) {
        enableCreateGroupTip();
        return;
    }
    var groupName = $(".group_name").val();
    if(groupName.length > 10 || groupName.length < 1) {
        var tip = $.i18n.map['createGroupNameTip'] != undefined ? $.i18n.map['createGroupNameTip']: "群组名称长度限制1-10";
        alert(tip);
        return false;
    }
    var reqData = {
        "groupName" : groupName,
    };
    var action = "api.group.create";
    handleClientSendRequest(action, reqData, groupCreateSuccess);
}

function insertGroupRoom(groupId, groupName)
{
    var msg = {
        "fromUserId": token,
        "name" : groupName,
        "timeServer": Date.parse(new Date()),
        "roomType": GROUP_MSG,
        "toGroupId": groupId,
        "type": "MessageText",
        "text": {
            "body": ""
        },
        "className": "group-profile",
        "chatSessionId": groupId
    };
    msg = handleMsgInfo(msg);
    appendOrInsertRoomList(msg, true, false);
}


$(document).on("click", ".group_cancle", function(){
    $(".group_name").val("");
});

$(document).on("click", ".create-group", function () {
    requestSiteConfig(checkEnableCreateGroup);
});

function getEnableCreateGroup()
{
    var enableCreateGroup = true;
   try{
       var siteConfigStr = localStorage.getItem(siteConfigKey);
       var siteConfig = JSON.parse(siteConfigStr);
       enableCreateGroup = siteConfig.enableCreateGroup == true ? true : false;
       var master = siteConfig.hasOwnProperty("masters") ? siteConfig.masters : undefined;
       if(master != undefined) {
           var masterStr = JSON.parse(master).join(",");
           if(masterStr.indexOf(token) != -1) {
               enableCreateGroup = true;
           }
       }
   }catch (error) {

   }
    return enableCreateGroup;
}
function checkEnableCreateGroup(results)
{
    ZalyIm(results);
    var enableCreateGroup = getEnableCreateGroup();
    var html = template("tpl-create-group-div", {
        enableCreateGroup:enableCreateGroup,
    });
    html = handleHtmlLanguage(html);
    $("#create-group").html(html);
    showWindow($("#create-group"));
}

function enableCreateGroupTip()
{

    var tip = $.i18n.map['notEnableCreateGroupTip'] ? $.i18n.map['notEnableCreateGroupTip'] : "站点禁止创建群组";
    alert(tip);
}

$(document).on("click", ".create_group_button" , function(){
    createGroup();
});

function createGroupByKeyDown(event)
{

    if(checkIsEnterBack(event) == false) {
        return;
    }
    createGroup();
}

//---------------------------------------click group member avatar-----------------------------------------------

var clickImgUserMsgId = '';
var clickImgUserId = '';

function handleClickGroupUserImg(results)
{
    var groupProfile = results.profile;

    if(groupProfile) {
        console.log("profile results===="+JSON.stringify(results));

        groupProfile.memberType = results.memberType ? results.memberType : GroupMemberType.GroupMemberGuest;

        var isOwner = groupProfile.memberType == GroupMemberType.GroupMemberOwner ? 1 : 0;
        var isAdmin = groupProfile.memberType == GroupMemberType.GroupMemberAdmin || isOwner ? 1 : 0 ;

        var memberIsAdmin = checkGroupMemberAdminType(clickImgUserId, groupProfile);
        var memberIsSpeaker = checkGroupMemberSpeakerType(clickImgUserId, groupProfile);
        var memberIsOwner = checkGroupOwnerType(clickImgUserId, groupProfile);
        var isFriend = localStorage.getItem(friendRelationKey+clickImgUserId) == FriendRelation.FriendRelationFollow ? 1 : 0;
        var isCanAddFriend = groupProfile.canAddFriend == true ? true : false;

        var html = template("tpl-group-user-menu", {
            userId : clickImgUserId,
            isFriend : isFriend,
            isOwner:isOwner,
            isAdmin:isAdmin,
            memberIsSpeaker:memberIsSpeaker == false ? false : true,
            memberIsAdmin:memberIsAdmin == false ? false : true,
            memberIsOwner:memberIsOwner == false ? false : true,
            isCanAddFriend : isCanAddFriend
        });

        html = handleHtmlLanguage(html);
        var node = $(".group-user-img-"+clickImgUserMsgId)[0].parentNode.nextSibling.nextSibling;
        $(node).append($(html));
    }
    handleGetGroupProfile(results);
}

$(document).on("click", ".group-user-img", function(){
    var groupId = localStorage.getItem(chatSessionIdKey);
    var userId = $(this).attr("userId");
    clickImgUserMsgId = $(this).attr("msgId");
    clickImgUserId = userId;
    $("#group-user-menu").attr("userId", userId);
    sendGroupProfileReq(groupId, handleClickGroupUserImg);
});


////设置新的聊天界面
$(document).on("click", "#open-temp-chat", function () {
    var node = $(this)[0].parentNode;
    var userId = $(node).attr("userId");
    sendFriendProfileReq(userId, openU2Chat);
});

function openU2Chat(result)
{
    handleGetFriendProfile(result);

    if(result == undefined) {
        return;
    }
    var profile = result.profile;

    if(profile != undefined && profile["profile"]) {
        var userProfile = profile["profile"];
        var userId = userProfile.userId;

        if(userId == undefined) {
            return ;
        }
        localStorage.setItem(chatSessionIdKey, userId);
        localStorage.setItem(userId, U2_MSG);
        $(".user-desc-body").html(userId);
        insertU2Room(undefined, userId);
    }
}

function insertU2Room(jqElement, userId)
{
    handleMsgRelation(jqElement, userId);
    var msg = {
        "fromUserId": token,
        "pointer": "78",
        "timeServer": Date.parse(new Date()),
        "roomType": "MessageRoomU2",
        "toUserId": userId,
        "type": "MessageText",
        "text": {
            "body": ""
        },
        "className": "u2-profile",
        "chatSessionId": userId,
    };
    msg = handleMsgInfo(msg);
    appendOrInsertRoomList(msg, true, false);
}


//---------------------------------------api.group.removeMember-----------------------------------------------
////group operation - api.group.removeMember
function removeMemberFromGroup(groupId, removeUserIds, callback)
{
    var action = "api.group.removeMember";
    var reqData = {
        "groupId": groupId,
        "userIds" : removeUserIds,
    }
    handleClientSendRequest(action, reqData, callback);
}

removeMemberId="";
function handleRemoveMember()
{
    try{
        $("."+removeMemberId).remove();
        var chatSessionId = localStorage.getItem(chatSessionIdKey);
        getGroupMembers(chatSessionId, 0, 18, displayGroupMemberForGroupInfo);
    }catch (error) {

    }
}
////group operation - api.group.removeMember - click remove group btn
$(document).on("click", ".remove_group_btn", function () {
    var groupId = localStorage.getItem(chatSessionIdKey);
    var userId = $(this).attr("userId");
    removeMemberId=userId;
    var removeUserIds = new Array();
    removeUserIds.push(userId);
    removeMemberFromGroup(groupId, removeUserIds, handleRemoveMember);
});

////group operation - api.group.removeMember - click user avatar in group chat
$(document).on("click", "#remove-group-chat", function () {
    var tip = $.i18n.map['removeMemberFromGroupJsTip'] != undefined ? $.i18n.map['removeMemberFromGroupJsTip']: "确定要移除群聊?";
    if(confirm(tip)) {
        var groupId = localStorage.getItem(chatSessionIdKey);
        var node = $(this)[0].parentNode;
        var userId = $(node).attr("userId");
        var removeUserIds = new Array();
        removeUserIds.push(userId);
        removeMemberFromGroup(groupId, removeUserIds, reloadPage);
    }
});

//group operation - api.group.removeMember - click in group member list

function handleGetGroupMemberInfo(result)
{
    if(result == undefined) {
        return;
    }
    var profile = result.profile;

    if(profile != undefined && profile["profile"]) {
        var userProfile = profile["profile"];
        var relation = profile.relation == undefined ? FriendRelation.FriendRelationInvalid : profile.relation;
        var isSelf = userProfile.userId == token ? true : false;

        var html = template("tpl-group-member-info", {
            userId : userProfile.userId,
            nickname:userProfile.nickname,
            loginName:userProfile.loginName,
            relation:relation,
            isSelf:isSelf
        });
        html = handleHtmlLanguage(html);
        $(".group-member-info").html(html);
        getNotMsgImg(userProfile.userId, userProfile.avatar);
        $(".group-member-info")[0].style.display='block';
    }
    handleGetFriendProfile(result);
}

$(document).on("click", ".group-member", function (event) {
    event.stopPropagation();
    event.preventDefault();
    if(event.target.className == "remove_group_btn") {
        return;
    }
    var userId = $(this).attr("userId");
    var isSelf = userId == token ? true : false;
    var relation = localStorage.getItem(friendRelationKey+userId);
    var html = template("tpl-group-member-info", {
        userId : userId,
        nickname:$(this).attr("nickname"),
        relation:relation,
        avatar:$(".info-avatar-"+userId).attr("src"),
        isSelf:isSelf
    });
    html = handleHtmlLanguage(html);
    $(".group-member-info").html(html);
    getFriendProfile(userId, true, handleGetGroupMemberInfo);
});



function  reloadPage() {
    window.location.reload();
}


//---------------------------------------group speakers-----------------------------------------------

// group operation -- group speakers from group profile
$(".group_speakers").on("click", function () {
    showWindow($("#group-speaker-people"));
    unselectSpeakerMemberOffset =0;
    var groupId = localStorage.getItem(chatSessionIdKey);
    sendGroupProfileReq(groupId, handelGroupSpeakerList);
});

// group operation -- group speakers from group profile - init html
function handelGroupSpeakerList(result)
{
    var groupProfile = result.profile;
    if(groupProfile) {
        var isSelfAdminRole = false;
        if(checkGroupMemberAdminType(token, groupProfile)) {
            isSelfAdminRole = true;
        }
        if(checkGroupOwnerType(token, groupProfile)){
            isSelfAdminRole = true;
        }
        $(".speaker-people-div").html('');
        if(isSelfAdminRole == false) {
            $(".remove-all-speaker")[0].style.display = "none";
            $(".speaker-group-member")[0].style.display = "none";
        }

        if(groupProfile.hasOwnProperty("speakers")) {
            var speakers = groupProfile.speakers;
            var speakersLength = speakers.length;
            for(var i=0; i<speakersLength;i++){
                var speakerInfo = speakers[i];
                var html =getSpeakerMemberHtml(speakerInfo,  true, "member", isSelfAdminRole);
                $(".speaker-people-div").append(html);
                getNotMsgImg(speakerInfo.userId, speakerInfo.avatar);
            }
        }
        // group operation -- group speakers from group profile - init member html
        if(isSelfAdminRole) {
            $(".speaker-group-member").remove();
            var html = template("tpl-group-member-for-speaker", {});
            html = handleHtmlLanguage(html);
            $(".speaker-content").append(html);
            $(".speaker-group-member-div").html('');
            getGroupMembers(groupProfile.id, unselectSpeakerMemberOffset, defaultCountKey, initSpeakerGroupMemberList);
        }
    }
    handleGetGroupProfile(result);
}

// group operation -- group speakers from group profile - init member html
unselectSpeakerMemberOffset = 0;
function initSpeakerGroupMemberList(results)
{
    var list = results.list;
    if(list) {
        unselectSpeakerMemberOffset = Number(unselectSpeakerMemberOffset+defaultCountKey);
        var length = list.length;
        var html = "";
        var groupId = localStorage.getItem(chatSessionIdKey);
        var groupProfile = getGroupProfile(groupId);
        var groupOwnerId = getGroupOwner(groupProfile);
        var groupAdminIds = getGroupAdmins(groupProfile);
        var speakerListMemberIds = getGroupSpeakers(groupProfile);
        var isSelfAdminRole = false;
        if(checkGroupMemberAdminType(token, groupProfile)) {
            isSelfAdminRole = true;
        }
        if(checkGroupOwnerType(token, groupProfile)){
            isSelfAdminRole = true;
        }
        for(i=0; i<length ; i++) {
            var user = list[i].profile;
            var userId = user.userId;
            var isType = "member";

            if(groupOwnerId == userId) {
                isType = "owner";
                continue;
            }
            if(groupAdminIds && groupAdminIds.indexOf(userId) != -1) {
                isType = "admin";
                continue;
            }

            if(speakerListMemberIds && speakerListMemberIds.indexOf(userId) != -1) {
                continue;
            }
            var html = getSpeakerMemberHtml(user,  false, "member", isSelfAdminRole);
            $(".speaker-group-member-div").append(html);
            getNotMsgImg(userId, user.avatar);
        }
    }
}
// group operation -- group speakers from group profile
$(function () {
    ////加载设置群成员列表
    $('.speaker-content').scroll(function(){
        var pwLeft = $(".speaker-content")[0];
        var ch  = pwLeft.clientHeight;
        var sh = pwLeft.scrollHeight;
        var st = $('.speaker-content').scrollTop();
        ////文档的高度-视口的高度-滚动条的高度
        if((sh - ch - st) == 0){
            var groupId = localStorage.getItem(chatSessionIdKey);
            getGroupMembers(groupId, unselectSpeakerMemberOffset, defaultCountKey, initSpeakerGroupMemberList);
        }
    });
});


//set group speakers by click user avatar from group chat dialog
$(document).on("click", "#set-speaker", function () {
    var groupId = localStorage.getItem(chatSessionIdKey);
    var node = $(this)[0].parentNode;
    var userId = $(node).attr("userId");
    var speakerUserIds = [];
    ////追加操作
    var tip = $.i18n.map['setSpeakerJsTip'] != undefined ? $.i18n.map['setSpeakerJsTip']: "设置发言人";
    if(confirm(tip)) {
        speakerUserIds.push(userId);
        updateGroupSpeaker(groupId, speakerUserIds, SetSpeakerType.AddSpeaker, handleSetSpeaker);
        removeWindow($("#group-user-menu"));
    }
});

//remove group speakers by click user avatar from group chat dialog
$(document).on("click", "#remove-speaker", function () {
    var groupId = localStorage.getItem(chatSessionIdKey);
    var node = $(this)[0].parentNode;
    var userId = $(node).attr("userId");
    var speakerUserIds = [];
    ////追加操作
    var tip = $.i18n.map['removeSpeakerJsTip'] != undefined ? $.i18n.map['removeSpeakerJsTip']: "确定要移除发言权限?";
    if(confirm(tip)) {
        speakerUserIds.push(userId);
        updateGroupSpeaker(groupId, speakerUserIds, SetSpeakerType.RemoveSpeaker, handleSetSpeaker);
        removeWindow($("#group-user-menu"));
        sendGroupProfileReq(groupId, handleGetGroupProfile);
    }
});

function updateGroupSpeaker(groupId, speakerUserIds, type, callback)
{
    var action = "api.group.setSpeaker";
    var reqData;
    if(speakerUserIds.length > 0 ) {
        reqData = {
            "groupId": groupId,
            "setType" : type,
            "speakerUserIds" :speakerUserIds,
        }
    } else {
        reqData = {
            "groupId": groupId,
            "setType" : type,
        }
    }

    handleClientSendRequest(action, reqData, callback);
}

function handleSetSpeaker(result)
{
    try{
        var speakerUserIds = result.speakerUserIds;
        var speakerKey = speakerUserIdsKey+localStorage.getItem(chatSessionIdKey);
        localStorage.setItem(speakerKey, JSON.stringify(speakerUserIds));
        var groupId = localStorage.getItem(chatSessionIdKey);
        sendGroupProfileReq(groupId, handleGetGroupProfile);
    }catch (error) {

    }
}
addSpeakerInfo=[];

function handleAddSpeaker()
{
    var groupId = localStorage.getItem(chatSessionIdKey);
    var groupProfile = getGroupProfile(groupId);

    var isSelfAdminRole = false;
    if(checkGroupMemberAdminType(token, groupProfile)) {
        isSelfAdminRole = true;
    }
    if(checkGroupOwnerType(token, groupProfile)){
        isSelfAdminRole = true;
    }

    var addSpeakerIdLength = addSpeakerInfo.length;
    for(var i=0; i<addSpeakerIdLength; i++) {
        var speakerInfo = addSpeakerInfo[i];
        $("."+speakerInfo.userId).remove();
        var html = getSpeakerMemberHtml(speakerInfo,  true, "member", isSelfAdminRole);
        $(".speaker-people-div").append(html);
        getNotMsgImg(speakerInfo.userId, speakerInfo.avatar)
    }
    addSpeakerInfo=[];
    sendGroupProfileReq(groupId, handleGetGroupProfile);
}

function getSpeakerMemberHtml(speakerInfo,  isSpeaker, isMemberType, isSelfAdminRole)
{
    var html = template("tpl-speaker-member",{
        nickname:speakerInfo.nickname,
        userId:speakerInfo.userId,
        avatar:speakerInfo.avatar,
        isSpeaker:isSpeaker,
        isMemberType:isMemberType,
        isSelfAdminRole:isSelfAdminRole
    });
    return  handleHtmlLanguage(html);
}

$(document).on("click", ".add_speaker_btn", function () {
    var userId = $(this).attr("userId");
    var groupId = localStorage.getItem(chatSessionIdKey);
    var speakerUserIds = [];
    speakerUserIds.push(userId);
    var speakerInfo = {
        userId:userId,
        nickname:$(this).attr("nickname"),
        avatar:$(this).attr("avatar"),
    }
    addSpeakerInfo.push(speakerInfo);
    updateGroupSpeaker(groupId, speakerUserIds, SetSpeakerType.AddSpeaker, handleAddSpeaker)
});

deleteSpeakerInfo=[];
function handleRemoveSpeaker()
{
    var delSpeakerLength=deleteSpeakerInfo.length;

    var groupId = localStorage.getItem(chatSessionIdKey);
    var groupProfile = getGroupProfile(groupId);

    var isSelfAdminRole = false;
    if(checkGroupMemberAdminType(token, groupProfile)) {
        isSelfAdminRole = true;
    }
    if(checkGroupOwnerType(token, groupProfile)){
        isSelfAdminRole = true;
    }
    for(var i=0; i<delSpeakerLength; i++) {
        var speakerInfo = deleteSpeakerInfo[i];
        $("."+speakerInfo.userId).remove();
        var html = getSpeakerMemberHtml(speakerInfo,  false, "member", isSelfAdminRole);
        $(".speaker-group-member-div").append(html);
        getNotMsgImg(speakerInfo.userId, speakerInfo.avatar);
    }
    deleteSpeakerInfo=[];
    sendGroupProfileReq(groupId, handleGetGroupProfile);
}

$(document).on("click", ".remove_speaker_btn", function () {
    var userId = $(this).attr("userId");
    var groupId = localStorage.getItem(chatSessionIdKey);
    var speakerUserIds = [];
    speakerUserIds.push(userId);
    var speakerInfo = {
        userId:userId,
        nickname:$(this).attr("nickname"),
        avatar:$(this).attr("avatar"),
    }
    deleteSpeakerInfo.push(speakerInfo);
    updateGroupSpeaker(groupId, speakerUserIds, SetSpeakerType.RemoveSpeaker, handleRemoveSpeaker)
});

$(document).on("click", ".remove-all-speaker", function () {
    var removeSpeakers = $(".remove-speaker");
    var removeSpeakersLength = removeSpeakers.length;
    var groupId = localStorage.getItem(chatSessionIdKey);
    for(var i=0; i<removeSpeakersLength;i++) {
        var speakers = removeSpeakers[i];
        var userId = $(speakers).attr("userId");
        var speakerInfo = {
            userId:userId,
            nickname:$(speakers).attr("nickname"),
            avatar:$(speakers).attr("avatar"),
        }
        deleteSpeakerInfo.push(speakerInfo);
    }
    updateGroupSpeaker(groupId, [], SetSpeakerType.CloseSpeaker, handleRemoveSpeaker)
});



// click user avatar in group dialog
$(document).on("click", ".open_chat", function () {
    var userId = $(this).attr("userId");
    sendFriendProfileReq(userId, openU2Chat);
    removeWindow($("#group-member-list-div"));
});

// click user avatar in group dialog
$(document).on("click", ".add-friend-by-group-member",function () {
    var userId = $(this).attr("userId");
    sendFriendApplyReq(userId, "", "");
    $(this).attr("disabled", "disabled");
    alert("发送申请成功");
    $(".group-member-info")[0].style.display='none';
});

function closeGroupMemberInfo()
{
    $(".group-member-info")[0].style.display='none';
}


//---------------------------------------display group qrcode-----------------------------------------------
$(document).on("click", ".share-group", function () {
    $("#qrcodeCanvas").html("");

    var chatSessionId = localStorage.getItem(chatSessionIdKey);
    var groupProfile = getGroupProfile(chatSessionId);
    var groupName = groupProfile != false && groupProfile.name != "" ? groupProfile.name : $(".chatsession-title").html();


    var siteConfigJsonStr = localStorage.getItem(siteConfigKey);
    var siteName = "";
    if(siteConfigJsonStr ) {
        siteConfig = JSON.parse(siteConfigJsonStr);
        siteName = siteConfig.name;
    }

    var html = template("tpl-share-group-div", {
        siteName:siteName,
        groupName:groupName,
        groupId:chatSessionId
    });

    html = handleHtmlLanguage(html);
    $("#share_group").html(html);
    showWindow($("#share_group"));

    getNotMsgImg(chatSessionId, groupProfile.avatar);

    var src = $("#share_group").attr("src");

    if(src == "" || src == undefined) {
        src="../../public/img/msg/group_default_avatar.png";
    }
    var urlLink = changeZalySchemeToDuckChat(chatSessionId, "g");
    $("#share_group").attr("urlLink", urlLink);
    generateQrcode($('#qrcodeCanvas'),  urlLink, src, true, "group");
});

$(document).on("click",".copy-share-group", function(){
    var urlLink = $("#share_group").attr("urlLink");
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', urlLink);
    input.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
        alert('复制成功');
    }
    document.body.removeChild(input);

});

$(document).on("click", ".save-share-group", function () {
    downloadImgFormQrcode("groupQrcode");
});


//---------------------------------------display group members-----------------------------------------------
groupMemberListOffset=0;
groupMemberListAdmins=[];

function addHtmlToGroupList(user, isType)
{
    var groupId = localStorage.getItem(chatSessionIdKey);
    var groupProfile = getGroupProfile(groupId);

    var isGroupOwner = checkGroupOwnerType(token, groupProfile);
    var isGroupAdmin = checkGroupMemberAdminType(token, groupProfile);
    var isPermission = isGroupOwner || isGroupAdmin ? "admin" : "member";

    var html = template("tpl-group-member-list", {
        userId : user.userId,
        nickname:user.nickname,
        isType:isType,
        isPermission:isPermission
    })
    html = handleHtmlLanguage(html);
    $(".group-member-content").append(html);
    getNotMsgImg(user.userId, user.avatar);
}

function initGroupMemberForGroupMemberList(results)
{
    var list = results.list;
    if(list) {
        groupMemberListOffset = Number(groupMemberListOffset+defaultCountKey);
        var length = list.length;
        for(var i=0; i<length ; i++) {
            var user = list[i].profile;
            if(groupMemberListAdmins.indexOf(user.userId) == -1) {
                addHtmlToGroupList(user, "member");
            }
        }
    }
}

function addGroupMemberToGroupMemberList(result)
{
    handleGetGroupProfile(result);
    var groupProfile = result.profile;
    if(groupProfile) {
        var owner = groupProfile.owner;
        groupMemberListAdmins.push(owner.userId);
        addHtmlToGroupList(owner, "owner", "admin");

        if(groupProfile.hasOwnProperty("admins")) {
            var admins = groupProfile.admins;
            if(admins == null ){
                return false;
            }
            var length = admins.length;
            for(var i=0; i<length; i++) {
                var admin = admins[i];
                addHtmlToGroupList(admin, "admin");
                groupMemberListAdmins.push(admin.userId);
            }
        }
        getGroupMembers(groupProfile.id, groupMemberListOffset, defaultCountKey, initGroupMemberForGroupMemberList);
    }
}

//click see_all_group_member , get group members
$(document).on("click", ".see_all_group_member", function () {
    groupMemberListOffset = 0;
    showWindow($("#group-member-list-div"));
    $(".group-member-info")[0].style.display="none";
    $(".group-member-content").html("");
    var groupId = localStorage.getItem(chatSessionIdKey);
    sendGroupProfileReq(groupId, addGroupMemberToGroupMemberList);
});

$(function () {
    ////加载设置群成员列表
    $('.group-member-content').scroll(function(){
        var pwLeft = $(".group-member-content")[0];
        var ch  = pwLeft.clientHeight;
        var sh = pwLeft.scrollHeight;
        var st = $('.group-member-content').scrollTop();

        ////文档的高度-视口的高度-滚动条的高度
        if((sh - ch - st) == 0){
            var groupId = localStorage.getItem(chatSessionIdKey);
            getGroupMembers(groupId, groupMemberListOffset, defaultCountKey, initGroupMemberForGroupMemberList )
        }
    });
});


function getGroupProfileByClickChatSessionRow(jqElement)
{
    var groupId =  jqElement.attr("chat-session-id");

    if(groupId == undefined || !groupId) {
        $(this).remove();
        return ;
    }
    var groupName = $('.nickname_'+groupId).html();
    groupName = template("tpl-string", {
        string : groupName
    });
    $(".chatsession-title").html(groupName);

    sendGroupProfileReq(groupId, handleGetGroupProfile);

    localStorage.setItem(chatSessionIdKey, groupId);
    localStorage.setItem(groupId, GROUP_MSG);

    $("#share_group").removeClass();
    $("#share_group").addClass("info-avatar-"+groupId);

    handleMsgRelation($(this), groupId);
}

$(document).on("click", ".group-profile", function () {
    getGroupProfileByClickChatSessionRow($(this));
});

// contact-row-u2-profile
$(document).on("click", ".contact-row-group-profile", function () {
    var groupId =  $(this).attr("chat-session-id");
    if(groupId == undefined) {
        alert("not found group-id by click group-profile");
        return ;
    }
    localStorage.setItem(chatSessionIdKey, groupId);
    localStorage.setItem(groupId, GROUP_MSG);

    handleClickRowGroupProfile(groupId);
});

function handleClickRowGroupProfile(groupId)
{
    sendGroupProfileReq(groupId, handleGetGroupProfile);

    var groupName = $('.nickname_'+groupId).html();
    groupName = template("tpl-string", {
        string : groupName
    });
    $(".chatsession-title").html(groupName);

    insertGroupRoom(groupId, groupName);
    handleMsgRelation($(this), groupId);
}

//---------------------------------------api.group.update-----------------------------------------------
function updateGroupProfile(groupId, values)
{
    var reqValues = [];
    reqValues.push(values);

    var action = "api.group.update";
    var reqData = {
        "groupId": groupId,
        "values" :reqValues,
    }
    handleClientSendRequest(action, reqData, handleGetGroupProfile);
}

// can_guest_read_message click ,游客是否可以查看消息
$(document).on("click", ".can_guest_read_message", function () {
    var groupId = localStorage.getItem(chatSessionIdKey);
    var canRead = $(".can_guest_read_message").attr("is_on");

    if(canRead == "on") {
        $(".can_guest_read_message").attr("is_on", "off");
        $(".can_guest_read_message").attr("src", "../../public/img/msg/icon_switch_off.png");
        canRead = false;
    } else {
        $(".can_guest_read_message").attr("is_on", "on");
        $(".can_guest_read_message").attr("src", "../../public/img/msg/icon_switch_on.png");
        canRead = true;
    }

    var values = {
        type : ApiGroupUpdateType.ApiGroupUpdateCanGuestReadMessage,
        writeType:DataWriteType.WriteUpdate,
        canGuestReadMessage :canRead,
    }
    updateGroupProfile(groupId, values);
});
//update group introduce
$(document).on("click", ".save_group_introduce", function () {
    var groupId = localStorage.getItem(chatSessionIdKey);
    var groupDesc = $(".group-introduce").val();

    var isMarkDown = $(".mark_down").attr("is_on");
    var type = isMarkDown == "on" ? GroupDescriptionType.GroupDescriptionMarkdown : GroupDescriptionType.GroupDescriptionText;
    var values = {
        type : ApiGroupUpdateType.ApiGroupUpdateDescription,
        writeType:DataWriteType.WriteUpdate,
        description : {
            type: type,
            body: groupDesc
        }
    }
    updateGroupProfile(groupId, values);
});


$(document).on("click", ".save-permission-join", function () {
    var groupId = localStorage.getItem(chatSessionIdKey);

    var permissionJoin = $(".permission-join-select").attr("permissionJoin");
    var values = {
        type : ApiGroupUpdateType.ApiGroupUpdatePermissionJoin,
        writeType:DataWriteType.WriteUpdate,
        permissionJoin : permissionJoin,
    };
    removeWindow($("#permission-join"));
    updateGroupProfile(groupId, values);
});

//set group  admin
$(document).on("click", "#set-admin", function () {
    var groupId = localStorage.getItem(chatSessionIdKey);
    var node = $(this)[0].parentNode;
    var userId = $(node).attr("userId");
    var adminUserIds = [];
    ////追加操作
    var tip = $.i18n.map['setAdminJsTip'] != undefined ? $.i18n.map['setAdminJsTip']: "设置管理员";
    if(confirm(tip)) {
        adminUserIds.push(userId);
        var values = {
            type : ApiGroupUpdateType.ApiGroupUpdateAdmin,
            writeType:DataWriteType.WriteAdd,
            adminUserIds : adminUserIds,
        }
        updateGroupProfile(groupId, values);
        removeWindow($("#group-user-menu"));
    }
});

//remove group admin
$(document).on("click", "#remove-admin", function () {
    var groupId = localStorage.getItem(chatSessionIdKey);
    var node = $(this)[0].parentNode;
    var userId = $(node).attr("userId");
    var adminUserIds = [];
    ////追加操作
    var tip = $.i18n.map['removeAdminJsTip'] != undefined ? $.i18n.map['removeAdminJsTip']: "移除管理员";
    if(confirm(tip)) {
        adminUserIds.push(userId);
        var values = {
            type : ApiGroupUpdateType.ApiGroupUpdateAdmin,
            writeType:DataWriteType.WriteDel,
            adminUserIds : adminUserIds,
        }
        updateGroupProfile(groupId, values);
        removeWindow($("#group-user-menu"));
    }
});

//update group mute
$(document).on("click", ".group_mute", function () {
    var groupId = localStorage.getItem(chatSessionIdKey);
    var mute = $(".group_mute").attr("is_on");

    clearRoomUnreadMsgNum(groupId);

    if(mute == "on") {
        $(".group_mute").attr("is_on", "off");
        $(".group_mute").attr("src", "../../public/img/msg/icon_switch_off.png");
        mute = false;
    } else {
        $(".group_mute").attr("is_on", "on");
        $(".group_mute").attr("src", "../../public/img/msg/icon_switch_on.png");
        mute = true;
    }

    var values = {
        type : ApiGroupUpdateType.ApiGroupUpdateIsMute,
        writeType:DataWriteType.WriteUpdate,
        isMute :mute,
    }
    updateGroupProfile(groupId, values);
});

// update group name
function updateGroupNameName(event)
{
    if(checkIsEnterBack(event) == false) {
        return;
    }

    var groupName = $("#groupName").val();
    var groupId = localStorage.getItem(chatSessionIdKey);

    if(groupName.length >10 || groupName.length < 1) {
        var tip = $.i18n.map['createGroupNameTip'] != undefined ? $.i18n.map['createGroupNameTip']: "群组名称长度限制1-10";
        alert(tip);
        return;
    }

    var values = {
        type : ApiGroupUpdateType.ApiGroupUpdateName,
        writeType:DataWriteType.WriteUpdate,
        name :groupName,
    }
    updateGroupProfile(groupId, values);

    var html = template("tpl-group-name-div", {
        groupName:groupName,
        editor:0
    });
    $("#groupName")[0].parentNode.replaceChild($(html)[0], $("#groupName")[0]);
}

//click group name in group profile right body
$(document).on("click", ".groupName",function () {
    var groupName = $(this).html();
    var html = template("tpl-group-name-div", {
        groupName:groupName,
        editor:1
    });
    $(this)[0].parentNode.replaceChild($(html)[0], $(this)[0]);
});

//---------------------------------api.group.quit api.group.delete-------------------------------------------

$(document).on("click", ".quit-group", function () {
    var tip = $.i18n.map['quitGroupJsTip'] != undefined ? $.i18n.map['quitGroupJsTip']: "退出群组?";

    if(confirm(tip)) {
        var groupId = localStorage.getItem(chatSessionIdKey);
        var action = "api.group.quit";
        var reqData = {
            "groupId": groupId
        };
        handleClientSendRequest(action, reqData, handleDeleteOrQuitGroup);
    }
});

//---------------------------------api.group.delete-------------------------------------------

function handleDeleteOrQuitGroup() {
    $(".see_group_profile").attr("is_show_profile", 0);
    $(".right-body-sidebar").hide();
}

$(document).on("click", ".delete-group", function () {
    var tip = $.i18n.map['disbandGroupJsTip'] != undefined ? $.i18n.map['disbandGroupJsTip']: "解散群?";
    if(confirm(tip)) {
        var groupId = localStorage.getItem(chatSessionIdKey);
        var action = "api.group.delete";
        var reqData = {
            "groupId": groupId
        };
        handleClientSendRequest(action, reqData, handleDeleteOrQuitGroup());
    }
});



//-------------------------------*******Friend*******----------------------------------------------

//---------------------------------------api.friend.list----------------------------------------------
// friend operation -- api.friend.list - display apply friend num
function displayApplyFriendNum()
{
    if(!judgeDefaultChat()) {
        return ;
    }
    try{
        var friendListNum = localStorage.getItem(applyFriendListNumKey);
        if(friendListNum > 0 && friendListNum != undefined) {
            $(".apply_friend_num")[0].style.display = "block";
            $(".apply_friend_num").html(friendListNum);
        } else {
            $(".apply_friend_list_num")[0].style.display = "none";
            $(".apply_friend_num")[0].style.display = "none";
        }
    }catch (error) {
        // console.log(error);
    }
}
// operation apply friend list num
function setFriendListTip(count)
{
    localStorage.setItem(applyFriendListNumKey, count);
}

function deleteFriendListTip()
{
    var count = localStorage.getItem(applyFriendListNumKey) ? Number(localStorage.getItem(applyFriendListNumKey)) : 0;
    count = (count-1>0) ? (count-1) : 0;
    localStorage.setItem(applyFriendListNumKey, count);
    displayApplyFriendNum();
}

// friend operation -- api.friend.list
function getFriendList(callback)
{
    var action = "api.friend.list";
    var reqData = {
        "offset" : friendOffset,
        "count"  : defaultCountKey,
    }
    handleClientSendRequest(action, reqData, callback);
}

// friend operation -- api.friend.list - append html
function  appendFriendListHtml(results)
{
    if(results == undefined || !results.hasOwnProperty("friends")) {
        return ;
    }
    var u2List = results.friends;
    if(u2List) {
        friendOffset = Number(friendOffset + defaultCountKey);
        var u2Length = u2List.length;
        for(i=0; i<u2Length; i++) {
            var u2 = u2List[i].profile;
            var html = template("tpl-friend-contact", {
                userId : u2.userId,
                nickname: u2.nickname ? u2.nickname : defaultUserName,
            });
            html = handleHtmlLanguage(html);
            $(".friend-list-contact-row").append(html);
            getNotMsgImg(u2.userId, u2.avatar);
        }
        var friendsDivHeight = $(".left-body-friends")[0].clientHeight;
        var friendToolsHeight = $(".friend-tools")[0].clientHeight;
        $(".friend-list-contact-row")[0].style.height = Number(friendsDivHeight-friendToolsHeight)+"px";
    }
}

// friend operation -- api.friend.list - init html
function initFriendList(results)
{
    $(".friend-list-contact-row").html("");
    if(results != undefined && results.hasOwnProperty("friends")) {
        appendFriendListHtml(results);
    }
    displayApplyFriendNum();
}

// friend operation -- api.friend.list - scroll append html
$('.friend-list-contact-row').scroll(function(event){
    var pwLeft = $(".friend-list-contact-row")[0];
    var ch  = pwLeft.clientHeight;
    var sh = pwLeft.scrollHeight;
    var st = $('.friend-list-contact-row').scrollTop();
    console.log("st ===="+st);

    //文档的高度-视口的高度-滚动条的高度
    if((sh - ch - st) == 0){
        getFriendList(appendFriendListHtml);
    }
});



//---------------------------------------api.friend.profile----------------------------------------------

function getFriendProfileByClickChatSessionRow(jqElement)
{
    var userId = jqElement.attr("chat-session-id");
    if(userId == undefined) {
        return false;
    }

    $(".user-image-for-add").attr("class", "user-image-for-add");
    $(".user-image-for-add").attr("src", "../../public/img/msg/default_user.png");

    getFriendProfile(userId, true, handleGetFriendProfile);
    var nickname = $(".nickname_"+userId).html();
    var nickname = template("tpl-string", {
        string : nickname
    });
    $(".chatsession-title").html(nickname);

    localStorage.setItem(chatSessionIdKey, userId);
    localStorage.setItem(userId, U2_MSG);
    handleMsgRelation($(this), userId);
}

$(document).on("click", ".u2-profile", function () {
    getFriendProfileByClickChatSessionRow($(this));
});

//insert u2 room, when click user in friend lists
$(document).on("click", ".contact-row-u2-profile", function () {
    var userId = $(this).attr("chat-session-id");
    if(userId == undefined) {
        return false;
    }
    localStorage.setItem(chatSessionIdKey, userId);
    localStorage.setItem(userId, U2_MSG);
    $(".user-image-for-add").attr("class", "user-image-for-add");
    $(".user-image-for-add").attr("src", "../../public/img/msg/default_user.png");
    sendFriendProfileReq(userId);
    insertU2Room($(this), userId);
});

function getFriendProfile(userId, isForceSend, callback)
{
    var friendInfoReqKey = reqProfile + userId;
    var nowTimestamp = Date.parse(new Date());
    var reqProfileTime = sessionStorage.getItem(friendInfoReqKey);

    var userInfoKey = profileKey+userId;
    var userProfile = localStorage.getItem(userInfoKey);
    if(userProfile) {
        userProfile = JSON.parse(userProfile);
        var nowTimestamp = Date.parse(new Date());
        if(!userProfile.hasOwnProperty("nickname")) {
            userProfile['nickname'] = defaultUserName;
        }
        if ((nowTimestamp - userProfile['updateTime'] ) < ProfileTimeout && isForceSend == false) {
            return userProfile;
        }
    }
    if(reqProfileTime != false && reqProfileTime != null && reqProfileTime != undefined && (nowTimestamp-reqProfileTime<reqTimeout) && isForceSend == false) {
        return false;
    }

    if(callback == undefined) {
        callback = handleGetFriendProfile;
    }
    sessionStorage.setItem(friendInfoReqKey, nowTimestamp);
    sendFriendProfileReq(userId, callback);
    return userProfile;
}

function sendFriendProfileReq(userId, callback)
{
    var action = "api.friend.profile";
    var reqData = {
        "userId" : userId
    };
    handleClientSendRequest(action, reqData, callback);
}

function handleGetFriendProfile(result)
{

    if(result == undefined) {
        return;
    }
    var profile = result.profile;

    if(profile != undefined && profile["profile"]) {
        var userProfile = profile["profile"];

        sessionStorage.removeItem(reqProfile+userProfile["userId"]);

        var userProfilekey = profileKey + userProfile["userId"];
        userProfile['updateTime'] = Date.parse(new Date());
        localStorage.setItem(userProfilekey, JSON.stringify(userProfile));

        var muteKey = msgMuteKey + userProfile["userId"];
        var mute = profile.mute ? 1 : 0;
        localStorage.setItem(muteKey, mute);

        var relationKey = friendRelationKey + userProfile["userId"];
        var relation = profile.relation == undefined ? FriendRelation.FriendRelationInvalid : profile.relation;
        localStorage.setItem(relationKey, relation);

        displayProfile(userProfile.userId, U2_MSG);
    }
}

function insertU2Room(jqElement, userId)
{
    handleMsgRelation(jqElement, userId);
    var msg = {
        "fromUserId": token,
        "pointer": "78",
        "timeServer": Date.parse(new Date()),
        "roomType": "MessageRoomU2",
        "toUserId": userId,
        "type": "MessageText",
        "text": {
            "body": ""
        },
        "className": "u2-profile",
        "chatSessionId": userId,
    };
    msg = handleMsgInfo(msg);
    appendOrInsertRoomList(msg, true, false);
}

function displayProfile(profileId, profileType)
{
    var chatSessionId   = localStorage.getItem(chatSessionIdKey);
    if(profileId == chatSessionId) {
        displayCurrentProfile();
        return;
    }
   updateInfo(profileId, profileType);
}

function updateInfo(profileId, profileType)
{
    var name;
    var mute;
    if(profileType == U2_MSG) {
        var friendProfile = getFriendProfile(profileId, false, handleGetFriendProfile);
        name = friendProfile != false && friendProfile != null ? friendProfile.nickname : "";
        getNotMsgImg(friendProfile.userId, friendProfile.avatar);
    } else {
        var groupProfile = getGroupProfile(profileId);
        var groupName = groupProfile != false && groupProfile != null ? groupProfile.name : "";
        name = groupName;
    }

    var muteKey= msgMuteKey+profileId;
    mute = localStorage.getItem(muteKey);
    var name = template("tpl-string", {
        string : name
    });

    try{
        name = name.trim();
    }catch (error) {

    }
    var subName = name;
    if(name!=undefined && name.length>10) {
        subName = name.substr(0, 8) + "...";
    }
    $(".nickname_"+profileId).html(name);
    $(".chatsession-row .nickname_"+profileId).html(subName);

    try{
        if(mute>0) {
            $(".room-chatsession-mute_"+profileId)[0].style.display = "block";
        } else {
            $(".room-chatsession-mute_"+profileId)[0].style.display = "none";
        }
    }catch (error) {
    }
}


function displayCurrentProfile()
{
    try{
        var chatSessionId   = localStorage.getItem(chatSessionIdKey);
        var chatSessionType = localStorage.getItem(chatSessionId);

        var muteKey = msgMuteKey + chatSessionId;
        var mute = localStorage.getItem(muteKey);

        if(chatSessionType == U2_MSG) {
            $(".group-profile-desc")[0].style.visibility = "hidden";
            $(".user-profile-desc")[0].style.visibility = "visible";
            $(".user-profile-desc")[0].style.width = "100%";
            $(".invite_people")[0].style.visibility="hidden";
            $(".add_friend")[0].style.display="inline";
            $(".user-image-for-add").addClass("info-avatar-"+chatSessionId);

            var friendProfile = getFriendProfile(chatSessionId, false, handleGetFriendProfile);

            if(friendProfile) {
                var nickname = friendProfile.nickname;
                nickname = template("tpl-string", {
                    string : nickname
                });
                $(".chatsession-title").html(nickname);
                $(".user-desc-body").html(nickname);
            } else {
                $(".chatsession-title").html("");
                $(".user-desc-body").html("");
            }
            $(".chat_session_id_"+chatSessionId).addClass("chatsession-row-active");
            var relationKey = friendRelationKey + chatSessionId;
            var relation = localStorage.getItem(relationKey) ;
            if(relation == FriendRelation.FriendRelationFollow) {
                $(".delete-friend")[0].style.display = "flex";
                $(".add-friend")[0].style.display = "none";
                $(".add_friend")[0].style.display = "none";
                $(".edit-remark")[0].style.display = "flex";
                $(".mute-friend")[0].style.display = "flex";
            } else {
                $(".delete-friend")[0].style.display = "none";
                $(".add-friend")[0].style.display = "flex";
                $(".edit-remark")[0].style.display = "none";
                $(".mute-friend")[0].style.display = "none";
                $(".add_friend")[0].style.display = "inline";
            }

            getNotMsgImg(friendProfile.userId, friendProfile.avatar);

            if(mute == 1) {
                $(".friend_mute").attr("src", "../../public/img/msg/icon_switch_on.png");
                $(".friend_mute").attr("is_on", "on");
            } else {
                $(".friend_mute").attr("src", "../../public/img/msg/icon_switch_off.png");
                $(".friend_mute").attr("is_on", "off");
            }

        } else if(chatSessionType == GROUP_MSG ) {
            $(".group-profile-desc")[0].style.visibility = "visible";
            $(".group-profile-desc")[0].style.width = "100%";
            $(".user-profile-desc")[0].style.visibility = "hidden";
            $(".invite_people")[0].style.visibility="visible";
            $(".add_friend")[0].style.display = "none";

            var groupProfile = getGroupProfile(chatSessionId);
            getNotMsgImg(groupProfile.id, groupProfile.avatar);

            if(groupProfile != false && groupProfile != null) {
                var groupName = groupProfile.name
                groupName = template("tpl-string", {
                    string : groupName
                });
                $(".chatsession-title").html(groupName);
                $(".nickname_"+groupProfile.id).html(groupName);
                $(".groupName").html(groupName);
            }

            $("#share_group").removeClass();
            $("#share_group").addClass("info-avatar-"+groupProfile.id);

            $(".group-desc-body").html("");

            try{
                var descBody = "";
                if(groupProfile!=false && groupProfile!= null && groupProfile.hasOwnProperty("description")) {
                    var descBody = groupProfile.description["body"];
                    if(descBody != undefined && groupProfile.description['type'] == GroupDescriptionType.GroupDescriptionMarkdown) {
                        var md = window.markdownit();
                        descBody = md.render(descBody);
                    } else {

                        if(descBody == null || descBody == undefined || descBody.length<1 ) {
                            descBody = "点击填写群介绍，让大家更了解你的群～";
                        }
                        descBody = template("tpl-string", {
                            string:descBody
                        });
                    }
                    $(".group-desc-body").html(descBody);
                } else {
                    if(descBody.length<1) {
                        descBody = "点击填写群介绍，让大家更了解你的群～";
                    }
                    descBody = template("tpl-string", {
                        string:descBody
                    });
                }
            }catch (error) {
                console.log(error.message)
            }
            getGroupMembers(groupProfile.id, 0, 18, displayGroupMemberForGroupInfo);

            try{
                var permissionJoin = groupProfile.permissionJoin;
                var memberType = groupProfile != false && groupProfile != null ? groupProfile.memberType : GroupMemberType.GroupMemberGuest ;
                switch (memberType) {
                    case GroupMemberType.GroupMemberOwner:
                        $('.invite_people')[0].style.display = "inline";
                        $('.quit-group')[0].style.display = "none";
                        $('.delete-group')[0].style.display = "flex";
                        $('.permission-join')[0].style.display = "flex";
                        $(".can-guest-read-message")[0].style.display = "flex";
                        $('.remove_member')[0].style.display = "flex";
                        $(".mute-group")[0].style.display = "flex";
                        $(".group-introduce").attr("disabled", false);
                        $(".save_group_introduce")[0].style.display = "flex";
                        $(".mark-down-group")[0].style.display = "flex";
                        break;
                    case GroupMemberType.GroupMemberAdmin:
                        $('.invite_people')[0].style.display = "inline";
                        $('.quit-group')[0].style.display = "flex";
                        $('.delete-group')[0].style.display = "none";
                        $('.remove_member')[0].style.display = "none";
                        $('.permission-join')[0].style.display = "flex";
                        $(".can-guest-read-message")[0].style.display = "none";
                        $(".mute-group")[0].style.display = "flex";
                        $(".group-introduce").attr("disabled", "disabled");
                        $(".save_group_introduce")[0].style.display = "none";
                        $(".mark-down-group")[0].style.display = "none";
                        $('.permission-join')[0].style.display = "none";
                        break;
                    case GroupMemberType.GroupMemberNormal:
                        if(permissionJoin == GroupJoinPermissionType.GroupJoinPermissionMember
                            || permissionJoin == GroupJoinPermissionType.GroupJoinPermissionPublic){
                            $('.invite_people')[0].style.display = "inline";
                        } else {
                            $('.invite_people')[0].style.display = "none";
                        }

                        $('.permission-join')[0].style.display = "none";
                        $('.quit-group')[0].style.display = "flex";
                        $('.delete-group')[0].style.display = "none";
                        $('.remove_member')[0].style.display = "none";
                        $(".can-guest-read-message")[0].style.display = "none";
                        $(".mute-group")[0].style.display = "flex";
                        $(".group-introduce").attr("disabled", "disabled");
                        $(".save_group_introduce")[0].style.display = "none";
                        $(".mark-down-group")[0].style.display = "none";
                        break;
                    case GroupMemberType.GroupMemberGuest:
                        $('.quit-group')[0].style.display = "none";
                        $('.delete-group')[0].style.display = "none";
                        $('.remove_member')[0].style.display = "none";
                        $('.permission-join')[0].style.display = "none";
                        $(".can-guest-read-message")[0].style.display = "none";
                        $(".mute-group")[0].style.display = "none";
                        $(".group-introduce").attr("disabled", "disabled");
                        $(".save_group_introduce")[0].style.display = "none";
                        $(".mark-down-group")[0].style.display = "none";
                        break;
                }

            } catch (error) {

            }

            if(mute == 1) {
                $(".group_mute").attr("src", "../../public/img/msg/icon_switch_on.png");
                $(".group_mute").attr("is_on", "on");
                $(".room-chatsession-mute_"+groupProfile.id)[0].style.display = "block";
            } else {
                $(".group_mute").attr("src", "../../public/img/msg/icon_switch_off.png");
                $(".group_mute").attr("is_on", "off");
                $(".room-chatsession-mute_"+groupProfile.id)[0].style.display = "none";
            }

            var canGuestReadMsg = groupProfile != false && groupProfile != null ? groupProfile.canGuestReadMessage : 0;

            if(canGuestReadMsg == 1) {
                $(".can_guest_read_message").attr("src", "../../public/img/msg/icon_switch_on.png");
                $(".can_guest_read_message").attr("is_on", "on");
            } else {
                $(".can_guest_read_message").attr("src", "../../public/img/msg/icon_switch_off.png");
                $(".can_guest_read_message").attr("is_on", "off");
            }

        }
        $("."+chatSessionId).addClass("chatsession-row-active");
        updateInfo(chatSessionId, chatSessionType);
        displayRightPage(DISPLAY_CHAT);
    }catch (error){
        // console.log(error.message)
    }
}


$(document).mouseup(function(e){
    var targetId = e.target.id;
    var targetClassName = e.target.className;

    if(targetId == "wrapper-mask") {
        var wrapperMask = document.getElementById("wrapper-mask");
        var length = wrapperMask.children.length;
        var i;
        for(i=0;i<length; i++) {
            var node  = wrapperMask.children[i];
            node.remove();
            addTemplate(node);
        }
        wrapperMask.style.visibility = "hidden";
    }
    ////隐藏群组点击头像之后的弹出菜单
    if(targetClassName != "group-user-img" && targetClassName != "item p-2") {
        hideGroupUserMenu();
    }

    if(targetClassName != "emotion-item") {
        document.getElementById("emojies").style.display = "none";
    }
    if(targetId != "selfAvatarUploadDiv" && targetId != "selfNickname" && targetId != "logout" && targetId != "logout-span"
        && targetId != "self-qrcode" && targetId != "user-image-upload" && targetId != "user-img-carmera"
        &&targetClassName != "nickNameDiv" && targetId !="selfQrcodeDiv" && targetId !="selfQrcodeCanvas" && targetId != "selfQrcode"
        && targetClassName != "self-qrcode") {
        $("#selfInfo").remove();
    }
});


function hideGroupUserMenu()
{
    var groupUserMenu = document.getElementById("group-user-menu");
    if(groupUserMenu) {
        groupUserMenu.remove();
        addTemplate(groupUserMenu);
    }
}

$(document).on("click", ".edit-remark", function () {
    var userId = localStorage.getItem(chatSessionIdKey);
    $("#edit-remark").attr("userId", userId);
    var userProfile = getFriendProfile(userId, false, handleGetFriendProfile);
    if(userProfile) {
        $(".remark_name").val(userProfile['nickname']);
    }
    showWindow($('#edit-remark'));
});

/// update group Profile
$(document).on("click", ".permission-join", function () {
    var groupId = localStorage.getItem(chatSessionIdKey);
    var currentGroupProfileJson = localStorage.getItem(profileKey+groupId);
    var currentGroupProfile  = JSON.parse(currentGroupProfileJson);
    var permissionJoin = currentGroupProfile.permissionJoin;

    var imgDivs = $(".imgDiv");
    var length = imgDivs.length;
    for(i=0;i<length;i++){
        var node = imgDivs[i];
        if($(node).attr("permissionJoin") == permissionJoin) {
            $(node).attr("src",  "../../public/img/msg/member_select.png");
            $(node).addClass("permission-join-select");
        } else  {
            $(node).attr("src",  "../../public/img/msg/member_unselect.png");
            $(node).removeClass("permission-join-select");
        }
    }

    showWindow($("#permission-join"));
});

$(document).on("click", ".mark_down", function () {
    var isMarkDown = $(".mark_down").attr("is_on");
    if(isMarkDown == "on") {
        $(".mark_down").attr("is_on", "off");
        $(".mark_down").attr("src", "../../public/img/msg/icon_switch_off.png");
    } else {
        $(".mark_down").attr("is_on", "on");
        $(".mark_down").attr("src", "../../public/img/msg/icon_switch_on.png");
    }
});

$(document).on("click", ".imgDiv", function () {
    var imgDivs = $(".imgDiv");
    var length = imgDivs.length;
    for(i=0;i<length;i++){
        var node = imgDivs[i];
        $(node).attr("src", "../../public/img/msg/member_unselect.png");
        $(node).removeClass("permission-join-select");
    }
    $(this).attr("src",  "../../public/img/msg/member_select.png");
    $(this).addClass("permission-join-select");
});


//添加好友
$(document).on("click", ".add-friend-btn", function(){
    var userId = localStorage.getItem(chatSessionIdKey);
    $("#add-friend-div").attr("userId", userId);
    sendFriendProfileReq(userId, displayAddFriend);
});

$(document).on("click", "#add-friend", function () {
    var node = $(this)[0].parentNode;
    var userId = $(node).attr("userId");
    sendFriendProfileReq(userId, displayAddFriend);
});

function displayAddFriend(result)
{
    handleGetFriendProfile(result);
    if(result == undefined) {
        return;
    }
    var profile = result.profile;

    if(profile != undefined && profile["profile"]) {
        var friendProfile = profile["profile"];
        $("#add-friend-div").attr("userId", friendProfile.userId);
        var html = template("tpl-add-friend-div", {
            nickname: friendProfile.nickname,
            userId : friendProfile.userId,
        });
        $("#add-friend-div").html(html);
        getNotMsgImg(friendProfile.userId, friendProfile.avatar);
        showWindow($('#add-friend-div'));
    }
}



////好友申请

applyFriendListOffset = 0;

$(document).on("click", ".apply-friend-list", function () {
    addActiveForPwContactRow($(this));
    applyFriendListOffset = 0;
    getFriendApplyList();
});

$(document).on("click", ".search-user", function () {
    addActiveForPwContactRow($(this));
    var html = template("tpl-search-user-div", {});
    html = handleHtmlLanguage(html);
    $("#search-user-div").html(html);
    showWindow($("#search-user-div"));
});

function getFriendApplyList()
{
    if(!judgeDefaultChat()) {
        return ;
    }
    var action = "api.friend.applyList";
    var reqData = {
        "offset" : 0,
        "count" : defaultCountKey,
    }
    handleClientSendRequest(action, reqData, handleApplyFriendList)
}

$(function () {
    if(!judgeDefaultChat()) {
        return ;
    }
    $(".friend-right-body").scroll(function () {
        var pwLeft = $(".friend-right-body")[0];
        var ch  = pwLeft.clientHeight;
        var sh = pwLeft.scrollHeight;
        var st = $('.friend-right-body').scrollTop();

        ////文档的高度-视口的高度-滚动条的高度
        if((sh - ch - st) == 0){
            var action = "api.friend.applyList";
            var reqData = {
                "offset" : applyFriendListOffset,
                "count" : defaultCountKey,
            }
            handleClientSendRequest(action, reqData, getApplyFriendListHtml);
        }
    });
});


function handleApplyFriendList(results)
{
    $(".friend-right-body").html("");
    getApplyFriendListHtml(results);
    var data = $(".l-sb-item-active").attr("data");
    if(data == "friend") {
        displayRightPage(DISPLAY_APPLY_FRIEND_LIST);
    }
    displayRoomListMsgUnReadNum();

}

function getApplyFriendListHtml(results)
{
    var lists = results.list;
    var html = "";
    setFriendListTip(results.totalCount);
    if(lists) {
        applyFriendListOffset = Number(applyFriendListOffset + defaultCountKey);
        var length = lists.length;
        for (i = 0; i < length; i++) {
            var applyInfo = lists[i];
            var user = applyInfo.public;
            html = template("tpl-apply-friend-info", {
                greetings : applyInfo.greetings,
                userId : user.userId,
                nickname : user.hasOwnProperty('nickname') ? user.nickname : defaultUserName
            });
            html = handleHtmlLanguage(html);
            $(".friend-right-body").append(html);
            getNotMsgImg(user.userId, user.avatar)
        }
    }
}

function handleHtmlLanguage(html)
{
    $(html).find("[data-local-value]").each(function () {
        var changeHtmlValue = $(this).attr("data-local-value");
        var valueHtml = $(this).html();
        var newValueHtml = $.i18n.map[changeHtmlValue];
        if(newValueHtml != undefined && newValueHtml != "" && newValueHtml != false) {
            html = html.replace(valueHtml, newValueHtml);
        }
    });

    $(html).find("[data-local-placeholder]").each(function () {
        var placeholderValue = $(this).attr("data-local-placeholder");
        var placeholder = $(this).attr("placeholder");
        var newPlaceholder = $.i18n.map[placeholderValue];
        if(newPlaceholder != undefined && newPlaceholder != false && newPlaceholder != "") {
            html = html.replace(placeholder, newPlaceholder);
        }
    });

    return html;
}



//-----------------------------------api.friend.update---------------------------------------------------------


function friendUpdate(userId, value)
{
    var values = new Array();
    values.push(value);
    var reqData = {
        userId : userId,
        values : values
    };
    var action = 'api.friend.update';
    handleClientSendRequest(action, reqData, handleGetFriendProfile);
}

//update friend mute
$(document).on("click", ".friend_mute", function () {
    var userId = localStorage.getItem(chatSessionIdKey);
    var mute = $(".friend_mute").attr("is_on");
    clearRoomUnreadMsgNum(userId);
    if(mute == "on") {
        $(".friend_mute").attr("is_on", "off");
        $(".friend_mute").attr("src", "../../public/img/msg/icon_switch_off.png");
        mute = false;
    } else {
        $(".friend_mute").attr("is_on", "on");
        $(".friend_mute").attr("src", "../../public/img/msg/icon_switch_on.png");
        mute = true;
    }
    var value = {
        type :ApiFriendUpdateType.ApiFriendUpdateIsMute,
        isMute : mute,
    }
    friendUpdate(userId, value);
});

//update friend remark name
$(document).on("click", ".edit_remark_for_friend", function () {
    editFriendRemark();
});

function editFriendRemarkByKeyDown(event) {
    if(!checkIsEnterBack(event)) {
        return false;
    }
    editFriendRemark();
}


function editFriendRemark()
{
    var remarkName = $(".remark_name").val();
    var userId = $("#edit-remark").attr("userId");
    var value = {
        type :ApiFriendUpdateType.ApiFriendUpdateRemark,
        remark : remarkName,
    }
    removeWindow($("#edit-remark"));
    friendUpdate(userId, value);
}



//-------------------------------------self qrcode-------------------------------------------------------
////展示个人消息
function displaySelfInfo()
{
    var html = template("tpl-self-info", {
        userId:token,
        nickname:nickname,
        loginName:loginName,
    });
    html = handleHtmlLanguage(html);
    $(".wrapper").append(html);
    getNotMsgImg(token, avatar);
}

$(document).on("click", ".selfInfo", function () {
    displaySelfInfo();
});

$(".selfInfo").mouseover(function(){
    displaySelfInfo();
}).mouseout(function () {

});


$(document).on("click", "#self-qrcode", function () {
    getSelfQrcode();
});

function getSelfQrcode() {
    $("#selfQrcodeDiv")[0].style.display = 'block';
    $("#selfInfoDiv")[0].style.display = 'none';

    $("#selfQrcodeCanvas").html("");
    var src = $(".selfInfo").attr("src");
    var urlLink = changeZalySchemeToDuckChat(token, "u");
    $("#selfQrcodeCanvas").attr("urlLink", urlLink);
    generateQrcode($('#selfQrcodeCanvas'), urlLink, src, true , "self");
}

//-------------------------------------api.user.update-------------------------------------------------------

function updateSelfNickName(event)
{
    if(checkIsEnterBack(event) == false) {
        return;
    }
    var nickname = $(".nickname").val();
    if(nickname.length > 16) {
        alert("长度16个字符");
        return;
    }
    var values = new Array();
    var value = {
        type : "ApiUserUpdateNickname",
        nickname : nickname,
    };
    values.push(value);
    updateUserInfo(values);
}

function updateUserInfo(values)
{
    var reqData = {
        values : values
    };
    var action = "api.user.update";
    handleClientSendRequest(action, reqData, handleUpdateUserInfo);
}

function handleUpdateUserInfo(results)
{
    window.location.reload();
}

$(document).on("click", ".nickNameDiv",function () {
    var html = template("tpl-nickname-div", {
        nickname:nickname
    });
    $(this)[0].parentNode.replaceChild($(html)[0], $(this)[0]);
});


//------------------------------------api.friend.delete--------------------------------------------------------

$(document).on("click", ".delete-friend", function () {
    var tip = $.i18n.map['deleteFriendJsTip'] != undefined ? $.i18n.map['deleteFriendJsTip']: "确定要删除好友么?";
    if(confirm(tip)){
        var userId = localStorage.getItem(chatSessionIdKey);
        var action = "api.friend.delete";
        var reqData = {
            toUserId : userId,
        };
        handleClientSendRequest(action, reqData, handleFriendDelete(userId))
    };
});

function handleFriendDelete(userId)
{
    var relation = friendRelationKey+userId;
    localStorage.setItem(relation, FriendRelation.FriendRelationFollowForWeb);
    displayCurrentProfile();
}


$(document).on("click", "#selfQrcode", function () {
    downloadImgFormQrcode("selfQrcode");
});





$(document).on("click", ".web-msg-click", function(){
    var url = $(this).attr("src-data");
    window.open(url);
});



//---------------------------------------api.friend.search------------------------------------------------
///解决回车和失去焦点冲突
var isSearchUser=false;
function searchUserByKeyDown(event)
{
    if(checkIsEnterBack(event) == false) {
        return;
    }
    isSearchUser = true;
    searchUser();
}

function searchUserByOnBlur() {
    if(isSearchUser == true) {
        isSearchUser = false;
        return;
    }
    searchUser();
}

function searchUser() {
    var searchValue = $(".search-user-input").val();
    if(searchValue.length<1) {
        return;
    }
    var action = "api.friend.search";
    var reqData = {
        keywords:searchValue,
        offset:0,
        count:defaultCountKey
    };
    handleClientSendRequest(action, reqData, handleSearchUser);
    $(".search-user-content").html('');
}

function handleSearchUser(results)
{
    if(results.hasOwnProperty("friends")) {
        var friends = results.friends;
        var friendsLength = friends.length;
        for(var i=0; i<friendsLength; i++) {
            var friendProfile = friends[i].profile;
            var html = template("tpl-search-user-info", {
                nickname:friendProfile.nickname,
                userId:friendProfile.userId,
                token:token
            });
            $(".search-user-content").append(html);
            getNotMsgImg(friendProfile.userId, friendProfile.avatar);
        }
    } else {
        var html = template("tpl-search-user-info-void", {});
        $(".search-user-content").append(html);
    }
}

//---------------------------------------api.friend.apply------------------------------------------------
function handleFriendApplyReq(type)
{
    if(type == errorFriendIsKey) {
        hanleAddFriendForFriendIs(friendApplyUserId);
        removeWindow($("#search-user-div"));
        return;
    }
}

function hanleAddFriendForFriendIs(friendApplyUserId)
{
    localStorage.setItem(chatSessionIdKey, friendApplyUserId);
    localStorage.setItem(friendApplyUserId, U2_MSG);
    insertU2Room(undefined, friendApplyUserId);
    sendFriendProfileReq(friendApplyUserId, handleGetFriendProfile);
}

// send friend apply by search
$(document).on("click", ".search-add-friend-btn", function () {
    var userId = $(this).attr("userId");
    friendApplyUserId = userId;
    sendFriendApplyReq(userId, "", handleFriendApplyReq);
    $(this).attr("disabled", "disabled");
    $(this)[0].style.backgroundColor = "#cccccc";
});

// send friend apply by click add friend
var friendApplyUserId ;
function sendFriendApplyReq(userId, greetings, callback)
{
    friendApplyUserId = userId;
    var action = "api.friend.apply";
    var reqData  = {
        "toUserId" : userId,
        "greetings" : greetings,
    };
    handleClientSendRequest(action, reqData, callback)
}


function handleApplyFriend(type)
{
    removeWindow($("#add-friend-div"));
    if(type == errorFriendIsKey) {
        hanleAddFriendForFriendIs(friendApplyUserId);
    }
}

function applyFriend() {
    var userId = $("#add-friend-div").attr("userId");
    var greetings = $(".apply-friend-reason").val();
    sendFriendApplyReq(userId, greetings, handleApplyFriend);
}

$(document).on("click", ".apply-friend", function () {
    $(this)[0].style.disabled = "disabled";
    applyFriend();
});

function addFriendByKeyDown(event)
{
    if(checkIsEnterBack(event)) {
        applyFriend();
    }
}


function closeMaskDiv(str)
{
    removeWindow($(str));
}
//---------------------------------------api.friend.accept------------------------------------------------


function handleFriendApplyAccept(jqElement)
{
    jqElement[0].parentNode.parentNode.parentNode.parentNode.remove();
    deleteFriendListTip();
}


function friendApplyAccept(jqElement, agree)
{
    var userId = jqElement.attr("userId");
    var action = "api.friend.accept";
    var reqData = {
        applyUserId : userId,
        agree : agree
    };
    handleClientSendRequest(action, reqData, handleFriendApplyAccept(jqElement));
}
//refused apply
$(document).on("click", ".refused-apply", function () {
    var node =  $(this)[0].parentNode;
    var tip = $.i18n.map['refuseFriendJsTip'] != undefined ? $.i18n.map['refuseFriendJsTip']: "确定拒绝对方?";
    if(confirm(tip)) {
        friendApplyAccept($(node), false);
    }
});

//agreed apply
$(document).on("click", ".agreed-apply", function () {
    var node =  $(this)[0].parentNode;
    var tip = $.i18n.map['agreeFriendJsTip'] != undefined ? $.i18n.map['agreeFriendJsTip']: "确定同意对方的好友申请?";
    if(confirm(tip)) {
        friendApplyAccept($(node), true);
    }
});



//---------------------------------------*******Msg*******-------------------------------------------------
//click chat room
$(document).on("click", ".chatsession-row", function(){
    var roomType = $(this).attr("roomType");
    var chatSessionId = $(this).attr("chat-session-id");
    updateRoomChatSessionContent(chatSessionId);
    if(roomType == U2_MSG) {
        getFriendProfileByClickChatSessionRow($(this));
    } else if(roomType == GROUP_MSG) {
        getGroupProfileByClickChatSessionRow($(this));
    }
});

// click msg image , open a new window
$(document).on("click", ".msg_img", function () {
    var src = $(this).attr("src");
    window.open(src);
});


//---------------------------------------http.file.downloadFile-------------------------------------------------
function downloadFile(elementObject) {
    var fileId = elementObject.attr("url");
    var msgId = elementObject.attr("msgId");
    var originName = elementObject.attr("originName");
    var currentRoom = localStorage.getItem(chatSessionIdKey);
    var isGroupMessage = localStorage.getItem(currentRoom) == GROUP_MSG ? 1 : 0;
    var requestUrl = downloadFileUrl +  "&fileId="+fileId + "&returnBase64=0&isGroupMessage="+isGroupMessage+"&messageId="+msgId+"&lang="+languageNum;
    requestUrl = encodeURI(requestUrl);
    var downloadLink = document.createElement('a');
    downloadLink.download = originName;
    downloadLink.href =requestUrl;
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

$(document).on("click", ".right_msg_file_div", function () {
    downloadFile($(this));

});

$(document).on("click", ".left_msg_file_div", function () {
    downloadFile($(this));
});

//---------------------------------------msg emotion-------------------------------------------------

$(document).on("click", ".emotions", function () {
    document.getElementById("emojies").style.display = "block";
});

$(document).on("click", ".emotion-item", function () {
    var  html = $(this).html();
    var htmls = $(".msg_content").val() + html;
    $(".msg_content").val(htmls);
});

//window 7 一下暂时不支持emotion
function checkOsVersion()
{
    var userAgent = navigator.userAgent;
    if(userAgent.indexOf("Windows") != -1 && ((userAgent.indexOf("Windows NT 5") != -1)
            || (userAgent.indexOf("Windows NT 6") != -1) || (userAgent.indexOf("Windows NT 7") != -1) )) {
        try{
            $(".emotions")[0].style.display = "none";
        }catch (error) {

        }
    }
}

//---------------------------------------msg dialog-------------------------------------------------

function handleMsgRelation(jqElement, chatSessionId)
{
    if(jqElement != undefined) {
        addActiveForPwContactRow(jqElement);
    }
    hideGroupUserMenu();
    getMsgFromRoom(chatSessionId);
    syncMsgForRoom();
    displayCurrentProfile();
}

function judgeDefaultChat()
{
    var chatType = localStorage.getItem(chatTypeKey);
    if(chatType != DefaultChat) {
        return false;
    }
    return true;
}

function displayRightPage(displayType)
{
    if(!judgeDefaultChat()) {
        return ;
    }
    try{
        switch (displayType){
            case DISPLAY_CHAT:
                var chatSessionId  = localStorage.getItem(chatSessionIdKey);
                var chatSessionRowLength = $(".chatsession-row").length;
                $(".msg-chat-dialog")[0].style.display = "block";
                if(chatSessionId && chatSessionRowLength>0) {
                    $(".chat-dialog")[0].style.display = "block";
                    $(".no-chat-dialog-div")[0].style.display = "none";
                } else {
                    $(".no-chat-dialog-div")[0].style.display = "block";
                    $(".chat-dialog")[0].style.display = "none";
                }
                $(".msg_content").focus()
                $(".friend-apply-dialog")[0].style.display = "none";
                checkOsVersion();
                break;
            case DISPLAY_APPLY_FRIEND_LIST:
                $(".msg-chat-dialog")[0].style.display = "none";
                $(".friend-apply-dialog")[0].style.display = "block";
                break;
        }
    }catch (error) {
        // console.log(error.message);
    }
}



$(".input-box").on("click",function () {
    $(".msg_content").focus()
});

function addActiveForPwContactRow(jqElement)
{
    var pwContactRows = $(".pw-contact-row");
    var length = pwContactRows.length;
    for(i=0;i<length;i++){
        var node = pwContactRows[i];
        $(node).removeClass("chatsession-row-active");
    }
    jqElement.addClass("chatsession-row-active");
}

$(document).on("click", ".chatsession-row", function (e) {
    addActiveForRoomList($(this));
});

function addActiveForRoomList(jqElement)
{
    var chatSessionRowNodes = $(".chatsession-row");
    var length = chatSessionRowNodes.length;
    var i;
    for(i=0;i<length;i++){
        var node = chatSessionRowNodes[i];
        $(node).removeClass("chatsession-row-active");
    }
    jqElement.addClass("chatsession-row-active");
}


//---------------------------------------send msg -------------------------------------------------

$(document).on("click", ".send_msg" , function(){
    sendMsgBySend();
});

//发送消息
function sendMsgBySend()
{
    var chatSessionId   = localStorage.getItem(chatSessionIdKey);
    var chatSessionType = localStorage.getItem(chatSessionId);
    var msgContent = $(".msg_content").val();
    var imgData = $("#msgImage img").attr("src");

    if(imgData) {
        uploadMsgImgFromCopy(imgData);
    }

    if(msgContent.length < 1) {
        return false;
    }

    if(msgContent.length > 1000) {
        alert("文本过长");
        return false;
    }
    $(".msg_content").val('');

    sendMsg(chatSessionId, chatSessionType, msgContent, MessageType.MessageText);
}

//粘贴图片
document.getElementById("msg_content").addEventListener('paste', function(event) {
    var imgFile = null;
    var idx;
    var items = event.clipboardData.items;
    if(items == undefined) {
        return;
    }
    for(var i=0,len=items.length; i<len; i++) {
        var item = items[i];
        if (item.kind == 'file' ||item.type.indexOf('image') > -1) {
            var blob = item.getAsFile();
            var reader = new FileReader();
            reader.onload = function(event) {
                var data = event.target.result;
                var img = new Image();
                img.src = data;
                img.onload =  function (ev) {
                    autoMsgImgSize(img, 400, 300);
                };
                document.getElementById("msgImage").style.display = "block";
                document.getElementById("msgImage").appendChild(img);
                return false;
            }; // data url!
            reader.readAsDataURL(blob);
        }
    }
});

document.onkeydown=function(e){
    var isIE = (document.all) ? true : false;
    var key;
    if(isIE) {
        key = window.event.keyCode;
    } else {
        key = e.which;
    }
    if(key ==8 || key == 46) {
        $("#msgImage").html("");
    }
    if(key == 13) {
        sendMsgBySend();
        e.preventDefault();
    }
};

function sortRoomList(jqElement)
{
    var chatSessionRows = $(".chatsession-row");
    var chatSessionRowsLength = chatSessionRows.length;
    var i;
    for(i=0; i<chatSessionRowsLength; i++) {
        var node = chatSessionRows[i];
        $(node).removeClass("chatsession-row-up");
    }

    jqElement.addClass("chatsession-row-up");

    var activeNode = $(".chatsession-row-up");
    var activeNum = 0;
    var i;
    for(i=0; i<chatSessionRowsLength; i++) {
        var node = chatSessionRows[i];
        if($(node).hasClass("chatsession-row-up")) {
            activeNum = i;
            if(activeNum != 0) {
                $(node).remove();
            }
        }
    }
    if(activeNum != 0) {
        $(activeNode).insertBefore($(".chatsession-row")[0]);
    }
}
