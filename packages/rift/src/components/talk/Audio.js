import * as React from 'react';
import { Layout, Text, Button, styled } from '@ui-kitten/components';

class Audio extends React.Component {
	constructor(props) {
		super(props);
		this.audioRef = React.createRef();
	}
	render() {
		const { props, audioRef } = this;
		const { connName } = props;
		return (
			<Layout>
				<audio id={`audio-${connName}`} controls autoplay ref={audioRef}></audio>
			</Layout>
		);
	}
}

export default Audio;
