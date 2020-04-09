const rp2 = require('../rp2/api.js');
const UserCommands = require('./users');
const shortcuts = {
	1: { cmd: 'createMockUsers', repo: 'users' },
	2: { cmd: 'addAllMockToFriends', repo: 'users' },
	3: { cmd: 'deleteAll', repo: 'users' },
	4: { cmd: 'deleteUser', repo: 'users' }
};
const shortcut = 3;
// { getFriends, acceptFriend, addFriend }
// const hardCodedArgs = { repo: false, cmd: false };
const hardCodedShortcut = shortcuts[shortcut];
const hardCodedArgs = {
	repo: hardCodedShortcut.repo,
	cmd: hardCodedShortcut.cmd
};
let name;
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
			name = hardCodedArgs.cmd || commandArg; // just for logging
			return repo[hardCodedArgs.cmd || commandArg];
		};
		const cmd = parseArgs();
		cmd('robertmozeika', 'robertmozeika@gmail.com')
			// cmd()
			.then(users => {
				console.log(users);
				console.log('finished successfully: ', name);
			})
			.catch(e => {
				console.log(e);
				console.log('error: ', name);
			});
	})
	.catch(e => {
		console.log(e);
	});
