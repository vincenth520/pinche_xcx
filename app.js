//app.js
var util = require('utils/util.js');
App({

  onLaunch: function () {
    var that = this;
    //小程序初始化先判断用户是否登录    
      wx.checkSession({
        success: function(){  
          wx.getStorage({  
            key: 'sk',
            success: function(res) {
                var sk = res.data;
                util.req('user/vaild_sk', { "sk": sk }, function (data) {
                  if (data.status == 1) {
                    that.globalData.sk = sk;
                  } else {
                    that.login();
                    return;
                  }
                })
            },
            fail:function() {
              that.login();
               return;
            }
          })

          wx.getStorage({  
            key: 'userInfo',
            success: function(res) {
                that.globalData.userInfo = res.data;
            },
            fail:function() {
              that.login();
            }
          });
        },
        fail: function(){
          //登录态过期
          that.login() //重新登录
        }
      })
    
  },

  login:function(){

    wx.reLaunch({
      url: '/pages/toLogin/toLogin'
    })
    
  } ,

  loginFail: function () {
    var that = this;
    // wx.showModal({
    //     content: '登录失败，请允许获取用户信息,如不显示请删除小程序重新进入',
    //     showCancel: false
    // });
    that.login();
  },
  setUserInfo:function(data){   //将用户信息缓存保存
    this.globalData.userInfo = data;
    wx.setStorage({
      key:"userInfo",
      data:data
    })
  },
  setSk:function(data){   //将用户信息缓存保存
    this.globalData.sk = data;
    wx.setStorage({
      key:"sk",
      data:data
    })
  },
  globalData:{
    userInfo:null,
    sk:null
  }
  
})