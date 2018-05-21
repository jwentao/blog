import './css/detail.scss';
import './css/error.scss';
import {$, generateMainHtml, ajax, markdown2html, generateErrorHtml, importSvg} from './js/util';

let method = {
	/**
	 * 根据id请求文章
	 * @param id 文章id
	 * @return
	 */
	async getArticleDetail(id) {
		let data = await ajax({url: '/article/get_article_detail', method: 'get', data: {id: id}});
		console.log(data)
		if (data.code !== 0) {
			$('#main').insertAdjacentHTML('afterEnd', generateErrorHtml());
			importSvg();
		} else {
			document.title = data.data.title;
			let html = markdown2html(data.data.origin_article);
			$('#content').innerHTML = `<div class="article-box"><h1 class="article-title">${data.data.title}</h1>
													 <div id="article-body" class="markdown-body">${html}</div></div>`;
			let headerList = Array.from($('#article-body').querySelectorAll("h1,h2,h3,h4,h5,h6"));
			this.generateHeadList(headerList)
			this.bindEvent(headerList)
		}
	},
	/**
	 * 根据id请求文章
	 * @param id 文章id
	 * @return
	 */
	generateHeadList(headerList) {


		let headerArr = tree(headerList)

		let catalog = `<div class="catalog-box">
								<nav class="article-catalog">
									<div class="catalog-title">目录</div>
									<div class="catalog-body" id="catalog-body">
										${generateListHtml(headerArr, 1)}
									</div>
								</nav>
							</div>`
		$('#aside').insertAdjacentHTML('beforeEnd', catalog)
		function generateListHtml(headerArr, d) {
			if (!headerArr) return ''
			let temp = `<ul class="${d === 1 ? 'catalog-list' : 'sub-list'}">`
			for (let i in headerArr) {
				temp += `<li class="item ${'d' + d}"><a data-target="${headerArr[i].headId}">${headerArr[i].headTitle}</a></li>`
				temp += generateListHtml(headerArr[i].children, d + 1)
			}
			temp += '</ul>'
			return temp
		}

		function tree(headerList, e) {
			// 第一次传入时没有e参数，以header数组第一个元素高一级的header为基础，如h1-》h0， h2-》h1
			if (!e) return listChildren(headerList, {tagName: 'H' + (getLevel(headerList[0]) - 1)})
			let resultTree = {'headTitle': e.innerText, 'headId': e.id};
			// 限制只取到最高级往下3级
			if (getLevel(e) < 3) {
				let children = listChildren(headerList, e);
				if (children.length !== 0)
					resultTree.children = children;
			}

			return resultTree;
		}

		function getLevel(e) {
			return e.tagName.substring(1, 2)
			// return e.tagName.match(/\d/);
		}

		function listChildren(headerList, e) {
			let resultList = [];
			let index = headerList.indexOf(e);
			// console.log('index', index)
			while (headerList[index + 1] && getLevel(headerList[index + 1]) > getLevel(e)) {
				if ((getLevel(headerList[index + 1]) - 1).toString() === getLevel(e))
					resultList.push(tree(headerList, headerList[index + 1]))
				index++;
			}
			return resultList;
		}
	},
	bindEvent (headerList) {
		let catalogBody = $('#catalog-body')
		catalogBody.addEventListener('click', e => {
			e.preventDefault()
			let id = e.target.dataset.target
			let activeLi = catalogBody.querySelector('.active')
			if (activeLi) activeLi.classList.remove('active')
			e.target.classList.add('active')
			$('#' + id).scrollIntoView()
			window.scrollBy(0, -60)
		}, false)
// 监听导航
		let io = new IntersectionObserver(e => {
			console.log(e)
			e = e[0]
			console.log(e.target.id, e.intersectionRect.top, e.boundingClientRect)
			if (e.isIntersecting) {
				console.log(e.target.id, e.intersectionRect.top)
				let activeLi = catalogBody.querySelector('.active')
				if (activeLi) activeLi.classList.remove('active')
				document.querySelector('a[data-target=' + e.target.id + ']').classList.add('active')
			}
		})

		headerList.forEach(item => {
			io.observe(item)
		})

		let asideIo = new IntersectionObserver(e => {
			if (e[0].isIntersecting) {
				$('.article-catalog')[0].classList.remove('static')
			} else {
				$('.article-catalog')[0].classList.add('static')
			}
		}, [1])
		asideIo.observe($('.banner')[0])
	}
}
// 初始化页面
function initPage() {
	$('body')[0].innerHTML = generateMainHtml({activeIdx: -1});
	method.getArticleDetail(location.search.split('=')[1]);
}

initPage();