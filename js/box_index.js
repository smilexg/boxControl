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

//提示信息 500毫秒后自动隐藏
gcy.device.msg = function(value,suffix){
	var spanSendMsg = $("span.send_msg"+suffix);
	spanSendMsg.html(value);
	spanSendMsg.show();
	setTimeout(function () {
        spanSendMsg.hide();
    }, 0.5*1000);
}

//开关控制
gcy.device.relayCtrl = function(){
	var aRelayCtrl = $(".relay_ctrl");
	var relayType = 1;
	aRelayCtrl.on('click', function(e){
		e.stopPropagation();
		if($(this).hasClass('relay_close')){
			relayType = 0;
		}
		var title = this.title;
		$.post('http://localhost:8080/boxctrl/relayCtrl/'+$("#gzhId").val()+'-'+$("#codeId").val()+'-'+title+'-'+relayType,function(value){
			if (value[0].result == "0") {
				gcy.device.msg("发送成功!","_relay_"+title);
			}else if(value[0].result == "offLine"){
				gcy.device.msg("主机未联网!","_relay_"+title);
			}else{
				gcy.device.msg("发送失败!","_relay_"+title);
			}
		});
	});
}

//同步
gcy.device.sync = function(){
	var aRelaySync = $(".relay_sync");
	aRelaySync.on('click', function(e){
		e.stopPropagation();
		var title = this.title;
		$.post('http://localhost:8080/boxctrl/relaySync/'+$("#gzhId").val()+'-'+$("#codeId").val()+'-'+title,function(value){
			if (value[0].result == "0") {
				gcy.device.msg("同步成功!","_relay_"+title);
			}else if(value[0].result == "offLine"){
				gcy.device.msg("主机未联网!","_relay_"+title);
			}else{
				gcy.device.msg("同步失败!","_relay_"+title);
			}
		});
		
	});
}

//重命名
gcy.device.rename = function(){
	var aRelayRename = $(".relay_rename,.button_rename");
	var relay_id = 0;
	//重命名
	aRelayRename.on('click', function(e){
		e.stopPropagation();
		relay_id = this.title;
		$(".name_info_"+relay_id).hide();
		$(".input_rename_"+relay_id).show();
		
		//重命名失去焦点时  后期要改成  用完成按钮来完成改名操作 不用焦点事件
		$(".input_rename_"+relay_id).blur(function(){
			$.post('http://localhost:8080/boxctrl/relayRename/',{"relayId":relay_id,"relayName":$(".input_rename_" + relay_id).val()},function(value){
				if (value[0].result == "success") {
					$(".name_info_" + relay_id).html($(".input_rename_" + relay_id).val());
					$(".name_info_" + relay_id).show();
					$(".input_rename_" + relay_id).hide();
				}
			});
		})
	});
}

gcy.scene = {};

//场景配置
gcy.scene.sceneCtrl = function(){
	var aSceneCtrl = $(".scene_ctrl");
	var divSetScene = $(".set_scene");
	
	//配置场景显示
	aSceneCtrl.on('click', function(e){
		e.stopPropagation();
		$("#scene_cont_val").val("");
		$("#aj_cont_val").val(this.title);
		gcy.getInfo.relayContForScene(this.parentNode.parentNode.parentNode.title,this.title);
		gcy.getInfo.relayContForSceneAdded(this.parentNode.parentNode.parentNode.title,this.title);
		
		$(".scene_name").html(this.innerHTML);
		$(".scene_aj_name").html(this.parentNode.parentNode.querySelector("div.device_name > label").innerHTML);
		gcy.mask.maskShow();
		divSetScene.show();
		setTimeout(function () {
			gcy.scene.addComm();
	    }, 0.1*1000);
	});
	
	var operaClear = $(".opera_clear");
	var operaSave = $(".opera_save");
	
	operaClear.on('click', function(e){
		e.stopPropagation();
		gcy.mask.maskHide();
		divSetScene.hide();
	});
	
	operaSave.on('click', function(e){
		e.stopPropagation();
		
		var sceneContVal = $("#scene_cont_val").val();
		$.post('http://localhost:8080/boxctrl/sceneContSave/'+$("#aj_cont_val").val(),{"sceneCont":sceneContVal,},function(value){
			if (value[0].result == "success") {
			
			} else{
			
			}
		});
		gcy.mask.maskHide();
		divSetScene.hide();
	});
}

//场景添加命令
gcy.scene.addComm = function(){
	var liSceneComm = $(".scene_comm_li");
	liSceneComm.on('click', function(){
		if($(this).hasClass("to_be_added")){//待添加  -> 已添加
			$("#scene_cont_val").val($("#scene_cont_val").val()+this.title+";");
			$(".added_ul").append($(this).removeClass("to_be_added").addClass("added"));
		}else if($(this).hasClass("added")){//已添加  -> 待添加
			$(".to_be_added_ul").append($(this).removeClass("added").addClass("to_be_added"));
			$("#scene_cont_val").val($("#scene_cont_val").val().replace(this.title+";",''));
			
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

gcy.scene.sync = function(){
	var aButtonSync = $(".button_sync");
	aButtonSync.on('click', function(){
		var title = this.title;
		$.post('http://localhost:8080/boxctrl/ajSync/'+this.title,function(value){
			if (value[0].result == "0") {
		    	gcy.getInfo.sceneInfo();
				gcy.device.msg("同步成功!","_button_"+title);
			}else if(value[0].result == "offLine"){
				gcy.device.msg("主机未联网!","_button_"+title);
			}else{
				gcy.device.msg("同步失败!","_button_"+title);
			}
		});
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
		if (value[0].result == "success") {
			var htmlList = '';
		    var htmlTemp = $("div.div_title").html();
		    for(var i = 1; i < value.length; i++){
		    	htmlList += htmlTemp.temp1(value[i]);
		    }
		    $("div.div_title").html(htmlList);
		    gcy.getInfo.relayInfo();
		    gcy.getInfo.sceneInfo();
		} else{
			$("div.div_title").html("暂无配电箱!");
		}
	});
}

gcy.getInfo.relayInfo = function(){
	$.post('http://localhost:8080/boxctrl/getRelayInfo/21',function(value){
		if (value[0].result == "success") {
		    var htmlTemp = $("div.relay_li").html();
		    for(var i = 1; i < value.length; i++){
		    	var htmlList = '';
		    	htmlList += htmlTemp.temp1(value[i]);
		    	$("div.div_jdq").append(htmlList);
		    	var relayOperaList = '';
		    	var relayOpera = $("div.relay_opera").html();
		    	for(var j = 0;j<value[i].relay_info.length;j++){
		    		relayOperaList += relayOpera.temp2(value[i].relay_info[j]);
		    	}
		    	$("ul.relay_ul_"+value[i].machine_num).html(relayOperaList);
		    }
		    
			gcy.device.relayCtrl();
			gcy.device.sync();
			gcy.device.rename();
		} else{
			$("div.div_jdq").html("暂无继电器!");
		}
	});
}

gcy.getInfo.sceneInfo = function(){
	$.post('http://localhost:8080/boxctrl/getButtoInfo/21',function(value){
		if (value[0].result == "success") {
		    var htmlTemp = $("div.button_li").html();
		    for(var i = 1; i < value.length; i++){
		    	var htmlList = '';
		    	htmlList += htmlTemp.temp1(value[i]);
		    	$("div.div_aj").append(htmlList);
		    	var buttonOperaList = '';
		    	var buttonOpera = $("div.button_opera").html();
		    	for(var j = 0;j<value[i].aj_info.length;j++){
		    		buttonOperaList += buttonOpera.temp2(value[i].aj_info[j]);
		    	}
		    	$("ul.aj_ul_"+value[i].machine_num).html(buttonOperaList);
		    }
		} else{
			$("div.div_aj").html("暂无按键!");
		}
		gcy.scene.sceneCtrl();
		gcy.scene.sync();
	});
}

gcy.getInfo.relayContForScene = function(machineNum,ajCont){
	$.post('http://localhost:8080/boxctrl/getRelayContForScene/21-'+machineNum+'-'+ajCont,function(value){
		if (value[0].result == "success") {
			var htmlList = '';
		    var htmlTemp = $("div.scene_cont_add").html();
		    for(var i = 1; i < value.length; i++){
		    	htmlList += htmlTemp.temp1(value[i]);
		    }
		    $("ul.to_be_added_ul").html(htmlList);
		} else{
			$("ul.to_be_added_ul").html("暂无待添加内容!");
		}
	});
}

gcy.getInfo.relayContForSceneAdded = function(machineNum,ajCont){
	$.post('http://localhost:8080/boxctrl/getRelayContForSceneAdded/21-'+machineNum+'-'+ajCont,function(value){
		if (value[0].result == "success") {
			var htmlList = '';
		    var htmlTemp = $("div.scene_cont_added").html();
		    for(var i = 1; i < value.length; i++){
		    	$("#scene_cont_val").val($("#scene_cont_val").val()+value[i].relay_cont_id+";");
		    	htmlList += htmlTemp.temp1(value[i]);
		    }
		    $("ul.added_ul").html(htmlList);
		} else{
			$("ul.added_ul").html("");
		}
	});
}


gcy.getInfo.boxInfo();
//事件初始化
$(document).ready(function(){
	setTimeout(function () {
		gcy.tagClick();
    }, 0.1*1000);
});
