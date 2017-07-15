var app = getApp();
var util = require('../../utils/util.js'); 

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: ["我是车主", "我是乘客"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  onShow:function(){
    this.getPassenger();
    this.getMy();
  },
  tel:function(e){
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone
    })
  },
  getPassenger: function () {
    var that = this;
    util.req('appointment/getPassenger',{sk:app.globalData.sk},function(data){
      if(data.status == 1){
        var list = data.data;
        var arr = new Array();
        list.forEach(function (item) {
          var status = item.status;
          var phone = item.phone;
          if (item.status == 0 && (new Date().getTime()) > (item.time * 1000)) {
              var status = 3;
              var phone = false;
          }
          arr.push({
            departure: ((item.departure).split('市')[1]).replace(/([\u4e00-\u9fa5]+[县区]).+/, '$1'),
            destination: ((item.destination).split('市')[1]).replace(/([\u4e00-\u9fa5]+[县区]).+/, '$1'),
            time: util.formatTime(new Date(item.time * 1000)),
            status: status,
            id:item.id,
            phone: phone
          })
        })
        that.setData({ 'Passenger': arr});
      }
    })
  },
  getMy: function () {
    var that = this;
    util.req('appointment/my', { sk: app.globalData.sk }, function (data) {
      if (data.status == 1) {
        var list = data.data;
        that.setData({my:list});
      }
    })
  }
});