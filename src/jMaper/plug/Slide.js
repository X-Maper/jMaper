jMaper.Slide = jMaper.Decor.Extend({

	namespace : 'jMaper.Decor.Slide',

	structure : function(jsn){
		if((this.radio = {}) && jsn){
			if(this.$.Match.isFunction(jsn.locate))
				this.locate = jsn.locate;
			if(this.$.Match.isBoolean(jsn.simple))
				this.simple = jsn.simple;
			if(this.$.Match.isString(jsn.anchor))
				this.anchor = jMaper.library.rule.put.test(jsn.anchor) ? jsn.anchor.toLowerCase() : null;
		}
	},

	anchor : null,

	locate : null,

	simple : false,

	module : {
		lite : '<div class="j-slide-" style="$1:18px;"><div class="j-slide2pin-"><div></div></div><div class="j-slide2zmi-"><div></div></div><div class="j-slide2zmo-"><div></div></div></div>',
		full : '<div class="j-slide-" style="$1:18px;"><div class="j-slide-pan-"><div></div></div><div class="j-slide-pin-"><div></div></div><div class="j-slide-zmi-"><div></div></div><div class="j-slide-bar-" style="height:$2px;"><div class="j-slide-bar-pick-"><div class="j-slide-bar-base-"><div></div></div><div class="j-slide-bar-mask-" style="top:$3px;"><div></div></div></div><div class="j-slide-bar-ctrl-" style="top:$4px;"><div></div></div></div><div class="j-slide-zmo-"><div></div></div><div class="j-slide-p2e-"></div><div class="j-slide-p2s-"></div><div class="j-slide-p2w-"></div><div class="j-slide-p2n-"></div></div>'
	},

	_build : function(bar){
		if(this.$.Match.isArray((this.target.netmap || 0).factor)){
			if(bar & (bar = this.target.netmap.factor.length) >= 0){
				this.$.Util.setElemSize(this.facade._bar, {
					h : (bar + 1) * 7 - 1
				});
			}
			this.$.Util.setElemSeat(this.facade._bar._ctrl, {
				t : (bar - this.target.netmap.level) * 7 - 4
			});
			this.$.Util.setElemSeat(this.facade._bar._mask, {
				t : (bar - this.target.netmap.level) * 7 - 1
			});
		}
	},

	render : function(drv, job){
		if(((this.target = drv) || 0).enable)
			(function(slide){
				if(!(drv.canvas && drv.widget)){
					this.$.Thread.delay.call(drv.client, arguments.callee, 0, this);
				}else{
					if(slide = drv.widget.slide){
						if(!this.$.Match.equal(slide, this))
							arguments.callee.call(this, slide.remove());
					}else{
						// 监听广播
						this.observe(drv.listen.zoom, this.radio.zoom = this.$.Util.bind(this, this.redraw), 0);
						this.observe(drv.listen.swap, this.radio.swap = this.$.Util.bind(this, this.redraw), 0);
						// 加载控件
						try{
							slide = (drv.widget.slide = this).redraw();
						}catch(e){
							slide = null;
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
		if((this.target || 0).enable && this.enable)
			switch((msg || 0).chan){
				// Swap Event.
				case this.target.listen.zoom:
				{
					if(!this.simple)
						this._build(false);
					break;
				}
				// Swap Event.
				case this.target.listen.swap:
				{
					if(!this.simple)
						this._build(true);
					break;
				}
				default :
				{
					if(this.simple){
						this.$.Fx.add.call(this.target.client, this.target.canvas, [this.$.Util.format(this.module.lite, [this.anchor || (this.anchor = 'left')])], function(cnv){
							if((this.facade = this.$.Array.pop(this.$.Fn.css.call(cnv, '.j-slide-'))) && (
								this.facade._zmo = this.$.Array.pop(
									cnv = this.$.Fn.css.call(this.facade, '.j-slide2pin-,.j-slide2zmi-,.j-slide2zmo-')
								)
							) && (
								this.facade._zmi = this.$.Array.pop(cnv)
							) && (
								this.facade._pin = this.$.Array.pop(cnv)
							)){
								// Title for btn.
								if(cnv = this.target.assets){
									this.facade._pin.title = cnv.slide.pin;
									this.facade._zmi.title = cnv.slide.max;
									this.facade._zmo.title = cnv.slide.min;
								}
								// Hover for pin.
								this.$.Fx.hover.call(this.target.facade, this.facade._pin, {
									outer : function(_, pin){
										pin.className = 'j-slide2pin-';
									},
									inner : function(_, pin){
										if((this.target || 0).netmap)
											pin.className = 'j-slide2p4h-';
									}
								}).mount(this);
								// Hover for zmi.
								this.$.Fx.hover.call(this.target.facade, this.facade._zmi, {
									outer : function(_, zmi){
										zmi.className = 'j-slide2zmi-';
									},
									inner : function(_, zmi){
										if((this.target || 0).netmap)
											zmi.className = 'j-slide2i4h-';
									}
								}).mount(this);
								// Hover for zmo.
								this.$.Fx.hover.call(this.target.facade, this.facade._zmo, {
									outer : function(_, zmo){
										zmo.className = 'j-slide2zmo-';
									},
									inner : function(_, zmo){
										if((this.target || 0).netmap)
											zmo.className = 'j-slide2o4h-';
									}
								}).mount(this);
								// Click for zmi.
								this.$.Util.addEvent({
									evt : jMaper.library.ctrl.click,
									obj : this.facade._zmi,
									arg : this,
									fun : function(){
										if(((this.target || 0).netmap || 0).zoomto)
											this.target.netmap.zoomto(this.target.netmap.level + 1);
									}
								});
								// Click for zmo.
								this.$.Util.addEvent({
									evt : jMaper.library.ctrl.click,
									obj : this.facade._zmo,
									arg : this,
									fun : function(){
										if(((this.target || 0).netmap || 0).zoomto)
											this.target.netmap.zoomto(this.target.netmap.level - 1);
									}
								});
								// Click for pin.
								if(!(this.facade._pin.style.display = !(this.$.Match.isFunction(this.locate) && this.$.Support.locate) ? 'none' : ''))
									this.$.Util.addEvent({
										evt : jMaper.library.ctrl.click,
										obj : this.facade._pin,
										arg : this,
										fun : function(e){
											if((this.target || 0).netmap)
												this.$.Fx.locate.share({
													Success : function(pos){
														this.locate(pos);
													},
													Failure : function(err){
														this.locate({err : err});
													}
												}, this);
										}
									});
							}
						}, this);
					}else{
						this.$.Fx.add.call(this.target.client, this.target.canvas, [this.$.Util.format(this.module.full, this.$.Array.merge([this.anchor || 'left'], (msg = ((this.target.netmap || 0).factor || 0).length) ? [(msg + 1) * 7 - 1, (msg - this.target.netmap.level) * 7 - 1, (msg - this.target.netmap.level) * 7 - 4] : [0, 0, 0]))], function(cnv){
							if((this.facade = this.$.Array.pop(this.$.Fn.css.call(cnv, '.j-slide-'))) && (
								this.facade._p2n = this.$.Array.pop(
									cnv = this.$.Fn.css.call(this.facade, '.j-slide-pan-,.j-slide-pin-,.j-slide-zmi-,.j-slide-bar-,.j-slide-zmo-,.j-slide-p2e-,.j-slide-p2s-,.j-slide-p2w-,.j-slide-p2n-')
								)
							) && (
								this.facade._p2w = this.$.Array.pop(cnv)
							) && (
								this.facade._p2s = this.$.Array.pop(cnv)
							) && (
								this.facade._p2e = this.$.Array.pop(cnv)
							) && (
								this.facade._zmo = this.$.Array.pop(cnv)
							) && (
								this.facade._bar = this.$.Array.pop(cnv)
							) && (
								this.facade._zmi = this.$.Array.pop(cnv)
							) && (
								this.facade._pin = this.$.Array.pop(cnv)
							) && (
								this.facade._pan = this.$.Array.pop(cnv)
							) && (
								this.facade._bar._ctrl = this.$.Array.pop(
									cnv = this.$.Fn.css.call(this.facade._bar, '.j-slide-bar-pick-,.j-slide-bar-mask-,.j-slide-bar-ctrl-')
								)
							) && (
								this.facade._bar._mask = this.$.Array.pop(cnv)
							) && (
								this.facade._bar._pick = this.$.Array.pop(cnv)
							)){
								// Title for btn.
								if(cnv = this.target.assets){
									this.facade._p2e.title = cnv.slide.p2e;
									this.facade._p2s.title = cnv.slide.p2s;
									this.facade._p2w.title = cnv.slide.p2w;
									this.facade._p2n.title = cnv.slide.p2n;
									this.facade._pin.title = cnv.slide.pin;
									this.facade._zmi.title = cnv.slide.max;
									this.facade._zmo.title = cnv.slide.min;
									this.facade._bar.title = cnv.slide.bar;
									this.facade._bar._ctrl.title = cnv.slide.dex;
								}
								// Hover for p2e.
								this.$.Fx.hover.call(this.target.facade, this.facade._p2e, {
									outer : function(){
										this.facade._pan.className = 'j-slide-pan-';
									},
									inner : function(){
										if((this.target || 0).netmap)
											this.facade._pan.className = 'j-slide-p4e-';
									}
								}).mount(this);
								// Hover for p2s.
								this.$.Fx.hover.call(this.target.facade, this.facade._p2s, {
									outer : function(){
										this.facade._pan.className = 'j-slide-pan-';
									},
									inner : function(){
										if((this.target || 0).netmap)
											this.facade._pan.className = 'j-slide-p4s-';
									}
								}).mount(this);
								// Hover for p2w.
								this.$.Fx.hover.call(this.target.facade, this.facade._p2w, {
									outer : function(){
										this.facade._pan.className = 'j-slide-pan-';
									},
									inner : function(){
										if((this.target || 0).netmap)
											this.facade._pan.className = 'j-slide-p4w-';
									}
								}).mount(this);
								// Hover for p2n.
								this.$.Fx.hover.call(this.target.facade, this.facade._p2n, {
									outer : function(){
										this.facade._pan.className = 'j-slide-pan-';
									},
									inner : function(){
										if((this.target || 0).netmap)
											this.facade._pan.className = 'j-slide-p4n-';
									}
								}).mount(this);
								// Hover for pin.
								this.$.Fx.hover.call(this.target.facade, this.facade._pin, {
									outer : function(_, pin){
										pin.className = 'j-slide-pin-';
									},
									inner : function(_, pin){
										if((this.target || 0).netmap)
											pin.className = 'j-slide-p4h-';
									}
								}).mount(this);
								// Hover for zmi.
								this.$.Fx.hover.call(this.target.facade, this.facade._zmi, {
									outer : function(_, zmi){
										zmi.className = 'j-slide-zmi-';
									},
									inner : function(_, zmi){
										if((this.target || 0).netmap)
											zmi.className = 'j-slide-i4h-';
									}
								}).mount(this);
								// Hover for zmo.
								this.$.Fx.hover.call(this.target.facade, this.facade._zmo, {
									outer : function(_, zmo){
										zmo.className = 'j-slide-zmo-';
									},
									inner : function(_, zmo){
										if((this.target || 0).netmap)
											zmo.className = 'j-slide-o4h-';
									}
								}).mount(this);
								// Hover for ctrl.
								this.$.Fx.hover.call(this.target.facade, this.facade._bar._ctrl, {
									outer : function(_, ctrl){
										ctrl.className = 'j-slide-bar-ctrl-';
									},
									inner : function(_, ctrl){
										if((this.target || 0).netmap)
											ctrl.className = 'j-slide-bar-slip-';
									}
								}).mount(this);
								// Touch for ctrl.
								this.$.Fx.drag(this.facade._bar._ctrl, {
									down : function(e, ctrl){
										e.m = this.$.Util.getMouse(e.e);
										e.p = this.$.Util.getElemSeat(ctrl);
										e.l = (e.n = ((this.target.netmap || 0).factor || 0).length || 0) * 7 - 4;
									},
									move : function(e, ctrl){
										if((e.o = e.p.t + this.$.Util.getMouse(e.e).y - e.m.y) > 0 && e.o < e.l){
											this.$.Util.setElemSeat(this.facade._bar._mask, {
												t : (e.r = Math.floor(e.o / 7)) * 7 + 6
											});
											this.$.Util.setElemSeat(ctrl, {
												t : e.r * 7 + 3
											});
										}
									},
									stop : function(e, ctrl){
										if((ctrl.className = this.$.Match.isSubset(ctrl, this.$.Util.getEvent(e.e).src, true) ? 'j-slide-bar-slip-' : 'j-slide-bar-ctrl-') && e.n)
											this.target.netmap.zoomto(e.n - e.r - 1);
									}
								}).start(this);
								// Click for pick.
								this.$.Util.addEvent({
									evt : jMaper.library.ctrl.click,
									obj : this.facade._bar._pick,
									arg : this,
									fun : function(e){
										if(((this.target || 0).netmap || 0).zoomto)
											this.target.netmap.zoomto(this.target.netmap.factor.length - Math.floor(
												(this.$.Util.getMouse(e).y - this.$.Util.getElemSeat(this.facade._bar).t) / 7
											));
									}
								});
								// Click for p2e.
								this.$.Util.addEvent({
									evt : jMaper.library.ctrl.click,
									obj : this.facade._p2e,
									arg : this,
									fun : function(){
										if(((this.target || 0).netmap || 0).moveto)
											this.target.netmap.moveto(this.target.netmap.crd2px(this.target.center).offset({
												x : this.target.screen.x
											}), true);
									}
								});
								// Click for p2s.
								this.$.Util.addEvent({
									evt : jMaper.library.ctrl.click,
									obj : this.facade._p2s,
									arg : this,
									fun : function(){
										if(((this.target || 0).netmap || 0).moveto)
											this.target.netmap.moveto(this.target.netmap.crd2px(this.target.center).offset({
												y : this.target.screen.y
											}), true);
									}
								});
								// Click for p2w.
								this.$.Util.addEvent({
									evt : jMaper.library.ctrl.click,
									obj : this.facade._p2w,
									arg : this,
									fun : function(){
										if(((this.target || 0).netmap || 0).moveto)
											this.target.netmap.moveto(this.target.netmap.crd2px(this.target.center).offset({
												x : -this.target.screen.x
											}), true);
									}
								});
								// Click for p2n.
								this.$.Util.addEvent({
									evt : jMaper.library.ctrl.click,
									obj : this.facade._p2n,
									arg : this,
									fun : function(){
										if(((this.target || 0).netmap || 0).moveto)
											this.target.netmap.moveto(this.target.netmap.crd2px(this.target.center).offset({
												y : -this.target.screen.y
											}), true);
									}
								});
								// Click for zmi.
								this.$.Util.addEvent({
									evt : jMaper.library.ctrl.click,
									obj : this.facade._zmi,
									arg : this,
									fun : function(){
										if(((this.target || 0).netmap || 0).zoomto)
											this.target.netmap.zoomto(this.target.netmap.level + 1);
									}
								});
								// Click for zmo.
								this.$.Util.addEvent({
									evt : jMaper.library.ctrl.click,
									obj : this.facade._zmo,
									arg : this,
									fun : function(){
										if(((this.target || 0).netmap || 0).zoomto)
											this.target.netmap.zoomto(this.target.netmap.level - 1);
									}
								});
								// Click for pin.
								if(!(this.facade._pin.style.display = !(this.$.Match.isFunction(this.locate) && this.$.Support.locate) ? 'none' : ''))
									this.$.Util.addEvent({
										evt : jMaper.library.ctrl.click,
										obj : this.facade._pin,
										arg : this,
										fun : function(){
											if((this.target || 0).netmap)
												this.$.Fx.locate.share({
													Success : function(pos){
														this.locate(pos);
													},
													Failure : function(err){
														this.locate({err : err});
													}
												}, this);
										}
									});
							}
						}, this);
					}
				}
			}
		// 销毁信息
		msg = null;
	},

	remove : function(){
		if((this.target || 0).enable && this.enable)
			(function(){
				if(this.target)
					if(!this.facade){
						this.$.Thread.delay.call(this.target.client, arguments.callee, 0, this);
					}else{
						if(this.obscure(this.target.listen.zoom, this.radio.zoom))
							if(!this.obscure(this.target.listen.swap, this.radio.swap)){
								this.observe(this.target.listen.zoom, this.radio.zoom, 0);
							}else{
								if(!delete this.target.widget.slide){
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
								}
							}
					}
			}).call(this);
	}

});