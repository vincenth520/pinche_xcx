//app.js
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
                wx.request({
                  url: 'https://xcx.codems.cn/api/user/vaild_sk',
                  data: {
                    "sk":sk
                  },
                  method: 'POST', 
                  header: {'Content-Type':'application/x-www-form-urlencoded'},
                  success:function(data){
                    if(data.data.status == 1){
                      that.globalData.sk = sk;
                    }else{
                      that.login();
                      return;
                    }
                    
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
    var that = this;
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          success: function(userinfo){
            wx.request({
              url: 'https://xcx.codems.cn/api/user/login',
              data: {
                "code":res.code,
                "encryptedData":userinfo.encryptedData,
                "iv":userinfo.iv
              },
              method: 'POST', 
              header: {
                'Content-type':'application/json'
              },
              success:function(data){
                data = data.data;
                console.log(data);
                that.setUserInfo(data.user);
                that.setSk(data.sk);
              }
            })
          },
          fail: function(res) {
            that.loginFail();
          }
        })
      }
    })
  } ,

  loginFail: function () {
    var that = this;
    wx.showModal({
        content: '登录失败，请允许获取用户信息,如不显示请删除小程序重新进入',
        showCancel: false
    });
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