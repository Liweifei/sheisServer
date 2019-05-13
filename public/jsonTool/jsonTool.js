var jsonInstance={
	toArr:function(param){//返回数组类型数据
		return {
            type:true,
            data:param,
            msg:""
        }
	},
	toMsg: function (param) {//返回信息类型数据
        return {
            type:true,
            data:[],
            msg:param
        }
    },
    toObj: function (param) {//返回信息类型数据
        return {
            type:true,
            data:param,
            msg:""
        }
    },
    justCodeInt(type,msg){//仅返回success 或false  type=true/false  msg是返回信息
        return {
            type:type,
            data:[],
            msg:!!msg?msg:""
        }
    }
}

module.exports = jsonInstance;