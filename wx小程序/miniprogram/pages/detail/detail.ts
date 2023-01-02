import { checkAuth } from "../../util/auth"
import request from "../../util/request"
export type Detail = {
  "id": string,
  "categoryId": number,
  "title": string,
  "feature": string,
  "price": number,
  "goodcomment": string,
  "poster": string,
  "slides": string[],
  "desc": string[]
}
// pages/detail/detail.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    current: 0,
    comments: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option: any) {
    wx.setNavigationBarTitle({
      title: option.title
    })
    const id = option.id
    this.getDetail(id)
    this.getComments()
  },
  getDetail(id: string) {
    request({
      url: `/goods?id=${id}`,
      method: "GET",
      success: (res: any) => {
        this.setData({
          detail: res.data[0]
        })
      },
      fail: (error: any) => {
        console.log(error);
      }
    })
  },
  getComments() {
    request({
      url: "/comments",
      method: "GET",
      success: (res: any) => {
        this.setData({
          comments: res.data
        })
      },
      fail: (error: any) => {
        console.log(error);

      }
    })
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
  handleTap(e: any) {
    const current = `http://localhost:5000${e.currentTarget.dataset.current}`
    let urls = (this.data.detail as Detail).slides
    urls = urls.map((url) => {
      return `http://localhost:5000${url}`
    })
    wx.previewImage({
      current,
      urls
    })
  },
  handleSubNavTap(e: any) {
    const current = e.currentTarget.dataset.current
    this.setData({
      current
    })
  },
  toShopCar() {
    wx.switchTab({
      url: "../shopcar/shopcar"
    })

  },
  addShopCar() {
    checkAuth((userInfo: any) => {
      request({
        url: `/carts?goodId=${(this.data.detail as Detail).id}&username=${userInfo.nickName}`,
        method: "GET",
        success: (res: any) => {
          if (res.data.length) {
            request({
              url: `/carts/${res.data[0].id}`,
              method: "PUT",
              data: {
                ...res.data[0],
                "number": res.data[0].number + 1
              },
              success: () => {
                wx.showToast({
                  title: '加入购物车成功',
                  icon: 'success',
                  duration: 2000
                })

              }
            })
          } else {
            request({
              url: "/carts",
              method: "POST",
              data: {
                "username": userInfo.nickName,
                "goodId": (this.data.detail as Detail).id,
                "number": 1,
                "checked": false
              },
              success: () => {
                wx.showToast({
                  title: '加入购物车成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            })
          }
        },
        fail: (error: any) => {
          console.log(error);
        }
      })
    })
  }
})