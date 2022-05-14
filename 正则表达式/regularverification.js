const numberReg = /^-?[1-9][0-9]?.?[0-9]*$/
const intReg = /^-?[1-9][0-9]*$/
const phoneReg = /^1[0-9]{10,10}$/
const emailReg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
// const pwdReg = /^.{6,16}$/
const pwdReg = /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{1,9}$/
const inviteCodeReg = /^[a-zA-Z0-9]{6,16}$/
const UnifiedCodeReg =  /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/
const websiteReg=/^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})www\.(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/

export default {
	isNumber: function(val) {
		return numberReg.test(val)
	},
	isInt: function(val) {
		return intReg.test(val)
	},
	// 验证手机号
	isPhone: function(val) {
		return phoneReg.test(val)
	},
	// 验证邮箱
	isEmail: function(val) {
		return emailReg.test(val)
	},
	isPwd: function(val) {
		return pwdReg.test(val)
	},
	isInviteCode: function(val) {
		return inviteCodeReg.test(val)
	},
	// 验证统一社会信用代码
	isUnifiedCode: function(val) {
		return UnifiedCodeReg.test(val)
	},
	// 网址校验
	iswebsite:function(val){
		return websiteReg.test(val)
	},
	
	validate: function(data, rules) {
		let res = { isOk: true, errmsg: '' }
		if (!rules || !rules.length) {
			return res
		}
		for (let rule of rules) {
			// rule: {name:'', type:'', errmsg:'', min:1, max:2, eq:'', required:Boolean, regex:''}
			if (!rule || !rule.name || !rule.type) {
				continue
			}
			
			// 如果值不存在
			if (!data[rule.name]) {
				// 如果是必填项就返回错误提示，required可以作为type是为了不同的type能给用户不同的提示
				if (rule.type === 'required' || rule.required) {
					res = { isOk: false, errmsg: rule.errmsg }
					if (!res.errmsg) {
						res.errmsg = '请正确输入所有数据' //默认提示
					}
					return res
				}
				// 如果不是必填项就跳过
				continue
			}
			switch (rule.type) {
				// required 上面已经判断过了
				case 'equals':
				case 'eq':
					if (data[rule.name] !== data[rule.eqName]) {
						res = { isOk: false, errmsg: rule.errmsg }
					}
				break
				case 'number':
					if (!numberReg.test(data[rule.name])) {
						res = { isOk: false, errmsg: rule.errmsg }
					}
				break
				case 'int':
					if (!intReg.test(data[rule.name])) {
						res = { isOk: false, errmsg: rule.errmsg }
					}
				break
				case 'phone':
					if (!phoneReg.test(data[rule.name])) {
						res = { isOk: false, errmsg: rule.errmsg }
					}
				break
				case 'email':
					if (!emailReg.test(data[rule.name])) {
						res = { isOk: false, errmsg: rule.errmsg }
					}
				break
				case 'pwd':
					if (!pwdReg.test(data[rule.name])) {
						res = { isOk: false, errmsg: rule.errmsg }
					}
				break
				case 'inviteCode':
					if (!inviteCodeReg.test(data[rule.name])) {
						res = { isOk: false, errmsg: rule.errmsg }
					}
				break
				case 'range': // 数字类型的值取值范围
					// {name: 'xxx', type: 'range', min: 6, max: 6, required: true, errmsg: 'xxx'}
					let val = data[rule.name]
					if (val) {
						if (numberReg.test(val)) {
							if (rule.min && val < rule.min) {
								res = { isOk: false, errmsg: rule.errmsg }
							} else if (rule.max && val > rule.max) {
								res = { isOk: false, errmsg: rule.errmsg }
							}
						} else {
							res = { isOk: false, errmsg: rule.errmsg }
						}
					}
				break
				case 'lengthRange': // 字符串长度取值范围
					// {name: 'xxx', type: 'lengthRange', min: 6, max: 6, errmsg: 'xxx'}
					let le = data[rule.name] ? data[rule.name].length : 0
					if (rule.min && le < rule.min) {
						res = { isOk: false, errmsg: rule.errmsg }
					} else if (rule.max && le > rule.max) {
						res = { isOk: false, errmsg: rule.errmsg }
					}
				break
				case 'regex': // 自定义正则表达式
					// {name: 'xxx', type: 'regex', regex: /^1[0-9]{10,10}$/, errmsg: 'xxx'}
					if (rule.regex && !rule.regex.test(data[rule.name])) {
						res = { isOk: false, errmsg: rule.errmsg }
					}
				break
			}
			// 发现任何一个错误就立即返回，后面的不再判断
			if (!res.isOk) {
				if (!res.errmsg) {
					res.errmsg = '请正确输入所有数据' //默认提示
				}
				return res
			}
		}
		return res
	}
}


// 使用方法
// 1.单独使用
// if (!this.$validate.isPhone(要验证的手机号)) {
//   uni.showToast({
//     icon: 'none',
//     title: '请输入正确的手机号'
//   })
// }

// 2.验证整个表单
// let loginRules = [
//   {name: 'tel', required: true, type: 'phone', errmsg: '请输入正确的手机号'},
//   {name: 'pwd', type: 'required', errmsg: '请输入密码'},
//   {name: 'pwd', type: 'pwd', errmsg: '密码须是6～16位字符'},
//   {name: 'pwd2', type: 'eq', eqName: 'pwd', required: true, errmsg: '两次输入密码不一致'},
//   {name: 'telCode', type: 'required', errmsg: '请输入验证码'},
//   {name: 'telCode', type: 'lengthRange', min: 6, max: 6, errmsg: '请正确输入验证码'}
// ]
// let valLoginRes = this.$validate.validate(this.userInfo, loginRules)
// if (!valLoginRes.isOk) {
//   uni.showToast({
//     icon: 'none',
//     title: valLoginRes.errmsg
//   })
//   return false
// }