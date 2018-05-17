import './css/login.scss';
import { $, ajax } from './js/util';
if (localStorage.getItem('id')) {
	$('#id').value = localStorage.getItem('id');
}
$('#confirm').addEventListener('click', e => {
	let id = $('#id').value;
	let psw = $('#psw').value;
	if (id === '' || psw === '') {
		alert('账号或密码不能为空');
	} else {
		login(id, psw);
	}
}, false);

async function login(id, psw) {
	let data = await ajax({url: '/user/login' , type: 'POST', data: {
		id: id,
		psw: psw
	}});
	console.log(data)
	if (data.code === 0 && data.token) {
		localStorage.setItem('accesstoken', data.token);
		localStorage.setItem('id', id);
	}
}