import * as React from 'react';

class Canvas extends React.Component {
	constructor(props) {
		super(props);
		this.canvasRef = React.createRef();
	}
	visualize(analyser) {
		const canvas = this.canvasRef.current;
		const canvasCtx = canvas.getContext('2d');
		let WIDTH = canvas.width;
		let HEIGHT = canvas.height;
		analyser.fftSize = 2048;
		var bufferLength = analyser.fftSize;
		console.log(bufferLength);
		var dataArray = new Uint8Array(bufferLength);

		canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

		draw = () => {
			drawVisual = requestAnimationFrame(draw);

			analyser.getByteTimeDomainData(dataArray);

			canvasCtx.fillStyle = 'rgb(200, 200, 200)';
			canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

			canvasCtx.lineWidth = 2;
			canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

			canvasCtx.beginPath();

			var sliceWidth = (WIDTH * 1.0) / bufferLength;
			var x = 0;

			for (var i = 0; i < bufferLength; i++) {
				var v = dataArray[i] / 128.0;
				var y = (v * HEIGHT) / 2;

				if (i === 0) {
					canvasCtx.moveTo(x, y);
				} else {
					canvasCtx.lineTo(x, y);
				}

				x += sliceWidth;
			}

			canvasCtx.lineTo(canvas.width, canvas.height / 2);
			canvasCtx.stroke();
		};

		draw();
	}
	render() {
		return (
			<Layout style={{ width: 300, height: 300 }}>
				<canvas height={300} width={300} ref={this.canvasRef}></canvas>
			</Layout>
		);
	}
}
