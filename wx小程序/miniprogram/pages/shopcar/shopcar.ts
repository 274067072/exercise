import { checkAuth } from "../../util/auth"
import request from "../../util/request"

// pages/shopcar/shopcar.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carList: [] as any[],
    userInfo: wx.getStorageSync("userInfo"),
    totalPrice: 0,
    isCheckAll: false,
    animation: null as any,
    moveId: -1 as number,
    animationEnd: wx.createAnimation({ duration: 150 }).translateX(0).step().export()
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
    this.auth()
    this.setData({
      animation: wx.createAnimation({ duration: 0 }).translateX(0).step().export()
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
  getCarList(userInfo: any) {
    request({
      url: `/carts?username=${userInfo.nickName}&_expand=good`,
      method: "GET",
      success: (res: any) => {
        const isCheckAll = res.data.every((item: any) => {
          return item.checked === true
        })
        this.setData({
          carList: res.data,
          userInfo,
          isCheckAll
        })
        this.calTotalPrice(res.data)
      }
    })
  }
  ,
  calTotalPrice(arr: any[]) {
    let totalPrice = 0
    arr.forEach((item) => {
      totalPrice = item.checked === true ? totalPrice + item.number * item.good.price : totalPrice
    })
    this.setData({
      totalPrice
    })
  },
  auth() {
    checkAuth((userInfo: any) => {
      this.getCarList(userInfo)
    })
  },
  handleNum(e: any) {
    const num = e.currentTarget.dataset.num;
    const id = e.currentTarget.dataset.id;
    const goods = this.data.carList.filter((item) => {
      return item.id === id
    })[0]
    goods.number = goods.number + num
    if (goods.number <= 0) {
      request({
        url: `/carts/${id}`,
        method: "DELETE",
        success: () => {
          const userInfo = wx.getStorageSync("userInfo")
          this.getCarList(userInfo)
        }
      })
    } else {
      request({
        url: `/carts/${id}`,
        method: "PUT",
        data: {
          "username": goods.username,
          "goodId": goods.goodId,
          "number": goods.number,
          "checked": goods.checked
        },
        success: () => {
          const userInfo = wx.getStorageSync("userInfo")
          this.getCarList(userInfo)
        }
      })
    }

  },
  handleChecked(e: any) {
    const id = e.currentTarget.dataset.id;
    const goods = this.data.carList.filter((item) => {
      return item.id === id
    })[0]
    goods.checked = !goods.checked
    request({
      url: `/carts/${id}`,
      method: "PUT",
      data: {
        "username": goods.username,
        "goodId": goods.goodId,
        "number": goods.number,
        "checked": goods.checked
      },
      success: () => {
        const userInfo = wx.getStorageSync("userInfo")
        this.getCarList(userInfo)
      }
    })
  },
  checkAll() {
    const isCheckAll = !this.data.isCheckAll
    this.setData({
      isCheckAll
    })
    const carList = this.data.carList.map((item) => {
      item.checked = isCheckAll
      return item
    })
    this.setData({
      carList
    })
    this.calTotalPrice(this.data.carList)
  },
  startX: 0,
  endX: 0,
  touchStart(e: any) {
    this.startX = e.changedTouches[0].pageX
    this.setData({
      animation: null,
      moveId: e.currentTarget.dataset.id
    })
  },
  touchMove(e: any) {
    this.endX = e.changedTouches[0].pageX
    const x = this.startX - this.endX
    if (x < 0) { return }
    const Animation = wx.createAnimation({ duration: 0 })
    Animation.translateX(-x).step()
    this.setData({
      animation: Animation.export()
    })
  },
  touchEnd(e: any) {
    this.endX = e.changedTouches[0].pageX
    const x = this.startX - this.endX
    if (x < 0) { return }
    if (x >= 60) {
      const duration = (100 - x) * 10 < 0 ? 0 : (100 - x) * 10
      const Animation = wx.createAnimation({ duration })
      Animation.translateX(-100).step()
      this.setData({
        animation: Animation
      })
    } else {
      const Animation = wx.createAnimation({ duration: 100 })
      Animation.translateX(0).step()
      this.setData({
        animation: Animation
      })
    }
  }
})