window.onload = function () {

    (function(){
        //重要变量
        var length = 5*5*5,//li总个数
            oUl = document.getElementById("list").children[0],//所有li的父级
            aLi = oUl.children;//所有li

        //初始化
        (function(){
            for (var i = 0; i < length; i++) {
                var oLi = document.createElement("li");
                oLi.index = i;
                oLi.x = i % 5;
                oLi.y = Math.floor( i%25/5 ) ;
                oLi.z = 4 - Math.floor( i/25 ) ;

                var d = flyData[i] || flyData[0];
                oLi.innerHTML = "<b class='liCover'></b>" +
                    "<p class='liTitle'>"+d.type+"</p>" +
                    "<p class='liAuthor'>"+d.author+"</p>" +
                    "<p class='liTime'>"+d.time+"</p>";

                var tX = Math.random()*6000-3000,
                    tY = Math.random()*6000-3000,
                    tZ = Math.random()*6000-3000;

                oLi.style.transform = "translate3D("+tX+"px,"+tY+"px,"+tZ+"px)";
                oUl.appendChild(oLi);
            }
            setTimeout(Grid , 200);
        })();

        //关于弹窗事件
        (function(){
            var oAlert = document.getElementById("alert"),
                oATitle = oAlert.getElementsByClassName("title")[0].getElementsByTagName("span")[0],
                oAImg = oAlert.getElementsByClassName("img")[0].getElementsByTagName("img")[0],
                oAAuthor = oAlert.getElementsByClassName("author")[0].getElementsByTagName("span")[0],
                oAInfo = oAlert.getElementsByClassName("info")[0].getElementsByTagName("span")[0];
            var oAll = document.getElementById("all");
            var oBack = document.getElementById("back");
            var oFrame = document.getElementById("frame");
            //li点击出现弹出层
            oUl.onclick = function (e) {
                var target = e.target;
                if ( /b/i.test(target.nodeName) ){
                    if ( target.goudan ){
                        target.goudan = false;
                    }else{
                        if ( oAlert.style.display==="block" ){
                            hide()
                        }else{
                            var index = target.parentNode.index;
                            var d = flyData[index] || flyData[0];
                            oAlert.index = index;
                            oATitle.innerHTML = "课题：" + d.title;
                            oAImg.src = d.src;
                            oAAuthor.innerHTML = "主讲老师：" + d.author;
                            oAInfo.innerHTML = "描述：" + d.dec;
                            show();
                        }
                    }
                }
                e.cancelBubble = true;
            };
            //弹出层上点击
            oAlert.onclick = function (e) {
                var d = flyData[this.index] || flyData[0];
                oFrame.src = "src/" + d.src + "/index.html";
                oAll.className = "left";
                e.cancelBubble = true;
            };
            //弹出层消失的触发
            document.onclick = function () {
                hide();
            };
            //Back按钮的点击
            oBack.onclick = function () {
                oAll.className = "";
            };

            //弹出层的显示
            function show() {
                if ( !oAlert.timer ){
                    oAlert.timer = true;
                    oAlert.style.display = "block";
                    oAlert.style.transform = "rotateY(0deg) scale(2)";
                    oAlert.style.opacity = "0";
                    var time = 300,
                        sTime = new Date();
                    function m() {
                        var prop = (new Date - sTime) / time;
                        if ( prop >= 1 ){
                            prop = 1;
                            oAlert.timer = false;
                        }else{
                            requestAnimationFrame(m);
                        }
                        oAlert.style.transform = "rotateY(0deg) scale("+(2-prop)+")";
                        oAlert.style.opacity = prop;
                    }
                    requestAnimationFrame(m);
                }
                return false;
            }
            //弹出层的隐藏
            function hide() {
                if ( oAlert.style.display === "block"&& !oAlert.timer ){
                    oAlert.timer = true;
                    oAlert.style.display = "block";
                    oAlert.style.transform = "rotateY(0deg) scale(1)";
                    oAlert.style.opacity = "1";
                    var time = 300,
                        sTime = new Date;
                    function m() {
                        var prop = (new Date - sTime) / time;
                        if ( prop >= 1 ){
                            prop = 1;
                            oAlert.timer = false;
                            oAlert.style.display = "none";
                        }else{
                            requestAnimationFrame(m);
                        }
                        oAlert.style.transform = "rotateY("+180*prop+"deg) scale("+(1-prop)+")";
                        oAlert.style.opacity = 1-prop;
                    }
                    requestAnimationFrame(m);
                }
            }
        })();

        //拖拽/滚轮事件的添加
        (function(){
            var roX = 0,
                roY = 0,
                trZ = -2000,
                timerMouse = null;

            document.onselectstart = function () {
                return false;
            };
            document.ondrag = function () {
                return false;
            };
            document.onmousedown = function (e) {
                //取消掉还没完成的惯性
                cancelAnimationFrame( timerMouse );

                var sX = e.clientX,
                    sY = e.clientY,
                    lastX = sX,//存最后一次move的坐标
                    lastY = sY,//存最后一次move的坐标
                    x_ = 0,//用来存最后两次move的距离差
                    y_ = 0,//用来存最后两次move的距离差
                    ifMove = false,//检测up之前是否有move
                    moveTime = 0,//用来解决最后一次move后很久再up还会有惯性的问题
                    ifTime = new Date;//解决短时间内误拖拽导致弹出层不出来的问题

                //解决down和up在同一个li身上触发，导致拖拽结束后还会弹窗的问题
                if ( /b/i.test(e.target.nodeName) ){
                    var thisLi = e.target;
                }

                this.onmousemove = function (e) {
                    ifMove = true;
                    x_ = e.clientX - lastX;
                    y_ = e.clientY - lastY;

                    roX -= y_*0.15;
                    roY += x_*0.15;

                    oUl.style.transform = "translateZ("+trZ+"px) rotateX("+roX+"deg) rotateY("+roY+"deg)";

                    lastX = e.clientX;
                    lastY = e.clientY;

                    moveTime = new Date;
                };
                this.onmouseup = function (e) {
                    if ( ifMove && (e.target === thisLi) && (new Date - ifTime) > 500 ){
                        thisLi.goudan = true; //给true的话，就会阻止弹窗的发生
                    }
                    this.onmousemove = null;
                    function m() {
                        x_ *= 0.9;
                        y_ *= 0.9;
                        roX -= y_*0.15;
                        roY += x_*0.15;
                        oUl.style.transform = "translateZ("+trZ+"px) rotateX("+roX+"deg) rotateY("+roY+"deg)";
                        if ( Math.abs(x_) < 0.1 && Math.abs(y_) < 0.1 )return;
                        timerMouse = requestAnimationFrame(m);
                    }
                    if ( new Date - moveTime < 100 ){
                        timerMouse = requestAnimationFrame(m);
                    }
                }
            };

            !function ( fn ) {
                if ( document.onmousewheel === undefined ){
                    document.addEventListener("DOMMouseScroll" , function (e) {
                        var d = -e.detail/3;
                        fn.call(this , d);
                    },false);
                }else{
                    document.onmousewheel = function (e) {
                        var d = e.wheelDelta / 120;
                        fn.call(this , d);
                    }
                }
            }(function (d) {
                trZ += d*100;
                oUl.style.transform = "translateZ("+trZ+"px) rotateX("+roX+"deg) rotateY("+roY+"deg)";
            });
        })();

       
    })();

};




/*var oDiv = document.createElement("div");
oDiv.style.cssText = "background:pink; position:absolute; width:5px; height:5px; border-radius:100%; top:"+e.clientY+"px; left:"+e.clientX+"px;";
document.body.appendChild(oDiv);*/
