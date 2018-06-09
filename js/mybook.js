$(function () {
    var dappContactAddress;
    var serialNumber;
    var NebPay;
    var nebPay;
    var nebulas;
    dappContactAddress = "n1ia6R6YZvDUNPwZMsSJwUrm8jQyuhFEUWe";
    nebulas = require("nebulas"), neb = new nebulas.Neb();
    neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));
    
    NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
    nebPay = new NebPay();	
    var myneb = new Neb();
    var nasApi = myneb.api;	

    var curWallectAdd;


    function getWallectInfo() {
        console.log("getWallectInfo");
        window.addEventListener('message', getMessage);
    
        window.postMessage({
            "target": "contentscript",
            "data": {},
            "method": "getAccount",
        }, "*");
    }
    
    function getMessage(e){
        if (e.data && e.data.data) {
            console.log("e.data.data:", e.data.data)
            if (e.data.data.account) {
                var address = e.data.data.account;
                curWallectAdd = address;
                console.log("address="+address);
                getTongXueLuByAddr(curWallectAdd);
            }
        }
    }
    
    function loadingOut(){
        $("#loading").fadeOut("slow");
    }

    function getTongXueLuByAddr(addr){
        var from = curWallectAdd;
        var value = "0";
        var nonce = "0";
        var gas_price = "1000000";
        var gas_limit = "20000000";
        var callFunction = "getTongXueLuByAddr";
        //"[\"" + nick_name + "\",\"" + school + "\",\"" + content + "\"]";
        var callArgs = "[\"" + addr + "\"]";;
        console.log("callFunction:" + callFunction + " callArgs:" + callArgs);
        var contract = {
        "function": callFunction,
        "args": callArgs
        };
    neb.api.call(from, dappContactAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
        var result = resp.result;   
        console.log("result : " + result);
        result = JSON.parse(result);
        // setItemsProperties(result);
        loadingOut();
    }).catch(function (err) {
        console.log("error :" + err.message);
    })
   }

//    function setItemsProperties(itemList) {
//         console.log(itemList);
//         var html = "";
//         for(var i = 0, iLen = itemList.length; i < iLen; i++) {
//             randomIndex = (i + 1) % 30;
//             // var i = Math.random();
//             // var randomIndex = Math.ceil(i*30);
//             console.log("randomIndex:" + randomIndex);
//             // randomIndex = 1;
//             html += 
//             '<div class="item">' + 
// 				'<div class="example-image-link" data-lightbox="example-set" data-title="Click the right half of the image to move forward."><img class="example-image" src="images/' + randomIndex + '.jpg" alt=""/></div>' + 
// 				'<div class="content-item">' + 
// 					'<h3 class="title-item"><a href="single.html?page='+i+'">' + itemList[i].title+ '</a></h3>' + 
// 					'<div class="time"> '+ itemList[i].date +'</div>' + 
// 					'<p class="info">'+itemList[i].content+'</p>	' + 	
// 				'</div>' + 
// 				'<div class="bottom-item">' + 
// 					// '<a href="#" class="btn btn-share share"><i class="fa fa-share-alt"></i> Share</a>' + 
// 					// '<a href="#" class="btn btn-like"><i class="fa fa-heart-o"></i></a>' +
// 					// '<a href="#" class="btn btn-comment"><i class="fa fa-comment-o"></i></a>' +
// 					'<a href="single.html?page='+i+'" class="btn btn-more"><i class="fa fa-long-arrow-right "></i></a>' +
// 				'</div>' + 
// 			'</div>';

//             console.log(html);
//         }
//         $('#container').append(html);
//    }

    // $(".market_page .button.small.yellow").on("click", function(event) {
    //     var currentIndex = event.currentTarget.id;
    //     console.log("currentIndex:" + currentIndex + " text:" + $(".market_page .button.small.yellow span")[currentIndex].innerHTML);
    //     if($(".market_page .button.small.yellow span")[currentIndex].innerHTML === "求赠送"){
    //         bootbox.prompt("请给对方填写1个赠送给你的理由~", function(result){
    //             console.log(result); 
    //             if(result !== null && result !== ""){
    //                var currentIndex = event.currentTarget.id;
    //                console.log("currentIndex:" + currentIndex);
    //                requestAHuluwa(currentIndex, result);
    //             }
    //        });
    //     }else{
    //         ownAHuluwa(currentIndex);
    //     }
    // });

    // getInfo();
    getWallectInfo()
})