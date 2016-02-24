jMaper.Geom.Wave = jMaper.Geom.Extend({

	namespace : 'jMaper.Layer.Geom.Wave',

	structure : function(jsn){
		if((this.radio = {}) && jsn){
			if(this.$.Match.isString(jsn.index))
				this.index = jsn.index;
			if(this.$.Match.isString(jsn.group))
				this.group = jsn.group;
			if(this.$.Match.isObject(jsn.arise))
				this.arise = jsn.arise;
			if(this.$.Match.isBoolean(jsn.matte))
				this.matte = jsn.matte;
			if(this.$.Match.isString(jsn.title))
				this.title = jsn.title;
			if(this.$.Match.isString(jsn.mouse))
				this.mouse = jsn.mouse;
			if(this.$.Match.isNumber(jsn.alpha))
				this.alpha = jsn.alpha;
			if(this.$.Match.isString(jsn.color))
				this.color = jsn.color;
			if(this.$.Match.isNumber(jsn.thick))
				this.thick = jsn.thick;
			if(this.$.Match.isString(jsn.style))
				this.style = jsn.style;
			if(this.$.Match.isBoolean(jsn.arrow))
				this.arrow = jsn.arrow;
			if(this.$.Match.isArray(jsn.route))
				this.route = jsn.route;
		}
	},

	arrow : false,

	color : null,

	thick : null,

	style : null,

	route : null,

	redraw : function(msg){
		if((this.target || 0).enable && this.target.netmap && this.enable && this.facade && (this.route || 0).length > 1)
			switch((msg || 0).chan){
				// Swap Event.
				case this.target.listen.swap:
				{
					if(msg.info.cover)
						break;
				}
				default:
				{
					msg = this.matte || !this._arise(this.arise);
					{
						if(this.handle){
							if(!(this.handle.matte = msg)){
								this.handle.title = this.title;
								this.handle.mouse = this.mouse;
								this.handle.alpha = this.alpha;
								this.handle.color = this.color;
								this.handle.thick = this.thick;
								this.handle.style = this.style;
								this.handle.arrow = this.arrow;
								this.handle.route = this._fit4r();
							}
							// 重绘图形
							this.handle.paint();
						}else{
							this.handle = this.target.sketch.createWave(msg ? {matte : msg} : {
								title : this.title,
								mouse : this.mouse,
								alpha : this.alpha,
								color : this.color,
								thick : this.thick,
								style : this.style,
								arrow : this.arrow,
								route : this._fit4r()
							});
						}
					}
				}
			}
		// 内存释放
		msg = null;
	},

	length : function(fun){
		if(this.$.Match.isFunction(fun))
			(function(){
				if(this.target)
					if(!this.handle){
						this.$.Thread.delay.call(this.target.client, arguments.callee, 0, this);
					}else{
						try{
							fun();
						}catch(e){
							throw e;
						}finally{
							fun = null;
						}
					}
			}).call(this);
	},

	within : function(fun){
		if(this.$.Match.isFunction(fun))
			(function(){
				if(this.target)
					if(!this.handle){
						this.$.Thread.delay.call(this.target.client, arguments.callee, 0, this);
					}else{
						try{
							fun();
						}catch(e){
							throw e;
						}finally{
							fun = null;
						}
					}
			}).call(this);
	}

});