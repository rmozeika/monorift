export const requestNotifications = () => {
	Notification.requestNotifications(reg => {
		console.log(reg);
	});
};
