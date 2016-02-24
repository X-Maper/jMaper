jMaper.Genre = jMaper.Decor.Extend({

	namespace : 'jMaper.Decor.Genre',

	structure : function(jsn){
		if((this.radio = {}) && jsn){
			if(this.$.Match.isString(jsn.anchor))
				this.anchor = jMaper.library.rule.put.test(jsn.anchor) ? jsn.anchor.toLowerCase() : null;
		}
	},

	anchor : null,

	module : {
		item : '<a id="$4" name="#$3" class="j-genre-ctx-$1-" href="javascript:void(0);"><div class="j-genre-ctx-$2-"><div></div></div>$5</a>',
		html : '<div class="j-genre-" style="$1:18px;"><div class="j-genre-map-"><div></div></div><div class="j-genre-lap-"><div></div></div><div class="j-genre-$1-" style="display:none;"><div class="j-genre-1px-"><div></div></div><div class="j-genre-ctx-"></div></div></div>'
	},

	_fresh : null,

	_build : function(src){
		if((this.facade || 0)._ctx)
			(function(){
				if(this._fresh){
					this.$.Thread.delay.call(this.target.client, arguments.callee, 0, this);
				}else{
					var htm = this.$.Dom.removeChild(this.facade._ctx) || [], mis = [];
					try{
						switch(src){
							case this.facade._map:
							{
								this.$.Array.each(this.target.symbol.tile, function(tile){
									this.$.Array.push(htm, this.$.Util.format(this.module.item, this.$.Match.equal(this.target.netmap, tile) ? [
										'sel', 'm2s', 'MAP', tile.index, tile.title
									] : [
										'mis', 'map', 'MAP', tile.index, tile.title
									]));
								}, this);
								break;
							}
							case this.facade._lap:
							{
								this.$.Array.each(this.target.symbol.pile, function(pile){
									if(pile.fusion(this.target) > -1 && pile.extent.contain(this.target, this.target.center)){
										this.$.Array.push(htm, this.$.Util.format(this.module.item, pile.allow ? [
											'sel', 'l2s', 'LAP', pile.index, pile.title
										] : [
											'mis', 'lap', 'LAP', pile.index, pile.title
										]));
									}else{
										this.$.Array.push(mis, this.$.Util.format(this.module.item, [
											'mis', 'l2x', 'LAP', pile.index, pile.title
										]));
									}
								}, this);
								break;
							}
						}
					}catch(e){
						htm = mis = null;
					}finally{
						if(this._fresh = (htm = this.$.Array.merge(htm, mis)).length){
							this.$.Fx.add.call(this.target.client, this.facade._ctx, htm, function(){
								this._fresh = this.$.Util.setElemSize(this.facade._ctx, {
									h : this._fresh * 34 - 1
								});
							}, this);
						}else{
							this.facade._box.style.display = 'none';
							{
								this.facade._map.className = 'j-genre-map-';
								this.facade._lap.className = 'j-genre-lap-';
							}
						}
					}
					// 释放内存
					src = htm = mis = null;
				}
			}).call(this);
	},

	render : function(drv, job){
		if(((this.target = drv) || 0).enable)
			(function(genre){
				if(!(drv.canvas && drv.widget)){
					this.$.Thread.delay.call(drv.client, arguments.callee, 0, this);
				}else{
					if(genre = drv.widget.genre){
						if(!this.$.Match.equal(genre, this))
							arguments.callee.call(this, genre.remove());
					}else{
						// 监听广播
						this.observe(drv.listen.swap, this.radio.swap = this.$.Util.bind(this, this.redraw), 0);
						// 加载控件
						try{
							genre = (drv.widget.genre = this).redraw();
						}catch(e){
							genre = null;
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
				case this.target.listen.swap:
				{
					if(!this.facade._box.style.display)
						switch(this.$.Util.getElemSeat(this.facade._box).t){
							case this.$.Util.getElemSeat(this.facade._lap).t:
							{
								if(msg.info.cover)
									this._build(this.facade._lap);
								break;
							}
							case this.$.Util.getElemSeat(this.facade._map).t:
							{
								if(!msg.info.cover)
									this._build(this.facade._map);
								break;
							}
						}
					break;
				}
				default:
				{
					this.$.Fx.add.call(this.target.client, this.target.canvas, [this.$.Util.format(this.module.html, [this.anchor || (this.anchor = 'right')])], function(cnv){
						if((this.facade = this.$.Array.pop(this.$.Fn.css.call(cnv, '.j-genre-'))) && (
							this.facade._ctx = this.$.Array.pop(
								cnv = this.$.Fn.css.call(this.facade, '.j-genre-map-,.j-genre-lap-,.j-genre-ctx-')
							)
						) && (
							this.facade._lap = this.$.Array.pop(cnv)
						) && (
							this.facade._map = this.$.Array.pop(cnv)
						) && (
							this.facade._box = this.$.Dom.getSire(this.facade._ctx)
						)){
							// Hover for map.
							this.$.Fx.hover.call(this.target.facade, this.facade._map, {
								outer : function(_, map){
									if((this.target || 0).enable && this.enable){
										this.facade._box.style.display = 'none';
										{
											map.className = 'j-genre-map-';
										}
									}
								},
								inner : function(_, map){
									if((this.target || 0).enable && this.enable && (
										this.facade._lap.className = 'j-genre-lap-'
									)){
										this.facade._box.style.display = '';
										{
											map.className = 'j-genre-' + this.anchor.substr(0, 1) + '4m-';
										}
										this.$.Util.setElemSeat(this._build(map) || this.facade._box, {
											t : this.$.Util.getElemSeat(map).t
										});
									}
								}
							}).mount(this);
							// Hover for lap.
							this.$.Fx.hover.call(this.target.facade, this.facade._lap, {
								outer : function(_, lap){
									if((this.target || 0).enable && this.enable){
										this.facade._box.style.display = 'none';
										{
											lap.className = 'j-genre-lap-';
										}
									}
								},
								inner : function(_, lap){
									if((this.target || 0).enable && this.enable && (
										this.facade._map.className = 'j-genre-map-'
									)){
										this.facade._box.style.display = '';
										{
											lap.className = 'j-genre-' + this.anchor.substr(0, 1) + '4l-';
										}
										this.$.Util.setElemSeat(this._build(lap) || this.facade._box, {
											t : this.$.Util.getElemSeat(lap).t
										});
									}
								}
							}).mount(this);
							// Hover for box.
							this.$.Fx.hover.call(this.target.facade, this.facade._box, {
								outer : function(_, box){
									box.style.display = 'none';
									{
										this.facade._map.className = 'j-genre-map-';
										this.facade._lap.className = 'j-genre-lap-';
									}
								},
								inner : function(_, box){
									box.style.display = '';
									{
										switch(this.$.Util.getElemSeat(box).t){
											case this.$.Util.getElemSeat(this.facade._map).t:
											{
												this.facade._lap.className = 'j-genre-lap-';
												this.facade._map.className = 'j-genre-' + this.anchor.substr(0, 1) + '4m-';
												break;
											}
											case this.$.Util.getElemSeat(this.facade._lap).t:
											{
												this.facade._map.className = 'j-genre-map-';
												this.facade._lap.className = 'j-genre-' + this.anchor.substr(0, 1) + '4l-';
												break;
											}
										}
									}
								}
							}).mount(this);
							// Click for box.
							this.$.Util.addEvent({
								evt : jMaper.library.ctrl.click,
								obj : this.facade._box,
								arg : this,
								fun : function(e){
									if((e = (this.$.Util.getEvent(e) || 0).src) !== this.facade._box)
										while(e){
											switch(e.name){
												case '#MAP':
												{
													if(e = this.target.symbol.tile[e.id])
														e = e.access(true);
													return;
												}
												case '#LAP':
												{
													if(e = this.target.symbol.pile[e.id])
														e = e.access(!e.allow);
													return;
												}
												default :
												{
													e = this.$.Dom.getSire(e);
												}
											}
										}
								}
							});
						}
					}, this);
				}
			}
		// 销毁信息
		msg = null;
	},

	remove : function(){
		if((this.target || 0).enable && this.enable)
			(function(){
				if(this.target)
					if(!this.facade || this._fresh){
						this.$.Thread.delay.call(this.target.client, arguments.callee, 0, this);
					}else{
						if(this.obscure(this.target.listen.swap, this.radio.swap))
							if(!delete this.target.widget.genre){
								this.observe(this.target.listen.swap, this.radio.swap, 0);
							}else{
								this.target = (
									this.facade = this.$.Dom.removeChild(this.facade, true)
								);
								// 内存释放
								{
									delete this.radio.swap;
								}
								delete this._fresh;
							}
					}
			}).call(this);
	}

});