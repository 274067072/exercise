import request from "./request"

export function checkAuth(callback: Function) {
  const userInfo = wx.getStorageSync('userInfo')
  if (userInfo) {
    callback(userInfo)
  } else {
    wx.showModal({
      title: '授权',
      content: '是否授权用户信息?',
      success(res) {
        if (res.confirm) {
          wx.getUserInfo({
            success: function (res) {
              const userInfo = res.userInfo
              request({
                url: `/users?nickName=${userInfo.nickName}`,
                method: "GET",
                success: (res: any) => {
                  if (!res.data.length) {
                    request({
                      url: `/users`,
                      method: "POST",
                      data: {
                        ...userInfo
                      },
                      success: (res:any) => {
                        wx.setStorageSync("userInfo", res.data[0])
                        callback(res.data[0])
                      }
                    })
                  } else {
                    wx.setStorageSync("userInfo", res.data[0])
                    callback(res.data[0])
                  }
                }
              })

            }
          })
        } 
      }
    })


  }
}