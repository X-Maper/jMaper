jMaper.Geog = jMaper.Layer.Extend({

	namespace : 'jMaper.Layer.Geog',

	allow : true,

	radix : 0,

	start : 0,

	close : 0,

	level : 0,

	speed : 50,

	craft : 72,

	units : 'DD',

	cover : false,

	origin : null,

	extent : null,

	factor : null,

	projcs : jMaper.convert['EPSG:4326'],

	resize : function(){
		var csize = this.$.Util.getElemSize((this.target || 0).canvas);
		try{
			this.target.screen.x = Math.round((this.target.screen.w = csize.w) * 0.5);
			this.target.screen.y = Math.round((this.target.screen.h = csize.h) * 0.5);
		}catch(e){
			csize = null;
		}finally{
			if(csize)
				try{
					this.target.sketch.refixStage(
						this.moveto(this.target.center)
					);
				}catch(e){
					csize = null;
				}finally{
					if(csize && (csize = (this.target.widget || 0).eagle))
						csize = csize._build(this);
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
						if(this.facade === this.target.canvas.maper.tile){
							if(delete this.target.symbol.tile[this.index])
								this.target = (
									this.facade = this.$.Dom.removeChild(this.facade)
								);
						}else{
							if(this.obscure(this.target.listen.drag, this.radio.drag)){
								if(!this.obscure(this.target.listen.zoom, this.radio.zoom)){
									this.observe(this.target.listen.drag, this.radio.drag, 1);
								}else{
									if(!this.obscure(this.target.listen.swap, this.radio.swap)){
										this.observe(this.target.listen.drag, this.radio.drag, 1);
										this.observe(this.target.listen.zoom, this.radio.zoom, 1);
									}else{
										if(!delete this.target.symbol.pile[this.index]){
											this.observe(this.target.listen.drag, this.radio.drag, 1);
											this.observe(this.target.listen.zoom, this.radio.zoom, 1);
											this.observe(this.target.listen.swap, this.radio.swap, 1);
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
										}
									}
								}
							}
						}
					}
			}).call(this);
	}

});