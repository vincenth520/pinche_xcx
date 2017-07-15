// pages/msg/list.js
var util = require('../../utils/util.js');
var app = getApp();
var id = 0;
var page = 1;
var arr = new Array();
Page({
  data:{},
  getList:function(id){
    var that = this;
    util.req('msg/get',{type:id,sk:app.globalData.sk,page:page},function(data){
      if(data.data == null){
        that.setData({ 'isnull': true,'nomore':true});
        return false;
      }
      if(page == 1){
        arr = new Array();
      }

      data.data.forEach(function(item){
        arr.push({
          time: util.getDateBiff(item.time * 1000),
          content: item.content,
          nickName: item.nickName,
          avatarUrl: item.avatarUrl,
          url:item.url
        })
      })
      
      that.setData({'msg':arr});
    })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    id = options.id;
    this.getList(options.id);
  },
  onPullDownRefresh: function () {
    page = 1;
    this.getList(id);
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    if (!this.data.nomore) {
      page++;
      this.getList(id);
    }
  }



})