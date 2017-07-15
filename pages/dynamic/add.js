// pages/comment/index.js
var app = getApp();
var util = require('../../utils/util.js');  
Page({
    data: {
        files: [],
        content:'',
        gender:1
    },
  chooseImage: function (e) {
      var that = this;
      wx.chooseImage({
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              res.tempFilePaths.forEach(function(item){
                wx.uploadFile({
                  url: 'https://xcx.codems.cn/api/upload', 
                  filePath: item,
                  name: 'file',
                  formData:{
                    'user': app.globalData.userInfo.id
                  },
                  success: function(res){
                    var data = JSON.parse(res.data);
                    console.log(data);
                    if(data.status == 1){
                      that.setData({
                          files: that.data.files.concat(data.data)
                      });
                      util.clearError(that);
                    }else{
                      console.log(data.msg);
                      util.isError(data.msg, that);
                    }
                  },
                  fail:function(){
                    util.isError('图片上传失败', that);
                  }
                })
              })
          }
      })
  },
  bindinput: function(e) {
    this.setData({content:e.detail.value});
  },
  previewImage: function(e){
      wx.previewImage({
          current: e.currentTarget.id, // 当前显示图片的http链接
          urls: this.data.files // 需要预览的图片http链接列表
      })
  },
  bindfocus:function(){
      util.clearError(this);
  },
  submit:function(){
    var that = this;
    var content = that.data.content;
    //console.log(content);return false;
    if(content == '' && ((that.data.files).length == 0)){
      util.isError('请输入内容或者至少选择一张图片', that);
      return false;
    }
    util.req('dynamic/add',{
      'content':content,
      'img':JSON.stringify(that.data.files),
      'sk':app.globalData.sk
      },function(data){
      if(data.status == 1){
        wx.navigateBack({
          delta: 1
        })
      }
    })
    
    
    
  }
})