export class HTMLBuilder {
	html: string;
	constructor() {
		this.html = `
            <!DOCTYPE html>
            <html>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            `;
	}

	createHead(title: string, links: string, script: string): void {
		const head = '<head>';
		this.html += head;
	}

	finishSave(): void {
		this.html += '</html>';
		console.log(this.html);
	}
}
