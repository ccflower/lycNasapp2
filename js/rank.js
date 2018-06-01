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
                html += '<tr>' +
                        '<th scope="row">'+ (i+1) +'</th>' +
                        '<td>'+itemList[i].from+'</td>' +
                        '<td>'+itemList[i].score+'</td>' +
                        '<td>'+itemList[i].date+'</td>' +
                        '</tr>';
						console.log(html);
            }
            $('#itemList').append(html);
        }).catch(function (err) {
            console.log("error :" + err.message);
        })
	}

    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + " " + date.getHours() + seperator2 + date.getMinutes()
                + seperator2 + date.getSeconds();
        return currentdate;
    }

    getAllPlayerInfo();
});