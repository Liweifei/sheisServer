var express = require('express');
var router = express.Router();
var request = require('request');
var ObjectId = require('mongodb').ObjectId ;
var moment = require("../public/utils/moment");
var dbTool = require("../public/dbTool/dbTool");
var jsonTool = require("../public/jsonTool/jsonTool");
var tokenTool = require("../public/tokenTool/tokenTool");
var collectionName="users";
var AppID="wx06855ef92170504a";//小程序appid
var SECRET="c9dc3d6deacb10b869ecb1589e9196e9";//小程序密钥
/* save user. */
router.post('/getToken', function(req, res, next) {
    if (req.body.code) {
        let options = {
            method: 'POST',
            url: 'https://api.weixin.qq.com/sns/jscode2session?',
            formData: {
                appid: AppID,
                secret: SECRET,
                js_code: req.body.code,
                grant_type: 'authorization_code'
            }
        };
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                response.body=JSON.parse(response.body)
                tokenTool.saveToken({token:response.body.openid},function(type){
                    console.log(type)
                    if(type){
                        res.json(jsonTool.toObj({token:response.body.openid}))
                    }else{
                        res.json(jsonTool.justCodeInt(false,"登录失败，token未存储！"))
                    }
                })
            }else{
                res.json(jsonTool.justCodeInt(false,"获取用户信息失败！"))
            }
        })
  	}else{
        res.json(jsonTool.justCodeInt(false,"接收js_code失败！"))
    }
    
});
/* save user. */
router.post('/saveInfo', function(req, res, next) {
  	if (req.body.id) {
        dbTool.findOne(collectionName,{"id":req.body.id},function(resons){
            if (!!resons) {//找到账号进行更新账号信息，否则存入信息
                let whereStr={'id':req.body.id};
                let updateParam={};
                for(key in req.body){
                    if(key!="id")updateParam[key]=req.body[key];
                }
                updateParam.updateTime=moment().format();
                console.log(updateParam)
                let updateStr={$set:updateParam}
                dbTool.updateOne(collectionName,whereStr,updateStr,function(result){
                    var msg=result?'存储成功！':'存储失败！';
                    res.json(jsonTool.justCodeInt(result,msg))
                })
            }else{
                let data=req.body;
                data.updateTime=moment().format();
                dbTool.insertOne(collectionName,data,function(result){
                    var msg=result?'存储成功！':'存储失败！';
                    res.json(jsonTool.justCodeInt(result,msg))
                })
            }
        })
  		
  	}else{
        res.json(jsonTool.justCodeInt(false,"存储失败"))
    }
});
/*check Token. */
router.post('/checkToken', function(req, res, next) {
    if (req.body.token) {
      tokenTool.checkToken({token:req.body.token},function(type){
        console.log(type)
        if(type){
            res.json(jsonTool.justCodeInt(true,"用户信息刷新成功！"))
        }else{
            res.json(jsonTool.justCodeInt(false,"登录失败，token未存储！"))
        }
    })
        
    }else{
      res.json(jsonTool.justCodeInt(false,"存储失败"))
  }
});

/* remove user. */
router.post('/delete', function(req, res, next) {
    if (req.body._id) {
        let whereStr={'_id':ObjectId(req.body._id)};
        dbTool.deleteOne(collectionName,whereStr,function(result){
            var msg=result?'删除成功！':'删除失败！';
            res.json(jsonTool.justCodeInt(result,msg))
        })
    }
});

/* update psd. */
router.post('/updatePsd', function(req, res, next) {
    if (req.body._id && req.body.password) {
        let whereStr={'_id':ObjectId(req.body._id)};
        let updateStr={$set:{"password":req.body.password}}
        dbTool.updateOne(collectionName,whereStr,updateStr,function(result){
            var msg=result?'更改成功！':'更改失败！';
            res.json(jsonTool.justCodeInt(result,msg))
        })
    }else{
      res.send("原账号数据不正确");
    }
});

/* get user list. */
router.get('/list2', function(req, res, next) {
	dbTool.findAll(collectionName,function(result,info){
        if(result){
            res.json(jsonTool.toArr(info))
        }else{
            res.json(jsonTool.justCodeInt(result,info))
        }
	})
  	
});

/* get user list. */
router.get('/list', function(req, res, next) {
    console.log(req.query.location)
    let whereStr={"location":{"$regex":req.query.location},id:{$ne:req.query.id}};
	dbTool.findSome(collectionName,whereStr,function(result,info){
        if(result){
            res.json(jsonTool.toArr(info))
        }else{
            res.json(jsonTool.justCodeInt(result,info))
        }
	})
  	
});

module.exports = router;
