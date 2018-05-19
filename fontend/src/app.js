import './css/index.scss'
// import 'babel-polyfill'
import { $, ajax, generateMainHtml, generateEntryList, getQueryValue } from './js/util';
let indexMap = ['default', 'all', 'origin', 'reprint'];
init();
function init() {
    let type = getQueryValue('type');
    let idx = 0;
    if (type) {
    	idx = indexMap.indexOf(type);
	}
    $('body')[0].innerHTML = generateMainHtml({activeIdx: idx});
}
$('#pc-show').addEventListener('click', e => {
	e.stopPropagation();
	e.preventDefault();
	let index = e.target.dataset.index;
	if (index) {
		if (e.target.classList.contains('active')) {
			return;
		}
		// Array.from($('.nav-item')).forEach(item => {
		// 	console.log(item)
		// 	item.firstElementChild.classList.remove('active');
		// });
		// e.target.classList.add('active');
		location.href = `./index.html?type=${indexMap[index]}`
	}
}, false);
$('#search-btn').addEventListener('click', e => {
	let input = $('#search-input').value;
	console.log(input)
	location.href = './search.html?title=' + input;
}, false);

$('.phone-show-menu')[0].addEventListener('click', e => {
	console.log(e)
	let showEl = $('.pc-show')[0]
	showEl.classList.toggle('show')
}, false)

getArticleList()


async function getArticleList () {
	let data = await ajax({url: '/article/get_article_list', type: 'GET', data: {
		idx: 0,
		num: 10
	}});
	console.log(data)
	if (data.code === 0) {
		let entryList = $('#entry-list');
		entryList.insertAdjacentHTML('beforeEnd', generateEntryList(data));
		entryList.addEventListener('click', e => {
			e.stopPropagation();
			let node = findParentDataSet(e.target, 'id');
			let id;
			if (node) {
				id = node.dataset.id;
				location.href = `./detail.html?id=${id}`;
			}
			console.log(id)
		}, false);
	}
}

function findParentDataSet(node, dataSet) {
	if(node.dataset[dataSet]) {
		return node
	} else if (node.parentNode) {
		return findParentDataSet(node.parentNode, dataSet)
	} else {
		return false
	}
}
