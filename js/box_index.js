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
gcy.mask = {};
var divMask = $("body>div#mask");
if(divMask.length>0){
	gcy.mask.maskShow = function(){
		divMask.show();
	};
	
	gcy.mask.maskHide = function(){
		divMask.hide();
	};
}

//继电器相关
gcy.device = {};

gcy.device.msg = function(value,value2){
	console.log(value2);
	var spanSendMsg = $("span.send_msg"+value2);
	spanSendMsg.html(value);
	spanSendMsg.show();
	setTimeout(function () {
        spanSendMsg.hide();
    }, 0.5*1000);
}

//开关控制
gcy.device.relayCtrl = function(){
	var aRelayCtrl = $(".relay_ctrl");
	
	aRelayCtrl.on('click', function(e){
		e.stopPropagation();
		gcy.device.msg("ok","_relay");
	});
}

//同步
gcy.device.sync = function(){
	var aRelaySync = $(".relay_sync,.button_sync");
	aRelaySync.on('click', function(e){
		var val="_relay";
		if($(this).hasClass("button_sync")){
			val="_button"
		}
		e.stopPropagation();
		gcy.device.msg("sync ok!",val);
	});
	//此处 同步两个 还是 出现一个框 一个一个同步?
}

//重命名
gcy.device.rename = function(){
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

//场景配置
gcy.device.sceneCtrl = function(){
	var aSceneCtrl = $(".scene_ctrl");
	var divSetScene = $(".set_scene");
	
	//配置场景显示
	aSceneCtrl.on('click', function(e){
		e.stopPropagation();
		gcy.mask.maskShow();
		divSetScene.show();
	})
}

gcy.scene = {};
//场景添加命令
gcy.scene.addComm = function(){
	var liSceneComm = $(".scene_comm_li");
	
	liSceneComm.on('click', function(){
		if($(this).hasClass("to_be_added")){
			$(".added_ul").append($(this).removeClass("to_be_added").addClass("added"));	
		}else if($(this).hasClass("added")){
			console.log(this.title)
			if(this.title == "1"){
				$(".to_be_added_ul").append($(this).removeClass("added").addClass("to_be_added"));
			}else{
				$("."+(parseInt(this.title)-1)).after($(this).removeClass("added").addClass("to_be_added"));
			}//after
		}
	});
}

//事件初始化
$(document).ready(function(){
	gcy.tagClick();
	gcy.device.relayCtrl();
	gcy.device.sync();
	gcy.device.rename();
	gcy.device.sceneCtrl();
	gcy.scene.addComm();
});
