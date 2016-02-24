jMaper.About = jMaper.Decor.Extend({

	namespace : 'jMaper.Decor.About',

	structure : function(jsn){
		if((this.radio = {}) && jsn){
			if(this.$.Match.isString(jsn.author))
				this.author = jsn.author;
			if(this.$.Match.isString(jsn.anchor))
				this.anchor = (jMaper.library.rule.put.test(jsn.anchor) ? jsn.anchor.toLowerCase() : null);
		}
	},

	author : null,

	anchor : null,

	module : '<div class="j-about-" style="$1:18px;"></div>',

	_fresh : null,

	render : function(drv, job){
		if(((this.target = drv) || 0).enable)
			(function(about){
				if(!(drv.canvas && drv.widget)){
					this.$.Thread.delay.call(drv.client, arguments.callee, 0, this);
				}else{
					if(about = drv.widget.about){
						if(!this.$.Match.equal(about, this))
							arguments.callee.call(this, about.remove());
					}else{
						// 加载控件
						try{
							about = (drv.widget.about = this).redraw();
						}catch(e){
							about = null;
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
				if(this.facade){
					this.facade.innerHTML = this.author;
				}else{
					if(this._fresh){
						this.$.Thread.delay.call(this.target.client, arguments.callee, 0, this);
					}else{
						this._fresh = this.$.Fx.add.call(this.target.client, this.target.canvas, [this.$.Util.format(this.module, [this.anchor || (this.anchor = 'left')])], function(cnv){
							if(this.facade = this.$.Array.pop(this.$.Fn.css.call(cnv, '.j-about-')))
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
						if(delete this.target.widget.about){
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