// pages/auto/auto.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Distance:'',
    deviceId:'',
    serviceId:'',
    characteristicId:''
  },
  Start(){
    let value = 'o'
    // 向蓝牙设备发送数据
    let buffer = new ArrayBuffer(value.length)
    let dataView = new DataView(buffer)
    for (let i = 0; i < value.length; i++) {
      dataView.setUint8(i, value[i].charCodeAt())
    }
    wx.writeBLECharacteristicValue({
      // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: this.data.deviceId,
      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
      serviceId: this.data.serviceId,
      // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
      characteristicId: this.data.characteristicId,
      // 这里的value是ArrayBuffer类型
      value: buffer,
      success(res) {
        console.log(buffer)
        console.log('writeBLECharacteristicValue success', res.errMsg)
        wx.showToast({
          title: '发送成功',
        })
      },
      fail(res) {
        wx.showToast({
          title: '发送失败',
        })
      }
    })
  },
  sendData(e){
    console.log(e)
    let value = e.detail.value
    // 向蓝牙设备发送数据
    let buffer = new ArrayBuffer(value.length)
    let dataView = new DataView(buffer)
    for (let i = 0; i < value.length; i++) {
      dataView.setUint8(i, value[i].charCodeAt())
    }
    wx.writeBLECharacteristicValue({
      // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: this.data.deviceId,
      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
      serviceId: this.data.serviceId,
      // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
      characteristicId: this.data.characteristicId,
      // 这里的value是ArrayBuffer类型
      value: buffer,
      success(res) {
        console.log(buffer)
        console.log('writeBLECharacteristicValue success', res.errMsg)
        wx.showToast({
          title: '发送成功',
        })
      },
      fail(res) {
        wx.showToast({
          title: '发送失败',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var value=wx.getStorageSync('ID')
    if(value){
      this.setData({
        deviceId:value.deviceId,
        serviceId:value.serviceId,
        characteristicId:value.characteristicId
      })
    }
    wx.createBLEConnection({
      deviceId:this.data.deviceId,
      success (res) {
        console.log(res)
        wx.getBLEDeviceServices({
          // 这里的 deviceId 需要已经通过 wx.createBLEConnection 与对应设备建立连接
          deviceId:this.data.deviceId,
          success (res) {
            console.log('device services:', res.services)
            wx.getBLEDeviceCharacteristics({
              // 这里的 deviceId 需要已经通过 wx.createBLEConnection 与对应设备建立链接
              deviceId:this.data.deviceId,
              // 这里的 serviceId 需要在 wx.getBLEDeviceServices 接口中获取
              serviceId:this.data.serviceId,
              success (res) {
                console.log('device getBLEDeviceCharacteristics:', res.characteristics)
              }
            })
          }
        })
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

  }
})