const { AsyncResource, executionAsyncId } = require('async_hooks');

class MessageListener extends AsyncResource {
	constructor({ id, lastId }, redis) {
		super('MESSAGE_LISTENER', { requireManualDestroy: true });
		this.id = id;
		this.lastId = lastId;
		this.redis = redis;
		// this.mapMessage = mapMessage; // repo.mapXReadMessage
		console.log('finished?');
		//this.init(lastId);
	}
	//done()
	init(task, emitEvent) {
		// console.log(asyncId, type, triggerAsyncId, resource);
		const { lastId } = this;
		//this.db.get(query, (err, data) => {
		this.runInAsyncScope(this.listen, this, lastId, emitEvent); //, err, data);
		//});
	}
	async listen(currentLastId, emitEvent) {
		const existing = await this.redis.xread([
			'BLOCK',
			0,
			'STREAMS',
			`messages:${this.id}`,
			currentLastId
		]);
		const messages = existing.map(this.mapMessage);
		const { id: lastId } = messages[messages.length - 1];
		emitEvent({ messages, lastId });
		// const messages = existing.map(this.mapMessage);
		// console.log(messages, newLastId);
		// this.lastId = newLastId;
		this.runInAsyncScope(this.listen, this, lastId, emitEvent);
	}
	// mapXReadMessage([ stream, [[ id, [type, payload ]]]]) {
	mapMessage([stream, [[id, [type, payload]]]]) {
		const [timeParsed] = id.match(/^[^-]*/);

		return {
			id,
			payload,
			time: timeParsed
		};
	}
	close() {
		//this.db = null;
		this.emitDestroy();
	}
}

module.exports = MessageListener;
