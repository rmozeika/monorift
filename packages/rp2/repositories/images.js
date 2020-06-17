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
		this.testNegSpaceGenerator();
	}
	static getNamespaces() {
		return {
			// collection: 'images',
			// table: 'images'
		};
	}
	async testNegSpaceGenerator() {
		const originalPath = path.resolve(__dirname, 'tmp', 'gCrc.png');
		const image = await Jimp.read(originalPath);
		const resultImage = await this.cropAdjacentCircleNegativeSpace(image);
	}
	async createGravatar(dir, filename, email, { size = '40' }) {
		const gravatarUrl = gravatar.url(
			email,
			{ s: size, r: 'x', d: 'retro' },
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
	async createGroupIcon(name, sizeMultiplier = 1) {
		const mockEmail = `${name}@monorift.com`;
		const dir = path.resolve(__dirname, '../public', 'groups');
		const uneditedDir = path.resolve(dir, 'unedited');
		const resultDir = path.resolve(dir, 'edited');
		// const src = await this.createGravatar(uneditedDir, name, mockEmail);
		// change size back possibly
		const gravatarSize = 40 * sizeMultiplier;
		const src = await this.createGravatar(uneditedDir, name, mockEmail, {
			size: gravatarSize
		});

		const gravatar = await Jimp.read(src.path);
		const transformedImage = await this.circleMask(gravatar, sizeMultiplier);
		const finishedPath = path.resolve(dir, `${name}.png`);
		transformedImage.write(finishedPath);
		return {
			uri: `/groups/${name}.png`,
			path: finishedPath
		};
		// const transparentImg = await this.addTransparency(src.path, resultDir);
	}
	async circleMask(image, sizeMultiplier = 1) {
		const dir = path.resolve(__dirname, 'tmp');
		const maskPath = path.resolve(dir, 'circlemask-prod.png');
		const mask = await Jimp.read(maskPath);
		image.mask(mask, 10, 10);
		// image.write(resPath);
		const circleResPath = path.resolve(dir, 'gCrc.png');
		const circleDimensions = {
			radius: 15 * sizeMultiplier,
			x: 20 * sizeMultiplier,
			w: 20 * sizeMultiplier
		};
		// image.circle({ radius: 15 * sizeMultiplier, x: 20, w: 20 });
		image.circle(circleDimensions);
		return image;
		// image.write(circleResPath);
	}
	async createCircleMask(sizeMultiplier) {
		// change to below programatic function (transparency test)
		const maskPath = path.resolve(dir, 'tsquare.png');

		// create a mask with transparent background
		// overlay onto another image with white background;
		const mask = await Jimp.read(maskPath);
		const circleRadius = sizeMultiplier * 10;
		const circleDimensions = {
			radius: circleRadius,
			x: circleRadius,
			y: circleRadius
		};
		mask.circle(circleDimensions);
		// mask.circle({ radius: 10, x: 10, y: 10 });
		// const circlePath = path.resolve(dir, 'circlemask.png');
		// mask.write(circlePath);
		const whitebackgroundMask = await this.createImage(
			circleRadius * 2,
			circleRadius * 2,
			'#fff'
		);
		whitebackgroundMask.composite(mask, 0, 0);
		newCircle.write(path.resolve(dir, 'circlemask-prod.png'));
		return newCircle;
	}
	async cropAdjacentCircleNegativeSpace(image) {
		const replaceColor = { r: 0, g: 0, b: 0, a: 0 };

		const limits = {
			x: {
				min: 15,
				max: 25
			},
			y: {
				min: 5,
				max: 15
			}
		};
		const calcHalfwayPoint = ({ min, max }) => {
			const diff = max - min;
			const half = diff / 2;
			const point = min + half;
			return point;
		};
		const halves = {
			x: calcHalfwayPoint(limits.x),
			y: calcHalfwayPoint(limits.y)
		};

		image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
			if (x < limits.x.min || x > limits.x.max) return;
			if (y < limits.y.min || y > limits.y.max) return;
			const xHalfwayDistance = Math.abs(x - halves.x);
			const yHalfwayDistance = Math.abs(y - halves.y);
			if (yHalfwayDistance < xHalfwayDistance) {
				return;
			}
			const thisColor = {
				r: image.bitmap.data[idx + 0],
				g: image.bitmap.data[idx + 1],
				b: image.bitmap.data[idx + 2],
				a: image.bitmap.data[idx + 3]
			};

			// if(colorDistance(targetColor, thisColor) <= threshold) {
			image.bitmap.data[idx + 0] = replaceColor.r;
			image.bitmap.data[idx + 1] = replaceColor.g;
			image.bitmap.data[idx + 2] = replaceColor.b;
			image.bitmap.data[idx + 3] = replaceColor.a;
			// }
		});
		image.write(path.resolve(__dirname, 'tmp', 'negspace.png'));
		console.log('done');
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
