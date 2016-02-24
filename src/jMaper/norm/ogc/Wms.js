jMaper.Tile.Wms = jMaper.Tile.Extend({

	namespace : 'jMaper.Layer.Geog.Tile.Wms',

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
			if(this.$.Match.isObject(jsn.layer))
				this.layer = jsn.layer;
			if(this.$.Match.isObject(jsn.style))
				this.style = jsn.style;
			if(this.$.Match.isObject(jsn.query))
				this.query = jsn.query;
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
			if(this.$.Match.isString(jsn.projcs)){
				this.projcs = jMaper.convert[jsn.projcs];
			}
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

	format : 'image/png',

	service : 'WMS',

	version : '1.3.0',

	request : 'GetMap',

	_w2arr : function(w){
		return [
			w, '?SERVICE=', this.service, '&VERSION=', this.version, '&REQUEST=', this.request, '&TRANSPARENT=TRUE&LAYERS=', this.$.Match.isArray(this.layer) ? this.$.Array.join(this.layer, ',') : this.layer, '&STYLES=', this.$.Match.isArray(this.style) ? this.$.Array.join(this.style, ',') : this.style, '&WIDTH=', this.block.wide, '&HEIGHT=', this.block.high, '&FORMAT=', this.format, (
				!this.$.Match.isEmpty(w = this.$.Parse.toReq(this.query)) ? '&' + w : ''
			)
		];
	},

	_p2crs : function(p){
		return (p = this.$.Array.index(jMaper.convert, p)) === -1 ? '' : p;
	},

	_g2box : function(r, c, v){
		var bbox = null;
		try{
			bbox = new jMaper.Bound({
				min : this.px2crd(new jMaper.Pixel({
					x : c * this.block.wide,
					y : r * this.block.high
				})),
				max : this.px2crd(new jMaper.Pixel({
					x : (c + 1) * this.block.wide,
					y : (r + 1) * this.block.high
				}))
			});
		}catch(e){
			bbox = null;
		}
		return this.$.Match.isObject(bbox) ? this.$.Array.join((
			v ? [bbox.min.lng, bbox.max.lat, bbox.max.lng, bbox.min.lat] : [bbox.min.lat, bbox.max.lng, bbox.max.lat, bbox.min.lng]
		), ',') : '';
	},

	source : function(l, r, c){
		var site;
		try{
			site = this.$.Match.isFunction(this.path) ? this.path() : this.path;
		}catch(e){
			site = null;
		}finally{
			switch(this.version){
				case '1.0.0':
				case '1.1.0':
				case '1.1.1':
				{
					return this.$.Array.join(this.$.Array.push(l = this._w2arr(site), '&SRS=', this._p2crs(this.projcs), '&BBOX=', this._g2box(r, c, true)) && l, '');
				}
				default:
				{
					return this.$.Array.join(this.$.Array.push(l = this._w2arr(site), '&CRS=', this._p2crs(this.projcs), '&BBOX=', this._g2box(r, c, false)) && l, '');
				}
			}
		}
	}

});