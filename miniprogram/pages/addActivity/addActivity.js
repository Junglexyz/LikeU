// pages/addActivity/addActivity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:'2019-04-07',
    icon:10,
    activity:null,
    selectIcon:false,
    iconsIndex:-1,
    everyHourValue:0,
    iconsIndex:1,
    background:['#345683','#af356c','#235487','#687360'],
    goal:true
  },
  goal:function(){
    this.setData({
      goal:true
    })
  },
  habit: function () {
    this.setData({
      goal: false
    })
  },
  /**
   * 输入框内容
   */
  activity:function(e){
    this.data.name = e.detail.value
  },
  motto: function (e) {
    this.data.motto = e.detail.value
  },
  hour: function (e) {
    let deadDate = new Date(this.data.date).getTime()
    let nowDate = new Date().getTime()
    let day =Math.ceil((deadDate - nowDate)/(24*60*60*1000))
    this.data.hour = e.detail.value;
    let everyHourValue = (e.detail.value/day).toFixed(2)
    this.setData({
      everyHourValue: everyHourValue
    })
  },
  everyHour: function (e) {
    this.data.everyHour = e.detail.value
  },
  selectIcon:function(e){
    var that = this
    that.data.iconImg = e.target.dataset.iconindex+'.png'
    let index = e.target.dataset.iconindex
    that.setData({
      iconsIndex: index
    })
  },
  openSelectIcon:function(){
    this.setData({
      selectIcon:true
    })
  },
  closeSelectIcon: function () {
    this.setData({
      selectIcon: false
    })
  },
  /**
   * 日期选择器 
   */
  bindDateChange:function(e){
    let deadDate = new Date(e.detail.value).getTime()
    let nowDate = new Date().getTime()
    let day = Math.ceil((deadDate - nowDate) / (24 * 60 * 60 * 1000))
    let everyHourValue = (this.data.hour / day).toFixed(2)
    this.setData({
      date: e.detail.value,
      everyHourValue:everyHourValue
    })
  },
  submit:function(){
    let data = this.data;
    if(!data.name){
      wx.showToast({
        title: '您还未填写目标',
      })
    }
    if (!data.motto) {
      wx.showToast({
        title: '写一句激励自己的话哦',
        icon:'none'
      })
    }
    if (!data.iconImg) {
      wx.showToast({
        title: '您还未选择图标',
        icon: 'none'
      })
    }
    if (!data.hour) {
      wx.showToast({
        title: '目标时长忘了填写呢',
        icon: 'none'
      })
    }
    let rand = parseInt(Math.random()*data.background.length);
    console.log(rand)
    let color = data.background[rand];
    let object = { 'name': data.name, 'motto': data.motto, 'iconImg': data.iconImg,'iconColor':color, 'hasFinishedTime': 0, 'goalTime': data.hour, 'perDayGoalTime': data.everyHourValue,'deadline':data.date,'isPlay':false}
    console.log(object)
    let activity = wx.getStorageSync('activities')||[]
    console.log(activity)
    activity.unshift(object)
    console.log('------------------')
    console.log(activity)
    // wx.setStorageSync("activities", activity)
    wx.setStorage({
      key: 'activities',
      data: activity,
      success(res){
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  /**[{ "isPlay": false, "id": "x000", "name": "固定", "motto": "必须花费时间做的事", "iconImg": "run.png", "iconColor": "#00eeff", "hasFinishedTime": 5, "goalTime": 100, "perDayGoalTime": 2, "deadline": 30 }, { "isPlay": false, "id": "x001", "name": "浪费", "motto": "一些没有必要做的事", "iconImg": "reading.png", "iconColor": "#ff0000", "hasFinishedTime": 22 }, { "isPlay": false, "id": "x002", "name": "睡眠", "motto": "好好休息", "iconImg": "sleep.png", "iconColor": "#28c1fb", "hasFinishedTime": 34 }]**/

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1
    let day = date.getDate() + 1
    let time = year+'-'+month+'-'+day
    console.log(time)
    this.setData({
      date:time
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})