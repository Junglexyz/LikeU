//index.js
const app = getApp()
var touchStart
var touchEnd
Page({
  data: {
    status:{people:true,pet:false,type:'people'},
    sysWH:null,
    pullup:null,
    pullupFirst:null,
    bgUrl:[],
    people: [
    { bgImg: 'add.png', itemName: '添加' },
    { bgImg: 'video.png', itemName: '影像' },
    { bgImg: 'albums.png', itemName: '相册' }, 
    { bgImg: 'stele.png', itemName: '碑文'},
    { bgImg: 'biography.png', itemName: '传记'},
    { bgImg: 'donation.png', itemName: '捐献'},
    { bgImg: 'giveFlower.png', itemName: '献花' },
    { bgImg: 'getFlower.png', itemName: '领花'}],
    pet: [
    { bgImg: 'add.png', itemName: '添加' },
    { bgImg: 'video.png', itemName: '影像' },
    { bgImg: 'albums.png', itemName: '相册' },
    { bgImg: 'star.png', itemName: '星球' },
    { bgImg: 'nearby.png', itemName: '周边' },
    { bgImg: 'file.png', itemName: '档案' },
    { bgImg: 'giveFlower.png', itemName: '献花' },
    { bgImg: 'getFlower.png', itemName: '领花' }]
  },

  onLoad: function() {
    var that = this
    var bgUrl;
    let systemInfo = wx.getSystemInfoSync()
    let sysWH = {width:systemInfo.windowWidth,height:systemInfo.windowHeight}
    let people = that.data.people
    console.log(sysWH)
    let radius = parseInt(sysWH.width)/2 - 40
    let angle = Math.PI/4
    for(let i=0;i<people.length;i++){
      people[i].x = radius*Math.cos(i*angle)
      people[i].y = -radius*Math.sin(i*angle)
    }

    wx.cloud.getTempFileURL({
      fileList: ['cloud://likeyou-ddcc21.6c69-likeyou-ddcc21/system/my-image15553020528450','cloud://likeyou-ddcc21.6c69-likeyou-ddcc21/system/my-image15553020528451'],
      success: res => {
        // get temp file URL
        console.log(res.fileList)
        bgUrl = res.fileList
        console.log(bgUrl)
        that.setData({
          sysWH: sysWH,
          items: people,
          bgUrl: bgUrl
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  pet:function(){
    var that = this
    let systemInfo = wx.getSystemInfoSync()
    let sysWH = { width: systemInfo.windowWidth, height: systemInfo.windowHeight }
    let pet = that.data.pet
    let radius = parseInt(sysWH.width) / 2 - 40
    let angle = Math.PI / 4
    console.log(radius)
    for (let i = 0; i < pet.length; i++) {
      pet[i].x = radius * Math.cos(i * angle)
      pet[i].y = -radius * Math.sin(i * angle)
    }
    that.setData({
      status:{people:false,pet:true,type:'pet'},
      sysWH: sysWH,
      items: pet
    })
  },
  people:function(){
    var that = this
    let systemInfo = wx.getSystemInfoSync()
    let sysWH = { width: systemInfo.windowWidth, height: systemInfo.windowHeight }
    let people = that.data.people
    let radius = parseInt(sysWH.width) / 2 - 40
    let angle = Math.PI / 4
    for (let i = 0; i < people.length; i++) {
      people[i].x = radius * Math.cos(i * angle)
      people[i].y = -radius * Math.sin(i * angle)
    }
    that.setData({
      status: { people: true, pet: false, type: 'people' },
      sysWH: sysWH,
      items: people
    })
  },
  pause:function(){
    console.log("pause")
  },
  mytouchstart: function (e) {
    touchStart = e.touches[0].clientY;
  },
  mytouchmove: function (e) {
    var that = this;
    touchEnd = e.touches[0].clientY
    if (touchEnd - touchStart > 100) {
      that.moveClick(0)
    } else if (touchEnd - touchStart < -100) {
      that.moveClick(-that.data.sysWH.height)
    }
  },

  /**上下滑动*/
  moveClick: function (down) {
    var animation = wx.createAnimation({
      duration: 0,
      delay: 0,
      timingFunction: "ease",
    });
    animation.translateY(down).step({ duration: 2000 })
    this.setData({ 
      pullup: animation.export() ,
      })
  },
})
