import './css/edit.scss'
import { $, ajax } from './js/util'
// 引入showdown 和 showdown高亮
let showdown  = require('showdown')
let showdownhighlight = require('showdown-highlight');
// 创建shoudown对象
let converter = new showdown.Converter({
	extensions: [showdownhighlight]
});

let inputText = $('#text-input')
let contentText = $('#content')
inputText.addEventListener('keyup', e => {
	let text = converter.makeHtml(inputText.value)
	// showdown解析四个空格开头的代码块，会出现hljs字符，这里先暴力替换掉
	text = text.replace(/>hljs/g, '>')
	// 序列化h1的id
	let idx = 0
	text = text.replace(/(<h[1-6][\S|\s]+?id=["|'])([\w|\-]*)(['|"])/g, function(a,b,c,d){
		console.log(a, b, '|', c,'|', d)
		return b +'heading-' + idx++ + d
})
	contentText.innerHTML = text
	console.log( text)
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
inputText.addEventListener('keydown', e => {
	if (event.key !== 'Tab') return
	// if (event && event.preventDefault) {
	// 	console.log('a')
	// 	e.preventDefault()
	// } else {
	// 	window.event.returnValue = false
	// }
	// tab占两个空格
	let tab = '  '
    let newCaretPosition;
		console.log(inputText.getCaretPosition())
    newCaretPosition = inputText.getCaretPosition() +tab.length;
    console.log(newCaretPosition)
	inputText.value = inputText.value.substring(0, inputText.getCaretPosition()) + tab + inputText.value.substring(inputText.getCaretPosition(), inputText.value.length);
	inputText.setCaretPosition(newCaretPosition);
    e.preventDefault()
    return false;
}, false)

$('#toggle-submit-box').addEventListener('click', e => {
	let el = $('#toggle-submit-box');
	let panel = $('#panel');
	if (el.classList.contains('icon-xialasanjiao')) {
		el.classList.remove('icon-xialasanjiao');
		el.classList.add('icon-xialasanjiao-copy');
		panel.style.display = 'block';
	} else {
		el.classList.remove('icon-xialasanjiao-copy');
		el.classList.add('icon-xialasanjiao');
		panel.style.display = 'none';
	}
}, false)

let tagList = Array.from($('.class-item'))
tagList.forEach(item => {
	item.addEventListener('click', e => {
		tagList.forEach(i => {
			i.classList.remove('active')
		})
		item.classList.add('active')
	}, false)
})

async function postArticle () {
	let data = await ajax('http://localhost/article/post_article', {method: 'post', body: {
		'title1': '一个测试的标题1',
		'auth': '测试作者名',
		'tag': 'tag1,tag2,tag3',
		'type': 'origin',
		'origin_article': '####大量的文本####大量的文本####大量的文本####大量的文本####大量的文本####大量的文本####大量的文本####大量的文本####大量的文本####大量的文本####大量的文本####大量的文本####大量的文本####大量的文本####大量的文本####大量的文本####大量的文本####大量的文本####大量的文本####大量的文本####大量的文本####大量的文本####大量的文本####大量的文本',
		'trans_article': `<h4>大量的文本</h4><h4>大量的文本</h4><h4>大量的文本</h4><h4>大量的文本</h4><h4>大量的文本</h4><h4>大量的文本</h4><h4>大量的文本</h4><h4>大量的文本</h4><h4>大量的文本</h4><h4>大量的文本</h4><h4>大量的文本</h4><h4>大量的文本</h4><h4>大量的文本</h4><h4>大量的文本</h4><h4>大量的文本</h4>`
	}})
	console.log(data)
}
// postArticle()


