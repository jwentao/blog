import './css/index.scss'
import 'babel-polyfill'
let func = () => {}
const NUM = 45
let arr = [1, 2, 4]
let newArr = arr.map(item => item + NUM)
function* funca() {}
let [a, b, c] = [1, 2, 3]
new Promise((res, rej) => {
	setTimeout(() => {
		res('success')
	}, 1000)
}).then(res => {
	console.log(res)
})

let s1 = Symbol('foo');
let s2 = Symbol('bar');

console.log(s1, s2)
console.log(a, b, c)
console.log(new Set(newArr))
console.log('this is index')