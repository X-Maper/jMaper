jMaper.Tile.Wmts = jMaper.Tile.Extend({

	namespace : 'jMaper.Layer.Geog.Tile.Wmts',

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
			if(this.$.Match.isString(jsn.layer))
				this.layer = jsn.layer;
			if(this.$.Match.isString(jsn.style))
				this.style = jsn.style;
			if(this.$.Match.isObject(jsn.query))
				this.query = jsn.query;
			if(this.$.Match.isNumber(jsn.craft))
				this.craft = jsn.craft;
			if(this.$.Match.isObject(jsn.block))
				this.block = jsn.block;
			if(this.$.Match.isArray(jsn.factor))
				this.close = this.$.Array.count(
					this.factor = jsn.factor
				);
			if(this.$.Match.isArray(jsn.assign))
				this.assign = jsn.assign;
			if(this.$.Match.isString(jsn.matrix))
				this.matrix = jsn.matrix;
			if(this.$.Match.isString(jsn.format))
				this.format = jsn.format;
			if(this.$.Match.isObject(jsn.extent))
				this.extent = jsn.extent;
			if(this.$.Match.isObject(jsn.origin)){
				this.origin = jsn.origin;
			}else{
				if(this.extent)
					this.origin = this.extent.min;
			}
			if(this.$.Match.isString(jsn.projcs))
				this.projcs = jMaper.convert[jsn.projcs];
			if(this.$.Match.isString(jsn.service))
				this.service = jsn.service;
			if(this.$.Match.isString(jsn.version))
				this.version = jsn.version;
			if(this.$.Match.isString(jsn.request))
				this.request = jsn.request;
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

	layer : null,

	style : null,

	query : null,

	assign : null,

	matrix : null,

	format : 'image/png',

	service : 'WMTS',

	version : '1.0.0',

	request : 'GetTile',

	source : function(l, r, c){
		var site, mate = this.radix + this.start + l;
		try{
			site = this.$.Match.isFunction(this.path) ? this.path() : this.path;
		}catch(e){
			site = null;
		}finally{
			return this.$.Array.join([
				site, '?SERVICE=', this.service, '&REQUEST=', this.request, '&VERSION=', this.version, '&LAYER=', this.layer, '&STYLE=', this.style, '&TILEMATRIXSET=', this.matrix, '&TILEMATRIX=', this.$.Match.isArray(this.assign) ? this.assign[mate] : mate, '&TILEROW=', r, '&TILECOL=', c, '&FORMAT=', this.format, (
					!this.$.Match.isEmpty(site = this.$.Parse.toReq(this.query)) ? '&' + site : ''
				)
			], '');
		}
	}

});
