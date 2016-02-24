/*******************************************************************************
 * 用途：jMaper地图引擎
 *
 * @author Wythe
 *
 * 版本日志：
 * @version 1.0 2009.08.01 创建 Wythe
 * @version 2.0 2010.10.01 更新 Wythe
 * @version 3.0 2012.11.01 更新 Wythe
 ******************************************************************************/
(function(wnd, unf){

	(function(_){

		/**
		 * 辅助类
		 */
		this.prototype['$'] = _;

		/**
		 * 版本号
		 */
		this.version = '3.0';

		/**
		 * 资源库
		 */
		this.library = {

			lang : function(){
				return  jMaper.i18n[(this.option || 0).assets] || jMaper.i18n[arguments[0]];
			},

			unit : {
				 M : 39.3701,
				KM : 39370.1,
				DD : 4374780.0,
				FT : 12.0,
				IN : 1.0
			},

			rule : {
				png : /.png/i,
				put : /^(LEFT|RIGHT)$/i
			},

			hand : {
				free : _.root + 'misc/ico/mouse/free.cur',
				drag : _.root + 'misc/ico/mouse/drag.cur'
			},

			mesh : {
				cause : _.root + 'misc/ico/patch/cause.png',
				blank : _.root + 'misc/ico/patch/blank.png'
			},

			ctrl : {
				click : _.Support.touch ? 'touchend' : 'click',
				touch : _.Support.touch ? 'touchstart' : 'mousedown'
			}

		};

		/**
		 * 投影系
		 *
		 * EPSG:4326    // WGS84
		 * EPSG:900913  // MKT
		 */
		this.convert = {
			'EPSG:4326' : {
				decode : function(wgs){
					return wgs && (
						(_.Match.isNumber(wgs.lng) && _.Match.isNumber(wgs.lat)) || (wgs.min && wgs.max)
					) ? wgs : unf;
				},
				encode : function(wgs){
					return wgs && (
						(_.Match.isNumber(wgs.lng) && _.Match.isNumber(wgs.lat)) || (wgs.min && wgs.max)
					) ? wgs : unf;
				}
			},
			'EPSG:900913' : {
				decode : function(wgs){
					return wgs ? _.Match.isNumber(wgs.lng) && _.Match.isNumber(wgs.lat) ? new jMaper.Coord({
						lng : wgs.lng * 20037508.34 / 180,
						lat : Math.log(Math.tan((90 + wgs.lat) * Math.PI / 360)) / Math.PI * 20037508.34
					}) : wgs.min && wgs.max ? new jMaper.Bound({
						min : arguments.callee.call(this, wgs.min),
						max : arguments.callee.call(this, wgs.max)
					}) : unf : unf;
				},
				encode : function(mkt){
					return mkt ? _.Match.isNumber(mkt.lng) && _.Match.isNumber(mkt.lat) ? new jMaper.Coord({
						lng : 180 * mkt.lng / 20037508.34,
						lat : 180 / Math.PI * (2 * Math.atan(Math.exp(mkt.lat / 20037508.34 * Math.PI)) - Math.PI / 2)
					}) : mkt.min && mkt.max ? new jMaper.Bound({
						min : arguments.callee.call(this, mkt.min),
						max : arguments.callee.call(this, mkt.max)
					}) : unf : unf;
				}
			}
		};

		/**
		 * 继承器
		 */
		this.feature = (function(caller, slaver){
			return ((slaver = caller.extend({$ : _}, function(){})).Extend = function(seeder){
				return (
					(seeder = caller.extend(caller.assign(seeder, this.prototype), caller.create.call(seeder))).Extend = arguments.callee
				) ? seeder : unf;
			}) ? slaver : unf;
		}).call(this.i18n = {}, {
			create : function(){
				return function(){
					try{
						if(this.structure)
							this.structure.apply(this, arguments);
					}catch(e){
						throw '<' + this.namespace + '> - Structure Exception';
					}
				};
			},
			extend : function(seeder, slaver){
				try{
					for(var proper in seeder){
						slaver.prototype[proper] = seeder[proper];
					}
				}catch(e){
					throw '<' + seeder.namespace + '> - Extend Exception';
				}
				return slaver;
			},
			assign : function(seeder, slaver, skiper){
				try{
					for(var proper in slaver){
						if(seeder[proper] === skiper)
							seeder[proper] = slaver[proper];
					}
				}catch(e){
					throw '<' + seeder.namespace + '> - Assign Exception';
				}
				return seeder;
			}
		});

		/**
		 * 预处理
		 */
		this.prepare = function(){
			var csize, cseat;
			try{
				csize = this.$.Util.getElemSize(this.canvas);
				cseat = this.$.Util.getPosition(this.canvas);
			}catch(e){
				csize = cseat = null;
			}finally{
				this.screen = csize && cseat ? this.sketch.sliceStage({
					x : csize.w,
					y : csize.h
				}) || {
					w : csize.w,
					h : csize.h,
					l : cseat.x,
					t : cseat.y,
					x : Math.round(csize.w * 0.5),
					y : Math.round(csize.h * 0.5)
				} : {};
			}
			if(!this.assets)
				this.assets = jMaper.library.lang.call(this, 'zh_Hans');
		};

		/**
		 * 渲染器
		 */
		this.prototype.include = function(elem, task){
			return !this.$.Match.isArray(elem) ? (
				(elem || 0).render ? !elem.render(this, task) : false
			) : !this.$.Array.each(elem, function(seed){
				this.include(seed, task);
			}, this);
		};

		this.prototype.refresh = function(elem){
			return !this.$.Match.isArray(elem) ? (
				(elem || 0).redraw ? !elem.redraw() : false
			) : !this.$.Array.each(elem, function(seed){
				this.refresh(seed);
			}, this);
		};

		this.prototype.exclude = function(elem){
			return !this.$.Match.isArray(elem) ? (
				(elem || 0).remove ? !elem.remove() : false
			) : !this.$.Array.each(elem, function(seed){
				this.exclude(seed);
			}, this);
		};

		this.prototype.dispose = function(){
			// 地图控件
			this.$.Array.each(this.widget, function(x){
				if((x || 0).remove) x.remove();
			});
			// 地图元素
			this.$.Array.each(this.symbol, function(x){
				for(var i = x.length - 1, e; i >= 0; i--){
					if(((e = x[i]) || 0).remove) e.remove();
				}
			});
			// 地图监听
			this.$.Array.each(this.listen, function(x){
				if((x || 0).dispose) x.dispose();
			});
			// 缓存清空
			this.$.Array.clear(this.screen);
			this.$.Array.clear(this.listen);
			this.$.Array.clear(this.symbol);
			this.$.Array.clear(this.widget);
			// 内存释放
			this.client = this.facade = this.canvas = this.option = this.assets = this.netmap = this.center = this.screen = this.listen = this.symbol = this.widget = this.sketch = this.$.Dom.removeChild(this.facade);
		};

		/**
		 * 视窗界
		 */
		this.prototype.viewbox = function(view){
			if(this.netmap){
				var middle = this.netmap.crd2px(this.center);
				if(middle){
					return new jMaper.Bound(view === false ? {
						min : this.netmap.px2crd(new jMaper.Pixel({
							x : middle.x - this.screen.w,
							y : middle.y - this.screen.h
						})),
						max : this.netmap.px2crd(new jMaper.Pixel({
							x : middle.x + this.screen.w,
							y : middle.y + this.screen.h
						}))
					} : {
						min : this.netmap.px2crd(new jMaper.Pixel({
							x : middle.x - this.screen.x,
							y : middle.y - this.screen.y
						})),
						max : this.netmap.px2crd(new jMaper.Pixel({
							x : middle.x + this.screen.x,
							y : middle.y + this.screen.y
						}))
					});
				}
			}
		};

	}).call((
		wnd.jMaper = function(cnv, cfg){
			if(this.$.Match.isElement(this.facade = this.$.Match.isString(cnv) ? this.$.Fn.id.call(wnd, cnv) : cnv) && (
				this.enable = this.$.Util.setMouse.call((this.client = wnd), this.facade, jMaper.library.hand.free)
			)){

				this.facade.className = 'jMaper' + (
					this.facade.className ? ' ' + this.facade.className : ''
				);

				// 屏蔽选择
				this.$.Util.addEvent({obj : this.facade, evt : 'selectstart', fun : function(e){
					return false;
				}});

				// 屏蔽右键
				this.$.Util.addEvent({obj : this.facade, evt : 'contextmenu', fun : function(e){
					return (e || 0).preventDefault ? e.preventDefault() : false;
				}});

				// 开启漫游
				this.ramble = this.$.Match.isBoolean(((this.option = cfg) || 0).ramble) ? this.option.ramble : true;

				// 初始画布
				this.$.Fx.add.call(this.client, this.facade, ['<div class="j-canvas-"></div>'], function(e){
					if(this.canvas = this.$.Array.pop(this.$.Fn.css.call(e, '.j-canvas-')))
						this.$.Fx.add.call(this.client, this.canvas, ['<div class="j-maper-"></div>'], function(c){
							this.$.Fx.add.call(this.client, this.canvas.maper = this.$.Array.pop(this.$.Fn.css.call(c, '.j-maper-')), [
								'<div class="j-tile-"></div>', '<div class="j-pile-"></div>', '<div class="j-note-"></div>', '<div class="j-draw-"></div>', '<div class="j-mark-"></div>', '<div class="j-tips-"></div>'
							], function(m){
								if((m = this.$.Fn.css.call(m, '.j-tile-,.j-pile-,.j-note-,.j-draw-,.j-mark-,.j-tips-')) && (
									this.canvas.maper.tips = this.$.Array.pop(m)
								) && (
									this.canvas.maper.mark = this.$.Array.pop(m)
								) && (
									this.canvas.maper.draw = this.$.Array.pop(m)
								) && (
									this.canvas.maper.note = this.$.Array.pop(m)
								) && (
									this.canvas.maper.pile = this.$.Array.pop(m)
								) && (
									this.canvas.maper.tile = this.$.Array.pop(m).appendChild(
										this.$.Dom.createDiv()
									)
								) && (
									this.widget = {}
								) && (
									this.symbol = {
										tile : {},
										pile : {},
										note : {},
										draw : {},
										mark : {},
										tips : {}
									}
								) && (
									this.listen = {
										drag : new jMaper.Event({name : 'Drag', fire : this}),
										zoom : new jMaper.Event({name : 'Zoom', fire : this}),
										swap : new jMaper.Event({name : 'Swap', fire : this})
									}
								) && (
									this.sketch = new this.$.Graphic(this.canvas.maper.draw, this.client)
								))
									// 漫游拖动
									this.$.Fx.drag(this.facade, jMaper.prepare.call(this) || {
										down : function(e){
											if((this.$.Support.touch || this.$.Util.getKey(e.e) === 1) && this.enable && this.ramble && (this.netmap || 0).enable && (
												e.c = this.netmap.crd2px(this.center)
											) && (
												e.m = this.$.Util.getMouse(e.e)
											))
												this.$.Util.setMouse.call(this.client, this.facade, jMaper.library.hand.drag);
										},
										move : function(e){
											if(this.manual = !!(e.m && (e.p = this.$.Util.getMouse(e.e)))){
												this.$.Util.setElemSeat(this.canvas.maper, {
													t : Math.round(this.netmap.nature.t - (e.p.y = e.m.y - e.p.y)),
													l : Math.round(this.netmap.nature.l - (e.p.x = e.m.x - e.p.x))
												});
												// 鹰眼随动
												if((this.widget.eagle || 0)._flyto)
													this.widget.eagle._flyto(unf, this.netmap.px2crd(e.c.clone().offset({
														x : e.p.x,
														y : e.p.y
													})));
											}
										},
										stop : function(e){
											if(e.m && this.$.Util.setMouse.call(this.client, this.facade, jMaper.library.hand.free) && e.p)
												this.manual = this.netmap.moveto(e.c.offset({
													x : e.p.x,
													y : e.p.y
												}));
										}
									}).start(this);
							}, this);
						}, this);
				}, this);
			}else throw 'Instance Exception';
		}
	), wnd.jMagic);

})(window);