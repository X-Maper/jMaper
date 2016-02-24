jMaper.Tips = jMaper.Layer.Extend({

	namespace : 'jMaper.Layer.Tips',

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
			if(this.$.Match.isObject(jsn.fonts))
				this.fonts = jsn.fonts;
			if(this.$.Match.isObject(jsn.gauge))
				this.gauge = jsn.gauge;
			if(this.$.Match.isObject(jsn.drift))
				this.drift = jsn.drift;
			if(this.$.Match.isDefined(jsn.quote))
				this.quote = jsn.quote;
			if(this.$.Match.isObject(jsn.point))
				this.point = jsn.point;
			if(this.$.Match.isFunction(jsn.scrap))
				this.scrap = jsn.scrap;
		}
	},

	mouse : null,

	color : null,

	/**
	 * {
	 *     size : Number,
	 *     bold : Boolean,
	 *     ital : Boolean
	 * }
	 */
	fonts : null,

	/**
	 * {
	 *     min : Number,
	 *     max : Number
	 * }
	 */
	arise : null,

	gauge : null,

	drift : null,

	quote : null,

	point : null,

	scrap : null,

	matte : false,

	module : {
		iframe : '<iframe marginWidth="0" marginHeight="0" scrolling="auto" frameborder="0" src="$1"></iframe>',
		wicket : '<div class="j-tips-head-"><div></div></div><div class="j-tips-main-"><div class="j-tips-body-"><div class="j-tips-info-"></div></div><div class="j-tips-foot-"><div></div></div></div><div class="j-tips-ctrl-"><div></div></div>'
	},

	_paint : null,

	_setup : function(msg){
		if(!msg){
			// 提示规格
			this.$.Util.setElemSize(this.facade, {
				w : this.gauge.w
			});
			this.$.Util.setElemSize(this.facade._body, {
				w : this.gauge.w,
				h : this.gauge.h
			});
			this.$.Util.setElemSize(this.facade._main, {
				w : this.gauge.w + 2
			});
			this.$.Util.setElemSize(this.facade._info, {
				w : this.gauge.w - 16,
				h : this.gauge.h - 10
			});
			// 提示光标
			this.$.Util.setMouse(this.facade._head, this.mouse);
			this.$.Util.setMouse(this.facade._main, this.mouse);
			// 提示标题
			if((this.facade._word.innerHTML = this.title || '') && (
				this.facade._word.style.color = this.color || '#cc5522'
			)){
				// 文字字号
				this.facade._word.style.fontSize = ((this.fonts || 0).size || 14) + 'px';
				// 文字样式
				this.facade._word.style.fontStyle = (this.fonts || 0).ital ? 'italic' : 'normal';
				// 文字加粗
				this.facade._word.style.fontWeight = this.$.Match.isBoolean((this.fonts || 0).bold) ? (
					this.fonts.bold ? 'bolder' : 'normal'
				) : 'bolder';
			}
			// 提示内容
			if(this.facade._info.style.overflow = 'auto'){
				this.$.Dom.removeChild(this.facade._info);
				// 加载内容
				if(this.$.Match.isDom(this.quote)){
					this.facade._info.appendChild(this.quote);
				}else{
					if(this.$.Match.isString(this.quote))
						if(!this.$.Match.isUrl(this.quote)){
							this.facade._info.innerHTML = this.quote;
						}else{
							this.$.Fx.add.call(this.target.client, this.facade._info, [this.$.Util.format(this.module.iframe, [this.quote])], function(){
								this.facade._info.style.overflow = 'hidden';
							}, this);
						}
				}
			}
			// 提示透明
			this.facade._head.style.filter = this.facade._main.style.filter = this.$.Array.join([
				'alpha(opacity=', (this.facade._head.style.opacity = this.facade._main.style.opacity = (this.alpha || 85) / 100) * 100, ')'
			], '');
		}
	},

	_build : function(msg, c2p){
		// 规格修正
		if(this.gauge || !(this.gauge = {
			h : 35,
			w : 155
		})){
			if(this.gauge.h < 1)
				this.gauge.h = 35;
			if(this.gauge.w < 32)
				this.gauge.w = 155;
		}
		// 提示绘制
		if(!this.matte && this._arise(this.arise, this.point) && (
			c2p = this.target.netmap.crd2px(this.point)
		)){
			this.facade.style.display = this._setup(msg) || '';
			// 提示位置
			this.$.Util.setElemSeat(this.facade, {
				t : Math.round(((this.drift || 0).y || 0) + c2p.y - this.target.netmap.nature.y - this.gauge.h - 42),
				l : Math.round(((this.drift || 0).x || 0) + c2p.x - this.target.netmap.nature.x - this.gauge.w * 0.5 - 1)
			});
		}else{
			this.facade.style.display = 'none';
			{
				this._setup(msg);
			}
		}
	},

	summit : function(){
		if((this.target || 0).enable && this.enable && this.facade)
			this.target.canvas.maper.tips.appendChild(this.facade);
	},

	render : function(drv, job){
		if(((this.target = drv) || 0).enable)
			(function(tips){
				if(!(drv.symbol || 0).tips){
					this.$.Thread.delay.call(drv.client, arguments.callee, 0, this);
				}else{
					if(tips = drv.symbol.tips[this.namespace + '.' + this.index]){
						tips = this.$.Match.equal(tips, this) ? this.redraw() : arguments.callee.call(
							this, tips.remove()
						);
					}else{
						// 监听广播
						this.observe(drv.listen.drag, this.radio.drag = this.$.Util.bind(this, this.redraw));
						this.observe(drv.listen.zoom, this.radio.zoom = this.$.Util.bind(this, this.redraw));
						this.observe(drv.listen.swap, this.radio.swap = this.$.Util.bind(this, this.redraw));
						// 绘制图形
						if(((this.facade = drv.canvas.maper.tips.appendChild(this.$.Dom.createDiv())).style.display = 'none') && (
							this.facade.className = 'j-tips-html-'
						))
							try{
								tips = (drv.symbol.tips[this.namespace + '.' + this.index] = this).redraw();
							}catch(e){
								tips = null;
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
		if((this.target || 0).enable && this.target.netmap && this.enable && this.facade)
			switch((msg || 0).chan){
				// Swap Event.
				case this.target.listen.swap:
				{
					if(msg.info.cover)
						break;
				}
				default:
				{
					(function(){
						if(this.facade._word){
							msg = this._build(msg);
						}else{
							if(this._paint){
								this.$.Thread.delay.call(this.target.client, arguments.callee, 0, this);
							}else{
								this._paint = this.$.Fx.add.call(this.target.client, this.facade, [this.module.wicket], function(cnv){
									if((this.facade._ctrl = this.$.Array.pop(cnv = this.$.Fn.css.call(this.facade, '.j-tips-head-,.j-tips-main-,.j-tips-body-,.j-tips-info-,.j-tips-ctrl-'))) && (
										this.facade._info = this.$.Array.pop(cnv)
									) && (
										this.facade._body = this.$.Array.pop(cnv)
									) && (
										this.facade._main = this.$.Array.pop(cnv)
									) && (
										this.facade._word = this.$.Dom.getFore(
											this.facade._head = this.$.Array.pop(cnv)
										)
									)){
										// Touch for body.
										this.$.Util.addEvent({
											obj : this.facade._body,
											evt : jMaper.library.ctrl.touch,
											fun : function(){
												return false;
											}
										});
										// Hover for ctrl.
										this.$.Fx.hover.call(this.target.facade, this.facade._ctrl, {
											outer : function(_, btn){
												btn.className = 'j-tips-ctrl-';
											},
											inner : function(_, btn){
												btn.className = 'j-tips-shut-';
											}
										}).mount();
										// Click for ctrl.
										this.$.Util.addEvent({
											obj : this.facade._ctrl,
											evt : jMaper.library.ctrl.click,
											fun : this.$.Util.bind(this, this.remove)
										});
										// Build for tips.
										this._paint = this._paint.call(this);
									}
									// 释放锁定
									delete this._paint;
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
					if(!this.facade || this._paint){
						this.$.Thread.delay.call(this.target.client, arguments.callee, 0, this);
					}else{
						if(this.obscure(this.target.listen.drag, this.radio.drag)){
							if(!this.obscure(this.target.listen.zoom, this.radio.zoom)){
								this.observe(this.target.listen.drag, this.radio.drag);
							}else{
								if(!this.obscure(this.target.listen.swap, this.radio.swap)){
									this.observe(this.target.listen.drag, this.radio.drag);
									this.observe(this.target.listen.zoom, this.radio.zoom);
								}else{
									if(!delete this.target.symbol.tips[this.namespace + '.' + this.index]){
										this.observe(this.target.listen.drag, this.radio.drag);
										this.observe(this.target.listen.zoom, this.radio.zoom);
										this.observe(this.target.listen.swap, this.radio.swap);
									}else{
										this.target = (
											this.facade = this.$.Dom.removeChild(this.facade, true)
										);
										try{
											if(this.$.Match.isFunction(this.scrap))
												this.scrap.call(this);
										}catch(e){
											throw e;
										}finally{
											// 内存释放
											{
												delete this.radio.drag;
												delete this.radio.zoom;
												delete this.radio.swap;
											}
											delete this._paint;
										}
									}
								}
							}
						}
					}
			}).call(this);
	}

});