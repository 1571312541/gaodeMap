/**
 *  地图初始化
 */
$(function () {
    var lnglat = [116.405467,39.907761]
    var map = map = new AMap.Map('container', {
        resizeEnable: true,//监控地图容器尺寸变化
        zoom: 12,//地图显示的缩放级别
        center: lnglat//地图中心点坐标值
    });
})
