import './css/index.scss'
// import 'babel-polyfill'
import { $, ajax, generateMainHtml, generateEntryList, getQueryValue } from './js/util';
let indexMap = ['default', 'all', 'origin', 'reprint'];
let global = {
	idx: 0,
	num: 10,
	canLoad: false
};
let entryList;
init();

// 初始化
function init() {
    let type = getQueryValue('type');
    let idx = 0;
    if (type) {
    	idx = indexMap.indexOf(type);
	}
    $('body')[0].innerHTML = generateMainHtml({activeIdx: idx});
    entryList = $('#entry-list');
    getArticleList(type);
    // 监听点击，跳转文章
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
	// 无限滚动
    let io = new IntersectionObserver(e => {
        if (e[0].intersectionRatio <= 0	) return;
        console.log('need load', global.canLoad)
        if (global.canLoad) {
            global.idx ++;
            getArticleList(type);
        }
    });
    io.observe($('#sentinels'));
	bindEvent();
}
// 绑定事件
function bindEvent() {
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
	}, false);
}



async function getArticleList (type) {
	let options = {
		idx: global.idx,
		num: global.num
	};
	console.log(type === 'origin' ? 1 : 2)
	if (type === 'origin' || type === 'reprint') {
		options.type = (type === 'origin' ? 1 : 2);
	}
	let data = await ajax({url: '/article/get_article_list', type: 'GET', data: options});
	console.log(data)
	if (data.code === 0) {
		entryList.insertAdjacentHTML('beforeEnd', generateEntryList(data));
		console.log('type', type)
		if (type && type !== 'default' && ((global.idx + 1) * global.num < data.total || !data.total)) {
			global.canLoad = true;
		}
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
