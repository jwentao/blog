import './css/search.scss';
// import 'babel-polyfill'
import { $, ajax, generateMainHtml, generateEntryList, getQueryValue } from './js/util';
let global = {
	idx: 0,
	num: 10,
	titleKeyWord: '',
	canLoad: false
};
let indexMap = ['default', 'all', 'origin', 'reprint'];
init();
function init() {
	$('body')[0].innerHTML = generateMainHtml({activeIdx: -1});
	global.titleKeyWord = $('#search-input').value = decodeURI(getQueryValue('title'));
	searchByTitle();
	bindEvent();
	let io = new IntersectionObserver(e => {
		if (e[0].intersectionRatio <= 0	) return;
		console.log('need load', global.canLoad)
		if (global.canLoad) {
			global.idx ++;
			searchByTitle();
		}
	});
	io.observe($('#sentinels'));
}



// 绑定事件
function bindEvent() {
	$('#entry-list').addEventListener('click', e => {
		e.stopPropagation();
		console.log('click');
		let node = findParentDataSet(e.target, 'id');
		let id;
		if (node) {
			id = node.dataset.id;
			location.href = `./detail.html?id=${id}`;
		}
	}, false);
	// 点击搜索btn
	$('#search-btn').addEventListener('click', e => {
		let input = $('#search-input');
		history.replaceState({}, input.value, './search.html?title=' + input.value);
		global.titleKeyWord = input.value;
		global.idx = 0;
		$('#entry-list').innerHTML = '';
		searchByTitle();
	}, false);
	// 回车触发click
	$('#search-input').addEventListener('keydown', e => {
		if (e.keyCode !== 13) {
			console.log(e.keyCode);
			return;
		}
		$('#search-btn').click();
	}, false);
	// 宽度过小时的下拉框
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
}
// 搜索
async function searchByTitle () {
	if (global.titleKeyWord === '') {
		return
	}
	let data = await ajax({url: '/article/search_by_title', type: 'GET', data: {
		idx: global.idx,
		num: global.num,
		title:  global.titleKeyWord
	}});
	console.log(data);
	if (data.code === 0 && data.data.length > 0) {
		$('.no-result')[0].style.display = 'none';
		$('#entry-list').insertAdjacentHTML('beforeEnd', generateEntryList(data));

		if ((global.idx + 1) * global.num < data.total || !data.total) {
			console.log('canload to true')
			global.canLoad = true;
		}
	} else if (data.total === 0) {
		$('.no-result')[0].style.display = 'block';
	}
}
// 找到包含某自定义data的node
function findParentDataSet(node, dataSet) {
	if(node.dataset[dataSet]) {
		return node
	} else if (node.parentNode) {
		return findParentDataSet(node.parentNode, dataSet)
	} else {
		return false
	}
}

