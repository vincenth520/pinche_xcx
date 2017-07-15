// pages/notice/index.js
var util = require('../../utils/util.js');
Page({
  data:{},
  onLoad:function(options){
    var that = this;
    util.req('notice/index',{id:options.id},function(data){
      if(data.status == 1){
        that.setData({data:data.data});
      }
    })
  }
})