
export class App {
	constructor() {
	}
}

declare global {
	interface Window {
		app: App;
	}
}

window.addEventListener('load', () => {
	window.app = new App();
});
