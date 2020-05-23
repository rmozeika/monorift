const path = require('path');
module.exports = {
	resolver: {
		blacklistRE: /(dist.web\/.*)|packages\/rp2\/\/*./ //, /packages\/rp2\/\/*./
	},
	watchFolders: [
		path.resolve(__dirname, './node_modules'),
		path.resolve(__dirname, './packages/rift')
	]
	// projectRoot: path.resolve(__dirname, 'packages', 'rift')
};

// old
// module.exports = {
//     resolver: {
//         blacklistRE: /(dist.web\/.*)|packages\/rp2\/\/*./, //, /packages\/rp2\/\/*./
//     }
// }
