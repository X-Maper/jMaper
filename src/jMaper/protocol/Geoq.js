jMaper.Tile.Geoq = jMaper.Tile.ArcGISRest.Extend({

	namespace : 'jMaper.Layer.Geog.Tile.ArcGISRest.Geoq',

	structure : function(jsn){
		if((this.radio = {}) && jsn){
			if(this.$.Match.isNumber(jsn.index))
				this.index = jsn.index;
			if(this.$.Match.isString(jsn.group))
				this.group = jsn.group;
			if(this.$.Match.isString(jsn.title))
				this.title = jsn.title;
			if(this.$.Match.isBoolean(jsn.allow))
				this.allow = jsn.allow;
			if(this.$.Match.isBoolean(jsn.cover))
				this.cover = jsn.cover;
			if(this.$.Match.isBoolean(jsn.alarm))
				this.alarm = jsn.alarm;
			if(this.$.Match.isString(jsn.path) || this.$.Match.isFunction(jsn.path))
				this.path = jsn.path;
			if(this.$.Match.isObject(jsn.extent))
				this.extent = jsn.extent;
			if(this.$.Match.isNumber(jsn.speed) && this.$.Match.isInt(jsn.speed))
				this.speed = jsn.speed;
			if(this.$.Match.isNumber(jsn.alpha) && this.$.Match.isInt(jsn.alpha, true))
				this.alpha = jsn.alpha;
			if(this.$.Match.isNumber(jsn.level) && this.$.Match.isInt(jsn.level, true))
				this.level = jsn.level;
			if(this.$.Match.isNumber(jsn.close) && this.$.Match.isInt(jsn.close))
				this.factor = this.$.Array.slice(this.factor, 0, this.close = jsn.close);
			if(this.$.Match.isNumber(jsn.start) && this.$.Match.isInt(jsn.start, true))
				this.factor = this.$.Array.slice(this.factor, this.start = jsn.start);
		}
	},

	version : 10,

	close : 19,

	craft : 96,

	units : 'M',

	origin : new jMaper.Coord({
		lng : -180.00000002503606,
		lat : 85.05112878196637
	}),

	extent : new jMaper.Bound({
		minX : -180.00000002503606,
		minY : -85.05112878196637,
		maxX : 180.00000002503606,
		maxY : 85.05112878196637
	}),

	projcs : jMaper.convert['EPSG:900913'],

	factor : [156543.033928, 78271.5169639999, 39135.7584820001, 19567.8792409999, 9783.93962049996, 4891.96981024998, 2445.98490512499, 1222.99245256249, 611.49622628138, 305.748113140558, 152.874056570411, 76.4370282850732, 38.2185141425366, 19.1092570712683, 9.55462853563415, 4.77731426794937, 2.38865713397468, 1.19432856685505, 0.597164283559817]

});