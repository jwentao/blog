function status() {
	if (response.status >= 200 && response.status < 300) {
		return response
	}
	throw new Error(response.statusText)
}

function json(response) {
	return response.json()
}

export function ajax (url, option) {
	return new Promise((resolve, rej) => {
		fetch(url, option).then(response => {
			if (response.status >= 200 && response.status < 300) {
				return resolve(response.json())
			} else {
				return rej(response)
			}
		}).catch(error => {
			return rej(error)
		})
	})
}