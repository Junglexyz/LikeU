export default class Run{
  constructor(){
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
  }
  /**开始播放音乐 */
  audioBackgroundPlay(title, epname, singer) {
    console.log('重新开始播放...')
    wx.vibrateShort() //震动
    // wx.setStorageSync("startTime", util.time(new Date()))
    this.backgroundAudioManager.title = title
    this.backgroundAudioManager.epname = epname
    this.backgroundAudioManager.singer = singer
    this.backgroundAudioManager.coverImgUrl = 
 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
    // 设置了 src 之后会自动播放
    this.backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
    this.backgroundAudioManager.onPlay(() => {
      console.log("音乐播放开始")
    })
    this.backgroundAudioManager.onPause(() => {
      console.log("音乐播放暂停")
    })
  }
  pause(){
    wx.pauseBackgroundAudio()
  }
}