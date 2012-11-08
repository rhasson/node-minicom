exports.respose_codes = {
	CONN: /^CONNECT$/,
	NO_CARRIER: /^NO CARRIER$/,
	BUSY: /^BUSY$/,
	ERROR: /^ERROR$/,
	OK: /^OK$/,
}

exports.cmd = {
	AT: "AT",
	MODEL: "+GMM",
	MANUFACTURER: "+GMI",
	FIRMWARE: "+GMR",
	INIT: {
		S7: 15,
		S0: 0,
		L: 1,
		M: 0,
		V: 1,
		X: 4,
		E: 0,
		Q: 0
	},
	RESET: "Z",
	INFO: {
		base: "I",
		model: 4,
		firmware: 3,
		count: 9
	},
	ANSWER: "A",
	HANGUP: "H",
	DIAL: "DT"
}
