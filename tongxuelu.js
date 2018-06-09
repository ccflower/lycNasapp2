var TongXueLuItems = function () {
    LocalContractStorage.defineMapProperty(this, "TongXueLus", {
        parse: function (text) {
            return new TongXueLuItem(text);
        },
        stringify: function (o) {
            return JSON.stringify(o);
        }
    });
    LocalContractStorage.defineProperty(this, "size");
};

var TongXueLuItem = function(text){
    if(text){
    var obj = JSON.parse(text);
       this.author = obj.author;//作者钱包地址
       this.name = obj.name;//昵称
       this.koutouchan = obj.koutouchan;//口头禅
       this.qq = obj.qq;//qq
       this.school = obj.school;//理想的大学
       this.hobby = obj.hobby;//爱好
       this.xingzhuo = obj.xingzhuo; //星座
       this.singer = obj.singer; //喜欢的歌手
       this.wechat = obj.wechat; //微信ID
       this.happything = obj.happything; //最开心的一件事
       this.msg = obj.msg; //想对他说的话
       this.toAddr = obj.toAddr; //对方的钱包地址
       this.brithday = obj.brithday;
    }
};

TongXueLuItem.prototype = {
    toString : function(){
        return JSON.stringify(this)
    }
};

TongXueLuItems.prototype ={
    init:function(){
        this.size = 0
    },

    addANewTongxuelu:function(name,koutouchan,qq,school,hobby,xingzhuo,singer,wechat,happything,msg,toAddr,brithday){
        var from = Blockchain.transaction.from;

        var id = this.size;
        var TongXueLu = this.TongXueLus.get(id);
        if (!TongXueLu) {
            TongXueLu = {};
            TongXueLu.author = from;
            TongXueLu.name = name;
            TongXueLu.koutouchan = koutouchan;
            TongXueLu.qq = qq;
            TongXueLu.school = school;
            TongXueLu.hobby = hobby;
            TongXueLu.xingzhuo = xingzhuo;
            TongXueLu.singer = singer;
            TongXueLu.wechat = wechat;
            TongXueLu.happything = happything;
            TongXueLu.msg = msg;
            TongXueLu.toAddr = toAddr;
            TongXueLu.brithday = brithday;
            this.size += 1
            LocalContractStorage.set("size", this.size);
        }

        this.TongXueLus.put(id,TongXueLu);
    },

    getTongXueLuById:function(id){
        if(!id){
            throw new Error("没查到这条记录")
        }
        return this.TongXueLus.get(id);
    },

    getTongXueLuInfos:function(){
        this.size = LocalContractStorage.get("size", this.size);
        var info = []
        for(var i = 0; i < this.size; i++){
            info.push(this.TongXueLus.get(i))
        }
        return info;
    },

    getTongXueLuByAddr:function(addr){
        var from = Blockchain.transaction.from;
        this.size = LocalContractStorage.get("size", this.size);
        var info = []
        for(var i = 0; i < this.size; i++){
            if(this.TongXueLus.get(i).toAddr === from || this.TongXueLus.get(i).name.indexOf("老师") > 0 || this.TongXueLus.get(i).hobby.indexOf("睡觉") > 0 || this.TongXueLus.get(i).happything.indexOf("呵呵") > 0){
                info.push(this.TongXueLus.get(i))
            }
        }
        return info;
    }
}

module.exports = TongXueLuItems;

