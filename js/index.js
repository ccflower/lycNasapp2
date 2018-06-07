$(function() {
    var serialNumber;
	var NebPay
	var nebPay
	var nebulas
	dappContactAddress = "n1t4s62fbmQncVmWidnZBk6ZKBjfa7XLJZf";
	nebulas = require("nebulas"), neb = new nebulas.Neb();
	neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));
	
	NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
	nebPay = new NebPay();
	
	function getAllPlayerInfo(){
		var from = dappContactAddress;
        var value = "0";
        var nonce = "0";
        var gas_price = "1000000";
        var gas_limit = "20000000";
        var callFunction = "getAllPlayerInfo";
        var callArgs = "";
        //console.log("callFunction:" + callFunction + " callArgs:" + callArgs);
        var contract = {
            "function": callFunction,
            "args": callArgs
        };
        neb.api.call(from, dappContactAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
            var result = resp.result;   
        
            result = JSON.parse(result);
            console.log(result);
            var html = "";
			var itemList = result;
			console.log(itemList);
            for(var i = 0, iLen = itemList.length; i < iLen; i++) {
                html += '<li>' +
				'<p class="item-content"><font color="white">玩家：'+ itemList[i].from + '<br>分数：' + itemList[i].score + '</font></p>' +
						'</li>';
						console.log(html);
            }
            $('#itemList').append(html);
        }).catch(function (err) {
            console.log("error :" + err.message);
        })
	}

    
    
});