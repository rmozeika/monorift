const Repository = require('../repository.js');
const Jimp = require('jimp');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs');
const http = require('http');

const Computations = require('./computations');
class ImagesRepository extends Repository {
	constructor(api) {
		super(api);
		// this.createGroupIcon('croptest', { altPath: path.resolve(__dirname, 'tmp', 'croptest.png') }); //nsparenyTest();
	}
	static getNamespaces() {
		return {
			// collection: 'images',
			// table: 'images'
		};
	}
	dir = path.resolve(__dirname, 'tmp');

	async createGravatar(dir, filename, email, { size = '40' }) {
		const gravatarUrl = gravatar.url(
			email,
			{ s: size, r: 'x', d: 'retro' },
			false
		);
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
		const dir = path.resolve(__dirname, '../../public', 'gravatar');
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
	async createGroupIcon(
		name,
		{ sizeMultiplier = 4, createNewMask = false, altPath } = {}
	) {
		const { image, ...newGroupIcon } = await this.createGroupIconBase(name, {
			sizeMultiplier,
			createNewMask
		}).catch(e => {
			console.trace(e);
		});
		console.log(newGroupIcon);

		const negSpaceRes = await this.cropAdjacentCircleNegativeSpace(image, {
			sizeMultiplier
		}).catch(e => {
			console.trace(e);
		});

		const dir = path.resolve(__dirname, '../../public', 'groups');
		const finishedPath = altPath || path.resolve(dir, `${name}.png`);

		this.cropGroupImageBorders(negSpaceRes, { sizeMultiplier });
		try {
			negSpaceRes.write(finishedPath);

			return {
				uri: `/groups/${name}.png`,
				path: finishedPath
			};
		} catch (e) {
			console.trace(e);
		}
	}
	async createGroupIconBase(
		name,
		{ sizeMultiplier = 1, createNewMask = false }
	) {
		const mockEmail = `${name}@monorift.com`;
		// const dir = path.resolve(__dirname, '../../public', 'groups');
		const { dir } = this;
		const uneditedDir = path.resolve(dir, 'unedited');
		const resultDir = path.resolve(dir, 'edited');
		// const src = await this.createGravatar(uneditedDir, name, mockEmail);
		// change size back possibly
		const gravatarSize = 40 * sizeMultiplier;
		const src = await this.createGravatar(uneditedDir, name, mockEmail, {
			size: gravatarSize
		});

		const gravatar = await Jimp.read(src.path);
		const transformedImage = await this.circleMask(gravatar, {
			sizeMultiplier,
			createNewMask
		});
		const finishedPath = path.resolve(resultDir, `${name}.png`);
		transformedImage.write(finishedPath);
		return {
			uri: `/groups/${name}.png`,
			path: finishedPath,
			image: transformedImage
		};
	}
	async circleMask(image, { sizeMultiplier = 1, createNewMask = false }) {
		const dir = path.resolve(__dirname, 'tmp');

		const maskPath = path.resolve(dir, 'circlemask-prod.png');
		let mask;
		if (createNewMask) {
			mask = await this.createCircleMask({ sizeMultiplier, createNewMask });
		} else {
			mask = await Jimp.read(maskPath);
		}
		const scale = this.createScale(sizeMultiplier);

		const maskXY = scale(10);
		image.mask(mask, maskXY, maskXY);

		const circleDimensions = {
			radius: scale(15),
			x: scale(20),
			w: scale(20)
		};

		image.circle(circleDimensions);
		return image;
	}
	async createCircleMask({ sizeMultiplier, createNewMask }) {
		// change to below programatic function (transparency test)
		const { dir } = this;
		const maskPath = path.resolve(dir, 'tsquare.png');

		// create a mask with transparent background
		// overlay onto another image with white background;
		let mask;
		if (createNewMask) {
			mask = await this.createSquareMask(sizeMultiplier);
		} else {
			mask = await Jimp.read(maskPath);
		}

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
		whitebackgroundMask.write(path.resolve(dir, 'circlemask-prod.png'));
		return whitebackgroundMask;
	}
	createScale(sizeMultiplier) {
		return function(input) {
			return input * sizeMultiplier;
		};
	}
	createComp(scale) {
		return new Computations(scale);
	}
	async cropAdjacentCircleNegativeSpace(image, { sizeMultiplier }) {
		const replaceColor = { r: 0, g: 0, b: 0, a: 0 };
		// const scale = (val) => (val * sizeMultiplier);
		const scale = this.createScale(sizeMultiplier);
		const comp = this.createComp(sizeMultiplier);
		const baseLimits = {
			x: {
				min: 15,
				max: 25
			},
			y: {
				min: 5,
				max: 10
			}
		};
		const { limits, halves } = comp.negSpaceLimitsAndHalves(baseLimits);

		const diagnolLinesCheck = comp.generateDiagnolLinesCheck(limits, halves);
		const inverseCircleCheck = comp.generateInverseCircle(limits, halves);

		image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
			// const proceed = diagnolLinesCheck(x, y, idx);
			const proceed = inverseCircleCheck(x, y, idx);
			if (!proceed) return;

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
		return image;
		console.log('done');
	}
	async cropGroupImageBorders(image, { sizeMultiplier }) {
		const scale = this.createScale(sizeMultiplier);
		const xyStartpoints = scale(5);
		const widthHeight = scale(30);
		image.crop(xyStartpoints, xyStartpoints, widthHeight, widthHeight);
		return image;
	}
	// REMOVE / NOW IN COMPUTATIONS
	generateDiagnolLinesCheck(limits, halves) {
		return function(x, y, idx) {
			if (x < limits.x.min || x > limits.x.max) return false;
			if (y < limits.y.min || y > limits.y.max) return false;
			const xHalfwayDistance = Math.abs(x - halves.x);
			const yHalfwayDistance = Math.abs(y - halves.y);
			if (yHalfwayDistance < xHalfwayDistance) {
				return false;
			}
			return true;
		};
	}
	async createSquareMask(sizeMultiplier) {
		const { dir } = this;
		const newFilePath = path.resolve(dir, 'tsquare.png');
		const dimension = sizeMultiplier * 20;
		const image = await this.createImage(dimension, dimension, '#000000ff');
		image.write(newFilePath);
		return image;
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
}
function promiseGet(url) {
	return new Promise((resolve, reject) => {
		http.get(url, response => {
			resolve(response);
		});
	});
}
module.exports = ImagesRepository;
