var gcy = {};

gcy.tagClick = function(){
	var labelRelayInfo = $("#relay_info > div.div_tag_p");
	var labelButtonInfo = $("#button_info > div.div_tag_aj");
	var divRelayInfo = $(".div_jdq");
	var divButtonInfo = $(".div_aj");
	
	//继电器
	labelRelayInfo.on('click', function(e){
		e.stopPropagation();
		divRelayInfo.show();
		divButtonInfo.hide();
	});
	
	//按键
	labelButtonInfo.on('click', function(e){
		e.stopPropagation();
		divRelayInfo.hide();
		divButtonInfo.show();
	});
}

//继电器相关
gcy.relay = {};

gcy.relay.msg = function(value,value2){
	console.log(value2);
	var spanSendMsg = $("span.send_msg"+value2);
	spanSendMsg.html(value);
	spanSendMsg.show();
	setTimeout(function () {
        spanSendMsg.hide();
    }, 0.5*1000);
}

//开关控制
gcy.relay.ctrl = function(){
	var aRelayCtrl = $(".relay_ctrl");
	
	aRelayCtrl.on('click', function(e){
		e.stopPropagation();
		gcy.relay.msg("ok","_relay");
	});
}

//同步
gcy.relay.sync = function(){
	var aRelaySync = $(".relay_sync,.button_sync");
	aRelaySync.on('click', function(e){
		var val="_relay";
		if($(this).hasClass("button_sync")){
			val="_button"
		}
		e.stopPropagation();
		gcy.relay.msg("sync ok!",val);
	});
	//此处 同步两个 还是 出现一个框 一个一个同步?
}

//重命名
gcy.relay.rename = function(){
	var aRelayRename = $(".relay_rename,.button_rename");
	var labelNameInfo = $(".name_info");
	var inputRename = $(".input_rename");
	
	//重命名
	aRelayRename.on('click', function(e){
		e.stopPropagation();
		labelNameInfo.hide();
		inputRename.show();
	});
	
	//重命名失去焦点时
	inputRename.blur(function(){
		labelNameInfo.show();
		inputRename.hide();
	})
}

//事件初始化
$(document).ready(function(){
	gcy.tagClick();
	gcy.relay.ctrl();
	gcy.relay.sync();
	gcy.relay.rename();
});
