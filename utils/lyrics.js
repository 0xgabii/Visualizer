// Thanks to HelloWorld017 (https://github.com/HelloWorld017/node-alsong)

import crypto from 'crypto';
import fs from 'fs';
import { parseString } from 'xml2js';
import Promise from 'bluebird';
import stream from 'stream';
const request = require('request-promise').defaults({
	'method': 'POST',
	'headers': {
		'Accept-Charset': 'utf-8',
		'Content-Type': 'application/soap+xml; charset=utf-8',
		'User-Agent': 'gSOAP'
	}
});

const ALSONG_URL = "http://lyrics.alsong.co.kr/alsongwebservice/service1.asmx";

const createResembleLyric2 = (artist, title) => ({
	'uri': ALSONG_URL,
	'body': `<?xml version="1.0" encoding="utf-8"?>
				<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
					<soap12:Body>
						<GetResembleLyric2 xmlns="ALSongWebServer">
							<stQuery>
								<strTitle>${title}</strTitle>
								<strArtistName>${artist}</strArtistName>
								<nCurPage>0</nCurPage>
							</stQuery>
						</GetResembleLyric2>
					</soap12:Body>
				</soap12:Envelope>`,
	'headers': {
		'SOAPAction': 'AlsongWebServer/GetResembleLyric2'
	}
});

const createLyric8 = checksum => ({
	'uri': ALSONG_URL,
	'body': `<?xml version="1.0" encoding="utf-8"?>
				<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
					<soap12:Body>
						<GetLyric8 xmlns="ALSongWebServer">
							<encData></encData>
								<stQuery>
									<strChecksum>${checksum}</strChecksum>
									<strVersion></strVersion>
									<strMACAddress></strMACAddress>
									<strIPAddress></strIPAddress>
								</stQuery>
						</GetLyric8>
					</soap12:Body>
				</soap12:Envelope>`,
	'headers': {
		'SOAPAction': 'AlsongWebServer/GetLyric8'
	}
});

const parseLyricStr = lyricStr => {
	const lyrics = {};
	lyricStr.split('<br>').forEach(v => {
		const match = v.match(/^\[(\d+):(\d\d).(\d\d)\](.*)$/);
		if (!match) return;
		const timestamp = 10 * (parseInt(match[1]) * 60 * 100 + parseInt(match[2]) * 100 + parseInt(match[3]));
		if (!lyrics[timestamp]) lyrics[timestamp] = [];
		lyrics[timestamp].push(match[4]);
	});

	return lyrics;
};

const parseBody = (methodName, body, parseLyric) => new Promise((resolve, reject) => {
	parseString(body, (err, data) => {
		if (err) {
			reject(err);
			return;
		}

		try {
			var result = data["soap:Envelope"]["soap:Body"][0][`${methodName}Response`][0][`${methodName}Result`][0];
		} catch (err) {
			reject(new Error("Wrong response from server."));
			return;
		}

		if (parseLyric || parseLyric === undefined) {
			const _result = {};
			Object.keys(result).forEach(k => {
				_result[k] = result[k][0];
			});

			_result.lyric = parseLyricStr(_result.strLyric);
			resolve(_result);
			return;
		}
		resolve(result);
	});
});

//GetResembleLyric3 does not working
const getResembleLyric2 = (artist, title, parseLyric) => new Promise((resolve, reject) => {
	request(createResembleLyric2(artist, title)).then(body => parseBody("GetResembleLyric2", body, false)).then(result => {
		if (parseLyric || parseLyric === undefined) {
			const _results = [];
			if (result["ST_GET_RESEMBLELYRIC2_RETURN"]) {
				result["ST_GET_RESEMBLELYRIC2_RETURN"].forEach(v => {
					const _result = {};
					Object.keys(v).forEach(k => {
						_result[k] = v[k][0];
					});

					_result.lyric = parseLyricStr(_result.strLyric);
					_results.push(_result);
				});
			}
			resolve(_results);
			return;
		}
		resolve(result);
	}).catch(err => {
		reject(err);
	});
});

const getLyric8 = (hash, parseLyric) => {
	if (typeof hash !== 'string' && hash instanceof Buffer)
		hash = crypto.createHash('md5').update(hash).digest('hex');

	return new Promise((resolve, reject) => {
		request(createLyric8(hash)).then(body => parseBody("GetLyric8", body, parseLyric)).then(result => {
			resolve(result);
		}).catch(err => {
			reject(err);
		});
	});
};

const getHashFromStream = stream => new Promise((resolve, reject) => {
	let hasID3 = undefined;
	let ID3len = 0;
	let buffer = Buffer.allocUnsafe(0);
	let finished = false;

	stream.on('data', chunk => {
		if (finished) return;
		buffer = Buffer.concat([buffer, chunk]);
		if (hasID3 === undefined) {
			if (buffer.length >= 10) {
				hasID3 = buffer.slice(0, 3).toString() === 'ID3';
				if (hasID3) {
					const buf = buffer.slice(6, 10);
					ID3len = buf[0] << 21 | buf[1] << 14 | buf[2] << 7 | buf[3] + 10;
				}
			} else return;
		}

		if (buffer.length > ID3len + 163840) {
			finished = true;
			buffer = undefined;
			resolve(crypto.createHash('md5').update(buffer.slice(ID3len, 163840 + ID3len)).digest('hex'));
		}
	});

	stream.on('end', () => {
		if (finished) return;
		if (hasID3 === undefined) {
			reject(new Error("Stream stopped!"));
			return;
		}

		buffer = undefined;
		resolve(crypto.createHash('md5').update(buffer.slice(ID3len, 163840 + ID3len)).digest('hex'));
	});

	stream.on('error', err => {
		buffer = undefined;
		reject(err);
	});
});

const getLyricFromStream = (stream, parseLyric) => new Promise((resolve, reject) => {
	getHashFromStream(stream).then(hash => {
		resolve(getLyric8(hash, parseLyric));
	}).catch(err => {
		reject(err);
	});
});

const getHashFromBuffer = buffer => new Promise((resolve, reject) => {
	let len = 0;
	if (buffer.slice(0, 3).toString() === 'ID3') {
		const buf = buffer.slice(6, 10);
		len = buf[0] << 21 | buf[1] << 14 | buf[2] << 7 | buf[3] + 10;
	}

	resolve(crypto.createHash('md5').update(buffer.slice(len, 163840 + len)).digest('hex'));
});

const getLyricFromBuffer = (buffer, parseLyric) => new Promise((resolve, reject) => {
	getHashFromBuffer(buffer).then(hash => {
		resolve(getLyric8(hash, parseLyric))
	}).catch(err => {
		reject(err);
	});
});

class Alsong {
	constructor() {
		if (arguments.length >= 2 && typeof arguments[0] === 'string' && typeof arguments[1] === 'string') {
			return getResembleLyric2(arguments[0], arguments[1], arguments[2]);
		}

		if (arguments.length < 1) throw new Error("Wrong arguments!");

		if (typeof arguments[0] === 'string') {
			return getLyricFromStream(fs.createReadStream(arguments[0]), arguments[1]);
		}

		if (arguments[0] instanceof stream) {
			return getLyricFromStream(arguments[0], arguments[1]);
		}

		if (arguments[0] instanceof Buffer) {
			return getLyricFromBuffer(arguments[0], arguments[1]);
		}
	}

	static getHash() {
		if (arguments.length < 1) throw new Error("Wrong arguments!");

		if (typeof arguments[0] === 'string') {
			return getHashFromStream(fs.createReadStream(arguments[0]));
		}

		if (arguments[0] instanceof stream) {
			return getHashFromStream(arguments[0]);
		}

		if (arguments[0] instanceof Buffer) {
			return getHashFromBuffer(arguments[0]);
		}
	}
}

export default Alsong;