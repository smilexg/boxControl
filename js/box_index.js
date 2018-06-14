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
	console.log(11);
	aRelayCtrl.on('click', function(e){
		e.stopPropagation();
		gcy.device.msg("ok","_relay_"+this.title);
	});
}

//同步
gcy.device.sync = function(){
	var aRelaySync = $(".relay_sync,.button_sync");
	aRelaySync.on('click', function(e){
		var val="_relay_"+this.title;
		if($(this).hasClass("button_sync")){
			val="_button_"+this.title;
		}
		e.stopPropagation();
		gcy.device.msg("sync ok!",val);
	});
	//此处 同步两个 还是 出现一个框 一个一个同步?
}

//重命名
gcy.device.rename = function(){
	var aRelayRename = $(".relay_rename,.button_rename");
	var relay_num = 0;
	//重命名
	aRelayRename.on('click', function(e){
		e.stopPropagation();
		relay_num = this.title;
		$(".name_info_"+relay_num).hide();
		$(".input_rename_"+relay_num).show();
		
		$(".input_rename_"+relay_num).blur(function(){
			$(".name_info_"+relay_num).html($(".input_rename_"+relay_num).val());
			$(".name_info_"+relay_num).show();
			$(".input_rename_"+relay_num).hide();
		})
	});
	
	//重命名失去焦点时
//	$(".input_rename_"+relay_num).blur(function(){
//		$(".name_info_"+relay_num).show();
//		$(".input_rename_"+relay_num).hide();
//	})
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
			$(".to_be_added_ul").append($(this).removeClass("added").addClass("to_be_added"));
			
			//对li进行排序 
			var domlist = $('.to_be_added_ul');
			var item = domlist.find('.to_be_added');
		    var newList = Array.prototype.sort.call(item,function(a,b){
		        return ($(a).find('.paixu').html()-0) - ($(b).find('.paixu').html()-0)
		    });
	        $('.to_be_added_ul').append(newList);
		}
	});
}

//正则 替换json数据
String.prototype.temp1 = function(obj){
	return this.replace(/\$\w+\$/gi, function(matchs) {
	    var returns = obj[matchs.replace(/\$/g, "")];		
	    return (returns + "") == "undefined"? "": returns;
	});
}

String.prototype.temp2 = function(obj) {
	return this.replace(/\@\w+\@/gi, function(matchs) {
	    var returns = obj[matchs.replace(/\@/g, "")];		
	    return (returns + "") == "undefined"? "": returns;
	});
};

gcy.getInfo = {};

gcy.getInfo.boxInfo = function(){
	$.post('http://localhost:8080/boxctrl/getBoxInfo/21-1-1001',function(value){
		console.log(value);
		if (value[0].result == "success") {
			var htmlList = '';
		    var htmlTemp = $("div.div_title").html();
		    for(var i = 1; i < value.length; i++){
		    	htmlList += htmlTemp.temp1(value[i]);
		    }
		    $("div.div_title").html(htmlList);
		} else{
			$("div.div_title").html("暂无配电箱!");
		}
	});
}

gcy.getInfo.relayInfo = function(){
	$.post('http://localhost:8080/boxctrl/getRelayInfo/21',function(value){
		console.log(value);
		if (value[0].result == "success") {
		    var htmlTemp = $("div.relay_li").html();
		    for(var i = 1; i < value.length; i++){
		    	var htmlList = '';
		    	htmlList += htmlTemp.temp1(value[i]);
		    	$("div.div_jdq").append(htmlList);
		    	var relayOperaList = '';
		    	var relayOpera = $("div.relay_opera").html();
		    	for(var j = 0;j<value[i].relay_info.length;j++){
//		    		var relay_id = value[i].relay_info[j].relay_id;
		    		relayOperaList += relayOpera.temp2(value[i].relay_info[j]);
		    		$("ul.relay_ul_"+value[i].machine_num).html(relayOperaList);
		    	}
		    	
		    }
		} else{
			$("div.div_jdq").html("暂无继电器!");
		}
	});
}


gcy.getInfo.boxInfo();
gcy.getInfo.relayInfo();
//事件初始化
$(document).ready(function(){
	setTimeout(function () {
		gcy.tagClick();
		gcy.device.relayCtrl();
		gcy.device.sync();
		gcy.device.rename();
		gcy.device.sceneCtrl();
		gcy.scene.addComm();
    }, 0.1*1000);
	
});
