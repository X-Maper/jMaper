jMaper.Tools = jMaper.Decor.Extend({

	namespace : 'jMaper.Decor.Tools',

	structure : function(jsn){
		if((this.radio = {}) && jsn){
			if(this.$.Match.isInt(jsn.active))
				this.active = jsn.active;
			if(this.$.Match.isArray(jsn.action))
				this.action = jsn.action;
			if(this.$.Match.isString(jsn.anchor))
				this.anchor = jMaper.library.rule.put.test(jsn.anchor) ? jsn.anchor.toLowerCase() : null;
		}
	},

	active : 0,

	/**
	 * {
	 *     allow : Boolean,
	 *     lable : String,
	 *     image : {
	 *         press : Url,
	 *         loose : Url
	 *     }
	 *     visit : Function
	 * }
	 */
	action : [],

	anchor : null,

	module : {
		live : '<img src="$1"/>',
		fill : '<a href="javascript:void(0);"></a>',
		item : '<a id="$1" href="javascript:void(0);"><div class="j-tools-$2-"><div></div><img src="$4"/><span>$3</span></div></a>',
		html : '<div class="j-tools-" style="$1:18px;"><div class="j-tools-btn-"><div></div><span></span></div><div class="j-tools-$1-" style="display:none;"></div></div>'
	},

	_fresh : null,

	_build : function(){
		if((this.facade || 0)._box)
			(function(){
				if(this._fresh){
					this.$.Thread.delay.call(this.target.client, arguments.callee, 0, this);
				}else{
					var htm = this.$.Dom.removeChild(this.facade._box) || [];
					try{
						for(var i = 0, b = this.$.Array.grep(this.action, function(itm){
							return itm.allow === false ? itm.allow : true;
						}, false), l = b.length, k = Math.ceil(l / 3) * 3, s, t; i < k; i++){
							this.$.Array.push(htm, i >= l ? this.module.fill : this.$.Util.format(this.module.item, this.active === (
								s = this.$.Array.index(this.action, t = b[i])
							) ? [
								s, 'sel', t.label || '', (t.image || 0).press || ''
							] : [
								s, 'mis', t.label || '', (t.image || 0).loose || ''
							]));
						}
					}catch(e){
						htm = null;
					}finally{
						if(this._fresh = (htm || 0).length){
							this.$.Fx.add.call(this.target.client, this.facade._box, htm, function(){
								this._fresh = this.$.Util.setElemSize(this.facade._box, {
									h : this._fresh / 3 * 59
								});
							}, this);
						}else{
							this.facade._box.style.display = 'none';
							{
								this.facade._btn.className = 'j-tools-btn-';
							}
						}
					}
					// 释放内存
					htm = null;
				}
			}).call(this);
	},

	select : function(obj){
		if((this.target || 0).enable && this.enable)
			obj = (function(arr, itm, idx){
				if(this.$.Match.isInt(itm, true)){
					if(itm > -1 && itm < arr.length)
						arguments.callee.call(this, arr, arr[itm]);
				}else{
					if(itm.allow !== false && (idx = this.$.Array.index(arr, itm)) > -1){
						// 重绘控件
						this.active = idx;
						{
							if((this.facade || 0)._img)
								try{
									if(this._build() || this.$.Match.isFunction(itm.visit))
										itm.visit.call(itm, idx);
								}catch(e){
									throw e;
								}finally{
									this.facade._img.innerHTML = this.$.Util.format(this.module.live, [(itm.image || 0).press || '']);
								}
						}
					}
				}
			}).call(this, this.$.Array.grep(this.action, function(itm){
				return itm.allow === false ? itm.allow : true;
			}, false), obj);
	},

	append : function(itm){
		if((this.target || 0).enable && this.enable && (
			this.$.Match.isJsn(itm) ? this.$.Array.push(this.action, itm) : false
		))
			itm = this._build();
	},

	repeal : function(obj){
		if((this.target || 0).enable && this.enable)
			obj = (function(arr, itm, idx){
				if(this.$.Match.isInt(itm, true)){
					if(itm > -1 && itm < arr.length)
						arguments.callee.call(this, arr, arr[itm]);
				}else{
					if((idx = this.$.Array.index(this.action, itm)) > -1 && this.$.Array.splice(this.action, idx, 1)){
						if(itm.allow !== false)
							this._build(this.active -= (
								this.$.Array.index(arr, itm) > this.active ? 0 : 1
							));
					}
				}
			}).call(this, this.$.Array.grep(this.action, function(itm){
				return itm.allow === false ? itm.allow : true;
			}, false), obj);
	},

	render : function(drv, job){
		if(((this.target = drv) || 0).enable)
			(function(tools){
				if(!(drv.canvas && drv.widget)){
					this.$.Thread.delay.call(drv.client, arguments.callee, 0, this);
				}else{
					if(tools = drv.widget.tools){
						if(!this.$.Match.equal(tools, this))
							arguments.callee.call(this, tools.remove());
					}else{
						// 加载控件
						try{
							tools = (drv.widget.tools = this).redraw();
						}catch(e){
							tools = null;
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
		if((this.target || 0).enable && this.enable && this.$.Array.some(this.action, function(item){
			return this.$.Match.isBoolean(item.allow) ? item.allow : true;
		}, this))
			// 绘制工具
			this.$.Fx.add.call(this.target.client, this.target.canvas, [this.$.Util.format(this.module.html, [this.anchor || (this.anchor = 'right')])], function(cnv){
				if((this.facade = this.$.Array.pop(this.$.Fn.css.call(cnv, '.j-tools-'))) && (
					this.facade._btn = this.$.Array.pop(
						cnv = this.$.Fn.css.call(this.facade, '.j-tools-btn-')
					)
				) && (
					this.facade._box = this.$.Dom.getLast(this.facade)
				) && (
					this.facade._img = this.$.Dom.getLast(this.facade._btn)
				)){
					// Hover for btn.
					this.$.Fx.hover.call(this.target.facade, this.facade._btn, {
						outer : function(_, btn){
							if((this.target || 0).enable && this.enable){
								this.facade._box.style.display = 'none';
								{
									btn.className = 'j-tools-btn-';
								}
							}
						},
						inner : function(_, btn){
							if((this.target || 0).enable && this.enable){
								this.facade._box.style.display = '';
								{
									btn.className = 'j-tools-b4h-'
								}
								// Build for ctx.
								this.$.Thread.delay(function(){
									if(this.facade._box.style.display === this.facade._box.innerHTML)
										this._build();
								}, 0, this);
							}
						}
					}).mount(this);
					// Hover for box.
					this.$.Fx.hover.call(this.target.facade, this.facade._box, {
						outer : function(_, box){
							this.facade._btn.className = 'j-tools-btn-';
							{
								box.style.display = 'none';
							}
						},
						inner : function(_, box){
							this.facade._btn.className = 'j-tools-b4h-';
							{
								box.style.display = '';
							}
						}
					}).mount(this);
					// Click for box.
					this.$.Util.addEvent(this.select(this.active || 0) || {
						evt : jMaper.library.ctrl.click,
						obj : this.facade._box,
						arg : this,
						fun : function(e){
							if((e = (this.$.Util.getEvent(e) || 0).src) !== this.facade._box)
								while(e){
									if(e.id){
										e = this.select(e.id);
									}else{
										e = this.$.Dom.getSire(e);
									}
								}
						}
					});
				}
			}, this);
	},

	remove : function(){
		if((this.target || 0).enable && this.enable)
			(function(){
				if(this.target)
					if(!this.facade || this._fresh){
						this.$.Thread.delay.call(this.target.client, arguments.callee, 0, this);
					}else{
						if(delete this.target.widget.tools){
							this.target = (
								this.facade = this.$.Dom.removeChild(this.facade, true)
							);
							// 内存释放
							delete this._fresh;
						}
					}
			}).call(this);
	}

});