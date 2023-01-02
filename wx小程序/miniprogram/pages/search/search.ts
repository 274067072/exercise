import request from "../../util/request";

// pages/search/search.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchList: [] as any[]
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
  handleSearch(e: any) {
    const value = e.detail.value
    if (value.length) {
      request({
        url: `/categories?title_like=${value}`,
        method: "GET",
        success: (res: any) => {
          let searchList = res.data
          request({
            url: `/goods?title_like=${value}`,
            method: "GET",
            success: (res: any) => {
              searchList = [...searchList, ...res.data]
              this.setData({
                searchList
              })
            },
            fail: (error: any) => {
              console.log(error);
            }
          })
        },
        fail: (error: any) => {
          console.log(error);
        }
      })
    } else {
      this.setData({
        searchList: []
      })
    }


  },
  toDetail(e: any) {
    const className = e.currentTarget.dataset.class
    const id = e.currentTarget.dataset.id
    const title = e.currentTarget.dataset.title
    if (className) {
      wx.navigateTo({
        url: `../list/list?id=${id}&title=${title}`
      })
    } else {
      wx.navigateTo({
        url: `../detail/detail?id=${id}&title=${title}`
      })
    }
  }
})