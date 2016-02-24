jMaper.Coord = jMaper.feature.Extend({

	namespace : 'jMaper.Coord',

	structure : function(crd){
		this.lng = this.$.Match.isNumber((crd || 0).lng) ? crd.lng : 0.0;
		this.lat = this.$.Match.isNumber((crd || 0).lat) ? crd.lat : 0.0;
	},

	lng : 0.0,

	lat : 0.0,

	clone : function(){
		return new jMaper.Coord({
			lng : this.lng,
			lat : this.lat
		});
	},

	ratio : function(per){
		if(per)
			if(this.$.Match.isNumber(per)){
				this.lng *= per;
				this.lat *= per;
			}else{
				this.lng *= this.$.Match.isNumber(per.lng) ? per.lng : 1.0;
				this.lat *= this.$.Match.isNumber(per.lat) ? per.lat : 1.0;
			}
		return this;
	},

	offset : function(dev){
		if(dev)
			if(this.$.Match.isNumber(dev)){
				this.lng += dev;
				this.lat += dev;
			}else{
				this.lng += this.$.Match.isNumber(dev.lng) ? dev.lng : 0.0;
				this.lat += this.$.Match.isNumber(dev.lat) ? dev.lat : 0.0;
			}
		return this;
	},

	compare : function(drv, pos){
		return pos ? this.$.Match.isNumber(pos.lng) && this.$.Match.isNumber(pos.lat) ? pos.lng === this.lng && pos.lat === this.lat : (
			this.$.Match.isNumber(pos.x) && this.$.Match.isNumber(pos.y) ? (
				(drv || 0).netmap ? this.compare(drv, drv.netmap.px2crd(pos)) : false
			) : false
		) : false;
	},

	distance : function(drv, pos){
		return (drv || 0).netmap && pos ? drv.netmap.crd2px(this).distance(drv, pos) : 0.0;
	}

});