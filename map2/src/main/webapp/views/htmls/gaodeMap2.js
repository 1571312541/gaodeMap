var map = null;
var lng = null;
var lat = null;

/**
 *  经纬度判断
 */
function getLnglat(lng, lat) {
    if ( lng == null || lng == '' || lng == undefined ){
        lng = 116.405467;
    } else {
        lng = parseFloat(lng);
    }
    if ( lat == null || lat == '' || lat == undefined ) {
        lat = 39.907761;
    }else {
        lat = parseFloat(lat);
    }
    return [lng,lat];
}
/**
 *  地图初始化
 */

$(function () {
    map = map = new AMap.Map('container', {
        resizeEnable : true,//监控地图容器尺寸变化
        zoom : 12,//地图显示的缩放级别
        center : getLnglat(lng,lat),//地图中心点坐标值
        lang : "zh_cn",//zh_cn 中文简体，en：英文，zh_en：中英文对照默认为: zh_cn：中文简体
        defaultCursor : "crosshair",//地图鼠标样式  crosshair\default\auto\pointer
        isHotspot : true,//是否开启地图热点和标注的hover效果。PC端默认是true，移动端默认是false
        dragEnable : true,//是否可通过鼠标拖拽平移，默认为true
        zoomEnable : true,//是否可缩放，默认值为true
        doubleClickZoom : true,//是否可通过双击鼠标放大地图，默认为true
        keyboardEnable : true,// 是否可通过键盘控制,默认为true  "+"和"-"缩放，Ctrl+“→”顺时针旋转，Ctrl+“←”逆时针旋转。
        jogEnable : true,//是否使用缓动效果，默认值为true
        scrollWheel : true//是否可通过鼠标滚轮缩放浏览，默认为true
    });



//------------------------------------------------------------------------------------------

    //点标记
    var marker = new AMap.Marker({
        position: getLnglat(lng,lat),
        clickable : true //点标记是否可点击
    });
    marker.setMap(map);

//------------------------------------------------------------------------------------------

    //工具条--方向盘、标尺
    map.plugin(["AMap.ToolBar"], function() {
        map.addControl(new AMap.ToolBar());
    });

//------------------------------------------------------------------------------------------

    //比例尺
    map.plugin(["AMap.Scale"],function () {
        map.addControl(new AMap.Scale());
    })

//------------------------------------------------------------------------------------------

    AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {
        //图层切换控件
        map.addControl(new BasicControl.LayerSwitcher({
            position: 'rt'//rt 右上角
        }));
    });

//------------------------------------------------------------------------------------------

    //信息窗体
    var content='<div class="info-title">高德地图</div><div class="info-content">' +
        '<img src="https://webapi.amap.com/images/amap.jpg">' +
        '高德是中国领先的数字地图内容、导航和位置服务解决方案提供商。<br/>' +
        '<a target="_blank" href = "https://mobile.amap.com/">点击下载高德地图</a></div>';
    var  infowindow1 = new AMap.AdvancedInfoWindow({
        content: content,//显示内容
        offset: new AMap.Pixel(0, -30),//显示基点位置
        closeWhenClickMap : false//是否在鼠标点击地图后关闭信息窗体，默认false
    });

//------------------------------------------------------------------------------------------
    //地理编码
    var geocoder = new AMap.Geocoder({
        city : "全国",//可选值：城市名（中文或中文全拼）、citycode、adcode；默认值：“全国”
        radius: 1000,//取值范围：0-3000 逆地理编码时，以给定坐标为中心点
        extensions : "all" //返回信息的详略 默认值：base，返回基本地址信息；取值为：all，返回地址信息及附近poi、道路、道路交叉口等信息
    })
    map.addControl(geocoder);

//------------------------------------------------------------------------------------------

    //点击事件
    map.on("click",function (e) {
        // console.log(e);
        map.clearMap();
        var lnglat = [e.lnglat.getLng(),e.lnglat.getLat()];
        //点标记
        marker = new AMap.Marker({
            position : lnglat,
            map : map
        })
        //打开信息窗体
        infowindow1.open(map,lnglat);
        // 根据坐标获取地址
        geocoder.getAddress(lnglat,function(status,result) {
            console.log(status)
            console.log(result)
        })

    })


    /*  status打印内容: complete 查到数据 / no_data 未查到数据
        result打印内容 :
        info: "OK"
        regeocode: Object { addressComponent: {…}, formattedAddress: "北京市东城区东华门街道天安门", roads: (3) […], … }
        <prototype>: Object { … }
    */
    /* e打印内容 ：
        lnglat: Object { N: 39.900518342783364, O: 116.37525459766391, lng: 116.375255, … }
        pixel: Object { x: 712, y: 317 }
        target: Object { _amap_id: 1, id: 1, CLASS_NAME: "AMap.Map", … }
        type: "click"*/
//------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------
    //添加右键菜单内容项
    var contextmenu=new AMap.ContextMenu();
    var pos=[];
    contextmenu.addItem("放大",function () {
        map.zoomIn();
    },0);
    contextmenu.addItem("缩小",function () {
        map.zoomOut();
    },1);
    contextmenu.addItem("添加点标记",function () {
        marker=new AMap.Marker({
            map:map,
            position:pos
        });
    },2);
    // 监听鼠标右击事件
    map.on("rightclick",function (e) {
        contextmenu.open(map,e.lnglat);
        pos=e.lnglat;
    });
//------------------------------------------------------------------------------------------
})

