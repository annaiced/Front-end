/* 
    作用：
        需要将所有的DOM元素对象以及相关的资源全部都加载完毕之后，再来实现的事件函数
*/

window.onload = function(){

    // 声明一个记录点击的缩略图下标
    var bigimgIndex = 0;

    // 路径导航的数据渲染
    navPathDataBind();
    function navPathDataBind(){
        /* 
            思路：
                1、先获取路径导航的页面元素（navPath）
                2、再来获取所需要的数据（data.js -> goodData.path）
                3、由于数据是需要动态产生的，那么相应的DOM元素也应该是动态产生的，含义需要根据数据的数量来进行创建DOM元素
                4、在遍历数据创建DOM元素的最后一条，只创建a标签，而不创建i标签
         */


        // 1、获取路径导航的页面元素对象（navPath）
        var navPath = document.querySelector('#wrapper #content .contentMain .navPath');
        // 看看是否拿到navPath
        // console.log(navPath);

        // 2、获取所需要的数据(在data.js里面的)
        var path = goodData.path;
        console.log(path);

        // 3、遍历数据
        for(var i = 0; i<path.length; i++){
            if(i == path.length - 1){
                // 只需要创建a且没有href属性(最后一个只是一个文本而已) 最后一个也不需要i（内容也就是/）
                var aNode = document.createElement("a");
                aNode.innerText = path[i].title;
                navPath.appendChild(aNode);
            }else{

                // 4、创建a标签
                var aNode = document.createElement("a");
                aNode.href = path[i].url;
                aNode.innerText = path[i].title;

                // 5、创建i标签
                var iNode = document.createElement("i");
                iNode.innerText = '/';

                // 6、让navPath元素来追加a和i(追加子项)
                navPath.appendChild(aNode);
                navPath.appendChild(iNode);
            }
        }
    }


    // 放大镜的移入、移除效果
    bigClassBind();
    function bigClassBind(){
        /* 
            思路：
                1、获取小图框元素对象，并且设置移入的事件
                    （onmouseover_有事件冒泡效果  、 onmouseenter_没有事件冒泡效果——就是不能依次传递给父元素）
                2、动态创建蒙版元素以及大图框的元素和大图片的元素
                3、对于移除时需要移除蒙版元素和大图框和大图片
        */

        //1.获取小图框元素
        var smallPic = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic');
        //获取leftTop元素
        var leftTop = document.querySelector('#wrapper #content .contentMain #center #left #leftTop');

        // 获取数据
        var imagessrc = goodData.imagessrc;

        // 设置移入事件
        smallPic.onmouseenter = function(){
            // 测试鼠标是否移入
            // console.log(111);

            // 3、创建蒙版元素
            var maskDiv = document.createElement('div');   //创建一个div节点
            maskDiv.className = "mask";    //名字叫mask

            // 4、创建大图框元素
            var BigPic = document.createElement('div');
            BigPic.id = "bigPic";

            // 5、创建大图片元素
            var BigImg = document.createElement('img');
            // BigImg.src = "./images/b1.png";
            BigImg.src = imagessrc[bigimgIndex].b;

            // 6、大图框来追加大图片
            BigPic.appendChild(BigImg);

            // 7、让小图框来追加蒙版元素
            smallPic.appendChild(maskDiv);

            // 8、让leftTop元素追加大图框
            leftTop.appendChild(BigPic);


            // 设置移动事件
            smallPic.onmousemove = function(event){
                // event.clientX:鼠标点距离浏览器左侧X轴的值
                // getBoundingClientRect().left：小图框元素距离浏览器左侧可视left值
                // maskDiv.offsetWidth：小图框元素的宽度
                var left = event.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetWidth / 2;
                var top = event.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetHeight / 2;

                // 判断
                if(left < 0){
                    left = 0;
                }else if(left > smallPic.clientWidth - maskDiv.offsetWidth){
                    left = smallPic.clientWidth - maskDiv.offsetWidth;
                }
                if(top < 0){
                    top = 0;
                }else if(top > smallPic.clientHeight - maskDiv.offsetHeight){
                    top = smallPic.clientHeight - maskDiv.offsetHeight;
                }


                // 设置left和top属性
                maskDiv.style.left = left + "px";
                maskDiv.style.top = top + "px";

                // 移动的比例关系 = 蒙版元素移动的距离 / 大图片元素移动的距离
                // 蒙版元素移动的距离 = 小图框宽度 - 蒙版元素的宽度
                // 大图片元素移动的距离 = 大图片的宽度 - 大图框元素的宽度
                var scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (BigImg.offsetWidth - BigPic.clientWidth);

                console.log(scale);  //0.495

                BigImg.style.left = -left / scale + "px";
                BigImg.style.top = -top / scale + "px";
            }




            // 设置移除事件
            smallPic.onmouseleave = function(){

                // 让小图框移除蒙版元素
                // smallPic和参数maskDiv必须是直接的子父关系，否则就会报错
                smallPic.removeChild(maskDiv);

                // 让leftTop元素移除大图框
                leftTop.removeChild(BigPic);

                
            }  
        }
    }

    // 动态渲染放大镜缩略图的数据
    thumbnailData();
    function thumbnailData(){
        /* 
            思路：
                1、先获取piclist元素下的ul
                2、再获取data.js文件下的goodData->imagessrc
                3、遍历数组，根据数组的长度来创建li元素
                4、让ul遍历追加li元素
        */

        //1、获取piclist下的ul
        var ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul'); 
        console.log(ul);

        // 获取imagessrc数据
        var imagessrc = goodData.imagessrc;
        console.log(imagessrc);

        // 3、遍历数组
        for(var i = 0; i < imagessrc.length ; i++){
            // 4、创建li元素
            var newLi = document.createElement('li');

            // 5、创建img元素
            var newImg = document.createElement('img');
            newImg.src = imagessrc[i].s;

            // 6、让li追加img元素
            newLi.appendChild(newImg);

            // 7、让ul追加li元素
            ul.appendChild(newLi);
        }
    }

    // 点击缩略图的效果
    thumbnailClick();
    function thumbnailClick(){
        /* 
            思路：
                1、获取所有的li元素，并且循环发生点击事件
                2、点击缩略图需要确定其下标位置来找到对应小图路径和大图路径替换现有src的值
        */

        // 1、获取所有的li元素
        var liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li');
        // console.log(liNodes);
        var smallPic_img = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic img');
        var imagessrc = goodData.imagessrc;

        // 小图路径需要默认和imagessrc的第一个元素小图的路径是一致的
        smallPic_img.src = imagessrc[0].s;

        // 2、循环点击li元素
        for(var i = 0; i<liNodes.length; i++){

                // 因为整个var是全局变量，虽然事件没有触发，但是页面渲染前已经运行结束了for循环，所以i=14
                // 上面for是同步执行代码，下面点击事件是异步执行代码，所以同步先执行，for循环已经到14的时候才会发生异步
                // 解决：在点击事件之前，给每个元素都添加上自定义的下标，异步点击事件上面加上自定义下标
                liNodes[i].index = i;  //还可以通过setAttribute('index',i)
                console.log(i);

                liNodes[i].onclick = function(){
                    var idx = this.index;   //事件函数中的this，永远指向的是实际发生事件的目标原事件
                    bigimgIndex = idx;

                    // 变换小图路径
                    smallPic_img.src = imagessrc[idx].s;
                }
        }
    }

    // 点击缩略图左右箭头的效果
    thumbnailLeftRightClick();
    function thumbnailLeftRightClick(){
        /* 
            思路：
                1、先获取左右两端的箭头按钮
                2、在获取可视的div以及ul元素和所有的li元素
                3、计算（发生起点、步长、总体运动的距离值）
                4、然后再发生点击事件
        */

        // 获取箭头元素
       var prev = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.prev');
       var next = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.next');
    //    console.log(prev);

        
        // 2、获取可视的div以及ul元素和所有的li元素
        var piclist = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist');

        var ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul');

        var liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li');

        // 3、计算(li的宽度+间距20px)

        // 发生起点
        var start = 0;
        // 步长
        var step = (liNodes[0].offsetWidth + 20) * 2;
        // 总体运动的距离值（就是隐藏在外面的长度） = ul的宽度 - div框的宽度 = (图片的总数 - div中显示的数量) * （li的宽度 + 20）
        var endPostion = (liNodes.length - 5) * (liNodes[0].offsetWidth + 20);

        // 4、发生事件
        prev.onclick = function(){
            start-=step;
            if(start < 0){
                start = 0;
            }
            ul.style.left = -start + "px";
        }

        next.onclick = function(){
            start+=step;
            if(start > endPostion){
                start = endPostion;
            }
            ul.style.left = -start + "px";
        }
    }

    // 商品详情数据的动态渲染
    rightTopData();
    function rightTopData(){
        /* 
            思路：
                1、查找rightTop元素
                2、查找data.js -> goodData -> goodDetail
                3、建立一个字符串变量，将原来的布局结构贴进来，将所对应的数据放在对应的位置上，重新渲染rightTop元素
        */

        // 1、查找元素
        var rightTop = document.querySelector('#wrapper #content .contentMain #center .right .rightTop');
        // console.log(rightTop);

        // 2、查找数据
        var goodsDetail = goodData.goodsDetail;
        

        // 3、创建一个字符串(双引号、单引号、模板字符串)变量
        // 模板字符串替换数据:${变量}
        var s = `<h3>${goodsDetail.title}</h3>
        <p>${goodsDetail.recommend}</p>
        <div class="priceWrap">
            <div class="priceTop">
                <span>价&nbsp;&nbsp;&nbsp;&nbsp;格</span>
                <div class="price">
                    <span>￥</span>
                    <p>${goodsDetail.price}</p>
                    <i>降价通知</i>
                </div>
                <p>
                    <span>累计评价</span>
                    <span>${goodsDetail.evaluateNum}</span>
                </p>
            </div>
            <div class="priceBottom">
                <span>促&nbsp;&nbsp;&nbsp;&nbsp;销</span>
                <p>
                    <span>${goodsDetail.promoteSales.type}</span>
                    <span>${goodsDetail.promoteSales.content}</span>
                </p>
            </div>
        </div>
        <div class="support">
            <span>支&nbsp;&nbsp;&nbsp;&nbsp;持</span>
            <p>${goodsDetail.support}</p>
        </div>
        <div class="address">
            <span>配&nbsp;送&nbsp;至</span>
            <p>${goodsDetail.address}</p>
        </div>`;

        // 重新渲染rightTop元素
        rightTop.innerHTML = s;

    }

    // 商品参数数据的动态渲染
    rightBottomData();
    function rightBottomData(){
        /* 
            思路：
                1、找rightBottom的元素对象
                2、查找data.js -> goodData.goodsDetail.crumbData数据
                3、由于数据是一个数组，需要遍历，有一个元素则需要有一个动态的dl元素对象（dt、dd）
        */

        // 1、查找元素对象
        var chooseWrap = document.querySelector('#wrapper #content .contentMain #center .right .rightBottom .chooseWrap');
        // console.log(chooseWrap);

        // 2、查找数据
        var crumbData = goodData.goodsDetail.crumbData;
        // console.log(crumbData);

        // 3、循环数据
        for(var i = 0;i < crumbData.length; i++){

            // 4、创建dl元素对象
            var dlNode = document.createElement('dl');

            // 5、创建dt元素对象
            var dtNode = document.createElement('dt');
            dtNode.innerText = crumbData[i].title;

            // 6、dl追加dt（dl要先追加dt，再追加dd）
            dlNode.appendChild(dtNode);

            // 7、遍历crumbData -> data元素
            for(var j= 0; j<crumbData[i].data.length; j++){
                // 创建dd元素
                var ddNode = document.createElement('dd');
                ddNode.innerText = crumbData[i].data[j].type;
                // price是给每一个dd身上都加了一个自定义属性
                ddNode.setAttribute('price',crumbData[i].data[j].changePrice);

                // 让dl追加dd
                dlNode.appendChild(ddNode);
            }

            // 8、让chooseWrap追加dl
            chooseWrap.appendChild(dlNode);
        }
    }

    // 点击商品参数之后的颜色排它效果
    clickddBind();
    function clickddBind(){
        /* 
            思路：
                1、获取所有的dl元素，取其中第一个dl元素下的所有dd先做测试，
                    测试完毕之后再对应dl第一行下标的前面再嵌套一个for循环，目的在变换下标
                2、循环所有的dd元素，并且添加点击事件
                3、确定实际发生事件的目标源对象，设置其文字颜色为红色，然后给其他所有的元素颜色都重置为基础颜色（#666）


            点击dd之后产生的mark标记：
            思路：
                1、首先创建一个可以容纳点击的dd元素值的容器（数组），确定数组的起始长度,再添加一些默认值
                2、然后再将点击的dd元素的值按照对应下标来写入到数组的元素身上
        */

        /* 
            querySelectorAll就是获取所有的，比如dl有很多个，那么自动获取返回数组  querySelector是获取第一个元素即可
        */ 
       
        //1、找第一个dl下的所有的dd元素
        var dlNodes = document.querySelectorAll('#wrapper #content .contentMain #center .right .rightBottom .chooseWrap dl');
        // console.log(dlNodes);

        var arr = new Array(dlNodes.length);

        var choose = document.querySelector('#wrapper #content .contentMain #center .right .rightBottom .choose');

        // 数组填充值
        arr.fill(0);

        // console.log(arr);  //[0,0,0,0]
        
        
        for(let i = 0;i <dlNodes.length ; i++){

            // 闭包函数来解决循环事件中的变量问题
            // 因为之前不停循环，最后只能留下最后一个变量i，就是页面最后一个dl才能实现功能
            (function(i){
                var ddNodes = dlNodes[i].querySelectorAll('dd');

                // console.log(ddNodes);   //测试获取到的每一行dd
                
                // 2、遍历当前所有的dd元素
                for(let j = 0;j <ddNodes.length ; j++){
                    ddNodes[j].onclick = function(){
                        // console.log(ddNodes[i]);
        

                        // 清空choose元素，否则点击第二行dl的时候，第一行点击过的dd，会在点击第二行的时候，再次出现
                        choose.innerHTML = "";   //必须是空字符串，再向里面添加内容

                        /*
                            ddNodes[0].style.color = '#666';
                            ddNodes[1].style.color = '#666';
                            ddNodes[2].style.color = '#666';
                        */ 
        
                        /*
                            假设点击的是第二个元素，下标为1， 
                            ddNodes[1].style.color = 'red';    第二个就会变红，而其他两个没有点击的就会设置原本的颜色
                            相同下标的dd元素的字体元素，在进行覆盖操作，而其他未点击的元素都是在进行重新设置元素
                        */ 
                        for(let k= 0;k < ddNodes.length;k++){
                            ddNodes[k].style.color = '#666';
                        }
        
                        ddNodes[j].style.color = 'red';      
                        
                        

                        // 点击哪个dd元素动态的产生一个新的mark标记元素
                        // arr[i] = ddNodes[j].innerText;
                        arr[i] = ddNodes[j];

                        changePriceBind(arr);  //函数的实参


                        // console.log(ddNodes[j].innerText);   //这在控制台可以看见，但是要赋值给下标
                        // console.log(arr);  //测试会发现在控制台基本实现

                        // 遍历arr数组，将非0元素的值写入到mark标记
                        arr.forEach(function(value,index){
                            // 只要是为真的条件，咱们就动态的来创建mark标签
                            if(value != 0){
                                // 创建div元素
                                var markDiv = document.createElement('div');
                                // 并且设置class属性
                                markDiv.className = 'mark';
                                // 并且设置值(加上.innerText，就不再是值本身了)
                                markDiv.innerText = value.innerText;   //value是函数里面的value，然后arr用的是上面动态点击的dd元素
                                //创建一个a元素
                                var aNode = document.createElement('a');
                                // 并设置值
                                aNode.innerText = 'X';
                                // 并且设置下标
                                //前面的index是为了写入到超链接里面的自定义属性名称，后面的index来自于数组元素的下标
                                aNode.setAttribute('index',index);   
                                // 让div追加a
                                markDiv.appendChild(aNode);

                                // 让choose元素追加div
                                choose.appendChild(markDiv);
                            }
                        })



                        /*  
                            绘制结束所有的a标签之后，可以对创建好的a进行点击事件
                            要知道点击的是第几个a，所以在绘制a标签的时候，就要设置下标index
                        */


                        // 获取所有的a标签元素，并且循环发生点击事件
                        var aNodes = document.querySelectorAll('#wrapper #content .contentMain #center .right .rightBottom .choose .mark a');
                        // console.log(aNodes);   // 点击之后会显示Node中的几个a

                        for(var n = 0; n<aNodes.length;n++){
                            aNodes[n].onclick = function(){
                                // 获取点击的a标签身上的index属性值
                                var index1 = this.getAttribute('index');

                                // 恢复数组中对应下标元素的值
                                arr[index1] = 0;

                                // console.log(arr);

                                // 找到对应下标的那个dl行中的所有的dd元素
                                var ddlist = dlNodes[index1].querySelectorAll('dd');
                                // console.log(ddlist);

                                // 遍历所有的dd元素(就是点击×之后原来选中的变成原始默认颜色)
                                for(var m = 0; m < ddlist.length ; m++){
                                    // 其余所有dd的文字颜色为灰色
                                    ddlist[m].style.color = "#666";
                                }

                                // 默认的第一个dd文字颜色恢复成红色
                                ddlist[0].style.color = 'red';

                                // 删除对应下标位置的mark标记
                                choose.removeChild(this.parentNode);

                                // 调用价格函数，这是在a标签里面，就是点击删除，价格也要改变
                                changePriceBind(arr);
                            }
                        }

                    }               
                }
            })(i)
            
        }
        
    }

    // 价格变动的函数声明
    /* 
        这个函数是需要在点击dd的时候以及删除mark标记的时候才需要调用
    */
    // changePriceBind();
    function changePriceBind(arr){
        /* 
            思路：
                1、获取价格的标签元素
                2、给每一个dd标签身上默认都设置一个价格的属性，用来记录变化的价格
                3、遍历arr数组，将dd元素身上的新变化的价格和已有的价格（5299）相加
                4、最后将计算之后的结果重新渲染到p标签里
        */

        // 1、原价格标签元素 
        var oldPrice = document.querySelector('#wrapper #content .contentMain #center .right .rightTop .priceWrap .priceTop .price p');

        // 取出默认的价格
        var price = goodData.goodsDetail.price;

        // 2、遍历arr数组
        for(var i = 0; i < arr.length; i++){
            if(arr[i] != 0){
                // 数据类型的强制转换(防止价格不是整数——一开始bus)
                var changeprice = Number(arr[i].getAttribute('price'));   //只输出价格

                // 最终价格
                price += changeprice;
            }
        }
        oldPrice.innerText = price;

        // 3、将变化后的价格写入到左侧标签当中
        var leftprice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p');
        leftprice.innerText = '￥' + price;

        // 4、遍历选择搭配中所有的复选框元素，看是否有选中的(4和5是连在一起的)
        // 目的：因为套餐价也需要跟随上方搭配改变不能一直都是5299
        var ipts = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle input');
        var newprice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i');
        for(var j = 0; j<ipts.length; j++){
            if(ipts[j].checked){
                price += Number(ipts[j].value);
            }
        }

        // 5、右侧的套餐价价格重新渲染
        newprice.innerText = '￥' + price;
    }


    // 选择搭配中间区域复选框选中套餐价变动效果
    chooseprice();
    function chooseprice(){
        /* 
            思路：
                1、先获取中间区域中所有的复选框元素
                2、遍历这些元素取出他们的价格，和左侧的基础价格进行累加，累加之后重新写回套餐价标签里面
        */

        // 1、 先获取中间区域中所有的复选框元素
        var ipts = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle input');
        // console.log(ipts);
        var leftprice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p');
        // console.log(leftprice);
        var newprice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i');

        // 2、遍历复选框(因为没有访问非当前函数作用域的变量值，所以不用闭包)
        for(var i = 0; i < ipts.length; i++){
            ipts[i].onclick = function(){
                var oldprice = Number(leftprice.innerText.slice(1));   //是从下标1开始往后，￥是下标为0,5299是下标从1往后的
                for(var j=0; j < ipts.length; j++){
                    if(ipts[j].checked){

                        // 新的价格 = 左侧价格 + 选中复选框附加价格
                        oldprice = oldprice + Number(ipts[j].value);
                    }
                }

                // 重新写回到套餐价标签当中
                newprice.innerText = '￥' + oldprice;

            }
        }
    }

    // 封装一个公共的选项卡函数
    
    /* 
        思路：
            被点击的元素tabBtns、被切换显示的元素tabConts
    */
    function Tab(tabBtns,tabConts){
        for(var i = 0; i < tabBtns.length; i++){
            tabBtns[i].index = i;
            tabBtns[i].onclick = function(){
                for(var j= 0; j < tabBtns.length; j++){
                    tabBtns[j].className = '';
                    tabConts[j].className = '';
                }
                this.className = 'active';
                tabConts[this.index].className = 'active';
            }
        }
    }

    // 点击左侧选项卡
    leftTab();
    function leftTab(){
        // 被点击的元素
        var h4s = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .leftAside .asideTop h4');
        // 被切换显示的元素(需要设置成直接的div，要有个>)
        var divs = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .leftAside .aslideContent>div');
        // 调用函数
        Tab(h4s,divs);
    }

    // 点击右侧选项卡
    rightTab();
    function rightTab(){
    // 被点击的元素
    var lis = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .bottomDetail .tabBtns li');
    // 被切换的显示元素
    var div = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .bottomDetail .tabContents div');
    // 调用函数
    Tab(lis,div);
    }

    // 右边侧边栏的点击效果
    rightAsideBind();
    function rightAsideBind(){
        /* 
            思路：
                1、先找到按钮元素，发生点击事件
                2、记录一个初始状态，在点击事件内部进行判断
                3、记录一个初始的状态，再点击事件的内容进行判断，如果为关闭则展开，否则为关闭
        */

        // 1、找按钮元素 
        var btns = document.querySelector('#wrapper .rightAside .btns');

        // 记录初始状态
        var flag = true;

        // 查找侧边栏元素
        var rightAside = document.querySelector('#wrapper .rightAside');

        // 2、发生点击事件
        btns.onclick = function(){

            // 判断
            if(flag){
                // 展开
                // flag = false;
                btns.className = "btns btnsOpen";
                rightAside.className = "rightAside asideOpen";
            }else{
                // 关闭
                // flag = true;
                btns.className = "btns btnsClose";
                rightAside.className = "rightAside asideClose";
            }

            // 无论前面的if和else执行的到底是谁，最终flag的状态都是在原来基础上进行取反
            flag = !flag;
        } 
    }
}

