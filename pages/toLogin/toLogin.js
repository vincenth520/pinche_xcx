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
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }
        return false;
      }
    })

    that.setData({
      appInfo: util.wxAppinfo
    });

  },
  bindGetUserInfo: function (e) {
    var that = this;
    var userinfo = e.detail;
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          success: function (userinfo) {
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
          },
          fail: function (res) {
            // that.loginFail();
          }
        })
      }
    })
  }
})