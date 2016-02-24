jMaper.Event = jMaper.feature.Extend({

	namespace : 'jMaper.Event',

	structure : function(jsn){
		this.namespace += '.' + jsn.name;
		{
			this.audience = jsn.fire;
			this.observer = [];
			this.schedule = [];
		}
	},

	complete : true,

	audience : null,

	foremost : 0,

	priority : 0,

	observer : [],

	schedule : [],

	dispose : function(){
		this.complete = !(this.schedule.length = this.observer.length = this.priority = this.foremost = 0);
	},

	detach : function(fun){
		return (fun = this.$.Array.remove(this.observer, fun)) > -1 ? (
			this.foremost >= fun ? this.priority-- >= 0 && this.foremost-- >= 0 : (
				this.priority >= fun ? this.priority-- >= 0 : true
			)
		) : true;
	},

	attach : function(fun, low){
		if(this.$.Match.isFunction(fun))
			switch(low){
				case 1 :
					return this.$.Array.splice(this.observer, this.foremost++, 0 * this.priority++, fun).length === 0;
				case 0 :
					return this.$.Array.splice(this.observer, this.priority++, 0, fun).length === 0;
				default :
					return this.$.Array.push(this.observer, fun) > 0;
			}
	},

	broadcast : function(msg){
		var transmit = 0;
		try{
			msg = this.$.Array.each(this.observer, function(fun){
				transmit = this.$.Array.push(this.schedule, {run : fun, msg : msg});
			}, this);
		}catch(e){
			transmit = 0;
		}finally{
			if(transmit && this.complete)
				this.$.Thread.delay.call(this.audience.client, function(timer){
					if(!(this.complete = !this.schedule.length)){
						var task, work = this.$.Array.splice(this.schedule, 0, 100);
						try{
							while(work.length){
								(task = this.$.Array.shift(work)).run({
									chan : this, info : task.msg
								});
							}
						}catch(e){
							timer.abort();
						}finally{
							this.$.Thread.delay.call(this.audience.client, arguments.callee, work = task = null, this);
						}
					}
				}, this.complete = false, this);
		}
	}

});