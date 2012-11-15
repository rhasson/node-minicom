/*
* handle state changes based on input command and return codes
* @state: current state object
* @cmd: issued command
* @code: return code for the issued command
* @data: array of data returned if any
* return:
*		@obj: object with the updated state and combined data object
*/

var res_codes = require('./codes').response_codes;

exports.handleState = function(state, cmd, code, data) {
console.log(state, cmd, code, data)
	var obj= {
		cmd: cmd,
		code: code,
		data: data
	};

	state.previous = state.current;
	if (!code && data.length) {
		state.current = 'DATA_RECEIVING';
		return {state: state, data: obj};
	} else if (code && cmd) {
		if (cmd.match(/^ATDT/i)) {
			switch (code) {
				case 'OK':
					state.current = 'CALL_CALLING';
					break;
				case 'RING':
					state.current = 'CALL_RINGING';
					break;
				case 'CONNECT':
					state.current = 'CALL_CONNECTED';
					break;
				case 'ERROR':
					state.current = 'CALL_FAILED';
					break;
				case 'NO CARRIER':
					state.current = 'CALL_NO_LINE';
					break;
				case 'BUSY':
					state.current = 'CALL_BUSY';
					break;
				default:
					state.current = 'CALL_UNKNOWN';
			}
		} else if (cmd.match(/^ATA/i)) {
			switch (code) {
				case 'OK':
					state.current = 'ANSWER_SUCCESS';
					break;
				case 'ERROR':
					state.current = 'ANSWER_FAILED';
					break;
				default:
					state.current = 'ANSWER_UNKNOWN';
			}
		} else if (cmd.match(/^ATH/i)) {
			switch (code) {
				case 'OK':
					state.current = 'HANGUP_SUCCESS';
					break;
				case 'ERROR':
					state.current = 'HANGUP_FAILED';
					break;
				default:
					state.current = 'HANGUP_UNKNOWN';
			}
		}
		return {state: state, data: obj};
	} else if (code && data.length === 0 && !cmd) {
		switch (code) {
			case 'RING':
				state.current = 'CALL_RINGING';
				break;
			default:
				state.current = 'UNKNON_'+code;
		}
		return {state: state, data: obj};
	}
}
