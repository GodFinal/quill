import Picker from './picker';

class TextPicker extends Picker {
	constructor(select, type) {
		super(select);
		this.container.classList.add('ql-text-picker');
		Array.from(this.container.querySelectorAll('.ql-picker-item')).forEach(item => {
			item.style[type] = item.getAttribute('data-value') || '';
		});
	}
}

export default TextPicker;
