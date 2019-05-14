import Delta from '../delta';
import {ClassAttributor, Scope} from '../parchment';
import Inline from '../blots/inline';
import Quill from '../core/quill';
import Module from '../core/module';
import {blockDelta} from '../blots/block';
import BreakBlot from '../blots/break';
import CursorBlot from '../blots/cursor';
import TextBlot from '../blots/text';
import CodeBlock, {CodeBlockContainer} from '../formats/code';

import hljs from '../../highlightjs';
import javascript from '../../highlightjs/languages/javascript';

hljs.registerLanguage('javascript', javascript);

const TokenAttributor = new ClassAttributor('code-hljs', 'hljs', {
	scope: Scope.INLINE
});

class CodeToken extends Inline {
	static formats(node, scroll) {
		debugger;
		while (node != null && node !== scroll.domNode) {
			if (node.classList.contains(CodeBlock.className)) {
				return super.formats(node, scroll);
			}
			node = node.parentNode;
		}
		return undefined;
	}

	constructor(scroll, domNode, value) {
		super(scroll, domNode, value);
		TokenAttributor.add(this.domNode, value);
	}

	format(format, value) {
		if (format !== CodeToken.blotName) {
			super.format(format, value);
		} else if (value) {
			TokenAttributor.add(this.domNode, value);
		} else {
			TokenAttributor.remove(this.domNode);
			this.domNode.classList.remove(this.statics.className);
		}
	}

	formats() {
		return {
			[CodeToken.blotName]: TokenAttributor.value(this.domNode)
		}
	}

	optimize(...args) {
		super.optimize(...args);
		if (!TokenAttributor.value(this.domNode)) {
			this.unwrap();
		}
	}
}
CodeToken.blotName = 'code-token';
CodeToken.className = 'ql-token';

class SyntaxCodeBlock extends CodeBlock {
	static create(value) {
		const domNode = super.create(value);
		if (typeof value === 'string') {
			domNode.setAttribute('data-language', value);
		}
		return domNode;
	}

	static formats(domNode) {
		return domNode.getAttribute('data-language') || 'plain';
	}

	static register() {
	} // Syntax module will register

	format(name, value) {
		if (name === this.statics.blotName && value) {
			this.domNode.setAttribute('data-language', value);
		} else {
			super.format(name, value);
		}
	}

	replaceWith(name, value) {
		this.formatAt(0, this.length(), CodeToken.blotName, false);
		return super.replaceWith(name, value);
	}
}

class SyntaxCodeBlockContainer extends CodeBlockContainer {
	attach() {
		super.attach();
		this.forceNext = false;
		this.scroll.emitMount(this);
	}

	format(name, value) {
		if (name === SyntaxCodeBlock.blotName) {
			this.forceNext = true;
			this.children.forEach(child => {
				child.format(name, value);
			});
		}
	}

	formatAt(index, length, name, value) {
		if (name === SyntaxCodeBlock.blotName) {
			this.forceNext = true;
		}
		super.formatAt(index, length, name, value);
	}

	highlight(highlight, forced = false) {
		if (this.children.head == null) return;
		const nodes = Array.from(this.domNode.childNodes).filter(node => node !== this.uiNode);
		const text = `${nodes.map(node => node.textContent).join('\n')}\n`;
		const language = SyntaxCodeBlock.formats(this.children.head.domNode);
		if (forced || this.forceNext || this.cachedText !== text) {
			if (text.trim().length > 0 || this.cachedText == null) {
				let oldDelta = this.children.reduce((delta, child) => {
					return delta.concat(blockDelta(child, false));
				}, new Delta());
				let delta = highlight(text, language);
				console.log(oldDelta.diff(delta))
				oldDelta.diff(delta).reduce((index, {retain, attributes}) => {
					// Should be all retains
					if (!retain) return index;
					if (attributes) {
						Object.keys(attributes).forEach(format => {
							if ([SyntaxCodeBlock.blotName, CodeToken.blotName].includes(format)) {
								this.formatAt(index, retain, format, attributes[format]);
							}
						});
					}
					return index + retain;
				}, 0);
			}
			this.cachedText = text;
			this.forceNext = false;
		}
	}


	optimize(context) {
		super.optimize(context);
		if (this.parent != null && this.children.head != null && this.uiNode != null) {
			const language = SyntaxCodeBlock.formats(this.children.head.domNode);
			if (language !== this.uiNode.value) {
				this.uiNode.value = language;
			}
		}
	}
}
SyntaxCodeBlockContainer.allowedChildren = [SyntaxCodeBlock];
SyntaxCodeBlock.requiredContainer = SyntaxCodeBlockContainer;
SyntaxCodeBlock.allowedChildren = [CodeToken, CursorBlot, TextBlot, BreakBlot];

function traverse(node, textMatcher, className) {
	// Post-order
	if (node.nodeType === node.TEXT_NODE) {
		return textMatcher(node, className);
	}
	if (node.nodeType === node.ELEMENT_NODE) {
		return Array.from(node.childNodes || []).reduce((delta, childNode) => {
			let childrenDelta = traverse(
				childNode,
				textMatcher,
				TokenAttributor.value(node)
			);
			return delta.concat(childrenDelta);
		}, new Delta());
	}
	return new Delta();
}

export default class Syntax extends Module {
	static register() {
		Quill.register(TokenAttributor, true);
		Quill.register(CodeToken, true);
		Quill.register(SyntaxCodeBlock, true);
		Quill.register(SyntaxCodeBlockContainer, true);
	}

	constructor(quill, options) {
		super(quill, options);
		this.highlightBlot = this.highlightBlot.bind(this);
		this.initListener();
		this.initTimer();
	}

	initListener() {
		this.quill.on(Quill.events.SCROLL_BLOT_MOUNT, blot => {
			if (!(blot instanceof SyntaxCodeBlockContainer)) return;
			const select = this.quill.root.ownerDocument.createElement('select');
			this.options.languages.forEach(({key, label}) => {
				const option = select.ownerDocument.createElement('option');
				option.textContent = label;
				option.setAttribute('value', key);
				select.appendChild(option);
			});
			select.addEventListener('change', () => {
				blot.format(SyntaxCodeBlock.blotName, select.value);
				this.quill.root.focus(); // Prevent scrolling
				this.highlight(blot, true);
			});
			if (blot.uiNode == null) {
				blot.attachUI(select);
				if (blot.children.head) {
					select.value = SyntaxCodeBlock.formats(blot.children.head.domNode);
				}
			}
		});
	}

	initTimer() {
		let timer = null;
		this.quill.on(Quill.events.SCROLL_OPTIMIZE, () => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				this.highlight();
				timer = null;
			}, this.options.interval);
		});
	}

	highlight(blot = null, force = false) {
		if (this.quill.selection.composing) return;
		this.quill.update(Quill.sources.USER);
		const range = this.quill.getSelection();
		const blots = blot == null ? this.quill.scroll.descendants(SyntaxCodeBlockContainer) : [blot];
		blots.forEach(container => {
			container.highlight(this.highlightBlot, force);
		});
		// this.quill.scroll.observer.takeRecords();
		this.quill.update(Quill.sources.SILENT);
		if (range != null) {
			this.quill.setSelection(range, Quill.sources.SILENT);
		}
	}

	highlightBlot(text, language = 'plain') {
		if (language === 'plain') {
			return text.split('\n')
				.reduce((delta, line, i) => {
					if (i !== 0) {
						delta.insert('\n', {[CodeBlock.blotName]: language});
					}
					return delta.insert(line,{[CodeToken.blotName]: false});
				}, new Delta());
		}
		const container = this.quill.root.ownerDocument.createElement('div');
		container.classList.add(CodeBlock.className);
		container.innerHTML = hljs.highlight(language, text).value;
		return traverse(container, (node, className) => {
			return node.data.split('\n').reduce((memo, nodeText, i) => {
				if (i !== 0) {
					memo.insert('\n', {[CodeBlock.blotName]: language});
				}
				if (className !== '' && nodeText.replace(/\s+/g, '') !== '') {
					return memo.insert(nodeText, {[CodeToken.blotName]: className});
				}
				return memo.insert(nodeText);
			}, new Delta());
		}, "");
	}
}
Syntax.DEFAULTS = {
	interval: 10,
	languages: [
		{key: 'plain', label: 'Plain'},
		{key: 'bash', label: 'Bash'},
		{key: 'cpp', label: 'C++'},
		{key: 'cs', label: 'C#'},
		{key: 'css', label: 'CSS'},
		{key: 'diff', label: 'Diff'},
		{key: 'xml', label: 'HTML/XML'},
		{key: 'java', label: 'Java'},
		{key: 'javascript', label: 'Javascript'},
		{key: 'markdown', label: 'Markdown'},
		{key: 'php', label: 'PHP'},
		{key: 'python', label: 'Python'},
		{key: 'ruby', label: 'Ruby'},
		{key: 'sql', label: 'SQL'}
	]
};
