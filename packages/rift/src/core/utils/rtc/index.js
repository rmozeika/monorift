export async function onIceCandidate(pc, event) {
	try {
		await getOtherPc(pc).addIceCandidate(event.candidate);
		onAddIceCandidateSuccess(pc);
	} catch (e) {
		onAddIceCandidateError(pc, e);
	}
	console.log(
		`${getName(pc)} ICE candidate:\n${
			event.candidate ? event.candidate.candidate : "(null)"
		}`
	);
}

export function onAddIceCandidateSuccess(pc) {
	console.log(`${getName(pc)} addIceCandidate success`);
}

export function onAddIceCandidateError(pc, error) {
	console.log(`${getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
}
