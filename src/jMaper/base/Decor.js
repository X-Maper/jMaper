jMaper.Decor = jMaper.feature.Extend({

	namespace : 'jMaper.Decor',

	radio : null,

	target : null,

	facade : null,

	enable : true,

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