import './css/edit.scss'
import { $ } from './js/util'
// 引入showdown 和 showdown高亮
let showdown  = require('showdown')
let showdownhighlight = require('showdown-highlight');
// 创建shoudown对象
let converter = new showdown.Converter({
	extensions: [showdownhighlight]
});

let inputText = $('#text-input')[0]
let contentText = $('#content')[0]
inputText.addEventListener('keyup', e => {
	contentText.innerHTML = converter.makeHtml(inputText.value)
	console.log( converter.makeHtml(inputText.value))
}, false)

HTMLTextAreaElement.prototype.getCaretPosition = function () {
//return the caret position of the textarea
    return this.selectionStart;
};
HTMLTextAreaElement.prototype.setCaretPosition = function (position) {
//change the caret position of the textarea
    this.selectionStart = position;
    this.selectionEnd = position;
    this.focus();
};
HTMLTextAreaElement.prototype.hasSelection = function () {
//if the textarea has selection then return true
    if (this.selectionStart == this.selectionEnd) {
        return false;
    } else {
        return true;
    }
};
HTMLTextAreaElement.prototype.getSelectedText = function () {
//return the selection text
    return this.value.substring(this.selectionStart, this.selectionEnd);
};
HTMLTextAreaElement.prototype.setSelection = function (start, end) {
//change the selection area of the textarea
    this.selectionStart = start;
    this.selectionEnd = end;
    this.focus();
};
let textarea = inputText
inputText.addEventListener('keydown', e => {

	if (event.key !== 'Tab') return
	// if (event && event.preventDefault) {
	// 	console.log('a')
	// 	e.preventDefault()
	// } else {
	// 	window.event.returnValue = false
	// }
    var newCaretPosition;
    newCaretPosition = textarea.getCaretPosition() + "  ".length;
    console.log(newCaretPosition)
    textarea.value = textarea.value.substring(0, textarea.getCaretPosition()) + " " + textarea.value.substring(textarea.getCaretPosition(), textarea.value.length);
    textarea.setCaretPosition(newCaretPosition);
    e.preventDefault()
    return false;
}, false)


