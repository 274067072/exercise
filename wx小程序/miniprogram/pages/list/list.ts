import request from "../../util/request"

// pages/list/list.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [] as any[],
    price: true,
    goodcomment: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option: any) {
    const id = option.id
    const title = option.title
    wx.setNavigationBarTitle({
      title
    })
    request({
      url: `/categories/${id}?_embed=goods`,
      method: "GET",
      success: (res: any) => {
        this.setData({
          list: res.data.goods
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
  toDetail: function (e: any) {
    const id = e.currentTarget.dataset.id
    const title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: `../detail/detail?id=${id}&title=${title}`
    })
  },
  handlePrice() {
    this.setData({
      list: this.data.list.sort((item1, item2) => this.data.price ? (item1.price - item2.price) : (item2.price - item1.price)),
      price: !this.data.price
    })
  },
  handleComment() {
    this.setData({
      list: this.data.list.sort((item1, item2) => {
        const comment1 = item1.goodcomment.substring(item1.goodcomment.length - 1, 1)
        const comment2 = item2.goodcomment.substring(item2.goodcomment.length - 1, 1)
        return this.data.goodcomment ? (comment1 - comment2) : (comment2 - comment1)
      }),
      goodcomment: !this.data.goodcomment
    })
  }
})