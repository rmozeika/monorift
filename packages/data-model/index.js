const path = require('path');
const fs = require('fs');
const fileMap = {
	users: 'schema.graphql',
	groups: 'groups.schema.graphql',
	messages: 'messages.schema.graphql'
};
module.exports = type => {
	return new Promise((resolve, reject) => {
		const gqlPath = path.resolve(__dirname, fileMap[type]);
		fs.readFile(gqlPath, 'utf8', (err, data) => {
			if (err) return reject(err);
			resolve(data);
			// this.typeDefs = gql`${data}`;
		});
	});
};
