var webgis;

function lFuncDocumentReady(){
	try{
		webgis = new jMaper('jMaper', {
			// 地图显示区域
			limits : new jMaper.Bound({
				minX : -180,
				minY : -90,
				maxX : 180,
				maxY : 90
			}),
			// 地图显示位置
			center : new jMaper.Coord({
				lng : 119.312327,
				lat : 26.073027
			})
		});
		webgis.include(
			new jMaper.Tile.Google({
				title : '谷歌卫星',
				style : 's',
				level : 7
			})
		);
		webgis.include(
			new jMaper.Tile.MapWorld({
				title : '天地图',
				level : 7
			})
		);
		webgis.include(
			new jMaper.Tile.Google({
				title : '谷歌标注',
				allow : false,
				cover : true,
				style : 'h',
				level : 7
			})
		);
		webgis.include(
			new jMaper.Eagle({
				hidden : false,
				geomap : new jMaper.Tile.Google()
			})
		);
		webgis.include(new jMaper.Slide());
		webgis.include(new jMaper.Genre());
		webgis.include(new jMaper.Scale());
	}catch(e){
		alert(e.message);
	}
}

window.onload = function(){
	jMagic.Thread.delay(function(){
		var wSize = jMagic.Util.getDocSize();
		jMagic.Util.setElemSize(jMagic.Fn.id("jMaper"), {
			w : wSize.winW,
			h : wSize.winH
		});
		lFuncDocumentReady();
	});
};

window.onresize = function(){
	jMagic.Thread.delay(function(){
		var wSize = jMagic.Util.getDocSize();
		jMagic.Util.setElemSize(jMagic.Fn.id("jMaper"), {
			w : wSize.winW,
			h : wSize.winH
		});
		// 修正布局
		try{
			if(webgis != null)
				webgis.netmap.resize();
		}catch(e){
			throw 'Resize Exception';
		}
	});
};