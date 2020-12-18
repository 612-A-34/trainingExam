import crypto from 'crypto-js';

// 公共方法

// 加密身份证号
const formatIdcard = idcard => {
	if(idcard.length == 15){
		return idcard.replace(/(\d{6})\d{6}(\d{3})/, "$1******$2")
	} else {
		return idcard.replace(/(\d{5})\d{6}(\d{6})/, "$1******$2")
	}
}

// 加密手机号
const formatPhone = phone => {
	const reg= /(\d{3})\d{4}(\d{4})/
	return phone.replace(reg, "$1****$2")
}

// base64 替换换行符
const baseReplace = imgUrl => {
	return imgUrl.replace(/[\r\n]/g, "")
}

/**
 * @desc 敏感信息加密
 * @param {string} str
 * @return {string}
 */
export const aesEncryto = (str, keys) => {
	const key = crypto.enc.Utf8.parse(keys);
	const cipher = crypto.AES.encrypt(str, key, {
		mode: crypto.mode.ECB,
		padding: crypto.pad.Pkcs7
	});
	return cipher.ciphertext.toString(crypto.enc.Base64);
}

export {
	formatIdcard,
	formatPhone,
	baseReplace
}