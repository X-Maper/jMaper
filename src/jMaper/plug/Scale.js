jMaper.Scale = jMaper.Decor.Extend({

	namespace : 'jMaper.Decor.Scale',

	structure : function(jsn){
		if((this.radio = {}) && jsn){
			if(this.$.Match.isString(jsn.anchor))
				this.anchor = jMaper.library.rule.put.test(jsn.anchor) ? jsn.anchor.toLowerCase() : null;
		}
	},

	anchor : null,

	module : '<div class="j-scale-" style="$1:18px;"><div><span></span></div></div>',

	_fresh : null,

	_build : function(dpi, d2s){
		var msc = 2.286 * d2s / dpi, exp = Math.pow(10, Math.floor(Math.log(msc) / Math.log(10)));
		// Scale Pixel.
		this.$.Util.setElemSize(this.facade._gap, {
			w : (msc = Math.round(msc / exp) * exp) * dpi / d2s * jMaper.library.unit.M
		});
		// Scale Font.
		this.facade._txt.innerHTML = this.$.Array.join(
			msc >= 1000 ? [msc / 1000, this.target.assets.scale.km] : [msc, this.target.assets.scale.m], '&thinsp;'
		);
	},

	render : function(drv, job){
		if(((this.target = drv) || 0).enable)
			(function(scale){
				if(!(drv.canvas && drv.widget)){
					this.$.Thread.delay.call(drv.client, arguments.callee, 0, this);
				}else{
					if(scale = drv.widget.scale){
						if(!this.$.Match.equal(scale, this))
							arguments.callee.call(this, scale.remove());
					}else{
						// 监听广播
						this.observe(drv.listen.zoom, this.radio.zoom = this.$.Util.bind(this, this.redraw), 0);
						this.observe(drv.listen.swap, this.radio.swap = this.$.Util.bind(this, this.redraw), 0);
						// 加载控件
						try{
							scale = (drv.widget.scale = this).redraw();
						}catch(e){
							scale = null;
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

	redraw : function(){
		if((this.target || 0).enable && this.enable)
			(function(){
				if((this.facade || 0)._txt){
					this._build(this.target.netmap.craft, this.target.netmap.deg2sc());
				}else{
					if(this._fresh){
						this.$.Thread.delay.call(this.target.client, arguments.callee, 0, this);
					}else{
						this._fresh = this.$.Fx.add.call(this.target.client, this.target.canvas, [this.$.Util.format(this.module, [this.anchor || (this.anchor = 'left')])], function(cnv){
							if((this.facade = this.$.Array.pop(this.$.Fn.css.call(cnv, '.j-scale-'))) && (
								this.facade._gap = this.$.Dom.getFore(this.facade)
							) && (
								this.facade._txt = this.$.Dom.getFore(this.facade._gap)
							))
								this._fresh = this._fresh.call(this);
							// 释放锁定
							delete this._fresh;
						}, this) || arguments.callee;
					}
				}
			}).call(this);
	},

	remove : function(){
		if((this.target || 0).enable && this.enable)
			(function(){
				if(this.target)
					if(!this.facade || this._fresh){
						this.$.Thread.delay.call(this.target.client, arguments.callee, 0, this);
					}else{
						if(this.obscure(this.target.listen.zoom, this.radio.zoom))
							if(!this.obscure(this.target.listen.swap, this.radio.swap)){
								this.observe(this.target.listen.zoom, this.radio.zoom, 0);
							}else{
								if(!delete this.target.widget.scale){
									this.observe(this.target.listen.zoom, this.radio.zoom, 0);
									this.observe(this.target.listen.swap, this.radio.swap, 0);
								}else{
									this.target = (
										this.facade = this.$.Dom.removeChild(this.facade, true)
									);
									// 内存释放
									{
										delete this.radio.zoom;
										delete this.radio.swap;
									}
									delete this._fresh;
								}
							}
					}
			}).call(this);
	}

});