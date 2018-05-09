import './css/edit.scss'
import {$, ajax} from './js/util'
// 引入showdown 和 showdown高亮
let showdown = require('showdown')
let showdownhighlight = require('showdown-highlight');
// 创建shoudown对象
let converter = new showdown.Converter({
	extensions: [showdownhighlight]
});

let postInfo = {
	title: '', // 标题
	auth: '', // 作者
	tag: '', // 标签
	type: '1', // 1为原创，2为转载
	origin_article: '' // 原文(markdowm语法)
}

let inputText = $('#text-input')
let contentText = $('#content')
let text = '';
inputText.addEventListener('keyup', e => {
	text = converter.makeHtml(inputText.value)
	// showdown解析四个空格开头的代码块，会出现hljs字符，这里先暴力替换掉
	text = text.replace(/>hljs/g, '>')
	// 序列化h1的id
	let idx = 0
	text = text.replace(/(<h[1-6][\S|\s]+?id=["|'])([\w|\-]*)(['|"])/g, function (a, b, c, d) {
		return b + 'heading-' + idx++ + d
	})
	contentText.innerHTML = text
	console.log(text)
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
	newCaretPosition = inputText.getCaretPosition() + tab.length;
	console.log(newCaretPosition)
	inputText.value = inputText.value.substring(0, inputText.getCaretPosition()) + tab + inputText.value.substring(inputText.getCaretPosition(), inputText.value.length);
	inputText.setCaretPosition(newCaretPosition);
	e.preventDefault()
	return false;
}, false)
// 显示/隐藏 发布box
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
// 切换发布box里的标签
let tagList = Array.from($('.class-item'))
tagList.forEach(item => {
	item.addEventListener('click', e => {
		postInfo.type = e.target.dataset.type
		tagList.forEach(i => {
			i.classList.remove('active')
		})
		item.classList.add('active')
	}, false)
})
// 点击确认发布
$('#confirm').addEventListener('click', e => {
	postInfo.title = $('#title-value').value;
	postInfo.auth = $('#auth-value').value;
	postInfo.tag = $('#tag-value').value;
	postInfo.origin_article = inputText.value;
	postInfo.time = new Date().getTime();
	postInfo.last_time = new Date().getTime();
	console.log(postInfo)
	postArticle(postInfo)
}, false)
async function postArticle(postInfo) {
	let data = await ajax({
		url: '/article/post_article', type: 'POST', data: postInfo
	});
	console.log(data)
	return data;
}
// postArticle()


