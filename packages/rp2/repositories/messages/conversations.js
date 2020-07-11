const Repository = require('../repository.js');

class ConversationsRepository extends Repository {
	constructor(api) {
		super(api);
		//this.add('mongo15');
		// this.members = this.api.repositories['members'];
		// this.images = this.api.repositories['images'];
		// this.createAllConversationIcons(false);
	}
	static getNamespaces() {
		return {
			// collection: 'conversations',
			table: 'conversations'
		};
	}
	// async testGet() {
	// 	const result = await this.query({ name: 'generalchao'}, `src->'gravatar'->>'uri'`);
	// 	console.log(result);
	// }
	async get({ id } = {}) {
		const conversations = await this.query({ id });
		return conversations;
	}
	async create(name, creator) {
		let status = { success: true, error: null, conversation: null };
		try {
			const { oauth_id, id } = creator;
			const conversation = await this.add(name, creator);
			status.conversation = conversation;
			const { gid } = conversation;
			const memberInsert = await this.createAdminMember({
				gid,
				uid: id,
				oauth_id
			});
			return status;
		} catch (e) {
			console.trace(e.stack);
			status.success = false;
			status.error = e.conversation;
			return status;
		}
	}
	async add(name, creator) {
		const gravatar = await this.images.createConversationIcon(name);
		const src = { gravatar };

		const [conversation] = await this.insert(
			{ name: name, creator: creator.id, src },
			['gid', 'name', 'creator', 'src']
		);
		return conversation;
	}
	async createAdminMember({ gid, uid, oauth_id }) {
		const memberInsert = await this.members.insert({ gid, uid, oauth_id });
		return memberInsert;
	}
	async createAllConversationIcons(onlyNull = true) {
		const conversations = await this.query({});
		console.log(conversations);
		let filtered;
		if (onlyNull) {
			filtered = conversations.filter(
				conversation => !conversation?.src?.gravatar?.uri
			);
		} else {
			filtered = conversations;
		}
		console.log(filtered);
		const result = await Promise.all(
			filtered.map(async ({ name, gid }) => {
				const gravatar = await this.images.createConversationIcon(name);
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
	let status = { success: true, error: null, conversation: null };
	if (e) {
		status.success = false;
		status.error = e.conversation;
	}
	return status;
}

module.exports = ConversationsRepository;
