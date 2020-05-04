'use strict';

//https://developers.google.com/web/fundamentals/web-components/examples/howto-tabs
/*

const template = document.createElement('template');
template.innerHTML = `
<style>

</style>
<slot name="tab"></slot>
<slot name="panel"></slot>
`;

*/
class ModalElement extends HTMLInputElement {
	isVisible: boolean;
	submitCallback: (value: string) => void;
	constructor() {
		super();

		this.setAttribute('class', 'modal-element');
		this.isVisible = false;
		this.style.display = 'none';
		this.submitCallback = (value): void => {
			console.log('Enter was pressed with ' + value);
		};

		//`this` refers to the classs becuase it is => function and not a function function
		this.addEventListener('keyup', (event) => {
			if (event.code == 'Enter') {
				if (this.submitCallback == null) return;
				this.submitCallback(this.value);
			} else if (event.code == 'Escape') {
				this.hide();
			}
		});
	}

	setSubmitCallback(cb: (value: string) => void): void {
		this.submitCallback = cb;
	}

	setPlaceholder(placeholder: string): void {
		this.value = '';
		this.type = 'text';
		if (placeholder.toLocaleLowerCase().includes('password')) {
			this.type = 'password';
		}
		this.placeholder = placeholder;
	}
	display(placeholder: string): void {
		this.value = '';
		if (placeholder != null) {
			this.setPlaceholder(placeholder);
		}

		this.isVisible = true;
		this.style.display = 'block';
		this.focus();
	}

	hide(): void {
		this.style.display = 'none';
		this.submitCallback = (): void => {
			console.log('Enter was pressed');
		};
	}
}
customElements.define('modal-box', ModalElement, { extends: 'input' });
