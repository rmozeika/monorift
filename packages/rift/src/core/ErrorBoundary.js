import React from 'react';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		logErrorToMyService(error);
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		logErrorToMyService(error, errorInfo);
	}

	render() {
		return this.props.children;
	}
}
function logErrorToMyService(error, errorInfo) {
	console.log(error, errorInfo);
	debugger; //error
}
export default ErrorBoundary;
