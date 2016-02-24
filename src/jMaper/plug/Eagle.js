jMaper.Eagle = jMaper.Decor.Extend({

	namespace : 'jMaper.Decor.Eagle',

	structure : function(jsn){
		if((this.radio = {}) && jsn){
			if(this.$.Match.isBoolean(jsn.hidden))
				this.hidden = jsn.hidden;
			if(this.$.Match.isObject(jsn.geomap))
				this.geomap = jsn.geomap;
			if(this.$.Match.isObject(jsn.vision))
				this.vision = jsn.vision;
			if(this.$.Match.isNumber(jsn.policy))
				this.policy = jsn.policy;
			if(this.$.Match.isString(jsn.anchor))
				this.anchor = jMaper.library.rule.put.test(jsn.anchor) ? jsn.anchor.toLowerCase() : null;
		}
	},

	policy : 16,

	hidden : true,

	vision : null,

	geomap : null,

	anchor : null,

	module : '<div class="j-eagle-" style="$1:-5px;"><div class="j-eagle-view-"><div class="j-eagle-box-"><div class="j-eagle-map-"><div></div></div><div class="j-eagle-see-"><div></div></div></div><div class="j-eagle-eye-"></div></div><div class="j-eagle-$3b2$2-" style="$1:4px;"><div></div></div></div>',

	_fresh : null,

	_mdown : function(e){
		if((this.$.Support.touch || this.$.Util.getKey(e.e) === 1) && !(this.target || 0).travel && this.target.enable && this.enable && (
			e.c = this.geomap.crd2px(this.target.center)
		) && (
			e.m = this.$.Util.getMouse(e.e)
		))
			this.$.Util.setMouse.call(this.target.client, this.facade._ctx, jMaper.library.hand.drag);
	},

	_mstop : function(e){
		if(e.m && this.$.Util.setMouse.call(this.target.client, this.facade._ctx, jMaper.library.hand.free) && e.p)
			this.target.netmap.moveto(this._place = this.geomap.px2crd(e.c.offset({
				x : e.p.x,
				y : e.p.y
			})), !(
				Math.abs(e.p.x) > this.facade._eye.offsetWidth || Math.abs(e.p.y) > this.facade._eye.offsetHeight
			));
	},

	_ratio : function(map){
		return (map = ((map || 0).deg2sc ? map.deg2sc() : 0) * (this.policy || 1)) > 0 && (
			map = this.$.Array.map(this.geomap.factor, function(deg){
				return Math.abs(this.geomap.deg2sc(deg) - map);
			}, this)
		).length ? this.$.Array.index(map, this.$.Array.min(map)) : -1;
	},

	_watch : function(c2s){
		if((c2s = {w : Math.round(this.target.screen.w * c2s), h : Math.round(this.target.screen.h * c2s)}) && (
			!(this.facade._eye.style.display = (
				this.facade._see.style.display = !(this.vision.w > c2s.w || this.vision.h > c2s.h) ? 'none' : ''
			))
		)){
			// 设置大小
			this.$.Util.setElemSize(this.facade._eye, c2s);
			this.$.Util.setElemSize(this.facade._see, c2s);
			// 设置位置
			(this._flyto || (this._flyto = function(box, pos){
				if(pos)
					(function(bom, sit, pel){
						if(!bom){
							arguments.callee.call(this, this.facade._eye, sit, pel);
							arguments.callee.call(this, this.facade._see, sit, pel);
						}else this.$.Util.setElemSeat(bom, {
							l : Math.round(pel.x + sit.l - this.geomap.nature.x - bom.offsetWidth * 0.5),
							t : Math.round(pel.y + sit.t - this.geomap.nature.y - bom.offsetHeight * 0.5)
						});
					}).call(this, box, this.$.Util.getElemSeat(this.facade._map), (
						this.geomap.crd2px(pos) || pos
					));
			})).call(this, null, this.target.center);
		}else delete this._flyto;
	},

	_altas : function(c2p){
		// 地图属性
		this.geomap._grasp(c2p, this.geomap.nature || (this.geomap.nature = {
			t : 0,
			l : 0
		}), this);
		// 重绘地图
		if(this.geomap._alpha())
			this.geomap._build(c2p, this);
	},

	_build : function(msg){
		if(!this.hidden && (this.geomap.target = this.target) && (
			this.geomap.facade = (this.facade || 0)._map
		)){
			// 计算视野
			if(this.$.Dom.removeChild(this.facade._map) || !msg){
				if(this.vision || !(this.vision = {
					x : 64,
					y : 64,
					h : 128,
					w : 128
				})){
					this.vision.x = Math.round((this.vision.w <= 18 ? this.vision.w = 128 : this.vision.w) * 0.5);
					this.vision.y = Math.round((this.vision.h <= 18 ? this.vision.h = 128 : this.vision.h) * 0.5);
				}
				// 鹰眼大小
				this.geomap.index = (
					this.$.Util.setElemSize(this.facade._ctx, this.vision) || this.$.Util.now()
				);
			}
			// 绘制鹰眼
			if((this.geomap.level = this._ratio(this.target.netmap)) < 0){
				// 清空样式
				if(delete this._flyto)
					this.facade._eye.style.cssText = (
						this.facade._see.style.cssText = ''
					);
			}else{
				// 绘制地图
				this._watch(this._altas(this.geomap.crd2px(this.geomap._ajust(this.target.center))) || (
					this.target.netmap.deg2sc() / this.geomap.deg2sc()
				));
			}
		}else delete this._flyto;
	},

	spread : function(){
		if(this.enable && (this.facade || 0)._map && this.hidden && !(this.hidden = !!(
			this.facade._ctx.style.display = ''
		)))
			this.facade._btn.className = (
				this._build() || this.facade._btn.className.replace('o', 'i')
			);
	},

	shrink : function(){
		if(this.enable && (this.facade || 0)._map && !this.hidden && (this.hidden = !!(
			this.facade._ctx.style.display = 'none'
		)))
			this.facade._btn.className = (
				this._build() || this.facade._btn.className.replace('i', 'o')
			);
	},

	render : function(drv, job){
		if(((this.target = drv) || 0).enable)
			(function(eagle){
				if(!(drv.canvas && drv.widget)){
					this.$.Thread.delay.call(drv.client, arguments.callee, 0, this);
				}else{
					if(eagle = drv.widget.eagle){
						if(!this.$.Match.equal(eagle, this))
							arguments.callee.call(this, eagle.remove());
					}else{
						// 监听广播
						this.observe(drv.listen.drag, this.radio.drag = this.$.Util.bind(this, this.redraw), 0);
						this.observe(drv.listen.zoom, this.radio.zoom = this.$.Util.bind(this, this.redraw), 0);
						this.observe(drv.listen.swap, this.radio.swap = this.$.Util.bind(this, this.redraw), 0);
						// 加载控件
						try{
							eagle = (drv.widget.eagle = this).redraw();
						}catch(e){
							eagle = null;
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
		if((this.target || 0).enable && this.enable && this.geomap)
			switch((msg || 0).chan){
				// Drag Event.
				case this.target.listen.drag:
				{
					if((this.facade || 0)._map && !this.hidden && (
						msg = this.geomap.crd2px(this.geomap._ajust(msg.info))
					)){
						// Map.
						var gm4s = this.$.Util.getElemSeat(this.facade._map), gpt1 = Math.round(this.geomap.nature.y + this.vision.y - msg.y), gpt2 = Math.round(this.geomap.nature.x + this.vision.x - msg.x);
						if(this.geomap.nature.t !== gm4s.t || this.geomap.nature.l !== gm4s.l){
							this.geomap.nature.t = gpt1;
							this.geomap.nature.l = gpt2;
						}else{
							this.$.Util.setElemSeat(this.facade._map, {
								t : this.geomap.nature.t = gpt1,
								l : this.geomap.nature.l = gpt2
							});
						}
						// Eye.
						if(this._flyto)
							this._flyto(this.facade._see, this._flyto(this.facade._eye, (
								(gpt1 = this.$.Util.getElemSeat(this.facade._eye)).t !== (gpt2 = this.$.Util.getElemSeat(this.facade._see)).t || gpt1.l !== gpt2.l ? this._place : msg
							)) || msg);
						// 重绘地图
						msg = this.geomap._build(msg, this);
					}
					break;
				}
				// Zoom and Swap Event.
				case this.target.listen.zoom:
				case this.target.listen.swap:
				{
					if((this.facade || 0)._map)
						this._build(msg);
					break;
				}
				default:
				{
					(function(){
						if((this.facade || 0)._map){
							return (this.hidden = !this.hidden) ? this.spread() : this.shrink();
						}else{
							if(this._fresh){
								this.$.Thread.delay.call(this.target.client, arguments.callee, 0, this);
							}else{
								this._fresh = this.$.Fx.add.call(this.target.client, this.target.canvas, [this.$.Util.format(this.module, [this.anchor || (this.anchor = 'right'), this.anchor.substr(0, 1), this.hidden ? 'o' : 'i'])], function(cnv){
									if((this.facade = this.$.Array.pop(this.$.Fn.css.call(cnv, '.j-eagle-'))) && this.$.Util.setMouse.call(this.target.client, this.facade._ctx = this.$.Dom.getPrev(this.facade._btn = this.$.Dom.getLast(this.facade)), jMaper.library.hand.free) && (
										this.facade._eye = this.$.Array.pop(cnv = this.$.Fn.css.call(this.facade, '.j-eagle-map->div,.j-eagle-see-,.j-eagle-eye-'))
									) && (
										this.facade._see = this.$.Array.pop(cnv)
									) && (
										this.facade._map = this.$.Array.pop(cnv)
									)){
										// Map Touch.
										this.$.Fx.drag(this.facade._map, {
											down : this._mdown,
											stop : this._mstop,
											move : function(e){
												if(e.m && (e.p = this.$.Util.getMouse(e.e))){
													// Map move.
													this.$.Util.setElemSeat(this.facade._map, {
														t : Math.round(this.geomap.nature.t - (e.p.y = e.m.y - e.p.y)),
														l : Math.round(this.geomap.nature.l - (e.p.x = e.m.x - e.p.x))
													});
													// See move.
													if(this._flyto)
														this._flyto(this.facade._see, e.c);
												}
											}
										}).start(this);
										// Eye Touch.
										this.$.Fx.drag(this.facade._eye, {
											down : this._mdown,
											stop : this._mstop,
											move : function(e){
												if(e.m && (e.p = this.$.Util.getMouse(e.e)))
													this._flyto(this.facade._eye, e.c.clone().offset({
														x : e.p.x = e.p.x - e.m.x,
														y : e.p.y = e.p.y - e.m.y
													}));
											}
										}).start(this);
										// Btn Hover.
										this.$.Fx.hover.call(this.target.facade, this.facade._btn, {
											outer : function(_, btn){
												btn.className = btn.className.replace('4', '2');
											},
											inner : function(_, btn){
												btn.className = btn.className.replace('2', '4');
											}
										}).mount(this);
										// Btn Click.
										this.$.Util.addEvent((
											this._fresh = this._fresh.call(this)
										) || {
											arg : this,
											obj : this.facade._btn,
											evt : jMaper.library.ctrl.click,
											fun : function(){
												return this.hidden ? this.spread() : this.shrink();
											}
										});
									}
									// 释放锁定
									delete this._fresh;
								}, this) || arguments.callee;
							}
						}
					}).call(this);
				}
			}
		// 内存释放
		msg = null;
	},

	remove : function(){
		if((this.target || 0).enable && this.enable)
			(function(){
				if(this.target)
					if(!this.facade || this._fresh){
						this.$.Thread.delay.call(this.target.client, arguments.callee, 0, this);
					}else{
						if(this.obscure(this.target.listen.drag, this.radio.drag)){
							if(!this.obscure(this.target.listen.zoom, this.radio.zoom)){
								this.observe(this.target.listen.drag, this.radio.drag, 0);
							}else{
								if(!this.obscure(this.target.listen.swap, this.radio.swap)){
									this.observe(this.target.listen.drag, this.radio.drag, 0);
									this.observe(this.target.listen.zoom, this.radio.zoom, 0);
								}else{
									if(!delete this.target.widget.eagle){
										this.observe(this.target.listen.drag, this.radio.drag, 0);
										this.observe(this.target.listen.zoom, this.radio.zoom, 0);
										this.observe(this.target.listen.swap, this.radio.swap, 0);
									}else{
										this.geomap.target = (
											this.target = (
												this.geomap.facade = (
													this.facade = this.$.Dom.removeChild(this.facade, true)
												)
											)
										);
										// 内存释放
										{
											delete this.radio.drag;
											delete this.radio.zoom;
											delete this.radio.swap;
										}
										delete this._flyto;
										delete this._place;
										delete this._fresh;
									}
								}
							}
						}
					}
			}).call(this);
	}

});