jMaper.Menus = jMaper.Decor.Extend({

	namespace : 'jMaper.Decor.Menus',

	structure : function(jsn){
		if((this.radio = {}) && jsn){
			if(this.$.Match.isBoolean(jsn.moment))
				this.moment = jsn.moment;
		}
	},

	moment : false,

	module : '<ul style="background-image:url(\'$3\');"><li><a href="javascript:void(0);" style="width:$1px;color:$4;font-size:$5px;font-style:$7;font-weight:$6;">$2</a></li></ul>',

	_trace : null,

	/**
	 * {
	 *     width : Number,
	 *     alpha : Number,
	 *     items : [{
	 *     		allow : Boolean,
	 *         	label : String,
	 *         	image : String,
	 *         	color : String,
	 *         	fonts : {
	 *             	size : Number,
	 *				bold : Boolean,
	 *				ital : Boolean
	 *         	},
	 *         	visit : Function
	 *     }]
	 * }
	 */
	bundle : function(obj, cfg){
		if(this.$.Match.isArray((cfg || 0).items) && (cfg.items || 0).length > 0)
			return !this.$.Match.isFunction((obj || 0).regist) ? this.moment ? this.$.Fx.longtap(obj, function(e){
				if(this.$.Support.touch || this.$.Util.getKey(e) === 1)
					this._regen(cfg, e);
			}, this) : (function(lsn){
				return {
					abort : this.$.Util.bind(this, function(){
						return lsn ? this.$.Util.delEvent(lsn) ? !(lsn = null) : false : true;
					})
				};
			}).call(this, this.$.Util.addEvent({
				obj : obj,
				arg : this,
				evt : 'contextmenu',
				fun : function(e){
					if(this.$.Util.stopLaunch(e))
						this._regen(cfg, e);
				}
			}, true)) : (function(lsn){
				return obj.regist(lsn.evt, lsn.fun) || {
					abort : function(){
						return obj && lsn ? obj.reject(lsn.evt, lsn.fun) || !(lsn = null) : true;
					}
				};
			}).call(this, this.moment ? {
				evt : this.$.Support.touch ? 'touchstart' : 'mousedown',
				fun : this.$.Util.bind(this, function(e, t, m, s, o){
					if((o = this.$.Util.getMouse(e)) && (t = this.$.Thread.delay(function(){
						if(this.$.Support.touch || this.$.Util.getKey(e) === 1)
							this._regen(cfg, e);
					}, 750, this))){
						m = this.$.Util.addEvent({
							evt : this.$.Support.touch ? 'touchmove' : 'mousemove',
							obj : this.$.Util.getDoc(this.target.client),
							arg : this,
							fun : function(p){
								if((p = this.$.Util.getMouse(p)) && (
									p.x != o.x || p.y != o.y
								))
									t.abort();
							}
						}, true);
						s = this.$.Util.addEvent({
							evt : this.$.Support.touch ? 'touchend' : 'mouseup',
							obj : this.$.Util.getDoc(this.target.client),
							arg : this,
							fun : function(){
								if(this.$.Util.delEvent(m) && this.$.Util.delEvent(s) && t.abort())
									m = s = t = null;
							}
						}, true);
					}
				})
			} : {
				evt : 'contextmenu',
				fun : this.$.Util.bind(this, function(e){
					if(this.$.Util.stopLaunch(e))
						this._regen(cfg, e);
				})
			});
	},

	_regen : function(cfg, aim){
		if((aim = this.$.Util.getMouse(aim)) && this.facade)
			this.$.Dom.removeChild(this.facade) || this._build(this.facade.appendChild(this.$.Dom.createDiv()), {
				width : cfg.width,
				alpha : cfg.alpha,
				items : cfg.items,
				mouse : aim
			});
	},

	_build : function(div, ctx){
		if((this.target || 0).screen && (
			div.style.display = 'none'
		)){
			// 设置透明
			div.style.filter = this.$.Array.join([
				'alpha(opacity=', (div.style.opacity = (ctx.alpha || 85) / 100) * 100, ')'
			], '');
			// 重绘控件
			this.$.Fx.add.call(this.target.client, div, this.$.Array.map(ctx.items, function(obj){
				return this.$.Util.format(this.module, [
					ctx.width || 85, obj.label || '', obj.image || '', obj.color || '#000000', (obj.fonts || 0).size || 12, (obj.fonts || 0).bold ? 'bolder' : 'normal', (obj.fonts || 0).ital ? 'italic' : 'normal'
				]);
			}, this), function(htm, css, num){
				if(num = ((css = this.$.Fn.css.call(htm, 'ul')) || 0).length){
					var bom, itm = this.$.Util.setElemSeat(htm, (
						htm.style.display = ''
					) || {
						t : ctx.mouse.y - this.target.screen.t,
						l : ctx.mouse.x - this.target.screen.l
					});
					// 绑定事件
					while((bom = this.$.Array.pop(css)) && (itm = ctx.items[--num])){
						this.$.Util.addEvent({
							obj : bom,
							arg : this,
							evt : jMaper.library.ctrl.click,
							fun : function(sel){
								return function(e){
									try{
										if(!(sel.allow === false) && this.$.Match.isFunction(sel.visit))
											sel.visit.call(sel, e);
									}catch(t){
										throw t;
									}finally{
										this.$.Dom.removeChild(this.facade);
									}
								};
							}(itm)
						}, true)
					}
				}
				// 释放内存
				this.$.Array.clear(ctx);
				{
					htm = css = num = ctx = null;
				}
			}, this);
		}else this.$.Dom.removeChild(div, true);
	},

	render : function(drv, job){
		if(((this.target = drv) || 0).enable)
			(function(menus){
				if(!(drv.canvas && drv.widget)){
					this.$.Thread.delay.call(drv.client, arguments.callee, 0, this);
				}else{
					if(menus = drv.widget.menus){
						if(!this.$.Match.equal(menus, this))
							arguments.callee.call(this, menus.remove());
					}else{
						// 监听广播
						this.observe(drv.listen.drag, this.radio.drag = this.$.Util.bind(this, this.redraw), 0);
						this.observe(drv.listen.zoom, this.radio.zoom = this.$.Util.bind(this, this.redraw), 0);
						this.observe(drv.listen.swap, this.radio.swap = this.$.Util.bind(this, this.redraw), 0);
						// 加载控件
						try{
							if(this.facade = drv.canvas.appendChild(this.$.Dom.createDiv()))
								menus = (drv.widget.menus = this).redraw();
						}catch(e){
							menus = null;
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

	redraw : function(msg){
		if((this.target || 0).enable && this.enable && this.facade)
			switch((msg || 0).chan){
				// Drag Event.
				case this.target.listen.drag:
				// Zoom Event.
				case this.target.listen.zoom:
				// Swap Event.
				case this.target.listen.swap:
				{
					return this.$.Dom.removeChild(this.facade);
				}
				default:
				{
					if(!this._trace && (
						this.facade.className = 'j-menus-'
					)){
						this._trace = this.$.Util.addEvent({
							evt : jMaper.library.ctrl.touch,
							obj : this.target.facade,
							arg : this,
							fun : function(e){
								if(this.facade && !this.$.Match.isSubset(this.facade, (this.$.Util.getEvent(e) || 0).src))
									this.$.Dom.removeChild(this.facade);
							}
						}, true);
					}else this.$.Dom.removeChild(this.facade);
				}
			}
	},

	remove : function(){
		if((this.target || 0).enable && this.enable)
			(function(){
				if(this.target)
					if(!this.facade){
						this.$.Thread.delay.call(this.target.client, arguments.callee, 0, this);
					}else{
						if(this.obscure(this.target.listen.drag, this.radio.drag))
							if(!this.obscure(this.target.listen.zoom, this.radio.zoom)){
								this.observe(this.target.listen.drag, this.radio.drag, 0);
							}else{
								if(!this.obscure(this.target.listen.swap, this.radio.swap)){
									this.observe(this.target.listen.drag, this.radio.drag, 0);
									this.observe(this.target.listen.zoom, this.radio.zoom, 0);
								}else{
									if(!delete this.target.widget.menus){
										this.observe(this.target.listen.drag, this.radio.drag, 0);
										this.observe(this.target.listen.zoom, this.radio.zoom, 0);
										this.observe(this.target.listen.swap, this.radio.swap, 0);
									}else{
										this.target = (
											this.facade = this.$.Dom.removeChild(this.facade, true)
										);
										// 内存释放
										{
											delete this.radio.drag;
											delete this.radio.zoom;
											delete this.radio.swap;
										}
										this._trace = null;
									}
								}
							}
					}
			}).call(this);
	}

});