// pages/home/home.ts
import request from "../../util/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    goodsList: [] as any[],
    searchInfo: "",
    page: 0,
    totalCount: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getSwiperData()
    this.getGoodsList()
  },
  getSwiperData() {
    request({
      url: "/recommends",
      method: "GET",
      success: (res: any) => {
        this.setData({
          swiperList: res.data
        })
      },
      fail: (error: any) => {
        console.log(error);
      }
    })
  },
  getGoodsList() {
    if (this.data.goodsList.length == this.data.totalCount || this.data.searchInfo.length) {
      wx.showToast({
        title: '没有更多商品了',
        icon: "none",
        mask: true,
        duration: 1000
      })
      return
    }
    wx.showLoading({ title: "加载中...", mask: true })
    request({
      url: `/goods?_page=${this.data.page + 1}&_limit=5`,
      method: "GET",
      success: (res: any) => {
        this.setData({
          goodsList: [...this.data.goodsList, ...res.data],
          searchList: [...this.data.goodsList, ...res.data],
          page: this.data.page + 1,
          totalCount: res.header["X-Total-Count"]
        })
        wx.hideLoading()
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
    this.getGoodsList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  toDetail: function (e: any) {
    const id = e.currentTarget.dataset.id
    const title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: `../detail/detail?id=${id}&title=${title}`
    })
  },
  toSearch() {
    wx.navigateTo({
      url: "../search/search"
    })
  }
})