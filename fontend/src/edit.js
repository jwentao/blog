import './css/edit.scss'
import { $ } from './js/util'

let showdown  = require('showdown')
let showdownhighlight = require('showdown-highlight');
// let converter = new showdown.Converter()

let converter = new showdown.Converter({
	// That's it
	extensions: [showdownhighlight]
});
let inputText = $('#text-input')[0]
let contentText = $('#content')[0]
inputText.addEventListener('keyup', e => {
	contentText.innerHTML = converter.makeHtml(inputText.value)
	console.log( converter.makeHtml(inputText.value))
}, false)
inputText.addEventListener('keydown', e => {

	if (event.key !== 'Tab') return
	if (event && event.preventDefault) {
		console.log('a')
		event.preventDefault()
	} else {
		window.event.returnValue = false
	}
	// 获取光标的range对象 event.view 是一个window对象
	let range = event.view.getSelection().getRangeAt(0);
	// 光标的偏移位置
	let offset = range.startOffset;
	// 新建一个span元素
	let span = document.createElement('span');
	// 四个 表示四个空格
	span.innerHTML = '    ';
	// 创建一个新的range对象
	let newrange = document.createRange();
	// 设置新的range的位置，也是插入元素的位置
	newrange.setStart(range.startContainer, offset);
	newrange.setEnd(range.startContainer, offset);
	newrange.collapse(true);
	newrange.insertNode(span);
	// // 去掉旧的range对象，用新的range对象替换
	// event.view.getSelection().removeAllRanges();
	event.view.getSelection().addRange(range);
	// // 将光标的位置向后移动一个偏移量，放到加入的四个空格后面
	range.setStart(span, 1);
	// range.setEnd(span, 1);
}, false)

let tab = e => {console.log(e)}


