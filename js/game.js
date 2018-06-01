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

    // 在html直接写代码，不编译、不构建，不然应该用const的
    var width = 400, height = 600, ballSize = 20;

    // 记录鼠标轨迹
    var mouse = {x: 300, y: 50};
    var mouseRecord = function ($e) {
        mouse.x = $e.canvasX;
        mouse.y = Math.max(30, $e.canvasY);
    };

    // 游戏状态
    var canShoot = true;
    var score = 0, ballLeft = 0, ballCount = 5;
    var blockArray = [];

    // 图片
    var BALL = './imgs/ball.png';
    var BLOCK = './imgs/block.jpg';
    var TRIANGLE = './imgs/triangle.png';

    // 用于碰撞检测
    var BALL_TYPE = 1, BLOCK_TYPE = 2, BORDER_TYPE = 3, BOTTOM_TYPE = 4, BONUS_TYPE = 5;

    // 初始化easycanvas实例
    var $Painter = new Easycanvas.painter();
    $Painter.register(el, {
        width: width,
        height: height,
        events: {
            mousemove: mouseRecord,
            touchmove: mouseRecord,
            mouseup: shoot,
            touchend: shoot,
        }
    });
    $Painter.start();

    $Painter.add({
        content: {
            text: function () {
                return '得分:' + score;
            }
        },
        style: {
            tx: 5, ty: 5,
            textAlign: 'left', textVerticalAlign: 'top',
            color: 'black'
        }
    });
    $Painter.add({
        content: {
            text: function () {
                return '小球个数:' + ballCount;
            }
        },
        style: {
            tx: 395, ty: 5,
            textAlign: 'right', textVerticalAlign: 'top',
            color: 'black'
        }
    });

    // 初始化easycanvas物理引擎
    var $space = new Easycanvas.class.sprite({
        physics: {
            gravity: 2,
            accuracy: 2,
        },
    });
    $Painter.add($space);
    $space.launch();

    // 显示瞄准轨迹
    var startAim = function () {
        for (var i = 0; i < 7; i ++) {
            $Painter.add({
                content: {
                    img: BALL,
                },
                data: {
                    gap: i / 6,
                },
                style: {
                    tx: function () {
                        return 200 + (mouse.x - 200) * this.data.gap;
                    },
                    ty: function () {
                        return 20 + (mouse.y - 20) * this.data.gap;
                    },
                    tw: 20, th: 20,
                    opacity: 0.4,
                },
                hooks: {
                    shoot: function () {
                        this.remove();
                    }
                }
            });
        }
    };
    startAim();

    function shoot () {
        if (!canShoot) return;

        $Painter.broadcast('shoot');
        canShoot = false;

        // 防止过程中鼠标移动引起多个小球方向不同
        var currentMouse = JSON.parse(JSON.stringify(mouse));
        // 防止过程中增加了小球数量
        var currentBallCount = ballCount;
        for (var i = 0; i < currentBallCount; i++) {
            setTimeout(function () {
                addBall(currentMouse);
            }, i * 100);
        }
    };

    function addBall (mouse) {
        ballLeft++;
        var $ball = new Easycanvas.class.sprite({
            name: 'ball',
            content: {
                img: BALL,
                // img: BLOCK,
            },
            physics: {
                shape: [
                    // 形状是一个以(ballSize / 2, ballSize / 2)为圆心的，半径也是ballSize / 2的圆
                    [ballSize / 2, ballSize / 2, ballSize / 2],
                ],
                mass: 1, // 质量
                friction: 0.2, // 摩擦（摩擦太大了会损失能量）
                elasticity: 0.8, // 弹性
                collisionType: BALL_TYPE,
            },
            style: {
                tw: ballSize, th: ballSize,
                sx: 0, sy: 0,
                tx: 200,
                ty: 20,
                zIndex: 1,
            },
            hooks: {
                physicsCollisionBegin: function ($other, collisionType) {
                    switch (collisionType) {
                        case BALL_TYPE:
                            return true;
                        case BOTTOM_TYPE:
                            var ball = this;
                            var block = $other;
                            if (ball.toRemove) {
                                return;
                            }

                            ball.toRemove = true;
                            ball.style.opacity = Easycanvas.transition.linear(1, 0, 500);
                            setTimeout(function () {
                                ball.physicsOff();
                                ball.remove();
                                ballLeft--;

                                if (ballLeft === 0) {
                                    canShoot = true;

                                    blockArray.forEach(function (block) {
                                        block.physicsOff();
                                        block.style.ty -= 50;

                                        if (block.style.ty < 50) {
                                            if (block.name === 'block') {
                                                canShoot = false;
                                            } else {
                                                if (block.$canvas) {
                                                    block.remove();
                                                }
                                            }
                                        } else {
                                            block.physicsOn();
                                        }
                                    });

                                    if (!canShoot) {
                                        // alert('You lose'+ score);
                                        console.log(score);
                                        Date.prototype.format = function(fmt) { 
                                            var o = { 
                                               "M+" : this.getMonth()+1,                 //月份 
                                               "d+" : this.getDate(),                    //日 
                                               "h+" : this.getHours(),                   //小时 
                                               "m+" : this.getMinutes(),                 //分 
                                               "s+" : this.getSeconds(),                 //秒 
                                               "q+" : Math.floor((this.getMonth()+3)/3), //季度 
                                               "S"  : this.getMilliseconds()             //毫秒 
                                           }; 
                                           if(/(y+)/.test(fmt)) {
                                                   fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
                                           }
                                            for(var k in o) {
                                               if(new RegExp("("+ k +")").test(fmt)){
                                                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                                                }
                                            }
                                           return fmt; 
                                        } 
                                        var playTime = new Date().format("yyyy-MM-dd hh:mm:ss");
                                        console.log(playTime);
                                        bootbox.confirm("您本局得分为:" + score + ", 点击确定可保存至星云链中。", function(result){
                                            console.log(result); 
                                            if(result !== null && result !== ""){
                                                var to = dappContactAddress;
                                                var value = "0";
                                                var callFunction = "addScore";
                                                var callArgs = "[\"" + score + "\",\"" + playTime + "\"]";
                                                console.log(callArgs);
                                                serialNumber = nebPay.call(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
                                                    listener: function (resp) {
                                                        console.log("thecallback is " + resp)
                                                        scoreNumber = 0;
                                                        volleyNum = 2;
                                                        fruits.length = 0;
                                                    }
                                                });
                                            }   
                                       });
                                    } else {
                                        startAim();
                                        addBlock(5 + score / 10, true);
                                        Math.random() < 0.5 && addBlock(5 + score / 10, true);
                                        Math.random() < 0.3 && addBlock(5 + score / 9, true);
                                        Math.random() < 0.2 && addBlock(5 + score / 8, true);
                                        Math.random() < 0.3 && addBonus();
                                        Math.random() < 0.3 && addBonus();
                                    }
                                }
                            }, 500);
                            return;
                    }
                },
                physicsCollisionPreSolve: function ($other, collisionType) {
                    switch (collisionType) {
                        case BLOCK_TYPE:
                            if (Math.abs(this.physicsGetVelocity().y) < 1) {
                                // 防止小球停到方块上
                                this.physicsSetVelocity({
                                    x: Math.random() * 10 - 5,
                                    y: -300,
                                });
                            }
                            return;
                    }
                },
                physicsCollisionSeparate: function ($other, collisionType) {
                    // 撞过一次就重置作用力（这样只剩下重力了，就开始往下掉）
                    this.physicsResetForces();

                    switch (collisionType) {
                        case BLOCK_TYPE:
                            var block = $other;

                            // 这里直接通过父对象从子对象拿数据，这种数据的依赖方式不好，但是这么简单个应用，无所谓了
                            // 更好的是例如通过easycanvas的自定义事件广播下去
                            block.children[0].content.text--;
                            score++;
                            if (!block.children[0].content.text) {
                                // 把方块撞成0了，先隐藏
                                block.physicsOff();
                                block.remove();
                                blockArray.splice(blockArray.indexOf(block), 1);
                            }
                            return;
                        case BONUS_TYPE:
                            var bonus = $other;

                            // 一个球被连续撞，只加一次
                            if (bonus.used) return false;
                            bonus.used = 1;

                            bonus.physicsOff();
                            bonus.remove();
                            blockArray.splice(blockArray.indexOf(bonus), 1);
                            ballCount++;
                            return;
                    }
                }
            }
        });
        $space.add($ball);

        $ball.physicsOn();
        // 抵消重力
        $ball.physicsApplyForce({x: 0, y: -1000}, {x: 0, y: 0});

        // 初速度
        var speed = {
            x: (mouse.x - 200) / (mouse.y - 20),
            y: 1
        };

        // 修正速度，确保从各个角度射出小球的速度差不多
        var muti = Math.sqrt(Math.pow(speed.x, 2) + Math.pow(speed.y, 2)) / 700;

        $ball.physicsSetVelocity({
            x: speed.x / muti,
            y: speed.y / muti,
        });
    }

    // 防止方块重叠，记录上一次方块的X坐标
    var lastBlockPositionX = 50;
    function addBlock (max, boolAddToBottom) {
        var deg = Math.floor(Math.random() * 360);
        var sprite = $space.add(new Easycanvas.class.sprite({
            name: 'block',
            content: {
                img: BLOCK,
            },
            physics: {
                shape: [
                    [[0, 0], [30, 0], [30, 30], [0, 30], [0, 0]],
                ],
                mass: 1,
                friction: 0.1,
                elasticity: 0.9,
                collisionType: BLOCK_TYPE,
                static: true,
            },
            style: {
                tw: 30, th: 30,
                tx: lastBlockPositionX + Math.floor(Math.random() * 20 - 10),
                ty: boolAddToBottom ? 500 : height - 100 - Math.floor(Math.random() * 100),
                locate: 'lt',
                zIndex: Math.random(),
                rotate: deg,
            },
            children: [{
                content: {
                    text: Math.floor(Math.random() * max) + 1,
                },
                style: {
                    color: 'yellow',
                    textAlign: 'center',
                    textVerticalAlign: 'middle',
                    textFont: '28px Arial',
                    tx: 15, ty: 10
                }
            }]
        }));
        sprite.physicsOn();
        blockArray.push(sprite);

        lastBlockPositionX += 50;
        if (lastBlockPositionX > 350) {
            lastBlockPositionX = 50;
        }
    }

    function addBonus () {
        var sprite = $space.add(new Easycanvas.class.sprite({
            name: 'bonus',
            content: {
                img: BALL,
            },
            physics: {
                shape: [
                    [ballSize / 2, ballSize / 2, ballSize / 2],
                ],
                mass: 1,
                friction: 0.1,
                elasticity: 0.5,
                collisionType: BONUS_TYPE,
                static: true,
            },
            style: {
                tw: 30, th: 30,
                tx: lastBlockPositionX + Math.floor(Math.random() * 20 - 10),
                ty: 500,
                locate: 'center',
                zIndex: 2,
                fv: Easycanvas.transition.pendulum(0, 0.2, 200).loop(),
                fh: Easycanvas.transition.pendulum(0.2, 0, 200).loop(),
            },
        }));
        sprite.physicsOn();
        blockArray.push(sprite);

        lastBlockPositionX += 50;
        if (lastBlockPositionX > 350) {
            lastBlockPositionX = 50;
        }
    }

    // 上半部分的边，摩擦小、弹性大
    var borderSprite = $space.add(new Easycanvas.class.sprite({
        physics: {
            shape: [
                [[0, 0], [width, 0]],
                [[0, 0], [0, height * 0.9]],
                [[width, 0], [width, height * 0.9]],
            ],
            friction: 0.1,
            elasticity: 0.8,
            collisionType: BORDER_TYPE,
            static: true
        },
        style: {
            tx: 0, ty: 0, tw: width, th: height,
            locate: 'lt',
        },
    }));
    borderSprite.physicsOn();

    // 下半部分的边，摩擦大、弹性小
    var bottomSprite = $space.add(new Easycanvas.class.sprite({
        physics: {
            shape: [
                [[0, height], [width, height]],
                [[0, height * 0.9], [0, height]],
                [[width, height * 0.9], [width, height]],
            ],
            friction: 5,
            elasticity: 0,
            collisionType: BOTTOM_TYPE,
            static: true
        },
        style: {
            tx: 0, ty: 0, tw: width, th: height,
            locate: 'lt',
        },
    }));
    bottomSprite.physicsOn();

    // 第一关7个方块
    for (var i = 0; i < 7; i++) {
        addBlock(5);
    }

    // 阻止微信浏览器的默认下拉
    document.body.addEventListener('touchmove' , function (e) {
        e.preventDefault();
    });
});