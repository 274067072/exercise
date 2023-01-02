export default function request(params: any) {
  wx.request({
    ...params,
    url: `http://localhost:5000${params.url}`
  })
}