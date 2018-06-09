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
        drawMybook(result);
        // setItemsProperties(result);
        loadingOut();
    }).catch(function (err) {
        console.log("error :" + err.message);
    })
   }
   function setTipsCard() {
    var defaults = {
        entrance: "bottom",
        column: 4,
        margin: "1%",
        selector: "> li",
        hoverTilt: "right",
        triggerSelector: "> li a",
        cardFlyDirection: "all",
        closeButton: "X",
        flipButton: "Flip",
        navigation: true,
        beforeOpen: null,
        afterOpen: null
        };
        
        
      
      $.fn.tip_cards = function(options){
        var settings = $.extend({}, defaults, options),
            el = $(this);  
        el.addClass("tc_body");
        
        $.each(el.find(settings.selector), function(i) {
          $(this).addClass("tc_card").hide().css({
            "width": (100/settings.column) - (parseInt(settings.margin) * 2) + "%",
            "margin": settings.margin
          }).wrapInner("<div class='tc_inner_card tilt_"+settings.hoverTilt+"'></div>");
          if ($(this).find(".tc_front").length > 0) {
            $(this).find(".tc_inner_card").addClass("tc_flipped");
          }
        });
        
        
        setTimeout(function(){
          $.each(el.find(".tc_card"), function(i) {
            var current = $(this);
            current.addClass("animate tc_entrance_" + settings.entrance).show();
            current.find(".tc_inner_card").prepend("<span class='tc_shadow'></span>");
            
            if (current.find(".tc_front").length > 0) {
              setTimeout(function(){
                current.find(".tc_inner_card").removeClass("tc_flipped")
              }  , 600);
            }
          });
        }, 100);
        
        
        function resetNav() {
          if ($(".tc_card.active").prev(".tc_card").length < 1) {
            $(".tc_modal_open .tc_prev").addClass("tc_entrance");
          } else {
            $(".tc_modal_open .tc_prev").removeClass("tc_entrance");
          }
          if ($(".tc_card.active").next(".tc_card").length < 1) {
            $(".tc_modal_open .tc_next").addClass("tc_entrance");
          } else {
            $(".tc_modal_open .tc_next").removeClass("tc_entrance");
          }
        }
        
        function realignCards() {
          var timeout = 100;
    
          $(".tc_fake1").addClass("tc_straighten").css({
            "position":"absolute",
            "top": (( $(window).height() - $(".tc_modal").height() ) / 2+$(window).scrollTop()) + 16 + "px",
            "left": ( $(window).width() - $(".tc_modal").width() ) / 2+$(window).scrollLeft() + "px",
            "-webkit-transform": "scale(0.96)",
            "-moz-transform": "scale(0.96)",
            "-o-transform": "scale(0.96)",
            "transform": "scale(0.96)"
          });
          setTimeout(function(){
            $(".tc_fake2").addClass("tc_straighten").css({
              "position":"absolute",
              "top": (( $(window).height() - $(".tc_modal").height() ) / 2+$(window).scrollTop()) + 12 + "px",
              "left": ( $(window).width() - $(".tc_modal").width() ) / 2+$(window).scrollLeft() + "px",
              "-webkit-transform": "scale(0.97)",
              "-moz-transform": "scale(0.97)",
              "-o-transform": "scale(0.97)",
              "transform": "scale(0.97)"
            });
            setTimeout(function(){
              $(".tc_fake3").addClass("tc_straighten").css({
                "position":"absolute",
                "top": (( $(window).height() - $(".tc_modal").height() ) / 2+$(window).scrollTop()) + 8 + "px",
                "left": ( $(window).width() - $(".tc_modal").width() ) / 2+$(window).scrollLeft() + "px",
                "-webkit-transform": "scale(0.98)",
                "-moz-transform": "scale(0.98)",
                "-o-transform": "scale(0.98)",
                "transform": "scale(0.98)"
              });
              setTimeout(function(){
                $(".tc_fake4").addClass("tc_straighten").css({
                  "position":"absolute",
                  "top": (( $(window).height() - $(".tc_modal").height() ) / 2+$(window).scrollTop()) + 4 + "px",
                  "left": ( $(window).width() - $(".tc_modal").width() ) / 2+$(window).scrollLeft() + "px",
                  "-webkit-transform": "scale(0.99)",
                  "-moz-transform": "scale(0.99)",
                  "-o-transform": "scale(0.99)",
                  "transform": "scale(0.99)",
                });
                setTimeout(function(){
                  $(".tc_main_modal").css({
                    "position":"absolute",
                    "top": ( $(window).height() - $(".tc_modal").height() ) / 2+$(window).scrollTop() + "px",
                    "left": ( $(window).width() - $(".tc_modal").width() ) / 2+$(window).scrollLeft() + "px",
                    "bottom": "auto",
                    "right": "auto",
                    "visibility": "visible"
                  });
    
                  setTimeout(function(){
                    $(".tc_main_modal .tc_inner_modal").removeClass("tc_flipped");
                    if (typeof settings.afterOpen == 'function') settings.afterOpen();
                    resetNav();
                  }, 500);  
                }, timeout);
              }, timeout);
            }, timeout);
          }, timeout);
        }
        
        $(window).resize(function() {
          realignCards();
        });
        
        el.find(settings.triggerSelector).addClass("tc_click_target").click(function() {
          var el2 = $(this),
          container = $(el2.attr("href"));
          
          
          
          el2.closest(".tc_card").addClass("active")
          
          if (typeof settings.beforeOpen == 'function') settings.beforeOpen();
          
          $("body").addClass("tc_modal_open");
          $("<div class='tc_overlay'></div>").appendTo("body");
          
          
          $("<div class='tc_modal tc_main_modal'><div class='tc_inner_modal'></div></div>").appendTo("body");
          
          
          $(".tc_main_modal .tc_inner_modal").html(container.html())
          
          
          if ($(".tc_main_modal .tc_front").length > 0) {
            $(".tc_main_modal .tc_inner_modal").addClass("tc_flipped");
          }
          
          if (settings.cardFlyDirection == "all") {
            $(".tc_main_modal").clone( true ).removeClass("tc_main_modal").addClass("tc_fake1 tc_to_top").attr("style", "").insertBefore(".tc_main_modal");
            $(".tc_main_modal").clone( true ).removeClass("tc_main_modal").addClass("tc_fake2 tc_to_bottom").attr("style", "").insertBefore(".tc_main_modal");
            $(".tc_main_modal").clone( true ).removeClass("tc_main_modal").addClass("tc_fake3 tc_to_left").attr("style", "").insertBefore(".tc_main_modal");
            $(".tc_main_modal").clone( true ).removeClass("tc_main_modal").addClass("tc_fake4 tc_to_right").attr("style", "").insertBefore(".tc_main_modal");
          } else {
            $(".tc_main_modal").clone( true ).removeClass("tc_main_modal").addClass("tc_fake1 tc_to_" + settings.cardFlyDirection).attr("style", "").insertBefore(".tc_main_modal");
            $(".tc_main_modal").clone( true ).removeClass("tc_main_modal").addClass("tc_fake2 tc_to_" + settings.cardFlyDirection).attr("style", "").insertBefore(".tc_main_modal");
            $(".tc_main_modal").clone( true ).removeClass("tc_main_modal").addClass("tc_fake3 tc_to_" + settings.cardFlyDirection).attr("style", "").insertBefore(".tc_main_modal");
            $(".tc_main_modal").clone( true ).removeClass("tc_main_modal").addClass("tc_fake4 tc_to_" + settings.cardFlyDirection).attr("style", "").insertBefore(".tc_main_modal");
          }
          
         
          addExtraButtons(settings);
          
          
          realignCards();
          
          if (settings.navigation != false ) {
            $("<a class='tc_entrance tc_next' href='#'>&raquo;</a>").insertAfter(".tc_overlay")
            $("<a class='tc_entrance tc_prev' href='#'>&laquo;</a>").insertAfter(".tc_overlay");
          }
          
          resetNav();
          
          
          $(".tc_next").click(function() {
            if ($(".tc_card.active").next(".tc_card").length > 0 && !$(this).hasClass("animated")) {
              var el3 = $(this);
              el3.addClass("animated");
              var content = "<div class='tc_inner_modal'>" + $($(".tc_card.active").removeClass("active").next(".tc_card").addClass("active").find(".tc_click_target").attr("href")).html() + "</div>";
              $(".tc_main_modal").addClass("old").clone().removeClass("old").html(content).insertBefore(".tc_main_modal.old")
              addExtraButtons(settings);
              $(".tc_main_modal.old").addClass("tc_to_bottom force").one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
                $(".tc_main_modal.old.tc_to_bottom").remove();
                
                $(".tc_main_modal").removeClass("tc_flipped");
                el3.removeClass("animated");
                resetNav();
              });
            }
            return false;
          });
          
          $(".tc_prev").click(function() {
            if ($(".tc_card.active").prev(".tc_card").length > 0 && !$(this).hasClass("animated")) {
              var el3 = $(this);
              el3.addClass("animated");
              var content = "<div class='tc_inner_modal'>" + $($(".tc_card.active").removeClass("active").prev(".tc_card").addClass("active").find(".tc_click_target").attr("href")).html() + "</div>";
              $(".tc_main_modal").addClass("old").clone().removeClass("old").addClass("tc_to_bottom force").html(content).insertAfter(".tc_main_modal.old")
              setTimeout(function(){
                $(".tc_main_modal.tc_to_bottom").removeClass("tc_to_bottom force")
                $(".tc_main_modal:not(.old)").one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
                  $(".tc_main_modal.old").remove();
                  addExtraButtons(settings);
                  $(".tc_main_modal").removeClass("tc_flipped");
                  resetNav();
                  el3.removeClass("animated");
                });
              }, 100);
            }
            return false;
          });
          
          
          function addExtraButtons(settings) {
            if (settings.closeButton != false ) {
              $(".tc_main_modal").prepend("<a class='tc_close' href='#'>" + settings.closeButton +"</a>");
              $(".tc_main_modal .tc_flip_toggle").remove();
            }
            if (settings.flipButton != false && $(".tc_main_modal").find(".tc_front").length > 0 ) {
              $(".tc_main_modal .tc_flip_toggle").remove();
              $(".tc_main_modal").prepend("<a class='tc_flip_toggle' href='#'>" + settings.flipButton +"</a>");
            }
    
    
            $(".tc_overlay, .tc_close").click(function() {
              $(".tc_overlay").fadeOut("slow", function() {
                $(".tc_overlay").remove();
              });
              el2.closest(".tc_card").removeClass("active")
              $(".tc_next, .tc_prev").addClass("tc_entrance")
              $(".tc_next, .tc_prev").one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
                $(".tc_next, .tc_prev").remove();
              });
              $(".tc_modal").attr("style","").one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
                $(this).remove();
                $("body").removeClass("tc_modal_open")
              });
              return false;
            });
    
            $(".tc_flip_toggle").click(function() {
              $(".tc_main_modal .tc_inner_modal").toggleClass("tc_flipped");
              return false;
            });
            
          }
          
        });
      }
   }
   function drawMybook(result) {
       var html = "";
       for (var i = 0; i < result.length; i++) {
           var item = result[i];
           var num = i + 1;
            html += '<li>' +
                '<div class="tc_front">' +
                    '<a href="#tip'+ num +'">Tip 1: See What videos your friends are posting and adjust friendships accordingly.</a>' +
                '</div>' +
                '<div class="tc_back"><p></p>' +
                '</div>' +
                '<div id="tip'+ num +'" class="tip">' +
                    '<div class="tc_front">' +
                        '<h1>1. See What videos your friends are posting</h1>' +
                        '<p>Whether youre signed in with your Google Account, you can see videos recommended for you.</p>' +
                    '</div>' +
                    '<div class="tc_back">' +
                        '<p>Tip 1: See What videos your friends are posting and adjust friendships accordingly.</p>' +
                    '</div>' +
                '</div>' +
            '</li>';
       }
       console.log(html);
       $(".tips").append(html);
       setTipsCard();
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