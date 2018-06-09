$(function() {
    var serialNumber;
	var NebPay
	var nebPay
	var nebulas
	dappContactAddress = "n1zDMur9vjYRrF2VbprTc4Rb16ohnxgZPd7";
	nebulas = require("nebulas"), neb = new nebulas.Neb();
	neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));
	
	NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
	nebPay = new NebPay();
    
    function addANewTongxuelu(name,koutouchan,qq,school,hobby,xingzhuo,singer,wechat,happything,msg,toAddr){
        var to = dappContactAddress;
        var value = "0";
        var callFunction = "addANewTongxuelu";
        var callArgs = "[\"" + name + "\",\"" + koutouchan + "\",\"" + qq + "\",\"" + school + "\",\"" + hobby +"\",\"" + xingzhuo + "\",\"" + singer +"\",\"" + wechat + "\",\"" + happything +"\",\"" + msg + "\",\"" + toAddr + "\"]";
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

});