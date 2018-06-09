$(function() {
    var serialNumber;
	var NebPay
	var nebPay
	var nebulas
	dappContactAddress = "n1ia6R6YZvDUNPwZMsSJwUrm8jQyuhFEUWe";
	nebulas = require("nebulas"), neb = new nebulas.Neb();
	neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));
	
	NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
	nebPay = new NebPay();
    
    function addANewTongxuelu(name,koutouchan,qq,school,hobby,xingzhuo,singer,wechat,happything,msg,toAddr, birthday){
        var to = dappContactAddress;
        var value = "0";
        var callFunction = "addANewTongxuelu";
        var callArgs = "[\"" + name + "\",\"" + koutouchan + "\",\"" + qq + "\",\"" + school + "\",\"" + hobby +"\",\"" + xingzhuo + "\",\"" + singer +"\",\"" + wechat + "\",\"" + happything +"\",\"" + msg + "\",\"" + toAddr + "\",\"" + birthday + "\"]";
        console.log(callArgs);
        serialNumber = nebPay.call(to, value, callFunction, callArgs, { 
            listener: function (resp) {
                try{
                    if(resp.indexOf("Transaction rejected by user") > 0){
                        alert("您拒绝了合约调用，请重试");
                    }
                }catch(e){
                    var hash = resp.txhash;
                    regetTransactionReceipt(hash, function (status) {
                        if(status == 1){
                            alert('添加成功！');
                        }else{
                            alert('添加失败，请重新提交！');
                        }
                    })
                }
                    //upadte card status into in progress...
            }
        }); 
    }

    $("#sendButton").click(function() {
        console.log("clicked...");
        var parameter = {};
        parameter.name = $("#nickName").val();
        parameter.hobby = $("#hobby").val();
        parameter.birthday = $("#birthday").val();
        parameter.xingzhuo = $("#xingzuo").val();
        parameter.koutouchan = $("#koutouchan").val();
        parameter.singer = $("#singer").val();
        parameter.qq = $("#qqNo").val();
        parameter.wechat = $("#wechatNo").val();
        parameter.school = $("#collage").val();
        parameter.happything = $("#happyThing").val();
        parameter.msg = $("#moreWords").val();
        parameter.toAddr = $("#walletAddr").val();
        console.log(parameter);
        addANewTongxuelu(parameter.name,parameter.koutouchan,parameter.qq,parameter.school,parameter.hobby,parameter.xingzhuo,parameter.singer,parameter.wechat,parameter.happything,parameter.msg,parameter.toAddr,parameter.birthday);
    });

        function regetTransactionReceipt(hash, cb) {
            var task = setInterval(function () {
                getTransactionReceipt(hash, function (resp) {
    //                console.log(resp)
                    var status = resp.result.status;
                    console.log('status:' +status)
                    if(status == 1 || status == 0){
                        clearInterval(task);
                        cb(status);
                    }
                })
            }, 1000);
        }
    
        function getTransactionReceipt(hash, cb){
            $.post('https://mainnet.nebulas.io/v1/user/getTransactionReceipt', JSON.stringify({
                "hash": hash
            }), function (resp) {
                console.log(resp);
                cb(resp)
            })
        }
    

});