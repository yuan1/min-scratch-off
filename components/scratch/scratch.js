// components/scratch/scratch.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    maskColor: {
      type: String,
      value: '#dddddd'
    },
    width: {
      type: Number,
      value: 350
    },
    height: {
      type: Number,
      value: 350
    },
    size: {
      type: Number,
      value: 15
    },
    scale: {
      type: Number,
      value: 0.7
    },
    circle: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    _show: false,
    _r: 30,
    _area: 90000,
    _ctx: null,
    _clearPoints: [],
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      this._init()
    },
    moved: function () {},
    detached: function () {},
  },
  /**
   * 组件的方法列表
   */
  methods: {
    touchStart(e) {
      this._eraser(e, true);
    },
    touchMove(e) {
      this._eraser(e, false);
    },
    touchEnd(e) {
      if (this.data._show) {
        this.data._ctx.clearRect(0, 0, this.properties.width, this.properties.height);
      }
    },
    _init() {
      this.data._show = false;
      this.data._clearPoints = [];
      this.data._r = this.properties.size * 2;
      this.data._area = this.properties.width * this.properties.height;
      this.createSelectorQuery().select('#myCanvas')
        .fields({
          node: true,
          size: true
        })
        .exec((res) => {
          if (!res[0]) {
            return;
          }
          const canvas = res[0].node;
          const dpr = wx.getSystemInfoSync().pixelRatio
          canvas.width = this.properties.width * dpr
          canvas.height = this.properties.height * dpr
          this.data._ctx = canvas.getContext('2d');
          this.data._ctx.scale(dpr, dpr)
          this._drawMask();
        })
    },
    _drawMask() {
      this.data._ctx.fillStyle = this.properties.maskColor;
      if (this.properties.circle) {
        this.data._ctx.arc(this.properties.width / 2, this.properties.height / 2, this.properties.width / 2, 0, 2 * Math.PI);
        this.data._ctx.fill();
      } else {
        this.data._ctx.fillRect(0, 0, this.properties.width, this.properties.height);
      }
    },
    _eraser(e, bool) {
      let len = this.data._clearPoints.length;
      let count = 0;
      let x = e.touches[0].x,
        y = e.touches[0].y;
      let x1 = x - this.properties.size;
      let y1 = y - this.properties.size;
      if (bool) {
        this.data._clearPoints.push({
          x1: x1,
          y1: y1,
          x2: x1 + this.data._r,
          y2: y1 + this.data._r
        })
      }
      for (let item of this.data._clearPoints) {
        if (item.x1 > x || item.y1 > y || item.x2 < x || item.y2 < y) {
          count++;
        } else {
          break;
        }
      }
      if (len === count) {
        this.data._clearPoints.push({
          x1: x1,
          y1: y1,
          x2: x1 + this.data._r,
          y2: y1 + this.data._r
        });
      }
      if (len && this.data._r * this.data._r * len > this.properties.scale * this.data._area) {
        this.data._show = true;
      }
      this._clearArcFun(x, y, this.data._r, this.data._ctx);
    },
    _clearArcFun(x, y, r, ctx) {
      let stepClear = 1;
      clearArc(x, y, r);

      function clearArc(x, y, radius) {
        let calcWidth = radius - stepClear;
        let calcHeight = Math.sqrt(radius * radius - calcWidth * calcWidth);
        let posX = x - calcWidth;
        let posY = y - calcHeight;
        let widthX = 2 * calcWidth;
        let heightY = 2 * calcHeight;
        if (stepClear <= radius) {
          ctx.clearRect(posX, posY, widthX, heightY);
          stepClear += 1;
          clearArc(x, y, radius);
        }
      }
    }
  }
})