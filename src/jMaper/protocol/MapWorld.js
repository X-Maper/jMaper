jMaper.Tile.MapWorld = jMaper.Tile.Extend({

	namespace : 'jMaper.Layer.Geog.Tile.MapWorld',

	agreement : {
		amend : /^(VEC|TER)$/i,
		style : /^(VEC|IMG|TER|C(V|I|T)A)$/i
	},

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
			if(this.$.Match.isObject(jsn.extent))
				this.extent = jsn.extent;
			if(this.$.Match.isNumber(jsn.speed) && this.$.Match.isInt(jsn.speed))
				this.speed = jsn.speed;
			if(this.$.Match.isNumber(jsn.alpha) && this.$.Match.isInt(jsn.alpha, true))
				this.alpha = jsn.alpha;
			if(this.$.Match.isNumber(jsn.level) && this.$.Match.isInt(jsn.level, true))
				this.level = jsn.level;
			if(this.$.Match.isString(jsn.style) && this.agreement.style.test(jsn.style))
				this.style = jsn.style.toLowerCase();
			if(this.$.Match.isNumber(jsn.close) && this.$.Match.isInt(jsn.close))
				this.factor = this.$.Array.slice(this.factor, 0, this.close = jsn.close);
			if(this.$.Match.isNumber(jsn.start) && this.$.Match.isInt(jsn.start, true))
				this.factor = this.$.Array.slice(this.factor, this.start = jsn.start);
		}
	},

	radix : 1,

	close : 19,

	style : 'vec',

	origin : new jMaper.Coord({
		lng : -180,
		lat : 90
	}),

	extent : new jMaper.Bound({
		minX : -180,
		minY : -90,
		maxX : 180,
		maxY : 90
	}),

	factor : [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765625E-5, 4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570313E-5, 5.36441802978515625E-6, 2.682209014892578E-6],

	repair : function(){
		return this.$.Array.join(['http://api.tianditu.com/img/', this.agreement.amend.test(this.style) ? this.style : '', '404.png'], '');
	},

	source : function(l, r, c){
		return this.$.Array.join([
			'http://t', Math.round(Math.random() * 7), '.tianditu.com/', this.style , '_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=', this.style, '&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=', this.radix + this.start + l, '&TILEROW=', r, '&TILECOL=', c, '&FORMAT=tiles'
		], '');
	}

});