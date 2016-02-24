jMaper.Mark = jMaper.Layer.Extend({

	namespace : 'jMaper.Layer.Mark',

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
			if(this.$.Match.isString(jsn.scene))
				this.scene = jsn.scene;
			if(this.$.Match.isObject(jsn.fonts))
				this.fonts = jsn.fonts;
			if(this.$.Match.isObject(jsn.frame))
				this.frame = jsn.frame;
			if(this.$.Match.isString(jsn.label))
				this.label = jsn.label;
			if(this.$.Match.isString(jsn.image))
				this.image = jsn.image;
			if(this.$.Match.isObject(jsn.dimen))
				this.dimen = jsn.dimen;
			if(this.$.Match.isObject(jsn.calib))
				this.calib = jsn.calib;
			if(this.$.Match.isObject(jsn.point))
				this.point = jsn.point;
		}
	},

	mouse : null,

	color : null,

	scene : null,

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
	 *     thick : Number,
	 *     style : String,
	 *     color : String
	 * }
	 */
	frame : null,

	label : null,

	image : null,

	dimen : null,

	calib : null,

	point : null,

	/**
	 * {
	 *     min : Number,
	 *     max : Number
	 * }
	 */
	arise : null,

	matte : false,

	amend : false,

	module : '<ul class="j-mark-label-"><li></li></ul><ul class="j-mark-image-"><li></li></ul>',

	_paint : null,

	_setup : function(msg){
		if(!msg){
			// 地标标题
			this.facade._label.title = (
				this.facade._image.title = this.title || ''
			);
			// 地标大小
			this.$.Util.setElemSize(this.facade._image, {
				w : (this.dimen || 0).w || 0,
				h : (this.dimen || 0).h || 0
			});
			// 地标光标
			this.$.Util.setMouse(this.facade._label, this.mouse);
			this.$.Util.setMouse(this.facade._image, this.mouse);
			// 地标图片
			if((this.facade._png.style.backgroundImage = 'none') && !(
				this.$.Browser.ie && this.$.Browser.v < 9 && jMaper.library.rule.png.test(this.image)
			)){
				this.facade._png.style.backgroundImage = 'url(' + this.image + ')';
			}else{
				this.facade._png.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=corp, src="' + this.image + '")';
			}
			// 地标边框
			this.facade._image.style.border = this.$.Array.join([
				(this.frame || 0).thick ? this.frame.thick + 'px' : 0, (this.frame || 0).style || 'solid', (this.frame || 0).color || '#ff0000'
			], ' ');
			// 地标文字
			if((this.facade._txt.innerHTML = this.label || '') && (
				this.facade._txt.style.color = this.color || '#0000ff'
			)){
				// 文字字号
				this.facade._txt.style.fontSize = ((this.fonts || 0).size || 12) + 'px';
				// 文字样式
				this.facade._txt.style.fontStyle = (this.fonts || 0).ital ? 'italic' : 'normal';
				// 文字加粗
				this.facade._txt.style.fontWeight = (this.fonts || 0).bold ? 'bolder' : 'normal';
				// 文字边框
				if(this.facade._image.style.marginTop = (this.frame || 0).thick ? -this.frame.thick + 'px' : 0)
					this.facade._label.style.border = this.facade._image.style.border;
			}
			// 地标背景
			this.facade._image.style.backgroundColor = (
				this.facade._label.style.backgroundColor = this.scene || 'transparent'
			);
			// 地标透明
			this.facade.style.filter = this.$.Array.join([
				'alpha(opacity=', (this.facade.style.opacity = (this.alpha || 100) / 100) * 100, ')'
			], '');
		}
	},

	_build : function(msg, c2p){
		if(!this.matte && this._arise(this.arise, this.point) && (
			c2p = this.target.netmap.crd2px(this.point)
		)){
			this.facade.style.display = this._setup(msg) || '';
			// 地标位置
			this.$.Util.setElemSize(this.facade, {
				w : this.facade.scrollWidth,
				h : this.facade.scrollHeight
			});
			this.$.Util.setElemSeat(this.facade, {
				t : Math.round(c2p.y - this.target.netmap.nature.y - this.facade._image.offsetTop - ((this.frame || 0).thick || 0) - ((this.calib || 0).y || 0)),
				l : Math.round(c2p.x - this.target.netmap.nature.x - this.facade._image.offsetLeft - ((this.frame || 0).thick || 0) - ((this.calib || 0).x || 0))
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
			this.target.canvas.maper.mark.appendChild(this.facade);
	},

	render : function(drv, job){
		if(((this.target = drv) || 0).enable)
			(function(mark){
				if(!(drv.symbol || 0).mark){
					this.$.Thread.delay.call(drv.client, arguments.callee, 0, this);
				}else{
					if(mark = drv.symbol.mark[this.namespace + '.' + this.index]){
						mark = this.$.Match.equal(mark, this) ? this.redraw() : arguments.callee.call(
							this, mark.remove()
						);
					}else{
						// 监听广播
						this.observe(drv.listen.drag, this.radio.drag = this.$.Util.bind(this, this.redraw));
						this.observe(drv.listen.zoom, this.radio.zoom = this.$.Util.bind(this, this.redraw));
						this.observe(drv.listen.swap, this.radio.swap = this.$.Util.bind(this, this.redraw));
						// 绘制图形
						if((this.facade = drv.canvas.maper.mark.appendChild(this.$.Dom.createDiv())).style.display = 'none')
							try{
								mark = (drv.symbol.mark[this.namespace + '.' + this.index] = this).redraw();
							}catch(e){
								mark = null;
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
						if(this.facade._png){
							msg = this._build(msg);
						}else{
							if(this._paint){
								this.$.Thread.delay.call(this.target.client, arguments.callee, 0, this);
							}else{
								this._paint = this.$.Fx.add.call(this.target.client, this.facade, [this.module], function(cnv){
									if((this.facade._image = this.$.Array.pop(cnv = this.$.Fn.css.call(this.facade, '.j-mark-label-,.j-mark-image-'))) && (
										this.facade._label = this.$.Array.pop(cnv)
									) && (
										this.facade._txt = this.$.Dom.getFore(this.facade._label)
									) && (
										this.facade._png = this.$.Dom.getFore(this.facade._image)
									))
										this._paint = this._paint.call(this);
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
									if(!delete this.target.symbol.mark[this.namespace + '.' + this.index]){
										this.observe(this.target.listen.drag, this.radio.drag);
										this.observe(this.target.listen.zoom, this.radio.zoom);
										this.observe(this.target.listen.swap, this.radio.swap);
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
										delete this._paint;
									}
								}
							}
						}
					}
			}).call(this);
	}

});