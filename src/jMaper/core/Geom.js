jMaper.Geom = jMaper.Layer.Extend({

	namespace : 'jMaper.Layer.Geom',

	mouse : null,

	/**
	 * {
	 *     min : Number,
	 *     max : Number
	 * }
	 */
	arise : null,

	amend : false,

	matte : false,

	handle : null,

	_fit4r : function(){
		var fit = [];
		try{
			this.$.Array.each(this.route, function(crd){
				this.$.Array.push(fit, (crd = this._fit4p(crd)).x, crd.y);
			}, this);
		}catch(e){
			return [];
		}
		return fit;
	},

	_fit4e : function(d2m){
		return this.$.Match.isNumber((this.extra || 0).x) && this.$.Match.isNumber((this.extra || 0).y) && (
			d2m = this.target.netmap.craft / this.target.netmap.deg2sc() * jMaper.library.unit.M
		) ? {
			x : this.extra.x * d2m,
			y : this.extra.y * d2m
		} : {
			x : 0.0,
			y : 0.0
		};
	},

	_fit4p : function(crd){
		return this.target.netmap.crd2px(crd || this.point).offset({
			x : -this.target.netmap.nature.x,
			y : -this.target.netmap.nature.y
		});
	},

	summit : function(){
		if((this.target || 0).enable && this.enable && this.handle)
			this.handle.front();
	},

	render : function(drv, job){
		if(((this.target = drv) || 0).enable)
			(function(geom){
				if(!(drv.sketch && (this.facade = ((drv.canvas || 0).maper || 0).draw))){
					this.$.Thread.delay.call(drv.client, arguments.callee, 0, this);
				}else{
					if(geom = drv.symbol.draw[this.namespace + '.' + this.index]){
						geom = this.$.Match.equal(geom, this) ? this.redraw() : arguments.callee.call(
							this, geom.remove()
						);
					}else{
						// 监听广播
						this.observe(drv.listen.zoom, this.radio.zoom = this.$.Util.bind(this, this.redraw));
						this.observe(drv.listen.swap, this.radio.swap = this.$.Util.bind(this, this.redraw));
						// 绘制图形
						try{
							geom = (drv.symbol.draw[this.namespace + '.' + this.index] = this).redraw();
						}catch(e){
							geom = null;
						}finally{
							if(this.$.Match.isFunction(job))
								this.$.Thread.delay.call(drv.client, job, 0, this);
							// 释放内存
							drv = job = null;
						}
					}
				}
			}).call(this);
	},

	remove : function(){
		if((this.target || 0).enable && this.enable)
			(function(){
				if(this.target)
					if(!this.handle){
						this.$.Thread.delay.call(this.target.client, arguments.callee, 0, this);
					}else{
						if(this.obscure(this.target.listen.zoom, this.radio.zoom)){
							if(!this.obscure(this.target.listen.swap, this.radio.swap)){
								this.observe(this.target.listen.zoom, this.radio.zoom);
							}else{
								if(!delete this.target.symbol.draw[this.namespace + '.' + this.index]){
									this.observe(this.target.listen.zoom, this.radio.zoom);
									this.observe(this.target.listen.swap, this.radio.swap);
								}else{
									// 擦除图形
									this.target = this.facade = this.handle = this.handle.erase();
									{
										delete this.radio.zoom;
										delete this.radio.swap;
									}
								}
							}
						}
					}
			}).call(this);
	}

});