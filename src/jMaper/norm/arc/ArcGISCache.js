jMaper.Tile.ArcGISCache = jMaper.Tile.Extend({

	namespace : 'jMaper.Layer.Geog.Tile.ArcGISCache',

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
			if(this.$.Match.isFunction(jsn.axis4x))
				this.axis4x = jsn.axis4x;
			if(this.$.Match.isFunction(jsn.axis4y))
				this.axis4y = jsn.axis4y;
			if(this.$.Match.isFunction(jsn.repair))
				this.repair = jsn.repair;
			if(!!jsn.path)
				this.path = jsn.path;
			if(this.$.Match.isString(jsn.units))
				this.units = jsn.units;
			if(this.$.Match.isNumber(jsn.craft))
				this.craft = jsn.craft;
			if(this.$.Match.isObject(jsn.block))
				this.block = jsn.block;
			if(this.$.Match.isArray(jsn.factor))
				this.close = this.$.Array.count(
					this.factor = jsn.factor
				);
			if(this.$.Match.isObject(jsn.extent))
				this.extent = jsn.extent;
			if(this.$.Match.isObject(jsn.origin)){
				this.origin = jsn.origin;
			}else{
				if(this.extent)
					this.origin = this.extent.min;
			}
			if(this.$.Match.isString(jsn.format))
				this.format = jsn.format;
			if(this.$.Match.isString(jsn.projcs))
				this.projcs = jMaper.convert[jsn.projcs];
			if(this.$.Match.isNumber(jsn.speed) && this.$.Match.isInt(jsn.speed))
				this.speed = jsn.speed;
			if(this.$.Match.isNumber(jsn.alpha) && this.$.Match.isInt(jsn.alpha, true))
				this.alpha = jsn.alpha;
			if(this.$.Match.isNumber(jsn.level) && this.$.Match.isInt(jsn.level, true))
				this.level = jsn.level;
			if(this.$.Match.isNumber(jsn.radix) && this.$.Match.isInt(jsn.radix, true))
				this.radix = jsn.radix;
			if(this.$.Match.isNumber(jsn.close) && this.$.Match.isInt(jsn.close))
				this.factor = this.$.Array.slice(this.factor, 0, this.close = jsn.close);
			if(this.$.Match.isNumber(jsn.start) && this.$.Match.isInt(jsn.start, true))
				this.factor = this.$.Array.slice(this.factor, this.start = jsn.start);
		}
	},

	path : null,

	format : 'png',

	source : function(l, r, c){
		var site;
		try{
			site = this.$.Match.isFunction(this.path) ? this.path() : this.path;
		}catch(e){
			site = null;
		}finally{
			return this.$.Array.join([
				site, '/L', this.$.Util.padded(this.radix + this.start + l, 2, 0, function(fix){
					return fix + this;
				}), '/R', this.$.Util.padded(r.toString(16), 8, 0, function(fix){
					return fix + this;
				}), '/C', this.$.Util.padded(c.toString(16), 8, 0, function(fix){
					return fix + this;
				})
			], '') + '.' + this.format;
		}
	}

});