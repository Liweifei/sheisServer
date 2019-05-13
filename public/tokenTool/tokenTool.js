var dbTool = require("../dbTool/dbTool");
var moment = require("../utils/moment");
var collectionName="tokens";

var tokenInstance={
    saveToken:function(param,cb){//保存token
        console.log(param)
        param.updateTime=moment().format();
        let type=false;
        dbTool.findOne(collectionName,{token:param.token},function(resons){
            if (!!resons) {
                let updateStr={$set:{"updateTime":param.updateTime}}
                dbTool.updateOne(collectionName,{token:param.token},updateStr,function(result){
                    type=result;
                    cb(type)
                })
            }else{
                dbTool.insertOne(collectionName,param,function(result){
                    type=result;
                    cb(type)
                })
            }
        })
        
    },
    checkToken: function (param,cb) {//检查token是否有效
        dbTool.findOne(collectionName,{token:param.token},function(resons){
            if (!!resons) {
              let timeDiff=moment().diff(resons.updateTime,"hours");
              if(timeDiff>3){
                cb(false);
              }else{
                cb(true);
              }
            }else{
                cb(false);
            }
        })
    },
    findToken: function (param) {//查找token
        let type=false;
        dbTool.findOne(collectionName,param,function(resons){
            type=!!resons;
        })
    }
}

module.exports = tokenInstance;
