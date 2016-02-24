jMaper.Layer = jMaper.feature.Extend({

	namespace : 'jMaper.Layer',

	index : null,

	group : null,

	title : null,

	alpha : null,

	radio : null,

	target : null,

	facade : null,

	enable : true,

	_arise : function(see, crd){
		return (this.target || 0).netmap ? (
			!crd || (function(){
				try{
					return this.viewbox(false).contain(this, crd);
				}catch(e){
					return false;
				}
			}).call(this.target)
		) && (
			!see || (function(d2s){
				return d2s > 0 ? (!see.min || d2s <= see.min) && (!see.max || d2s >= see.max) : false
			}).call(this, this.target.netmap.deg2sc())
		) : false;
	},

	trigger : function(evt, msg){
		evt.broadcast(msg);
	},

	obscure : function(evt, fun){
		return evt.detach(fun);
	},

	observe : function(evt, fun, low){
		return evt.attach(fun, low);
	}

});