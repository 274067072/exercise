import { checkAuth } from "../../util/auth"
import request from "../../util/request"

// pages/center/center.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null as any
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    checkAuth((userInfo: any) => {
      wx.setStorageSync("userInfo", userInfo)
      this.setData({ userInfo })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  changeImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success: (res) => {
        const avatarUrl = res.tempFiles[0].tempFilePath
        const userInfo = { ...this.data.userInfo, avatarUrl }
        request({
          url: `/users/${userInfo.id}`,
          method: "PUT",
          data: { ...userInfo },
          success: () => {
            this.setData({ userInfo })
            wx.setStorageSync("userInfo", userInfo)
          }
        })
      }
    })
  },
  auth() {
    checkAuth((userInfo: any) => {
      wx.setStorageSync("userInfo", userInfo)
      this.setData({ userInfo })
    })
  },
})