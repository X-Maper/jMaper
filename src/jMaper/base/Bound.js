jMaper.Bound = jMaper.feature.Extend({

	namespace : 'jMaper.Bound',

	structure : function(bnd){
		this.min = ((bnd || 0).min || 0).namespace ? bnd.min : new jMaper.Coord({
			lng : this.$.Match.isNumber((bnd || 0).minX) ? bnd.minX : 0.0,
			lat : this.$.Match.isNumber((bnd || 0).maxY) ? bnd.maxY : 0.0
		});
		this.max = ((bnd || 0).max || 0).namespace ? bnd.max : new jMaper.Coord({
			lng : this.$.Match.isNumber((bnd || 0).maxX) ? bnd.maxX : 0.0,
			lat : this.$.Match.isNumber((bnd || 0).minY) ? bnd.minY : 0.0
		});
	},

	min : null,

	max : null,

	clone : function(){
		return new jMaper.Bound({
			minX : this.min.lng,
			maxX : this.max.lng,
			minY : this.min.lat,
			maxY : this.max.lat
		});
	},

	balance : function(){
		return new jMaper.Coord({
			lng : (this.min.lng + this.max.lng) * 0.5,
			lat : (this.max.lat + this.min.lat) * 0.5
		});
	},

	compare : function(drv, bnd){
		return (bnd || 0).min && bnd.max ? this.min.compare(drv, bnd.min) && this.max.compare(drv, bnd.max) : false;
	},

	correct : function(drv, shp){
		return shp ? this.$.Match.isNumber(shp.lng) && this.$.Match.isNumber(shp.lat) ? new jMaper.Coord({
			lng : shp.lng > this.min.lng ? shp.lng < this.max.lng ? shp.lng : this.max.lng : this.min.lng,
			lat : shp.lat > this.max.lat ? shp.lat < this.min.lat ? shp.lat : this.min.lat : this.max.lat
		}) : (
			shp.min && shp.max ? new jMaper.Bound({
				min : this.correct(drv, shp.min),
				max : this.correct(drv, shp.max)
			}) : (
				this.$.Match.isNumber(shp.x) && this.$.Match.isNumber(shp.y) ? (
					(drv || 0).netmap ? this.correct(drv, drv.netmap.px2crd(shp)) : null
				) : null
			)
		) : null;
	},

	contain : function(drv, shp){
		return shp ? this.$.Match.isNumber(shp.lng) && this.$.Match.isNumber(shp.lat) ? shp.lng >= this.min.lng && shp.lat >= this.max.lat && shp.lng <= this.max.lng && shp.lat <= this.min.lat : (
			shp.min && shp.max ? this.contain(drv, shp.min) && this.contain(drv, shp.max) : (
				this.$.Match.isNumber(shp.x) && this.$.Match.isNumber(shp.y) ? (
					(drv || 0).netmap ? this.contain(drv, drv.netmap.px2crd(shp)) : false
				) : false
			)
		) : false;
	}

});