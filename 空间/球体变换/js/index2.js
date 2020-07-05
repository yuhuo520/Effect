var vm;
new Vue({
	el: '#main',
	data: {
		length: 5 * 5 * 5,
		list: [],
		roX: 0,
		roY: 0,
		trZ: -2000,
	},
	computed: {
		// 容器样式
		ulStyle: function() {
			return {
				transform: "translateZ(" + this.trZ + "px) rotateX(" +
				           this.roX + "deg) rotateY(" + this.roY + "deg)"
			}
		},
		//表格样式
		tableStyle: function() {
			var tableStyle = [];
			var n = Math.ceil(vm.length / 18) + 2;
			var midY = n / 2 - 0.5;
			var midX = 18 / 2 - 0.5;
			var disX = 170;
			var disY = 210;
			var arr = [
			    {x : 0, y : 0},
			    {x : 17, y : 0},
			    {x : 0, y : 1},
			    {x : 1, y : 1},
			    {x : 12, y : 1},
			    {x : 13, y : 1},
			    {x : 14, y : 1},
			    {x : 15, y : 1},
			    {x : 16, y : 1},
			    {x : 17, y : 1},
			    {x : 0, y : 2},
			    {x : 1, y : 2},
			    {x : 12, y : 2},
			    {x : 13, y : 2},
			    {x : 14, y : 2},
			    {x : 15, y : 2},
			    {x : 16, y : 2},
			    {x : 17, y : 2}
			];
			for (i = 0; i < vm.length; i++) {
			    var x,y;
			    if ( i < 18 ){
			        x = arr[i].x;
			        y = arr[i].y;
			    }else{
			        x = i % 18;
			        y = Math.floor(i / 18) + 2;
			    }
			    tableStyle.push({
					transform: "translate3D("+(x-midX)*disX+"px, "+(y-midY)*disY+"px, 0px)"
				});
			}
			return tableStyle;
		}
	},
	methods: {
		//页面初始化
		init() {
			// 面板数量
			for (let i = 0; i < vm.length; i++) {
				//初始的随机位置
				let tX = Math.random()*6000-3000;
				let tY = Math.random()*6000-3000;
				let tZ = Math.random()*6000-3000;
				vm.list.push({
					// 序号
					index : i, 
					// 层叠布局中的坐标
					x : i % 5,
					y : Math.floor(i % 25 / 5),
					z : Math.floor(i / 25),
					// 显示数据
					type : "Css3",
					author : "羊村扛把子",
					time : "2017-05-02",
					// 位置样式
					style : {
						transform: "translate3D("+tX+"px,"+tY+"px,"+tZ+"px)"
					}
				});
			}
			// setTimeout(vm.toGrid , 200);
		},
		pageEvent() {
			var timerMouse = null;
			var lastX, lastY;	// 存最后一次move的坐标
			var x_, y_; 	// 用来存最后两次move的距离差
			var ifMove;		// 检测up之前是否有move
			var moveTime;	// 用来解决最后一次move后很久再up还会有惯性的问题
			var ifTime;	// 解决短时间内误拖拽导致弹出层不出来的问题
			var thisLi;	
			// 鼠标按下事件
			document.onmousedown = function (e) {
				lastX = e.clientX;
				lastY = e.clientY;
				x_ = y_ = 0;
				ifMove = false;
				moveTime = 0;
				ifTime = new Date;
			    //取消掉还没完成的惯性
			    cancelAnimationFrame(timerMouse);
			    //解决down和up在同一个li身上触发，导致拖拽结束后还会弹窗的问题
			    if ( /b/i.test(e.target.nodeName) ){
			        thisLi = e.target;
			    }
				// 鼠标按下时注册移动事件
				document.onmousemove = function (e) {
				    ifMove = true;
				    x_ = e.clientX - lastX;
				    y_ = e.clientY - lastY;
							
				    vm.roX -= y_*0.15;
				    vm.roY += x_*0.15;
					
				    lastX = e.clientX;
				    lastY = e.clientY;
							
				    moveTime = new Date;
				};
			};
			
			document.onmouseup = function (e) {
			    if ( ifMove && (e.target === thisLi) && (new Date - ifTime) > 500 ){
			        thisLi.goudan = true; //给true的话，就会阻止弹窗的发生
			    }
				// 清空移动事件
			    this.onmousemove = null;
			    function m() {
			        x_ *= 0.9;
			        y_ *= 0.9;
			        vm.roX -= y_*0.15;
			        vm.roY += x_*0.15;
					
			        if ( Math.abs(x_) < 0.1 && Math.abs(y_) < 0.1 )return;
			        timerMouse = requestAnimationFrame(m);
			    }
			    if ( new Date - moveTime < 100 ){
			        timerMouse = requestAnimationFrame(m);
			    }
			}
			
			// 滚轮缩放事件
			if ( document.onmousewheel === undefined ){
				// 火狐浏览器不支持onmousewheel事件
			    document.addEventListener("DOMMouseScroll" , function (e) {
			        var d = -e.detail/3;
					vm. trZ += d * 100;
			    },false);
			}else{
			    document.onmousewheel = function (e) {
			        var d = e.wheelDelta / 120;
			        vm. trZ += d * 100;
			    }
			}
			
			document.onselectstart = function () {
			    return false;
			};
			document.ondrag = function () {
			    return false;
			};
		},
		//Table 元素周期表布局
		toTable() {
		    for (var i = 0; i < vm.length; i++) {
		        vm.list[i].style = vm.tableStyle[i];
		    }
		},
		//Sphere 球状布局
		toSphere() {
		    if ( Sphere.arr ){
		        for (var i = 0; i < length; i++) {
		            aLi[i].style.transform = Sphere.arr[i];
		        }
		    }else{
		        Sphere.arr = [];
		        var arr = [1,3,7,9,11,14,21,16,12,10,9,7,4,1],
		            arrLength = arr.length,
		            xDeg = 180 / (arrLength-1);
		        for (i = 0; i < length; i++) {
		
		            //求出当前 i 处于arr的第几层 第几个
		            var numC = 0 , numG = 0;
		            var arrSum = 0;
		            for (var j = 0; j < arrLength; j++) {
		                arrSum += arr[j];
		                if ( arrSum > i ){
		                    numC = j;
		                    numG = arr[j] - (arrSum - i);
		                    break;
		                }
		            }
		            var yDeg = 360 / arr[numC];
		            var val = "rotateY("+(numG+1.3)*yDeg+"deg) rotateX("+(90-numC*xDeg)+"deg) translateZ(800px)";
		            Sphere.arr[i] = val;
		            aLi[i].style.transform = val;
		        }
		    }
		
		},
		//Helix 螺旋式布局
		toHelix() {
		    if (Helix.arr){
		        for (var i = 0; i < length; i++) {
		            aLi[i].style.transform = Helix.arr[i];
		        }
		    }else{
		        Helix.arr = [];
		        var h = 3.7,//环数
		            tY = 7,//每个li上下位移相差
		            num = Math.round(length/h),//每环个数
		            deg = 360 / num,//每个li Y旋转相差
		            mid = length/2 - 0.5;//找准中间点
		        for (i = 0; i < length; i++) {
		            var val = "rotateY("+i*deg+"deg) translateY("+(i-mid)*tY+"px) translateZ(800px)";
		            Helix.arr[i] = val;
		            aLi[i].style.transform = val;
		        }
		    }
		
		},
		//Grid 层叠式布局
		toGrid() {
		    if ( Grid.arr ){
		        for (i = 0; i < length; i++) {
		            aLi[i].style.transform = Grid.arr[i];
		        }
		    }else{
		        Grid.arr = [];
		        var disX = 350;//每个li 水平（x）方向的间距
		        var disY = 350;//每个li 垂直（y）方向的间距
		        var disZ = 800;//每个li 纵深（z）方向的间距
		        for (var i = 0; i < length; i++) {
		            var oLi = aLi[i];
		            var x = (oLi.x - 2) * disX,
		                y = (oLi.y - 2) * disY,
		                z = (oLi.z - 2) * disZ;
		            var val = "translate3D("+x+"px,"+y+"px,"+z+"px)";
		            Grid.arr[i] = val;
		            oLi.style.transform = val;
		        }
		    }
		
		}
	},
	created() {
		vm = this;
		vm.init();
		vm.pageEvent();
	}
})