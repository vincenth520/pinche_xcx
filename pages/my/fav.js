// pages/my/list.js
var app = getApp();
var util = require('../../utils/util.js');
var page = 1;
var list = new Array();
Page({
  data:{
  tabs: ["全部", "车找人", "人找车"]
  },
  del:function(e){
    var that = this;
    var currentTarget = e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: '取消收藏?',
      success: function(res) {
        if (res.confirm) {
          util.req('fav/delFav',{sk:app.globalData.sk,iid:list[currentTarget].id},function(data){
            if(data.status == 1){
              list.splice(currentTarget,1);
              that.setData({list:list});
              wx.showToast({
                title: '取消收藏成功',
                icon: 'success',
                duration: 2000
              })
            }else{
                util.isError('取消收藏失败,请重试', that);
                return false;
            }
          })
        }
      }
    })
    return false;
  },
  onReachBottom:function(){
    if(!this.data.nomore){
      page++;
      this.getList();
    }
  },
  getList(){
    var that = this;
    util.req('fav/myFav',{sk:app.globalData.sk,page:page},function(data){
      if(data.data == null){
          if(page == 1){  
            console.log(page)        ;
            that.setData({'isnull':true});
          }
          that.setData({nomore:true});
          return false;
        } 

        if(page == 1){          
          list = new Array();
        }

        var surp = new Array('','空位','人');
        data.data.forEach(function(item){
          var obj = {
            start:((item.departure).split('市')[1]).replace(/([\u4e00-\u9fa5]+[县区]).+/,'$1'),
            over:((item.destination).split('市')[1]).replace(/([\u4e00-\u9fa5]+[县区]).+/,'$1'),
            type:that.data.tabs[item.type],
            tp:item.type,
            time:util.formatTime(new Date(item.time*1000)),
            surplus:item.surplus+surp[item.type],
            see:item.see,
            gender:item.gender,
            url:'/pages/info/index?id='+item.id,
            tm:util.getDateDiff(item.time*1000),
            id:item.id,
            fad:item.fad
          };
          list.push(obj);
        })
      that.setData({list:list});
    })
  },  
  onPullDownRefresh: function(){
    page = 1;
    this.getList();
    wx.stopPullDownRefresh();
  },
  onShow:function(){
    page = 1;
    this.getList();
  }
})