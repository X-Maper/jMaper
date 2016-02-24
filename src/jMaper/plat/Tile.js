jMaper.Tile = jMaper.Geog.Extend({

	namespace : 'jMaper.Layer.Geog.Tile',

	alarm : true,

	block : {
		wide : 256,
		high : 256
	},

	module : '<img id="$1" name="#" src="$6" style="top:$4px;left:$5px;width:$2px;height:$3px;"/>',

	deg2sc : function(deg){
		return this.$.Array.index(this.factor, deg || (deg = (this.factor || 0)[this.level])) > -1 ? Math.round(deg * this.craft * jMaper.library.unit[this.units]) : 0;
	},

	cur2px : function(cur){
		return cur && this.$.Match.isNumber(cur.x) && this.$.Match.isNumber(cur.y) ? (function(c2p){
			return c2p ? new jMaper.Pixel({
				x : cur.x + c2p.x - this.l - this.x,
				y : cur.y + c2p.y - this.t - this.y
			}) : null;
		}).call(this.target.screen, this.crd2px(this.target.center)) : null;
	},

	crd2px : function(crd){
		return crd && this.$.Match.isNumber(crd.lng) && this.$.Match.isNumber(crd.lat) ? (function(ogn, deg){
			return ogn && deg ? new jMaper.Pixel({
				x : (this.lng - ogn.lng) / deg,
				y : (ogn.lat - this.lat) / deg
			}) : null;
		}).call(this.projcs.decode(crd), this.projcs.decode(this.origin), this.factor[this.level]) : null;
	},

	px2crd : function(pel){
		return pel && this.$.Match.isNumber(pel.x) && this.$.Match.isNumber(pel.y) ? (function(ogn, deg){
			return ogn && deg ? this.encode(new jMaper.Coord({
				lng : ogn.lng + pel.x * deg,
				lat : ogn.lat - pel.y * deg
			})) : null;
		}).call(this.projcs, this.projcs.decode(this.origin), this.factor[this.level]) : null;
	},

	moveto : function(pos){
		if((this.target || 0).netmap === this && this.target.enable && this.enable && (
			pos = this._ajust(pos)
		)){
			if(!this.target.center.compare(this.target, pos) || arguments.callee.caller === this.resize)
				if(arguments[1]){
					this.$.Fx.anime.call(this.target.client, function(fly, c2p, m2p, inv, dev){
						try{
							if(this.target.travel && this.target.travel !== fly)
								this.target.travel.stop();
						}catch(e){
							fly = pos = null;
						}finally{
							return (this.target.travel = fly) ? this.target.netmap === this && !this.target.manual ? !(c2p = this.crd2px(pos)).compare(this.target, (m2p = this.crd2px(this.target.center)).offset({
								x : (inv = Math.abs(dev = c2p.x - m2p.x)) > this.speed ? this.speed * inv / dev : dev,
								y : (inv = Math.abs(dev = c2p.y - m2p.y)) > this.speed ? this.speed * inv / dev : dev
							})) ? this.moveto(m2p) : (this.target.travel = pos = this.moveto(m2p)) || false : (this.target.travel = pos = null) || false : false;
						}
					}, 0, this);
				}else{
					var v2p, c2p = this.crd2px(pos);
					// 地图位置
					this.$.Util.setElemSeat(this.target.canvas.maper, {
						t : this.nature.t = Math.round(this.nature.y + this.target.screen.y - c2p.y),
						l : this.nature.l = Math.round(this.nature.x + this.target.screen.x - c2p.x)
					});
					// 绘图视界
					this.target.sketch.sliceStage(v2p = {
						x : this.nature.l + this.target.screen.w,
						y : this.nature.t + this.target.screen.h
					});
					// 绘图位置
					v2p = this.$.Util.setElemSeat(this.target.canvas.maper.draw, {
						t : -v2p.y,
						l : -v2p.x
					});
					// 重绘地图
					c2p = this._build(c2p);
					// 事件通知
					pos = this.trigger(this.target.listen.drag, this.target.center = pos);
				}
		}
	},

	zoomto : function(num){
		if((this.target || 0).netmap === this && this.target.enable && this.enable && this.level !== num && this.factor[num]){
			var pixel = this.crd2px(this.target.center), ratio = this.factor[this.level] / this.factor[this.level = num];
			// 缩略地图
			this._thumb(ratio, {
				x : pixel.x - this.nature.x,
				y : pixel.y - this.nature.y
			});
			// 地图属性
			this._grasp(pixel.ratio(ratio), this.nature);
			// 重绘地图
			this.$.Thread.delay.call(this.trigger(this.target.listen.zoom, ratio) || this.target.client, function(){
				this._build(this.crd2px(this.target.center));
			}, 700, this);
		}
	},

	access : function(use){
		if((this.target || 0).enable && this.enable)
			if(this.cover){
				if((this.level = this.fusion(this.target)) > -1){
					this.allow = use;
				}else{
					return;
				}
			}else{
				if(use && this.allow && this.target.netmap !== this){
					if((this.target.netmap || 0).nature){
						this.nature = {
							t : this.target.netmap.nature.t,
							l : this.target.netmap.nature.l
						};
						// 适配比例
						if((use = this.target.netmap.deg2sc()) && (
							use = this.$.Array.map(this.factor, function(deg){
								return Math.abs(this.deg2sc(deg) - use);
							}, this)
						).length)
							this.level = this.$.Array.index(use, this.$.Array.min(use));
					}
					// 切换地图
					(this.target.netmap = this).redraw();
				}else{
					return;
				}
			}
		// 广播事件
		use = this.trigger(this.target.listen.swap, this);
	},

	fusion : function(drv){
		return (drv || 0).netmap && (drv = drv.netmap.deg2sc() * 10) ? this.$.Array.index(this.factor, this.$.Array.find(this.factor, function(deg){
			return (deg = Math.round(drv / this.deg2sc(deg)) / 10) >= 1.0 && deg <= 1.1;
		}, this)) : -1;
	},

	_ajust : function(p2c){
		if((this.extent || 0).correct)
			return this.extent.correct(this.target, (
				(this.target.option || 0).limits ? this.target.option.limits.correct(this.target, p2c) : p2c
			));
	},

	source : function(){
		return '#';
	},

	repair : function(){
		return this._spare();
	},

	axis4x : function(){
		return Math.round(arguments[1] * this.block.wide - arguments[2]);
	},

	axis4y : function(){
		return Math.round(arguments[1] * this.block.high - arguments[2]);
	},

	_spare : function(){
		return !this.cover && this.alarm ? jMaper.library.mesh.cause : jMaper.library.mesh.blank;
	},

	_alpha : function(){
		return !!(this.facade.style.filter = this.$.Array.join([
			'alpha(opacity=', (this.facade.style.opacity = (this.alpha || 100) / 100) * 100, ')'
		], ''));
	},

	_dimen : function(bnd, deg, geo){
		geo.w = Math.floor((bnd.max.lng - bnd.min.lng) / deg / this.block.wide) * this.block.wide;
		geo.h = Math.floor((bnd.min.lat - bnd.max.lat) / deg / this.block.high) * this.block.high;
	},

	_grasp : function(c2p, geo, eye){
		if((eye || 0).vision){
			geo.x = this.nature.l - eye.vision.x + c2p.x;
			geo.y = this.nature.t - eye.vision.y + c2p.y;
		}else{
			if(eye = (this.cover ? this.target.netmap.nature : this.nature)){
				geo.x = eye.l - this.target.screen.x + c2p.x;
				geo.y = eye.t - this.target.screen.y + c2p.y;
			}
		}
		// 地图尺寸
		c2p = this._dimen({min : this.projcs.decode(this.origin), max : this.projcs.decode(this.extent).max}, this.factor[this.level], geo);
	},

	_thumb : function(per, pos){
		pos = per = this.$.Array.each(this.$.Fn.css.call(this.facade, 'img'), function(img, css){
			// Thumb Size.
			css = this.$.Util.getElemSize(img);
			css = this.$.Util.setElemSize(img, {
				w : Math.round(css.w * per),
				h : Math.round(css.h * per)
			});
			// Thumb Seat.
			css = this.$.Util.getElemSeat(img);
			css = this.$.Util.setElemSeat(img, {
				l : Math.round(pos.x - (pos.x - css.l) * per),
				t : Math.round(pos.y - (pos.y - css.t) * per)
			});
		}, this);
	},

	_bound : function(c2p, eye){
		var dev, m4v = (eye || 0).vision || this.target.screen;
		return {
			minR : (dev = c2p.y - m4v.h) < 0 ? 0 : Math.floor(dev / this.block.high),
			minC : (dev = c2p.x - m4v.w) < 0 ? 0 : Math.floor(dev / this.block.wide),
			maxR : (dev = c2p.y + m4v.h) < this.nature.h ? Math.floor(dev / this.block.high) : (
				this.nature.h > this.block.high ? this.nature.h / this.block.high - 1 : 0
			),
			maxC : (dev = c2p.x + m4v.w) < this.nature.w ? Math.floor(dev / this.block.wide) : (
				this.nature.w > this.block.wide ? this.nature.w / this.block.wide - 1 : 0
			)
		};
	},

	_patch : function(c2p, eye){
		var tile = [];
		for(var b = this._bound(c2p, eye), i = b.minR, j; i <= b.maxR; i++){
			for(j = b.minC; j <= b.maxC; j++){
				this.$.Array.push(tile, {
					id : this.$.Array.join([this.level, i, this.index, j], ''), row : i, col : j
				});
			}
		}
		return tile;
	},

	_build : function(c2p, eye){
		var tile = this._patch(c2p, eye), html, i;
		if(i = tile.length){
			for(var k, j = (html = this.$.Fn.css.call(this.facade, 'img')).length - 1; j > -1; i = tile.length, j--){
				for(--i, k = this.$.Array.pop(html); i > -1; i--){
					if(tile[i].id === k.id){
						this.$.Array.splice(tile, i, k = 1);
						break;
					}
				}
				if(k !== 1) this.facade.removeChild(k);
			}
			while(i = this.$.Array.pop(tile)){
				this.$.Array.push(html, this.$.Util.format(this.module, [
					i.id, this.block.wide, this.block.high, this.axis4y(this.level, i.row, this.nature.y), this.axis4x(this.level, i.col, this.nature.x), this.source(this.level, i.row, i.col)
				]));
			}
			// 加载栅格
			html = this.$.Fx.add.call(this.target.client, this.facade, this.$.Array.sort(html, 'random'), function(div){
				this.$.Array.each(this.$.Fn.css.call(div, 'img[name]'), function(img, lsn){
					if(lsn = this.$.Util.addEvent({
						obj : img,
						arg : this,
						evt : 'error',
						fun : function(){
							if(this.$.Util.delEvent(lsn))
								try{
									img.src = this.repair();
								}catch(e){
									img.src = this._spare();
								}finally{
									img = lsn = null;
								}
						}
					}))
						img.removeAttribute('name');
				}, this);
			}, this);
		}
		// 释放内存
		tile = c2p = i = null;
	},

	render : function(drv, job){
		if(((this.target = drv) || 0).enable && (this.factor || 0).length > 0)
			if(this.cover){
				(function(index){
					if(!(((drv.canvas || 0).maper || 0).pile) || ((drv.symbol || 0).pile || 0)[index = this.$.Util.now()]){
						this.$.Thread.delay.call(drv.client, arguments.callee, 0, this);
					}else{
						if((this.facade = drv.canvas.maper.pile.appendChild(this.$.Dom.createDiv())) && (
							drv.symbol.pile[this.facade.style.zIndex = (
								this.index = this.$.Match.isInt(this.index, true) ? this.index : index
							)] = this
						)){
							// 监听广播
							this.observe(drv.listen.drag, this.radio.drag = this.$.Util.bind(this, this.redraw), 1);
							this.observe(drv.listen.zoom, this.radio.zoom = this.$.Util.bind(this, this.redraw), 1);
							this.observe(drv.listen.swap, this.radio.swap = this.$.Util.bind(this, this.redraw), 1);
							// 加载图层
							try{
								index = this.access(!!this.allow);
							}catch(e){
								index = null;
							}finally{
								if(this.$.Match.isFunction(job))
									this.$.Thread.delay.call(drv.client, job, 0, this);
								// 释放内存
								drv = job = null;
							}
						}
					}
				}).call(this);
			}else{
				(function(index){
					if(!(this.facade = ((drv.canvas || 0).maper || 0).tile) || ((drv.symbol || 0).tile || 0)[index = this.$.Util.now()]){
						this.$.Thread.delay.call(drv.client, arguments.callee, 0, this);
					}else{
						if(drv.symbol.tile[this.index = this.$.Match.isInt(this.index, true) ? this.index : index] = this)
							// 加载瓦片
							try{
								index = this.access(!drv.netmap);
							}catch(e){
								index = null;
							}finally{
								if(this.$.Match.isFunction(job))
									this.$.Thread.delay.call(drv.client, job, 0, this);
								// 释放内存
								drv = job = null;
							}
					}
				}).call(this);
			}
	},

	redraw : function(msg){
		if((this.target || 0).enable && this.enable && this.facade)
			switch((msg || 0).chan){
				// Drag Event.
				case this.target.listen.drag:
				{
					if(this.allow && this.nature)
						if(this.extent.contain(this.target, msg.info)){
							// 重绘地图
							this._build(this.crd2px(msg.info));
						}else{
							this.$.Dom.removeChild(this.facade);
						}
					break;
				}
				// Zoom Event.
				case this.target.listen.zoom:
				{
					if(this.allow)
						if((this.level = this.fusion(this.target)) > -1){
							var middle = this.crd2px(this.target.center);
							if(this.nature){
								// 缩略地图
								this._thumb(msg.info, {
									x : middle.x / msg.info - this.nature.x,
									y : middle.y / msg.info - this.nature.y
								});
								// 地图属性
								this._grasp(middle, this.nature);
							}else{
								this._grasp(middle, this.nature = {});
							}
							// 重绘地图
							if(this.extent.contain(this.target, this.target.center))
								this.$.Thread.delay.call(this.target.client, function(){
									if(this.nature) this._build(this.crd2px(this.target.center));
								}, 700, this);
						}else{
							if(this.nature)
								this.nature = this.$.Dom.removeChild(this.facade);
						}
					break;
				}
				// Swap Event.
				case this.target.listen.swap:
				{
					if(msg.info.cover && msg.info !== this)
						break;
				}
				default :
				{
					if(this.cover){
						if(this.allow && (this.level = this.fusion(this.target)) > -1 && (
							msg = this.crd2px(this.target.center)
						)){
							// 地图属性
							this._grasp(msg, this.nature || (
								this.nature = {}
							));
							// 绘制地图
							if(this._alpha() && this.extent.contain(this.target, this.target.center))
								this._build(msg);
						}else{
							if(this.nature)
								this.nature = this.$.Dom.removeChild(this.facade);
						}
					}else{
						if(this.allow && (this.factor || 0)[this.level] && (msg = this._ajust(this.target.center || (this.target.option || 0).center)) && (
							this.target.center = msg
						)){
							// 地图属性
							this._grasp(msg = this.crd2px(msg), this.nature || (this.nature = {
								t : 0,
								l : 0
							}));
							// 绘制地图
							if(this._alpha())
								this._build(msg);
						}
					}
				}
			}
		// 内存释放
		msg = null;
	}

});