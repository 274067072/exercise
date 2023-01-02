import {
	baseUrl
} from "./config.js"

export function topList(callback) {
	uni.request({
		url: `${baseUrl}/toplist/detail`,
		method: "GET",
		success: (res) => {
			callback(res.data.list)
		},
		fail: (err) => {
			console.log(err);
		}
	})
}

export function playList(id, callback) {
	uni.request({
		url: `${baseUrl}/playlist/detail?id=${id}`,
		method: "GET",
		success: (res) => {
			callback(res.data)
		},
		fail: (err) => {
			console.log(err);
		}
	})
}

export function songDetail(id, callback) {
	uni.request({
		url: `${baseUrl}/song/detail?ids=${id}`,
		method: "GET",
		success: (res) => {
			callback(res.data.songs[0])
		},
		fail: (err) => {
			console.log(err);
		}
	})
}

export function lyric(id, callback) {
	uni.request({
		url: `${baseUrl}/lyric?id=${id}`,
		method: "GET",
		success: (res) => {
			callback(res.data.lrc.lyric)
		},
		fail: (err) => {
			console.log(err);
		}
	})
}

export function songUrl(id, callback) {
	uni.request({
		url: `${baseUrl}/song/url?id=${id}`,
		method: "GET",
		success: (res) => {
			callback(res.data.data[0])
		},
		fail: (err) => {
			console.log(err);
		}
	})
}

export function simiSong(id, callback) {
	uni.request({
		url: `${baseUrl}/simi/song?id=${id}`,
		method: "GET",
		success: (res) => {
			callback(res.data.songs)
		},
		fail: (err) => {
			console.log(err);
		}
	})
}

export function hotList(callback) {
	uni.request({
		url: `${baseUrl}/search/hot/detail`,
		method: "GET",
		success: (res) => {
			callback(res.data.data)
		},
		fail: (err) => {
			console.log(err);
		}
	})
}
export function searchList(keywords, callback) {
	uni.request({
		url: `${baseUrl}/search?keywords=${keywords}`,
		method: "GET",
		success: (res) => {
			callback(res.data.result.songs)
		},
		fail: (err) => {
			console.log(err);
		}
	})
}

export function suggestList(keywords, callback) {
	uni.request({
		url: `${baseUrl}/search/suggest?keywords=${keywords}&type=mobile`,
		method: "GET",
		success: (res) => {
			callback(res.data.result.allMatch)
		},
		fail: (err) => {
			console.log(err);
		}
	})
}
