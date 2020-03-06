class Command {
	constructor(rp2, repositoryName) {
		this.rp2 = rp2;
		this.repository = this.rp2.repositories[repositoryName];
	}
}

module.exports = Command;
