// pages/BT/BT.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    discoverFlag: false,
    devices: [],
    deviceId: '',
    services: [],
    characteristics: [],
    characteristicId: '',
    showFlage: true,
    showflage: false,
    name: '',
    serviceId: '',
    read: false,
    write: false,
    showKeyboard: false,
    showData: '',
  },
  onShow: function () {
    wx.getBluetoothAdapterState({
      success(res) {
        console.log(res)
        if (res.available) {
          wx: wx.showToast({
            title: '蓝牙没有打开',
          })
        }
      }
    })
  },

  openAdapter(e) {
  },

  discoverDevices() {
    let that = this
  },

  getDevice() {
    let that = this
    wx.openBluetoothAdapter({
      success(res) {
        console.log(res)
      }
    })
    
    wx.startBluetoothDevicesDiscovery({
      services: [],
      success(res) {
        console.log(res)
        that.setData({
          discoverFlag: res.isDiscovering
        })
      }
    })

    function ab2hex(buffer) {
      var hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function (bit) {
          return ('00' + bit.toString(16)).slice(-2)
        }
      )
      return hexArr.join('');
    }
    if (this.data.discoverFlag) {
      // ArrayBuffer转16进度字符串示例
      wx.onBluetoothDeviceFound(function (res) {
        var devices = res.devices;
        console.log('new device list has founded')
        console.dir(devices)
        console.log(ab2hex(devices[0].advertisData))
      })
      // ArrayBuffer转16进度字符串示例

      wx.getBluetoothDevices({
        success: function (res) {
          console.log(res)
          if (res.devices[0]) {
            console.log(ab2hex(res.devices[0].advertisData))
            that.setData({
              devices: res.devices
            })
          }
          if (that.data.devices.length >= 4) {
            wx.stopBluetoothDevicesDiscovery({
              success(res) {
                console.log(res)
              }
            })
          }
        }
      })
    }
  },

  create(e) {
    let that = this
    console.log(e)
    let index = e.currentTarget.dataset.index
    wx.createBLEConnection({
      deviceId: that.data.devices[index].deviceId,
      wx: wx.showLoading({
        title: '正在连接',
      }),
      success(res) {
        console.log(res)
        that.setData({
          deviceId: that.data.devices[index].deviceId,
          name: that.data.devices[index].name,
          showFlage: false,
          showflage: true,
        })
        wx: wx.hideLoading({

        })
        wx.getBLEDeviceServices({
          // 这里的 deviceId 需要已经通过 wx.createBLEConnection 与对应设备建立连接
          deviceId: that.data.deviceId,
          success(res) {
            console.log('device services:', res.services)
            that.setData({
              services: res.services
            })
          }
        })
      }
    })
  },
  choose(e) {
    console.log(e)
    let that = this
    let index = e.currentTarget.dataset.index
    let serviceId = this.data.services[index].uuid
    this.setData({
      serviceId: serviceId
    })
    wx.getBLEDeviceCharacteristics({
      // 这里的 deviceId 需要已经通过 wx.createBLEConnection 与对应设备建立链接
      deviceId: this.data.deviceId,
      // 这里的 serviceId 需要在 wx.getBLEDeviceServices 接口中获取
      serviceId: this.data.serviceId,
      success(res) {
        console.log('device getBLEDeviceCharacteristics:', res.characteristics)
        that.setData({
          characteristics: res.characteristics

        })
      }
    })
  },
  disconnect() {
    let that = this
    wx.closeBLEConnection({
      deviceId: this.data.deviceId,
      success(res) {
        console.log(res)
        that.setData({
          showFlage: true,
          showflage: false
        })
      }
    })
  },
  select(e) {
    let that = this
    console.log(e)
    let index = e.currentTarget.dataset.index
    let characteristicId = this.data.characteristics[index].uuid
    this.setData({
      characteristicId: characteristicId,
      showKeyboard: true
    })
    wx.notifyBLECharacteristicValueChange({ //读数据
      state: true, // 启用 notify 功能
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId: this.data.deviceId,
      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
      serviceId: this.data.serviceId,
      // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
      characteristicId: this.data.characteristicId,
      success(res) {
        console.log('notifyBLECharacteristicValueChange success', res.errMsg)

        function ab2hex(buffer) {
          let hexArr = Array.prototype.map.call(
            new Uint8Array(buffer),
            function (bit) {
              return ('00' + bit.toString(16)).slice(-2)
            }
          )
          return hexArr.join('');
        }
        wx.onBLECharacteristicValueChange(function (res) {
          console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
          console.log(ab2hex(res.value))
          console.log(ab2str(res.value))
          let value = ab2str(res.value)
          revData += value
          if (revData.length >= 30) {
            revData = value
          }
          that.setData({
            showData: revData
          })
        })
      }
    })
  },
  sendData(e) {
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
  
  yaokong(){
    let that=this
    wx.setStorageSync('ID', 
    {
      deviceId:that.data.deviceId,
      serviceId:that.data.serviceId,
      characteristicId:that.data.characteristicId
    })
    wx.navigateTo({
      url: '/pages/controler/controler',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})