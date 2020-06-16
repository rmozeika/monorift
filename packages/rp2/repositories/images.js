const Repository = require('./repository.js');
const Jimp = require('jimp');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs');
const http = require('http');
class ImagesRepository extends Repository {
	constructor(api) {
		super(api);
		// this.createGroupIcon('firstgroup'); //nsparenyTest();
	}
	static getNamespaces() {
		return {
			// collection: 'images',
			// table: 'images'
		};
	}
	async createGravatar(dir, filename, email) {
		const gravatarUrl = gravatar.url(
			email,
			{ s: '40', r: 'x', d: 'retro' },
			false
		);
		// const gravatarPath = path.resolve(
		// 	__dirname,
		// 	'../../public',
		// 	'gravatar',
		// 	`${filename}.png`
		// );
		const gravatarPath = path.resolve(dir, `${filename}.png`);

		const file = fs.createWriteStream(gravatarPath);
		const response = await promiseGet(gravatarUrl);
		response.pipe(file);
		return {
			url: gravatarUrl,
			path: gravatarPath,
			uri: `/gravatar/${filename}.png`
		};
	}
	async createUserGravatar(email, oauth_id, username) {
		const dir = path.resolve(__dirname, '../public', 'gravatar');
		const gravatarSrc = await this.createGravatar(dir, oauth_id, username);
		return gravatarSrc;
	}
	async fetchAndSave(url, path) {
		const response = await this.fetch(url);
	}
	async fetch(url) {
		const response = await promiseGet(gravatarUrl);
		return response;
	}
	async saveFile(path, stream) {
		const file = fs.createWriteStream(gravatarPath);
	}
	async createGroupIcon(name) {
		const mockEmail = `${name}@monorift.com`;
		const dir = path.resolve(__dirname, '../public', 'groups');
		const uneditedDir = path.resolve(dir, 'unedited');
		const resultDir = path.resolve(dir, 'edited');
		const src = await this.createGravatar(uneditedDir, name, mockEmail);
		const gravatar = await Jimp.read(src.path);
		const transformedImage = await this.circleMask(gravatar);
		const finishedPath = path.resolve(dir, `${name}.png`);
		transformedImage.write(finishedPath);
		return {
			uri: `/groups/${name}.png`,
			path: finishedPath
		};
		// const transparentImg = await this.addTransparency(src.path, resultDir);
	}
	async circleMask(image) {
		const dir = path.resolve(__dirname, 'tmp');
		const maskPath = path.resolve(dir, 'circlemask-prod.png');
		const mask = await Jimp.read(maskPath);
		image.mask(mask, 10, 10);
		// image.write(resPath);
		const circleResPath = path.resolve(dir, 'gCrc.png');
		image.circle({ radius: 15, x: 20, w: 20 });
		return image;
		// image.write(circleResPath);
	}
	async createCircleMask() {
		// change to below programatic function (transparency test)
		const maskPath = path.resolve(dir, 'tsquare.png');

		const mask = await Jimp.read(maskPath);
		mask.circle({ radius: 10, x: 10, y: 10 });
		const circlePath = path.resolve(dir, 'circlemask.png');
		mask.write(circlePath);
		const newCircle = await this.createImage(20, 20, '#fff');
		newCircle.composite(circleMask, 0, 0);
		newCircle.write(path.resolve(dir, 'circlemask-prod.png'));
		return newCircle;
	}
	async tra() {
		try {
			const dir = path.resolve(__dirname, 'tmp');
			const maskPath = path.resolve(dir, 'tsquare.png');
			const gtarPath = path.resolve(dir, 'base.png');
			const resPath = path.resolve(dir, 'res15.png');

			const mask = await Jimp.read(maskPath);

			const gtar = await Jimp.read(gtarPath);
			// gtar.circle({ radius: 5, x: 10, y: 10 });
			// gtar.write(path.resolve(dir, 'circle1.png'));
			mask.circle({ radius: 10, x: 10, y: 10 });
			const circlePath = path.resolve(dir, 'circlemask.png');
			mask.write(circlePath);
			const circleMask = await Jimp.read(circlePath);
			const newCircle = await this.createImage(20, 20, '#fff');
			newCircle.composite(circleMask, 0, 0);
			newCircle.write(path.resolve(dir, 'circlemask-prod.png'));
			gtar.mask(newCircle, 10, 10);
			gtar.write(resPath);
			const circleResPath = path.resolve(dir, 'gCrc.png');
			gtar.circle({ radius: 15, x: 20, w: 20 });
			gtar.write(circleResPath);
		} catch (e) {
			console.log(e);
		}
	}
	async addTransparency(originalPath, resultDir) {
		const pngImg = await Jimp.read(originalPath);
	}
	async transparenyTest() {
		const dir = path.resolve(__dirname, 'tmp');
		const newFilePath = path.resolve(dir, 'tsquare.png');
		const gtarPath = path.resolve(dir, 'base.png');
		const resPath = path.resolve(dir, 'res.png');
		new Jimp(20, 20, '#000000ff', async (err, image) => {
			image.write(newFilePath);
			const gtar = await Jimp.read(gtarPath);
			gtar.mask(image, 10, 10);
			gtar.write(resPath);

			// image.blit
		});
		// #00000000
	}
	createImage(height, width, color) {
		return new Promise((resolve, reject) => {
			new Jimp(height, width, color, (err, image) => {
				if (err) {
					return reject(err);
				}
				resolve(image);
			});
		});
	}

	async tra1() {
		const dir = path.resolve(__dirname, 'tmp');
		const maskPath = path.resolve(dir, 'circle2.png');
		const gtarPath = path.resolve(dir, 'base.png');
		const resPath = path.resolve(dir, 'res2.png');
		const mask = await Jimp.read(maskPath);

		const gtar = await Jimp.read(gtarPath);
		gtar.mask(mask, 10, 10);
		gtar.write(resPath);
	}
	async blur() {
		const dir = path.resolve(__dirname, 'tmp');
		const newFilePath = path.resolve(dir, 'tsquare.png');
		const gtarPath = path.resolve(dir, 'base.png');
		const resPath = path.resolve(dir, 'res.png');
	}
}
function promiseGet(url) {
	return new Promise((resolve, reject) => {
		http.get(url, response => {
			resolve(response);
		});
	});
}
module.exports = ImagesRepository;
