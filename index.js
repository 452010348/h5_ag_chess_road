var L = {
  pos: function (x, y, i, title) {
    return { x: x, y: y, i: i, title: title || "", }
  },
  creatMap: function (row, col) {
    var map_box = [];
    for (var i = 0; i < row * col; i++) {
      var x = i / col << 0;
      var y = i % col;
      var j = y + x * col;
      var p = this.pos(x, y, j);
      map_box.push(p);
    };
    return map_box;
  },
  init: function () {
    console.log('初始化');

    //默认路途数据定义
    this.arr_mian = [];//珠盘路数据
    this.arr_mian_row = 15;//一行N个
    this.arr_mian_col = 6;//一列N个
    this.arr_mian_box = this.creatMap(this.arr_mian_row, this.arr_mian_col); //用索引定义数据格式 · 索引转坐标用

    this.arr_mian_i = -1;//记录下标


    //大路数据
    this.arr_big_road = [];//保存大路基本数据
    this.arr_big_road_row = 30;//一行N个
    this.arr_big_road_col = 6;//一列N个
    this.arr_big_road_right = false;
    this.arr_big_road_max_pos = { x: 0, y: 0 };//比较最大的坐标
    this.arr_big_road_right_pos = { x: 0, y: this.arr_big_road_col }

    this.arr_big_road_tieNum = 0;//大路的和次数
    this.arr_big_road_ab = [];// 0|1|2|1| 分栏存数据 用于 大眼路 小路 小强路 比较
    this.arr_big_road_i = -1;

    //大眼路 - arr_big_road 这个就是大眼路数据
    this.arr_big_eye_row = 30;
    this.arr_big_eye_col = 6;

    //小路 - arr_big_road 这个就是小路数据
    this.arr_small_road_row = 30;
    this.arr_small_road_col = 6;

    //小强路 - arr_big_road 这个就是小路数据
    this.arr_small_strong_road_row = 30;
    this.arr_small_strong_road_col = 6;
  },
  //第二个是和 相等
  is_3_00: function (o1, o2) {
    o2.x = o1.x;
    o2.y = o1.y;
    o2.type = o1.type
    o2.type_title = o1.type_title
    o2.tieNum = o1.tieNum + 1;
  },
  //第二个是和 不相等
  is_3_01: function (o1, o2) {
    this.is_3_00(o1, o2)
  },
  //第二个不是和 相等
  is_2_00: function (o1, o2) {

    if (this.arr_big_road_right == true) {
      o2.x = o1.x + 1;
      o2.y = o1.y;
    } else {
      o2.x = o1.x;
      o2.y = o1.y + 1;
    }
    this.is_2_max_y(o1, o2);
    this.is_2_max_x(o1, o2);
    this.is_max_pos(o1, o2);
    console.log("拐点坐标", this.arr_big_road_right_pos);
  },

  is_max_pos: function (o1, o2) {
    //记录上一个 o2 arr_big_road_max_pos 最长的坐标
    //用o2.x 比较 arr_big_road_max_pos.x 如果 > 大于它 则替换y
    if (o2.x > this.arr_big_road_max_pos.x) {
      this.arr_big_road_max_pos.x = o2.x;
      this.arr_big_road_max_pos.y = o2.y;
    }
    console.log("最长坐标", this.arr_big_road_max_pos);
  },
  //第二个不是和 不相等
  is_2_01: function (o1, o2) {
    console.log("arr_big_road_right", this.arr_big_road_right);
    //如果首个是和 那么退格
    if (o1.type == 3 && this.arr_big_road.length == 2) {
      this.arr_big_road_right_pos.x--;
    }

    //当y==1 && 到了最后一格 把拐点调到 右下角
    if (this.arr_big_road_max_pos.x >= this.arr_big_road_row - 1 && this.arr_big_road_right_pos.y == 1) {
      this.arr_big_road_right_pos.x = this.arr_big_road_row - 1
      this.arr_big_road_right_pos.y = this.arr_big_road_col
      console.log('更新最大 拐点调到 右下角')
    }

    //换行必须x +1
    this.arr_big_road_right_pos.x++;

    //只有相同的情况下才会被改变 所以这里只会触发一次
    if (this.arr_big_road_right == true) {
      this.arr_big_road_right_pos.y--;
      this.arr_big_road_right = false;
    }
    if (this.arr_big_road_right_pos.y <= 0) {
      this.arr_big_road_right_pos.y = this.arr_big_road_col;
    }

    //换行核心 落点位置 为 上一次转点 坐标
    o2.x = this.arr_big_road_right_pos.x;
    o2.y = 0;
    o2.i = o2.y + o2.x * this.arr_big_road_col

    //换行的时候判断o2是否是最长的x  用于 两个不同的时候垂直往下
    if (o2.x > this.arr_big_road_max_pos.x) {
      this.arr_big_road_right_pos.y = this.arr_big_road_col
    }
    this.is_2_max_x(o1, o2);
    this.is_max_pos(o1, o2);

    console.log("拐点坐标", this.arr_big_road_right_pos)
  },

  //最大Y
  is_2_max_y: function (o1, o2) {
    if (o2.x == this.arr_big_road_right_pos.x && o2.y == this.arr_big_road_right_pos.y) {
      console.log('撞到底部最大拐点')
      this.arr_big_road_right = true;
      o2.x++;
      o2.y--;
      o2.i = o2.y + o2.x * this.arr_big_road_col;

      console.log('更新最大拐点', this.arr_big_road_right_pos)
    }
  },
  //最大x
  is_2_max_x: function (o1, o2) {
    if (o2.x > this.arr_big_road_row - 1) {
      console.log('撞到右边墙了')
      this.arr_big_road.map(function (el) {
        var d = el;
        d.x--;
        d.i = d.y + d.x * this.arr_big_road_col
        return; d;
      })

      this.arr_big_road_right_pos.x--;
      if (this.arr_big_road_right_pos.x < 0) {
        this.arr_big_road_right_pos.x = -1
      }
      console.log("拐点坐标", this.arr_big_road_right_pos)
    }
  },



  //上次数据比较 
  big_road_is_equal: function (o1, o2, num) {
    if (num == 1) {
      this.arr_big_road_ab[this.arr_big_road_i].pop()
      this.arr_big_road.pop()
    }
    this.arr_big_road_ab[this.arr_big_road_i].push(o2)
    this.arr_big_road.push(o2)
  },
  //动态创建并并比较
  big_road_equal_init: function (o2) {
    this.arr_big_road_i++;
    if (typeof this.arr_big_road_ab[this.arr_big_road_i] == "undefined") {
      this.arr_big_road_ab[this.arr_big_road_i] = [];
    }
    this.arr_big_road_ab[this.arr_big_road_i].push(o2)
    this.arr_big_road.push(o2);
  },






  // 大眼路
  // 第二个不是和 相等 ==== 向下走
  big_eyes_is_equal:function(row,col){
    console.log("%c%s","color:green;","大眼路第："+row+"行，"+ col + "列", "向下走");
    var a1 = this.arr_big_road_ab[this.arr_big_road_i-1];
    var a2 = this.arr_big_road_ab[this.arr_big_road_i-0];
    if(a2.length - a1.length>=2){   
      console.log('大眼路- 大于两个不存在 - 画红圈')
      this.BigEyes$.add("庄")
    }else{
      if( !!a1[a2.length-1] ){
        console.log('存在 - 画红圈')
        this.BigEyes$.add("庄")
      }else{
        console.log('不存在 - 画蓝圈')
        this.BigEyes$.add("闲")
      }
    }
    console.log('查看下大眼路数据', this.BigEyes$.arr_big_road )
  },
  // 第二个不是和 不相等 ==== 换列
  big_eyes_equal_init:function(row,col){
    console.log("%c%s","color:green;","大眼路第："+row+"行，"+ col + "列", "换列");
    var a1 = this.arr_big_road_ab[this.arr_big_road_i-2];
    var a2 = this.arr_big_road_ab[this.arr_big_road_i-1];
    if(a1.length==a2.length){
      console.log('大眼路-是齐整，则于大眼路画红圈。')
      this.BigEyes$.add("庄")
    }else{
      console.log('大眼路-是不齐整，则于大眼路画蓝圈。')
      this.BigEyes$.add("闲")
    }
    console.log('查看下大眼路数据', this.BigEyes$.arr_big_road )
  },








  //=======小路==不跳行比较
  // 第二个不是和 相等 ==== 向下走
  small_road_is_equal_2:function(){
    var a1 = this.arr_big_road_ab[this.arr_big_road_i-1];
    var a2 = this.arr_big_road_ab[this.arr_big_road_i-0];
    if( a1.length-a2.length<=0 && !!a1[a2.length-1] ){
      console.log('小路222牌--存在 - 画红圈')
      this.SmallRoad$.add("庄")
    }
    if( a2.length-a1.length==1 && !a1[a2.length-1] ){
      console.log('小路222牌--存在 - 画蓝圈')
      this.SmallRoad$.add("闲")
    }
    if( a2.length-a1.length>=2 && !a1[a2.length-1] ){
      console.log('小路222牌--存在 - 画红圈')
      this.SmallRoad$.add("庄")

    }
  },
  //=======小路==跳行比较
  // 第二个不是和 相等 ==== 向下走
  small_road_is_equal:function(row,col){
    console.log("%c%s","color:green;","小路第："+row+"行，"+ col + "列", "向下走");
    var a1 = this.arr_big_road_ab[this.arr_big_road_i-2];
    var a2 = this.arr_big_road_ab[this.arr_big_road_i-0];
    if( a2.length - a1.length==1 && !a1[a2.length-1] ){
      console.log('小路333-不存在 - 画蓝圈')
      this.SmallRoad$.add("闲")
    }
    if(a2.length - a1.length>=2){   
      console.log('小路333-大于两个不存在 - 画红圈')
      this.SmallRoad$.add("庄")
    }
    if(a1.length-a2.length>=0 && !!a1[a2.length-1]){
      console.log('小路333-左边大于==右边  - 画红圈')
    }
  },
  // 第二个不是和 不相等 ==== 换列
  small_road_equal_init:function(row,col){
    console.log("%c%s","color:green;","小路第："+row+"行，"+ col + "列", "换列");
    var a1 = this.arr_big_road_ab[this.arr_big_road_i-3];
    var a2 = this.arr_big_road_ab[this.arr_big_road_i-1];
    if(a1.length==a2.length){
      console.log('小路333-是齐整，则于小路画红圈。')
      this.SmallRoad$.add("庄")
    }else{
      console.log('小路333-是不齐整，则于小路画蓝圈。')
      this.SmallRoad$.add("闲")
    }
  },






  // 小强路
  // 第二个不是和 相等 ==== 向下走
  small_strong_is_equal:function(row,col){
    console.log("%c%s","color:green;","小强路第："+row+"行，"+ col + "列", "向下走");
    var a1 = this.arr_big_road_ab[this.arr_big_road_i-3];
    var a2 = this.arr_big_road_ab[this.arr_big_road_i-0];
    if(a2.length - a1.length==1 && !a1[a2.length-1]){
      console.log('小强路- 画 蓝 色斜线')
      this.SmallStrongRoad$.add("闲")

    }
    if(a2.length == a1.length){   
      console.log('小强路- 画 红 色斜线。')
      this.SmallStrongRoad$.add("庄")
    }
    if(a2.length-a1.length>=2){
      console.log('小强路- 画 红 色斜线。')
      this.SmallStrongRoad$.add("庄")
    }
  },
  // 第二个不是和 不相等 ==== 换列
  small_strong_equal_init:function(row,col){
    console.log("%c%s","color:green;","小强路第："+row+"行，"+ col + "列", "换列");
    var a1 = this.arr_big_road_ab[this.arr_big_road_i-4];
    var a2 = this.arr_big_road_ab[this.arr_big_road_i-1];
    if(a1.length==a2.length){
      console.log('小强路-是齐整，画红色斜线')
      this.SmallStrongRoad$.add("庄")
    }{
      console.log('小强路-是不齐整，画蓝色斜线。')
      this.SmallStrongRoad$.add("庄")
    }
  },




















  //核心
  add: function (title) {
    var code = 0;
    switch (title) {
      case "庄":
      case "庄_庄对":
      case "庄_闲对":
      case "庄_庄对闲对":
        code = 1;
        break;

      case "闲":
      case "闲_庄对":
      case "闲_闲对":
      case "闲_庄对闲对":
        code = 2;
        break;

      case "和":
      case "和_庄对":
      case "和_闲对":
      case "和_庄对闲对":
        code = 3;
        break;
    }

    //========默认数据================
    console.log(this)
    if (this.arr_mian_i + 1 == this.arr_mian_row * this.arr_mian_col) {
      this.arr_mian.map(function (el) {
        var o = el;
        o.x -= 1;
        return
      })
      this.arr_mian_i -= this.arr_mian_col;
    }
    this.arr_mian_i++;
    var _d = {
      x: this.arr_mian_box[this.arr_mian_i].x,
      y: this.arr_mian_box[this.arr_mian_i].y,
      type: code,
      type_title: title,
      code: code,
      code_title: title,
      tieNum: 0,
      i: this.arr_mian_box[this.arr_mian_i].y + this.arr_mian_box[this.arr_mian_i].x * this.arr_big_road_col,
    }
    this.arr_mian.push(_d);





    //========默认数据================
    if (this.arr_big_road.length == 0) {
      console.log('%c%s', 'color:green', '第0个初始化数据');
      var o2 = Object.assign({}, _d)
      this.big_road_equal_init(o2);
      if (o2.type == 3) {
        this.arr_big_road_right_pos.x++;
      }
    } else {
      var o1 = Object.assign({}, this.arr_big_road[this.arr_big_road.length - 1]);
      var o2 = Object.assign({}, _d);

      if (o1.type == o2.type && code == 3) {
        console.log('%c%s', 'color:green', '第二个是和 相等');
        this.big_road_is_equal(o1, o2, 1)
        this.is_3_00(o1, o2);
      }
      if (o1.type != o2.type && code == 3) {
        console.log('%c%s', 'color:green', '第二个是和 不相等')
        this.big_road_is_equal(o1, o2, 1);
        this.is_3_01(o1, o2);
      }
      if (o1.type == o2.type && code < 3) {
        console.log('%c%s', 'color:green', '第二个不是和 相等')
        this.big_road_is_equal(o1, o2, 0);
        this.is_2_00(o1, o2);
      }

      if (o1.type != o2.type && code < 3) {
        console.log('%c%s', 'color:green', '第二个不是和 不相等');
        this.big_road_equal_init(o2)
        this.is_2_01(o1, o2);
      }
      // console.log( "珠盘路数据",this.arr_mian );
      // console.log( "大路数据",this.arr_big_road);
      // console.log( "大路分栏数据",this.arr_big_road_ab );
    }

    //不是大路的类 以下就不要执行·否则就会报错
    if( this.name != "珠盘路和大路"){
      return
    }




    //=========大眼路==================
    if(this.arr_big_road_ab.length>1){
      var row = this.arr_big_road_i;
      var col = this.arr_big_road_ab[this.arr_big_road_i].length;

      if (o1.type != o2.type && code < 3 && this.arr_big_road_ab.length==2&&col==1) {
        console.log("%c%s","color:green;","大眼路第："+row+"行，"+ col + "列", "不执行任何操作");
      }else{

        // 第二个不是和 相等 ==== 向下走
        if (o1.type == o2.type && code < 3) {
          this.big_eyes_is_equal(row,col);
        }
        // 第二个不是和 不相等 ==== 换列
        if (o1.type != o2.type && code < 3) {
          this.big_eyes_equal_init(row,col);
        }
        if( this.name=="大眼路"){
          console.log('查看下大眼路数据', this.arr_big_eye )
        }
      }
    }
    //=========大眼路==================





    // //=========小路====================
    if(this.arr_big_road_ab.length==2){
      var row = this.arr_big_road_i;
      var col = this.arr_big_road_ab[this.arr_big_road_i].length;
      if (o1.type != o2.type && code < 3 && this.arr_big_road_ab.length==2&&col==1) {
        console.log("%c%s","color:green;","小路第："+row+"行，"+ col + "列", "不执行任何操作");
      }else{
        // 第二个不是和 相等 ==== 向下走
        if (o1.type == o2.type && code < 3) {
          this. small_road_is_equal_2(row,col);
        }
        if(this.name == "小路"){
          console.log('查看小路数据', this.arr_big_eye )
        }
      }
    }

    if(this.arr_big_road_ab.length>=3){
      var row = this.arr_big_road_i;
      var col = this.arr_big_road_ab[this.arr_big_road_i].length;

      if (o1.type != o2.type && code < 3 && this.arr_big_road_ab.length==3&&col==1) {
        console.log("%c%s","color:green;","小路第："+row+"行，"+ col + "列", "不执行任何操作");
      }else{
        // 第二个不是和 相等 ==== 向下走
        if (o1.type == o2.type && code < 3) {
          this.small_road_is_equal(row,col);
        }
        // 第二个不是和 不相等 ==== 换列
        if (o1.type != o2.type && code < 3) {
          this.small_road_equal_init(row,col);
        }
        if(this.name == "小路"){
          console.log('查看小路数据', this.arr_big_eye )
        }
      }
    }
    //=========小路====================




    //=========小强路==================
    if(this.arr_big_road_ab.length>=4){
      var row = this.arr_big_road_i;
      var col = this.arr_big_road_ab[this.arr_big_road_i].length;

      if (o1.type != o2.type && code < 3 && this.arr_big_road_ab.length==4&&col==1) {
        console.log("%c%s","color:green;","小强路第："+row+"行，"+ col + "列", "不执行任何操作");
      }else{

        // 第二个不是和 相等 ==== 向下走
        if (o1.type == o2.type && code < 3) {
          this.small_strong_is_equal(row,col);
        }
        // 第二个不是和 不相等 ==== 换列
        if (o1.type != o2.type && code < 3) {
          this.small_strong_equal_init(row,col);
        }
        if( this.name=="小强路"){
          console.log('查看下小强路数据', this.arr_big_eye )
        }
      }
    }
    //=========小强路==================
    

    //渲染数据可视化
    this.render_main()
  },























  //重置
  reast:function(){
    //重新推演数据
    switch(this.name){
      case "珠盘路和大路":
        this.init();
        break;
    }
    this.BigEyes$.init();
    this.SmallRoad$.init();
    this.SmallStrongRoad$.init();
  },
  //退格
  back: function () {
    console.log('退格')
    if (this.arr_mian.length > 0) {
      this.arr_mian.pop();
      var arr = Object.assign([], this.arr_mian);
      this.reast();
      arr.forEach(function (el) {
        this.add(el.type_title);
      },this)

      //渲染数据可视化
      this.render_main()
    }
  },
  //清空
  del_all: function () {
    console.log("清空")
    this.reast();

    //渲染数据可视化
    this.render_main()
  },

  //渲染数据可视化
  render_main(){
    try {    
      //渲染珠盘路
      window.render_main(this.arr_mian, o_map_box);
      //渲染大路
      window.render_main(this.arr_big_road, o_map_big_road);
      //渲染大眼路
      window.render_main(this.BigEyes$.arr_big_road, o_map_big_eye);
      //渲染小路
      window.render_main(this.SmallRoad$.arr_big_road, o_map_small_road);
      //渲染小强路
      window.render_main(this.SmallStrongRoad$.arr_big_road, o_map_small_strong_road);
    } catch (error) {
      console.warn("此乃没有绑定 试图 渲染不出来")
    }

    return {
      arr_mian:this.arr_mian,
      arr_big_road:this.arr_big_road,
      arr_BigEyes:this.BigEyes$.arr_big_road,
      arr_SmallRoad:this.SmallRoad$.arr_big_road,
    }
  }
}


function BeadPlate() {

  this.name = "珠盘路和大路";
  //珠盘路 和 大路
  this.init();

  //大眼路
  function B(){}
  B.prototype = Object.assign({}, L);
  this.BigEyes$ = new B();
  this.BigEyes$.name = "大眼路";
  this.BigEyes$.init();

  //小路
  function S(){}
  S.prototype = Object.assign({}, L);
  this.SmallRoad$ = new S();
  this.SmallRoad$.name = "小路";
  this.SmallRoad$.init();

  //小强路
  function Q(){}
  Q.prototype = Object.assign({}, L);
  this.SmallStrongRoad$ = new Q();
  this.SmallStrongRoad$.name = "小强路";
  this.SmallStrongRoad$.init();


}
BeadPlate.prototype = Object.assign({}, L);//集成
// //============以上是路途类===================


var L$ = new BeadPlate();






var map_test;
var o_map_test;
var o_map_box;
var o_map_big_road;
var w = 20;
var h = 20;
window.onload = function () {

  //===========数据可视化理解坐标测试用的 可注释===========
  map_test = L.creatMap(10, 6);
  console.log(map_test);

  var div = document.createElement("div");
  div.className = "road";
  console.log(div);

  o_map_test = document.getElementById("map_test");
  map_test.forEach(function (o, i) {
    var d = div.cloneNode(true);
    d.style.top = o.y * 50 + "px";
    d.style.left = o.x * 50 + "px";

    o_map_test.appendChild(d);
    d.innerHTML = "<p style='color:green;'>" + o.i + "</p><p>" + o.x + "," + o.y + "</p>"
  }, this)
  //===========数据可视化理解坐标测试用的 可注释===========







  //================以下是 html5 div 数据可视化======================================
  document.querySelector('head').innerHTML += '<style>.svg-symbol{width:'+w+'px;height:'+h+'px;}.map_road{background:url(\'data:image/svg+xml;utf8,	<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="'+w+'" height="'+h+'"><rect x="0" y="0" width="'+w+'" height="'+h+'" fill="transparent" stroke="rgb(214,214,214)" stroke-width="1" stroke-opacity="1"></rect></svg>\') repeat}</style>';
  
  //默认数据
  o_map_box = document.getElementById('map_box');
  o_map_box.style.width = w * L$.arr_mian_row + "px";
  o_map_box.style.height = h * L$.arr_mian_col + "px";
  //大路
  o_map_big_road = document.getElementById('map_big_road');
  o_map_big_road.style.width = w * L$.arr_big_road_row + "px";
  o_map_big_road.style.height = h * L$.arr_big_road_col + "px";
  //大眼路
  o_map_big_eye = document.getElementById('map_big_eye');
  o_map_big_eye.style.width = w * L$.arr_big_eye_row + "px";
  o_map_big_eye.style.height = h * L$.arr_big_eye_col + "px";
  //小路
  o_map_small_road = document.getElementById('map_small_road');
  o_map_small_road.style.width = w * L$.arr_small_road_row + "px";
  o_map_small_road.style.height = h * L$.arr_small_road_col + "px";
  //小强路
  o_map_small_strong_road = document.getElementById('map_small_strong_road');
  o_map_small_strong_road.style.width = w * L$.arr_small_strong_road_row + "px";
  o_map_small_strong_road.style.height = h * L$.arr_small_strong_road_col + "px";
}










//数据可视化
function render_main(arr, target) {
  var html = "";
  target.innerHTML = html;
  arr.forEach(function (el) {
    var left = el.x * w + 'px';
    var top = el.y * h + 'px';
    // debugger
    switch (el.type_title) {
      case "庄":
        html += '<div class="svg-symbol Banker_svg" style="left:' + left + ';top:' + top + ';position:absolute"></div>';
        break;
      case "庄_庄对":
        html += '<div class="svg-symbol Banker-BP_svg"  style="left:' + left + ';top:' + top + ';position:absolute"></div>';
        break;
      case "庄_闲对":
        html += '<div class="svg-symbol Banker-PP_svg"  style="left:' + left + ';top:' + top + ';position:absolute"></div>';
        break;
      case "庄_庄对闲对":
        html += '<div class="svg-symbol Banker_svg" style="left:' + left + ';top:' + top + ';position:absolute"></div>';
        html += '<div class="svg-symbol Banker1-BP-PP_svg"  style="left:' + left + ';top:' + top + ';position:absolute"></div>'
        break;

      case "闲":
        html += '<div class="svg-symbol Player_svg" style="left:' + left + ';top:' + top + ';position:absolute"></div>';
        break;
      case "闲_庄对":
        html += '<div class="svg-symbol Player-BP_svg"  style="left:' + left + ';top:' + top + ';position:absolute"></div>';
        break;
      case "闲_闲对":
        html += '<div class="svg-symbol Player-PP_svg"  style="left:' + left + ';top:' + top + ';position:absolute"></div>';
        break;
      case "闲_庄对闲对":
        html += '<div class="svg-symbol Player-BP-PP_svg"  style="left:' + left + ';top:' + top + ';position:absolute"></div>';
        break;

      case "和":
        html += '<div class="svg-symbol Tie_svg" style="left:' + left + ';top:' + top + ';position:absolute"></div>'
        break;
      case "和_庄对":
        html += '<div class="svg-symbol Tie-BP_svg"  style="left:' + left + ';top:' + top + ';position:absolute"></div>';
        break;
      case "和_闲对":
        html += '<div class="svg-symbol Tie-PP_svg"  style="left:' + left + ';top:' + top + ';position:absolute"></div>';
        break;
      case "和_庄对闲对":
        html += '<div class="svg-symbol Tie-BP-PP_svg"  style="left:' + left + ';top:' + top + ';position:absolute"></div>';
        break;
    }
    target.innerHTML = html;
  });
}

// function render_big_road(arr) {
//   var html = "";
//   document.getElementById('map_big_road').innerHTML = html;
//   arr.forEach(function (arr, i) {
//     arr.forEach(function (el, i) {
//       var left = el.x * 30 + "px";
//       var top = el.y * 30 + "px";
//       var num = el.tieNum;
//       var type = el.type;
//       var type_title = el.type_title;
//       switch (el.type) {
//         case 1:
//           html += '<div class="svg-symbol Banker1_svg" style="left:' + left + ';top:' + top + ';position:absolute"></div>';
//           break;
//         case 2:
//           html += '<div class="svg-symbol Eye-Blue_svg" style="left:' + left + ';top:' + top + ';position:absolute"></div>';
//           break;
//         case 3:
//           html += '<div class="svg-symbol Tie1_svg" style="left:' + left + ';top:' + top + ';position:absolute"></div>';
//           break;
//       }
//     })
//   })
//   document.getElementById('map_big_road').innerHTML = html;
// }
// function render_big_eye(arr) {
//   var html = "";
//   document.getElementById('map_big_eye').innerHTML = "";
//   arr.forEach(function (arr, i) {
//     arr.forEach(function (el, i) {
//       var left = el.x * 30 + "px";
//       var top = el.y * 30 + "px";
//       var num = el.tieNum;
//       var type = el.type;
//       var type_title = el.type_title;
//       switch (el.type) {
//         case 1:
//           html += '<div class="svg-symbol Banker1_svg" style="left:' + left + ';top:' + top + ';position:absolute"></div>';
//           break;
//         case 2:
//           html += '<div class="svg-symbol Eye-Blue_svg" style="left:' + left + ';top:' + top + ';position:absolute"></div>';
//           break;
//         case 3:
//           html += '<div class="svg-symbol Tie1_svg" style="left:' + left + ';top:' + top + ';position:absolute"></div>';
//           break;
//       }
//     })
//   })
//   document.getElementById('map_big_eye').innerHTML = html;
// }
