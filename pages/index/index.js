// index.js
// 获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    _numberData: [],
    luckyNumber: 0,
    todayNumber: 0,
    prizeData: [],
  },
  onLoad() {
    this._generateluckyNumber()
    this._generateNumberData()
    this._generatePrizeData()
  },
  handleMore() {
    wx.reLaunch({
      url: 'index'
    })
  },
  _generateluckyNumber() {
    this.setData({
      luckyNumber: Math.floor(Math.random() * 100),
      todayNumber: new Date().getDate()
    })
  },
  _generateNumberData() {
    const luckyNumber = this.data.luckyNumber;
    const arr = Array.from({
      length: 100
    }).fill().map((_, i) => i)
    const numberData = Array.from({
      length: 18
    }).fill().map((_, i) => {
      const random = Math.floor(Math.random() * arr.length)
      const num = arr.splice(random, 1)[0]
      if (num === new Date().getDate() && i > 12 && Math.random() > 0.5) {
        return num - 1
      }
      if (num !== luckyNumber || (num === luckyNumber && luckyNumber === random)) {
        return num
      }
      return arr.pop() || 0
    })
    this.setData({
      _numberData: numberData
    })
  },
  _generatePrizeData() {
    const _numberData = this.data._numberData;
    const _prize = [
      5, 10, 15, 20, 30, 40,
      5, 10, 15, 20, 30, 40,
      5, 10, 15, 20, 30, 40,
      5, 10, 15, 20, 30, 40,
      5, 10, 15, 20, 30, 40,
      50, 100, 150, 200, 250, 300,
      400, 500, 600, 700, 800, 999,
    ];
    const luckyNumber = this.data.luckyNumber;
    const todayNumber = this.data.todayNumber;
    const prizeData = _numberData.map(num => {
      const prizeIndex = util.getRandom(0, _prize.length);
      const prize = _prize[prizeIndex] || "10";
      const lucky = num === luckyNumber || num === todayNumber;
      return {
        lucky,
        num: num.toString().padStart(2, '0'),
        prize: `￥${prize}`,
      }
    })
    this.setData({
      prizeData
    })
  }
})