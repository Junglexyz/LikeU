//index.js
const app = getApp()
import Run from '../runtime/runtime'
var touchStart
var touchEnd
var isPlay = false;
const util = require('../../utils/util.js');
import activitiesData from '../../data/defaultData/activities.js';
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({
  data: {
    time:{},
    pulldown: null,
    tipInfo:null,
    details:null,
    run:null,
    activities:null
  },
  
  /**下拉 */

  pull:function(){

  },

  mytouchstart:function(e){
    touchStart = e.touches[0].clientY;
  },
  mytouchmove:function(e){
    var that = this;
    touchEnd = e.touches[0].clientY
    if(touchEnd-touchStart>100){
      that.moveClick(220)
    } else if (touchEnd - touchStart < -100){
      that.moveClick(0)
    }
  },

  /**上下滑动*/
  moveClick: function (distant) {
    var animation = wx.createAnimation({
      duration: 1000,
      delay: 0,
      timingFunction: "ease",
    });

    animation.translate(0, distant).step({ duration: 1000 })
    this.setData({ pulldown: animation.export() })

  },

  /**底部详情弹窗*/
  detailClick: function () {
    var animation = wx.createAnimation({
      duration: 1000,
      delay: 0,
      timingFunction: "ease",
    });

    animation.translate(0, -650).step({ duration: 1000 }).backgroundColor('rgba(100,100,100,0.3)').step({ duration: 1000 })
    this.setData({ details: animation.export() })

  },
  back:function(){
    console.log("back")
  },
  /**提示下滑 */
  tipInfo: function (distant) {
    var animation = wx.createAnimation({
      duration: 100,
      delay: 0,
      timingFunction: "ease",
    });

    animation.translate(0, distant).step({ duration: 500 }).translate(0, 0).step({ duration: 0 })
    this.setData({ tipInfo: animation.export() })

  },

  /**
   * 开始活动
   */
  audioPlay: function (e) {
    let _this = this;
    var interval = app.globalData.interval;
    var activities = _this.data.activities;
    let index = e.target.dataset.id; //本次播放的任务序号
    var lastIndex = app.globalData.lastIndex;  //上一次播放的任务序号
    var startTime = wx.getStorageSync('startTime')
    var date = util.formatYMD(new Date());
    if (app.globalData.isPlaying && index != lastIndex) {
      console.log('转换一个任务后记录')
      activities[lastIndex].isPlay = false;//前一个任务
      app.globalData.isPlaying = false;
      clearInterval(app.globalData.interval);
      _this.setData({
        hours: '00',
        minutes: '00',
        seconds: '00'
      })
      _this.recordActivityTime(date, startTime, activities[lastIndex].name, lastIndex);
    }
    if (activities[index].isPlay) { //如果这个任务已开始
      console.log('pause')
      wx.pauseBackgroundAudio();
      activities[index].isPlay = false;   //停止该任务
      app.globalData.isPlaying = false;
      console.log('停止当前任务后记录')
      clearInterval(app.globalData.interval);
      _this.recordActivityTime(date, startTime, activities[lastIndex].name, lastIndex);
      _this.setData({
        activities: activities,
        hours: '00',
        minutes: '00',
        seconds: '00'
      })
    } else {
      console.log('play')

      let seconds = 0;
      let minutes = 0;
      let hours = 0;

      app.globalData.interval = setInterval(function () {
        let secondsStr = '';
        let minutesStr = '';
        let hoursStr = '';
        seconds++;
        if (seconds % 60 == 0) {
          minutes++;
          seconds = 0;
        }
        if (minutes % 60 == 0 && minutes > 0) {
          hours++;
          minute = 0;
        }
        if (seconds < 10) {
          secondsStr = '0' + seconds;
        } else {
          secondsStr = seconds;
        }
        if (minutes < 10) {
          minutesStr = '0' + minutes;
        } else {
          minutesStr = minutes;
        }
        if (hours < 10) {
          hoursStr = '0' + hours;
        } else {
          hoursStr = hours;
        }
        _this.setData({
          hours: hoursStr,
          minutes: minutesStr,
          seconds: secondsStr
        })
      }, 1000)

      _this.audioBackgroundPlay(activities[index].name, activities[index].motto, 'me') //开始这个任务
      activities[index].isPlay = true;
      app.globalData.isPlaying = true;
      app.globalData.lastIndex = index;
      _this.setData({
        activities: activities
      })
    }
  },
  /**开始播放音乐 */
  audioBackgroundPlay: function (title, epname, singer) {
    console.log('重新开始播放...')
    wx.vibrateShort();
    wx.setStorageSync("startTime", util.time(new Date()));
    backgroundAudioManager.title = title
    backgroundAudioManager.epname = epname
    backgroundAudioManager.singer = singer
    backgroundAudioManager.coverImgUrl =
      'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
    // 设置了 src 之后会自动播放
    backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
    backgroundAudioManager.onPlay(() => {
      console.log("音乐播放开始");
    })
    backgroundAudioManager.onPause(() => {
      console.log("音乐播放暂停");
    })
  },

  /**记录任务时间 */
  recordActivityTime: function (date, startTime, activity, index) {
    var _this = this;
    console.log(date)
    var activity = wx.getStorageSync('activities') || [];
    let records = wx.getStorageSync('records') || [];
    let recordsPerDay = wx.getStorageSync('recordsPerDay') || [];
    let endTime = util.time(new Date());
    let duration = parseFloat(((util.timeToSeconds(endTime) - util.timeToSeconds(startTime)) / 60 / 60).toFixed(2));
    let activities = activitiesData;
    console.log(duration)
    if (duration < 0.1) {
      //时间少于1分钟不做记录
    }
    console.log(records.length == 0)
    //第一次记录
    if (records.length == 0) {
      console.log('第一次记录')
      activities[index].hasFinishedTime = activity[index].hasFinishedTime + duration;
      let objects = { "date": date, "times": [{ "startTime": startTime, "endTime": endTime, "activity": activity[index].name, "duration": duration }] };
      let obj = { date: date };
      for(let i=0;i<activities.length;i++){
        let key = activities[i].name;
        obj[key] = 0;
      }
      let key = activity[index].name;
      console.log(key)
      obj[key] = duration;
      recordsPerDay.unshift(obj)
      records.unshift(objects);
      wx.setStorageSync("records", records);
      wx.setStorageSync("activities", activity);
      wx.setStorageSync("recordsPerDay", recordsPerDay);
      return;
    }
    //记录新的一天
    if (records[0].date != date) {
      console.log('第二次记录if内')
      activities[index].hasFinishedTime = activity[index].hasFinishedTime + duration;
      let objects = { "date": date, "times": [{ "startTime": startTime, "endTime": endTime, "activity": activity[index].name, "dutation": duration }] };
      //recordsPerDay
      let obj = { date: date };
      let key = activity[index].name;
      console.log(key)
      obj[key] = duration;
      recordsPerDay.unshift(obj);
      records.unshift(objects);
      wx.setStorageSync("recordsPerDay", recordsPerDay);
      wx.setStorageSync("records", records);
      wx.setStorageSync("activities", activity);
      return;
    }
    console.log('第三次记录')
    activities[index].hasFinishedTime = activity[index].hasFinishedTime + duration;
    let times = records[0].times;
    let object = { "startTime": startTime, "endTime": endTime, "activity": activity[index].name, "dutation": duration }

    //recordsPerDay
    let obj = recordsPerDay[0];
    let key = activity[index].name;
    console.log(obj[key] == undefined)
    if (obj[key] == undefined) {
      obj[key] = duration;
    } else {
      obj[key] = (parseFloat(obj[key]) + duration).toFixed(2);
      console.log(obj[key])
    }

    console.log(obj)

    times.push(object);
    wx.setStorageSync("records", records);
    wx.setStorageSync("activities", activity);
    wx.setStorageSync("recordsPerDay", recordsPerDay)
    console.log(records)
  },
  /** 跳转到活动详情*/
  activityDetails: function (e) {
    console.log(e)
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../activityDetails/activityDetails' + '?' + 'name' + '=' + name
    });
  },
  onLoad: function() {
    var that = this;
    var activities = wx.getStorageSync('activities');
    var weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    var date = new Date();
    //获取时间
    var time = {
      'year': date.getFullYear(),
      'month': date.getMonth() + 1,
      'day': date.getDate(),
      'week': weeks[date.getDay()],
      'hour': date.getHours(),
      'minute': timeFormat(date.getMinutes())
    }
    that.setData({
      time: time,
      activities: activities
    })
    var t = setInterval(function(){
      var date = new Date();
      //获取时间
      var time = {
        'year': date.getFullYear(),
        'month': date.getMonth() + 1,
        'day': date.getDate(),
        'week': weeks[date.getDay()],
        'hour': date.getHours(),
        'minute': timeFormat(date.getMinutes())
      }
      that.setData({
        time: time
      })
    },30*1000)
    function timeFormat(time) {
      if (time < 10) {
        return '0' + time
      }else{
        return time
      }
    }
    
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
  }
})
