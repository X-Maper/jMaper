jMaper.Pixel = jMaper.feature.Extend({

	namespace : 'jMaper.Pixel',

	structure : function(pel){
		this.x = this.$.Match.isNumber((pel || 0).x) ? pel.x : 0.0;
		this.y = this.$.Match.isNumber((pel || 0).y) ? pel.y : 0.0;
	},

	x : 0.0,

	y : 0.0,

	clone : function(){
		return new jMaper.Pixel({
			x : this.x,
			y : this.y
		});
	},

	ratio : function(per){
		if(per)
			if(this.$.Match.isNumber(per)){
				this.x *= per;
				this.y *= per;
			}else{
				this.x *= this.$.Match.isNumber(per.x) ? per.x : 1.0;
				this.y *= this.$.Match.isNumber(per.y) ? per.y : 1.0;
			}
		return this;
	},

	offset : function(dev){
		if(dev)
			if(this.$.Match.isNumber(dev)){
				this.x += dev;
				this.y += dev;
			}else{
				this.x += this.$.Match.isNumber(dev.x) ? dev.x : 0.0;
				this.y += this.$.Match.isNumber(dev.y) ? dev.y : 0.0;
			}
		return this;
	},

	compare : function(drv, pos){
		return pos ? this.$.Match.isNumber(pos.x) && this.$.Match.isNumber(pos.y) ? pos.x === this.x && pos.y === this.y : (
			this.$.Match.isNumber(pos.lng) && this.$.Match.isNumber(pos.lat) ? (
				(drv || 0).netmap ? this.compare(drv, drv.netmap.crd2px(pos)) : false
			) : false
		) : false;
	},

	distance : function(drv, pos){
		return (drv || 0).netmap && pos ? (
			this.$.Match.isNumber(pos.x) && this.$.Match.isNumber(pos.y) ? Math.sqrt(Math.pow(this.x - pos.x, 2) + Math.pow(this.y - pos.y, 2)) / drv.netmap.craft * drv.netmap.deg2sc() * 0.0254 : (
				this.$.Match.isNumber(pos.lng) && this.$.Match.isNumber(pos.lat) ? this.distance(drv, drv.netmap.crd2px(pos)) : 0.0
			)
		) : 0.0;
	}

});