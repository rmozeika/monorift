const rp2 = require('../rp2/api.js');
const UserCommands = require('./users');
const shortcuts = {
	1: { cmd: 'createMockUsers', repo: 'users' },
	2: { cmd: 'addAllMockToFriends', repo: 'users' },
	3: { cmd: 'deleteAll', repo: 'users' }
};
const shortcut = 1;
// { getFriends, acceptFriend, addFriend }
// const hardCodedArgs = { repo: false, cmd: false };
const hardCodedShortcut = shortcuts[shortcut];
const hardCodedArgs = {
	repo: hardCodedShortcut.repo,
	cmd: hardCodedShortcut.cmd
};
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
		cmd('robertmozeika', 'robertmozeika@gmail.com')
			// cmd()
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
