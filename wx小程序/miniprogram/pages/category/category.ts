import request from "../../util/request"

// pages/category/category.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [] as any[],
    current: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getCategory()
  },
  getCategory() {
    request({
      url: "/categories?_embed=goods",
      method: "GET",
      success: (res: any) => {
        this.setData({
          categories: res.data
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
  handleCurrent(e: any) {
    this.setData({
      current: e.currentTarget.dataset.index
    })
  },
  toDetail(e: any) {
    const id = e.currentTarget.dataset.id
    const title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: `../detail/detail?id=${id}&title=${title}`
    })
  }
})