const Repository = require('../repository.js');
const WorkerPool = require('./WorkerPool');
const { on } = require('events');

class MessagesRepository extends Repository {
	constructor(api) {
		super(api);
		//this.add('mongo15');
		// this.members = this.api.repositories['members'];
		// this.images = this.api.repositories['images'];
		// this.createAllMessageIcons(false);
		// this.listenForMore(
		//     11392,
		//     "1593275596354-0"
		//   );
		this.createWorkerPool();
	}
	static getNamespaces() {
		return {
			// collection: 'messages',
			// table: 'messages'
		};
	}
	createWorkerPool() {
		this.pool = new WorkerPool(1, this.api);
	}
	// async testGet() {
	// 	const result = await this.query({ name: 'generalchao'}, `src->'gravatar'->>'uri'`);
	// 	console.log(result);
	// }
	async get(conversationId) {
		const messages = await this.query({ conversationId });
		return messages;
	}
	mapMessage([id, [type, payload]]) {
		const [timeParsed] = id.match(/^[^-]*/);
		return {
			id,
			payload,
			time: timeParsed
			// timeReadable:
		};
	}
	mapXReadMessage([stream, [[id, [type, payload]]]]) {
		const [timeParsed] = id.match(/^[^-]*/);

		return {
			id,
			payload,
			time: timeParsed
		};
	}
	async existing(id) {
		const { redis } = this.api;
		const existing = await redis.xrevrange([
			`messages:${id}`,
			'+',
			'-',
			'COUNT',
			10
		]);
		const messages = existing.map(this.mapMessage);
		// change below to messages
		const { id: lastId } = messages[0];
		return { messages: messages.reverse(), lastId };
	}
	async newMessagesMetadata(id, lastId) {}
	async listenForMore(id, from, lastId) {
		const { pool } = this;
		const { redis } = this.api;
		// const tid = async_hooks.triggerAsyncId();

		try {
			//pool.runTask({ id, lastId }, redis);
			//const emitter = on(pool, 'message');
			const worker = pool.taskWorker({ id, lastId }, redis);
			const emitter = on(worker, 'message');
			return emitter;
			// const messageListener = new MessageListener();
			// messageListener.init();
			// const asyncId = messageListener.asyncId()
			// Promise.resolve(asyncId).then(res => {
			//     console.log(res);
			// })
			// return () => {
			//     messageListener.close();
			// };
		} catch (e) {
			console.trace(e);
		}

		// const listen = async (lastIdUpdate) => {
		//     const existing = await redis.xread([ 'COUNT', 1, 'STREAMS', `messages:${id}`, lastIdUpdate]);
		//     const [newLastId]= existing[existing.length -1];
		//     const messages = existing.map(this.mapMessage);
		//     return listen(newLastId);
		// };

		// const existing = await redis.xread([ 'COUNT', 1, 'STREAMS', `messages:${id}`, lastId]);
		//const messages = existing.map(this.mapMessage);
		// const [lastId]= existing[existing.length -1];
	}
	async feed(id, id2) {
		console.log(id);
		const { redis } = this;

		var stream = redis.scanStream({
			// only returns keys following the pattern of `user:*`
			match: `message:${id}`,
			// returns approximately 100 elements per call
			count: 100
		});
	}
	async create(name, creator) {
		let status = { success: true, error: null, message: null };
		try {
			const { oauth_id, id } = creator;
			const message = await this.add(name, creator);
			status.message = message;
			const { gid } = message;
			const memberInsert = await this.createAdminMember({
				gid,
				uid: id,
				oauth_id
			});
			return status;
		} catch (e) {
			console.trace(e.stack);
			status.success = false;
			status.error = e.message;
			return status;
		}
	}
	async add(name, creator) {
		const gravatar = await this.images.createMessageIcon(name);
		const src = { gravatar };

		const [message] = await this.insert(
			{ name: name, creator: creator.id, src },
			['gid', 'name', 'creator', 'src']
		);
		return message;
	}
	async createAdminMember({ gid, uid, oauth_id }) {
		const memberInsert = await this.members.insert({ gid, uid, oauth_id });
		return memberInsert;
	}
	async createAllMessageIcons(onlyNull = true) {
		const messages = await this.query({});
		console.log(messages);
		let filtered;
		if (onlyNull) {
			filtered = messages.filter(message => !message?.src?.gravatar?.uri);
		} else {
			filtered = messages;
		}
		console.log(filtered);
		const result = await Promise.all(
			filtered.map(async ({ name, gid }) => {
				const gravatar = await this.images.createMessageIcon(name);
				const src = { gravatar };
				const updateOp = await this.update({ gid }, { src });
				return updateOp;
			})
		).catch(e => {
			console.log(e);
		});
		console.log(result);
	}
}

function gqlError(e) {
	let status = { success: true, error: null, message: null };
	if (e) {
		status.success = false;
		status.error = e.message;
	}
	return status;
}

module.exports = MessagesRepository;
