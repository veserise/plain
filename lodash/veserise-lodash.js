var veserise = function () {

	/**
	 * chunk
	 * @param ary {Array}
	 * @param size {Number}
	 * @return  {Array}
	 *
	 *@example
	 * chunk([1,2,3,4] , 3)
	 * chunk([1,2,3,4])
	*/
	function chunk(ary, size = 1){
		if ( size == 1 ) return ary
		var result  = [] , i = 0
		while (i < size){
			result.push(ary.shift())
			i++
		}
		return [result, ary]
	}

	/**
	 * compact
	 * @param ary {Array}
	 * @return  {Array}
	 *
	 *@example
	 * compact([1,2,3,4])
	 * compact(['1','2','3','4'])
	*/
	function compact(ary){
		 return ary.filter(it => it)
	}

	/**
	 * compact
	 * @param ary {Array}
	 * @param value {Numbers}
	 * @return  {Array}
	 *
	 *@example
	 * compact([1,2,3],1,[2,3])
	 * compact(['1','2','3','4'],[[3]])
	*/
	function concat ( ary , ...value){
		var result = []
		for (var i = 0; i < ary.length; i++) {
			result.push(ary[i])
		}
		result.push(...value)
		return result
	}

	/**
	 * difference
	 * @param ary {Array}
	 * @param value {Numbers}
	 * @return  {Array}
	 *
	 *@example
	 * difference([1,2,3],[1],[2,3])
	 * difference(['1','2','3','4'],[3])
	*/
	function difference( ary, ...value){
		var result = [] , jum = []
		for (var i = 0; i < value.length; i++) {
			for (var j = 0; j < value[i].length; j++) {
				result.push(value[i][j])
			}
		}

		for (var i = 0; i < ary.length; i++) {
			if ( !(result.includes(ary[i])) ){
				jum.push(ary[i])
			}
		}
		return jum
	}

	/**
	 * differenceBy
	 * @param ary {Array}
	 * @param value {Numbers}
	 * @return  {Array}
	 *
	 *@example
	 * differenceBy([[1,2,3],[1],[2,3]],f())
	 * differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x')
	*/
	function differenceBy(ary, ...values){

	    if (Array.isArray(values[values.length - 1])) {
	        return difference(ary, ...values)
	    }
	    var val = values.reduce((res, cur) => {
	        return res.concat(cur)
	    })
		var itera = last(val) , func 
	    if (typeof itera == 'string') {
	        func = obj => obj[itera]
	    }
	    if (typeof itera == 'function') {
	        func = obj => itera(obj)
	    }
	    val = val.map(func)

	    return ary.filter(item => !val.includes(func(item)))
	}



	function drop(ary, n = 1){
		if( ary.length == 0 ) return undefined
		var result = []
		for (var i = n; i < ary.length; i++) {
			result.push(ary[i])
		}
		return result
	}

	function dropRight(ary , n = 1){
		if( ary.length == 0 ) return undefined
		var result = []
		for (var i = 0; i < ary.length - n; i++) {
			result.push(ary[i])
		}
		return result
	}


	/**
	 * fill
	 * @param ary {Array} 
	 * @return  {Array} 
	*/
	function fill(ary, value, start = 0, end = ary.length){
		var res = []
		for (var i = 0; i < ary.length; i++) {
			if (i >= start && i < end ) {
				ary[i] = value
			}
			res.push(ary[i])
		}
		return res
	}

	/**
	 * findIndex
	 * @param ary {Array} 
	 * @return  {number} 
	*/
	function findIndex(ary, pre  = _.identity, fromIndex = 0){

		for (var i = fromIndex; i < ary.length; i++) {
			if( Array.isArray(pre) ){
				if( ary[i][pre[0]] == pre[1] ){
					return i
				}
			}

			if( typeof pre == 'string' ){
				if( ary[i][pre] ){
					return i
				}

			} 
			
			if( typeof pre == 'function'){
				if( pre(ary[i]) ){
					return i
				}
			}

			if( typeof pre == 'object'){
			 	var flag = true
			 	for (var key in pre) {
			 		if( pre[key] != ary[i][key] || ary[i][key] == undefined){
			 			flag = false
			 		}
			 	}
			 	if(flag) return i
			}
		}
		return -1
	}

	/**
	 * findLastIndex
	 * @param ary {Array} 
	 * @return  {number} 
	*/
	function findLastIndex(ary, pre  = _.identity, fromIndex = ary.length-1){

		for (var i = fromIndex; i >= 0 ; i--) {
			if( Array.isArray(pre) ){
				if( ary[i][pre[0]] == pre[1] ){
					return i
				}
			}

			if( typeof pre == 'string' ){
				if( ary[i][pre] != undefined){
					return fromIndex - i
				}

			} 
			
			if( typeof pre == 'function'){
				if( pre(ary[i]) ){
					return i
				}
			}

			if( typeof pre == 'object'){
			 	var flag = true
			 	for (var key in pre) {
			 		if( pre[key] != ary[i][key] || ary[i][key] == undefined){
			 			flag = false
			 			break
			 		}
			 	}
			 	if(flag) return i
			}
		}
		return -1
	}


	/**
	 * flatten
	 * @param ary {[,[,[,[]]]]}
	 * @return  {[]}
	*/
	function flatten(ary){
		var result = []
		for (var i in ary ) {
			if( Array.isArray(ary[i]) ){
				result.push(...ary[i])
			}else{
				result.push(ary[i])
			}
		}
		return result
	}

    /**
	 * flattenDeep
	 * @param ary {[,[,[,[]]]]}
	 * @return  {[]}
	*/
	function flattenDeep(ary){
		var str = ary.toString().split(",")
		var result = []
		for (var i = 0; i < str.length; i++) {
			result.push(+str[i])
		}
		return result
	}

	/**
	 * flattenDepth
	 * @param ary {[,[,[,[]]]]}
	 * @return  {[]}
	*/
	function flattenDepth(ary , dept = 1 ){

		var result = ary
		while ( dept > 0 ){
			result = flatten(result)
			dept--
		}
		
		return result
	}

	/**
	 * fromPairs
	 * @param ary {[,[,[,[]]]]}
	 * @return  {[]}
	*/
	function fromPairs(ary){
		
		var result = {}
		for (var i = 0; i < ary.length; i++) {
			result[ary[i][0]] = ary[i][1]
		}
		
		return result
	}


	/**
	 * flip
	 * @param f {f}
	 * @return  {[]}
	*/
	function flip (f){
		return function(...args){
			return f(...args.reverse() )
		}
	}

	/**
	 * reverse
	 * @param ary {Array} 
	 * @return  {Array} 
	*/
	function reverse(ary){
		var result = []
		for (var i = ary.length - 1; i >= 0; i--) {
			result.push(ary[i])
		}
		return result
	}

	/**
	 * head
	 * @param ary {Array} 
	 * @return  {} return the first data in array 
	*/
	function head(ary){
		if( ary.length == 0 ) return undefined
		return ary[0]
	}


	/**
	 * indexOf
	 * @param ary {Array} 
	 * @param value {Number} 
	 * @return {Number} return the value' position in array 
	*/
	function indexOf(ary, value , fromIndex = 0){
		if( ary.length == 0 ) return undefined
		for (var i = fromIndex; i < ary.length; i++) {
			if ( ary[i] == value){
				return i
			}else if (ary[i] != ary[i] && value != value) {
            	return i
        	}
		}
		return -1
	}

	/**
	 * initial
	 * @param ary {Array} 
	 * @return {Array} 
	*/
	function initial(ary){
		return ary.slice(0, ary.length - 1 )
	}

	/**
	 * intersection
	 * @param ary {Array} 
	 * @return {Number} the last data in array
 	*/
	function intersection(...arys){
		var res = arys[0].slice()
		for (var i = 1; i < arys.length; i++) {
			res = res.filter(it => arys[i].includes(it))
		}
		return res
	}


	/**
	 * join
	 * @param ary {Array} 
	 * @return {string} 
 	*/
	function join(ary, string = ","){
		var str = ''
		for (var i = 0; i < ary.length; i++) {
			if(i == ary.length - 1){
				str +=''+ ary[i]
			}else{
				str += '' + ary[i] +''+ string
			}
		}
		return str
	}

	/**
	 * last
	 * @param ary {Array} 
	 * @return {} 
 	*/
	function last(ary){
		if(ary.length == 0) return null
		return ary[ary.length - 1]
	}

	/**
	 * lastIndexOf
	 * @param ary {Array} 
	 * @param value {Number} 
	 * @return {Number} return the value' position in array 
	*/
	function lastIndexOf(ary, value , fromIndex = ary.length-1){
		if( ary.length == 0 ) return undefined
		for (var i = fromIndex; i >= 0; i--) {
			if ( ary[i] == value){
				return i
			}else if (ary[i] != ary[i] && value != value) {
            	return i
        	}
		}
		return -1
	}

	/**
	 * nth
	 * @param ary {Array} 
	 * @param value {Number} 
	 * @return {Number} return the value' position in array 
	*/
	function nth(ary, n = 0){
		if( ary.length == 0 ) return null
		if( n >= 0 && n < ary.length) return ary[n]
		else return ary[-n]
	}
	
	/**
	 * pull
	 * @param ary {Array} 
	 * @param value {Number} 
	 * @return {Number} return the value' position in array 
	*/
	function pull(ary, ...values){
		var result = [] , map = {}
		for (var i = 0; i < values.length; i++) {
			map[values[i]] = i
		}
		for (var j = 0; j < ary.length; j++) {
			if ( !(ary[j] in map) ){
				result.push(ary[j])
			}
		}
		ary = result
		return ary
	}

	/**
	 * reduce
	 * @param ary {Array} 
	 * @return {} 
 	*/
	function reduce(ary, calc, initial = 0){
		var i = 0
		for ( i in ary ) {
			initial = calc(initial ,ary[i], i)
		}
		return initial
	}

	/**
	 * reduce
	 * @param ary {Array} 
	 * @return {} 
 	*/
	function filter(ary, test){
		var result = []
		if( typeof test == 'function'){
			for (var i = 0; i < ary.length; i++) {
				if ( test(ary[i], i, ary) ){
	                 result.push(ary[i])
				}
			}
		}
		if( typeof test == 'string'){

		}
		
		return result
	}

	/**
	 * slice
	 * @param ary {Array} 
	 * @param start {Number} 
	 * @param end {Number} 
	 * @return {Array} return the data in range of [start, end) in array
 	*/
	function slice(ary, start, end){
		var result = []
		for (var i = start; i < end; i++) {
			result.push(ary[i])
		}
		return result
	}

	/**
	 * sortedIndex
	 * @param ary {Array} 
	 * @return {Array} 
 	*/
	function sortedIndex( ary, value){
		var end = ary.length -1 , i = 0 
		if( value > ary[end] ) return end + 1
		while( i <= end){
			var mid = Math.floor( (end + i) / 2)
			var m = ary[mid]
			if( value >= ary[i] && value <= ary[end] && (end - i) <= 1){
				return i + 1

			}else if( value < m ){
				end = mid

			}else if( value > m ){
				i = mid

			}else{
				return i + 1
			}
		}
		return i + 1

	}


	/**
	 * union
	 * @param ary {Array} 
	 * @return {Array} 
 	*/
	function union(...arys){
		return Array.from(new Set(flatten(arys)))
	}

	/**
	 * unionBy
	 * @param ary {Array} 
	 * @return {Array} 
 	*/
	function unionBy(...arys){
		var iteratee = last(arys)
		var ary = flatten(arys.slice(0,arys.length - 1))
		return uniqBy(ary, iteratee)
	}

	/**
	 * uniq
	 * @param arg {Array}
	 * @return  {}
	*/
	function uniq (ary){
		return Array.from(new Set(ary))
	}
	
	/**
	 * uniqBy
	 * @param arg {Array}
	 * @return  {}
	*/
	function uniqBy (ary, iteratee = _.identity){
		var res = [] , map ={}

		if(typeof iteratee == 'string'){
			ary.forEach(it => {
				var val = it[iteratee]
				if( !(val in map) ){
					map[val] = val
					res.push(it)
				}
			})
		}else{
			ary.forEach(it => {
				var val = iteratee(it)
				if( !(val in map) ){
					map[val] = it
					res.push(it)
				}
			})
		}

		return res
	}

	/**
	 * zip
	 * @param ary {Array} 
	 * @return {Array} 
 	*/
	function zip(...arys){
 		var maxlen = arys.reduce((max, arr) => Math.max(max, arr.length), 0)
    	var res = Array(maxlen).fill(0).map(it => Array(arys.length))

		for (var  i = 0; i < maxlen; i++) {
			for (var  j = 0; j < arys.length; j++) {
				res[i][j] = arys[j][i]
			}
		}

		return res
	}


	/**
	 * unzip
	 * @param ary {Array} 
	 * @return {Array} 
 	*/
	function unzip(ary){
		var res = []
		for (var i = 0; i < ary[0].length; i++) {
	        res[i] = []
	        for (var j = 0; j < ary.length; j++) {
	            res[i][j] = ary[j][i]
	        }
	    }

		return res
	}

	/**
	 * unzipWith
	 * @param ary {Array} 
	 * @return {Array} 
 	*/
	function unzipWith(ary, iteratee = _.identity ){
 		var res = [] , re = []
		for (var i = 0; i < ary[0].length; i++) {
	        res[i] = []
	        for (var j = 0; j < ary.length; j++) {
	            res[i][j] = ary[j][i]
	        }
	        re.push(res[i].reduce(iteratee))
	    }

		return res
	}

	/**
	 * without
	 * @param ary {Array} 
	 * @return {Array} 
 	*/
	function without(ary, ...values ){
		var res = []
 		for (var i = 0; i < ary.length; i++) {
 			if( values.includes( ary[i] ) == false ){
 				res.push( ary[i] )
 			}
 		}

		return res
	}

	/**
	 * xor
	 * @param ary {Array} 
	 * @return {Array} 
 	*/
	function xor(...arys){
		var res = [], map = {}, ins = []
		var res = flatten(arys)

		for (var i = 0; i < res.length; i++) {
			if( res.lastIndexOf(res[i]) == i ){
				if( !(res[i] in map)  ){
					ins.push(res[i])
				}
			}else{
				map[res[i]] = 1
			}
		}
		return ins
	}

	/**
	 * forEach
	 * @param ary {Array} 
	 * @return {Array} 
 	*/
	function forEach( ary, action){
		for (var i = 0; i < ary.length; i++) {
			action(ary[i])
		}
		return ary
	}

	/**
	 * map
	 * @param ary {Array} 
	 * @param key {}
	 * @return  {[]} 
	*/
	function map ( collection , iteratee = veserise.identity ){
		var result = []
		iteratee = iteratee(iteratee)

	    if ( Array.isArray(collection) ) {
	        for (var i = 0; i < collection.length; i++) {
	            result.push(iteratee(collection[i], i, collection))
	        }
	    } else {
	        for (var keys in collection) {
	            result.push(iteratee(collection[keys], keys, collection))
	        }
	    }

	    return result
	}



	/**
	 * keyBy
	 * @param ary {Array} 
	 * @param key {}
	 * @return  {[]} 
	*/
	function keyBy (ary, key){
		var result = {}
		if( typeof key == 'string'){
			ary.forEach(item =>{
				result[ item[key] ] = item
			})
		}
		if( typeof key == 'function'){
			ary.forEach(item =>{
				result[ key(item) ] = item
			})
		}
		
		return result
	}

	/**
	 * hasOdd
	 * @param ary {Array} 
	 * @param arg {}
	 * @return  {boolean} the odd data exsited in ary
	*/
	function hasOdd (ary){
		var has = false
		forEach(ary, function(it) {
			if (it % 2){
				has = true
				return false
			}
		})
		return has
	}

	/**
	 * before
	 * @param f {function} 
	 * @param n {Number}
	 * @return  {} return the data range of [0 , n)
	*/
	function before (n , func){
		var c = 0 , last 
		return function(...args){
			c++
			if(c < n){
				return last = func(...args)
			}else{
				return  last
			}
		}
	}

	/**
	 * after
	 * @param f {function} 
	 * @param n {Number}
	 * @return  {} return the data range of [n,Infinity)
	*/
	function after (n , func){
		var c = 0
		return function(...args){
			c++
			if(c < n){
				return func()
			}else{
				return func(...args)
			}
		}
	}

	/**
	 * ary
	 * @param f {function} slice the data range of [0 , n) in array
	 * @param n {Number}
	 * @return  {}
	*/
	function ary (f , n = f.length){
		return function(...args){
			return f(...args.slice(0, n) )
		}
	}



	/**
	 * unary
	 * @param f {function} slice the first data in array
	 * @param arg {}
	 * @return  {}
	*/
	function unary (f){
		return ary(f, 1)
	}

	/**
	 * bind
	 * @param f {function} remain the first data 
	 * @param arg {}
	 * @return  {}
	*/
	function bind (f){
		var args = Array.from(arguments)
		return function(){
			var arg = Array.from(arguments)
			return f.apply(null, args.concat(arg))
		}
	}

	/**
	 * spread
	 * @param f {function} spread out the data 
	 * @param arg {}
	 * @return  {}
	*/
	function spread (f) {
		return function(ary){
			return f.apply(null, ary)
		}
	}

	/**
	 * memoize
	 * @param f {function} remain the data of input
	 * @param arg {}
	 * @return  {}
	 *
	*/
	function memoize (f) {
		var map = {}
		return function(arg){
			if(arg in map){
				return map[arg]
			}else{
				map[arg] = f(arg)
				return map[arg]
			}
		}
	}

	/**
	 * curry
	 * @param f {function}
	 * @return  {f}
	 *
	*/
	function curry ( f , len = f.length ) { 
		return function(...args){
			if( args.length < len  ){
				return curry(f.bind(null,...args), len - args.length )
			}else{
				return f(...args)
			}
		}
	}

	/**
	 * every
	 * @param ary {Array}
	 * @param test {function}
	 * @return  {boolean}
	*/
	function every(ary, test){
		for (var i = 0; i < ary.length; i++) {
			if( ! test(ary[i], i ,ary) ){
				return false
			}
		}
		return true
	}

	/**
	 * some
	 * @param ary {Array}
	 * @param test {function}
	 * @return  {boolean}
	*/
	function some (ary, test){
		for (var i = 0; i < ary.length; i++) {
			if( test(ary[i], i , ary) ){
				return true
			}
		}
		return false
	}

	/**
	 * negate
	 * @param f {function}
	 * @param ...arge {Numbers}
	 * @return  {function}
	 *
	 *@example
	 * f = isOdd()
	 * f = isEven()
	*/
	function negate (f){
		return function(...arg){
			return !f(...arg)
		}
	}

	/**
	 * isArguments
	 * @param val {object/ number/fucntion / string }
	 * @return  {true / false}
	*/
	function isArguments(value){
        return Object.prototype.toString.call(value) === '[object Arguments]'
    }

	/**
	 * isArray
	 * @param val {object/ number/fucntion / string }
	 * @return  {true / false}
	*/
	function isArray(value){
        return Object.prototype.toString.call(value) === '[object Array]'
    }

    /**
	 * isArrayLike
	 * @param val {object/ number/fucntion / string }
	 * @return  {true / false}
	*/
	function isArrayLike(value){
		if (typeof value != 'function' && value.length >= 0 && value.length <= Number.MAX_SAFE_INTEGER) return true
        else return false
    }

    /**
	 * isBoolean
	 * @param val {object/ number/fucntion / string }
	 * @return  {true / false}
	*/
	function isBoolean(value){
		return Object.prototype.toString.call(value) == '[object Boolean]'
    }

    /**
	 * isDate
	 * @param val {object/ number/fucntion / string }
	 * @return  {true / false}
	*/
	function isDate(value){
        return Object.prototype.toString.call(value) == '[object Date]'
    }

    /**
	 * isDate
	 * @param val {object/ number/fucntion / string }
	 * @return  {true / false}
	*/
	function isDate(value){
        return Object.prototype.toString.call(value) == '[object Date]'
    }

    /**
	 * isElement
	 * @param str {object/ number/fucntion / string }
	 * @return  {true / false}
	*/
	function isElement (value) {
		return Object.prototype.toString.call(value) == '[object HTMLBodyElement]'
	}

	/**
	 * isEmpty
	 * @param str {object/ number/fucntion / string }
	 * @return  {true / false}
	*/
	function isEmpty (value) {
		if(value == true || value == false || value == null) return true
		if( typeof value == 'object' && 
			(value == '' || value == null || value.length == 0 || value.size == 0 || value instanceof Object) 
			) return true
		return false
	}

	/**
	 * isEqual
	 * @param str {object/ number/fucntion / string }
	 * @return  {true / false}
	*/
	function isEqual (value , other ) {
		if( value === other) return true
		if( typeof value == typeof other){
			for (var key in value) {
				if( !( key in other ) || value[key] != other[key]){
					return false
				}
			}
			for (var key in other) {
				if( !( key in value ) || value[key] != other[key]){
					return false
				}
			}
			return true
		}
		return false
	}


	/**
	 * isError
	 * @param value {}
	 * @return  {true / false}
	*/
	function isError (value ) {
		return Object.prototype.toString.call(value) == '[object Error]'
	}


	/**
	 * isObject
	 * @param value {object/ number/fucntion }
	 * @return  {true / false}
	*/
	function isObject(value) {
      var type = typeof value
      return value != null && (type == 'object' || type == 'function')
    }

    /**
	 * instanof
	 * @param value fucntion }
	 * @return  {true / false}
	*/
	function instanof(ary , value) {
      return value != null && (type == 'object' || type == 'function')
    }


	/**
	 * isFinite
	 * @param value {}
	 * @return  {true / false}
	*/
	function isFinite (value ) {
		return Number.isFinite(value)
	}

	/**
	 * isFunction
	 * @param value {}
	 * @return  {true / false}
	*/
	function isFunction (value ) {
		return Object.prototype.toString.call(value) == '[object Function]'
	}


	/**
	 * isInteger
	 * @param value {}
	 * @return  {true / false}
	*/
	function isInteger ( value ) {
		return Number.isInteger(value)
	}

	/**
	 * isLength
	 * @param value {}
	 * @return  {true / false}
	*/
	function isLength ( value ) {
		return ToLength(value)
	}

	/**
	 * toLength
	 * @param value {}
	 * @return  {true / false}
	*/
	// function toLength ( value ) {
	// 	if( isArrayLike(value) ){

	// 	}
	// 	return  ToLength(value)
	// }

	/**
	 * isMap
	 * @param value {}
	 * @return  {true / false}
	*/
	function isMap ( value ) {
		return Object.prototype.toString.call(value) == '[object Map]'
	}


	/**
	 * isMatch
	 * @param obj,source {}
	 * @return  {true / false}
	*/
	function isMatch (obj,  source ) {
		if(obj === source ) return true
		for(var key in source ){
			if( typeof source[key] == 'object' && source[key] != null){
				if(! isMatch(obj[key], source(key))) return false
			}else{
				if( source[key] != obj[key]) return false
			}
		}
		return true
	}

	/**
	 * min
	 * @param array {Array}
	 * @return  {}
	*/
	function min (array) {
		if( array.length == 0 ) return undefined
		var min = Infinity
		array.map(item=> {
			if( min > item ){
				min = item
			}
		})
		return min
	}

	/**
	 * max
	 * @param array {Array }
	 * @return  {}
	*/
	function max (array) {
		if( array.length == 0 ) return undefined
		var max = -Infinity
		array.map(item=> {
			if( max < item ){
				max = item
			}
		})
		return max
	}

	/**
	 * add
	 * @param array {Array }
	 * @return  {}
	*/
	function add (a, b ) {
		return a + b
	}



	/**
	 * run
	 * @param ary {[,[,[,[]]]]}
	 * @return  {[]}
	 *
	 *@example
	 * run(add, [1,2])
	*/
	function run(f , ...arg){
		return f(...arg)
	}

	/**
	 * forOwn
	 * @param obj {Object}
	 *
	 *@example
	 * forOwn({a:1,b:2},(val , key ,obj))
	*/
	function forOwn(obj , inter){
		var hasOwn = Object.prototype.hasOwnProperty
		for(var key in obj){
			if( hasOwn.call(obj, key)){
				inter(obj[key], key, obj)
			}
		}
	}

	/**
	 * padEnd
	 * @param obj {Object}
	 *
	 *@example
	 * forOwn({a:1,b:2},(val , key ,obj))
	*/
	function padEnd(obj , len){
		
	}



	/**
	 * toArray
	 * @param ary {}
	 * @return {[]}
	 *
	 *@example
	 * toArray({"s": 1, "d": 2})
	 * toArray(1)
	 * toArray("a,b,c")
	 * toArray(['6', '8', '10'])
	*/
	function toArray (ary){
		if( typeof ary == 'string'){
			var res = ary.split('')
			var jum = []
			for (var i = 0; i < res.length; i++) {
				jum.push(res[i])
			}

			return jum
		}

		if( typeof ary == 'object'){
			var res = []
			for (var key in ary) {
				res.push(ary[key])
			}
			return res
		}

		if ( ary == null ) return []
		return Array.from(ary)
	}

	/**
	 * matches
	 * @param source {}
	 * @return {[]}
	 *
	*/
	function matches (source){
		return function(obj){
			return isMatch(obj, source)
		}
	}

	
	// function iteratee(){
	// 	if(typeof this == 'string'){
	// 		return this
	// 	}else{
	// 		return function itera(it){
	// 			return this(it)
	// 		}
	// 	}
	// }


	return	{
		chunk,
		compact,
		difference,
		differenceBy,
		drop,
		dropRight,
		fill,
		findIndex,
		findLastIndex,
		flatten,
		flattenDeep,
		flattenDepth,
		fromPairs,
		head,
		last,
		indexOf,
		lastIndexOf,
		initial,
		intersection,
		nth,
		join,
		flip,
		pull,
		concat,
		reverse,
		reduce,
		filter,
		slice,
		sortedIndex,
		union,
		unionBy,
		forEach,
		uniq,
		uniqBy,
		without,
		xor,


		map,
		keyBy,
		spread,
		hasOdd,
		before,
		after,
		ary,
		unary,
		bind,
		memoize,
		curry,
		every,
		some,
		negate,
		zip,
		unzip,
		unzipWith,



		isObject,
		isArray,
		isArrayLike,
		isArguments,
		isBoolean,
		isDate,
		isElement,
		isEmpty,
		isEqual,
		isError,
		isFinite,
		isFunction,
		isInteger,
		//isLength,
		isMap,
		isMatch,




		toArray,
		min,
		max,
		add,
		matches
		//iteratee
		//isString
	}

}()