var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    appInfo: {},
    login: false
  },
  onLoad: function (options) {
    var that = this;
    var vdata = {};
    // wx.getSetting({
    //   success: function (res) {
    //     console.log(res)
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.switchTab({
    //         url: '/pages/index/index',
    //       })
    //     }
    //     return false;
    //   }
    // })

    that.setData({
      appInfo: util.wxAppinfo
    });

  },
  getUserProfile: function (e) {
    var that = this;
    var userinfo = e.detail;
    console.log('sss')
    wx.getUserProfile({
      lang: 'en',
      desc: '用于完善会员资料',
      success: function (userinfo) {
        console.log(userinfo)
        wx.login({
          success: function (res) {
            util.req('user/login', {
              "code": res.code,
              "encryptedData": userinfo.encryptedData,
              "iv": userinfo.iv
            }, function (data) {
              app.setUserInfo(data.user);
              app.setSk(data.sk);
              wx.reLaunch({
                url: '/pages/index/index',
              })
            })
          }
        })
      },
      fail: function (res) {
        console.log(res)
        // that.loginFail();
      }
    })
  }
})