const rp2 = require('../rp2/api.js');
const UserCommands = require('./users');
// { getFriends, acceptFriend, addFriend }
const hardCodedArgs = { repo: false, cmd: false };
// const hardCodedArgs = { repo: 'users', cmd: 'addAllMockToFriends' };

rp2
	.init({})
	.then(() => {
		console.log(rp2);
		const userCommands = new UserCommands(rp2);
		const parseArgs = () => {
			let [repoArg, commandArg] = process.argv.slice(2);
			const repos = {
				users: userCommands
			};
			const repo = repos[hardCodedArgs.repo || repoArg];
			return repo[hardCodedArgs.cmd || commandArg];
		};
		const cmd = parseArgs();

		cmd()
			.then(users => {
				console.log(users);
			})
			.catch(e => {
				console.log(e);
			});
	})
	.catch(e => {
		console.log(e);
	});
