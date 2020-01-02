signaling.onmessage = async ({ desc, candidate }) => {
	try {
		if (desc) {
			// if we get an offer, we need to reply with an answer
			if (desc.type === 'offer') {
				await pc.setRemoteDescription(desc);
				const stream = await navigator.mediaDevices.getUserMedia(constraints);
				stream.getTracks().forEach(track => pc.addTrack(track, stream));
				await pc.setLocalDescription(await pc.createAnswer());
				signaling.send({ desc: pc.localDescription });
			} else if (desc.type === 'answer') {
				await pc.setRemoteDescription(desc);
			} else {
				console.log('Unsupported SDP type.');
			}
		} else if (candidate) {
			await pc.addIceCandidate(candidate);
		}
	} catch (err) {
		console.error(err);
	}
};

//old junk
function handleConnection(event) {
	const peerConnection = event.target;
	const iceCandidate = event.candidate;
	if (iceCandidate) {
		const newIceCandidate = new RTCIceCandidate(iceCandidate);
		if (true) return;
		const otherPeer = getOtherPeer(peerConnection);

		otherPeer
			.addIceCandidate(newIceCandidate)
			.then(() => {
				handleConnectionSuccess(peerConnection);
			})
			.catch(error => {
				handleConnectionFailure(peerConnection, error);
			});

		trace(
			`${getPeerName(peerConnection)} ICE candidate:\n` +
				`${event.candidate.candidate}.`
		);
	}
}

// Logs answer to offer creation and sets peer connection session descriptions.
function createdAnswer(description, localPeerConnection, remotePeerConnection) {
	trace(`Answer from remotePeerConnection:\n${description.sdp}.`);

	trace('remotePeerConnection setLocalDescription start.');
	remotePeerConnection
		.setLocalDescription(description)
		.then(() => {
			setLocalDescriptionSuccess(remotePeerConnection);
		})
		.catch(setSessionDescriptionError);

	trace('localPeerConnection setRemoteDescription start.');
	localPeerConnection
		.setRemoteDescription(description)
		.then(() => {
			setRemoteDescriptionSuccess(localPeerConnection);
		})
		// .catch(setSessionDescriptionError);
		.catch(trace);
}

// Logs error when setting session description fails.
function setSessionDescriptionError(error) {
	trace(`Failed to create session description: ${error.toString()}.`);
}

// Logs success when localDescription is set.
function setLocalDescriptionSuccess(peerConnection) {
	setDescriptionSuccess(peerConnection, 'setLocalDescription');
}

// Logs success when remoteDescription is set.
function setRemoteDescriptionSuccess(peerConnection) {
	setDescriptionSuccess(peerConnection, 'setRemoteDescription');
}

// Logs success when setting session description.
function setDescriptionSuccess(peerConnection, functionName) {
	const peerName = getPeerName(peerConnection);
	trace(`${peerName} ${functionName} complete.`);
}
