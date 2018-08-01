// var describe = function (str, func) {
//   var count = 0
//   return (str, func) => {
//     console.log(count + str)
//     count++
//     func()
//   }
// }()
// function describe (str, func) {
//   var res = ''
//   var caller = describe.caller
//   while (caller) {
//     res += ' '
//     caller = caller.caller
//   }
//   console.log(res + str)
//   func()
// }

// describe('1', () => {
//   describe('2', () => {
//     describe('3', () => {})
//     describe('3', () => {})
//   })
// })

var MyMap = function () {
  function MyMap (iter) {
    this.entries = []

    if (iter) {
      for (let ary of iter) {
        this.set(ary[0], ary[1])
      }
    }
  }

  MyMap.prototype = {
    get size() {
      return this.entries.length
    },

    clear: function () {
      this.entries = []
    },

    delete: function (key) {
      let ary = this.entries
      for (let i = 0; i < ary.length; i++) {
        if (isEqual(ary[i][0], key)) {
          this.entries.splice(i, 1)
          return true
        }
      }
      return false
    },

    get: function (key) {
      for (let item of this.entries) {
        if (isEqual(item[0], key)) return item[1]
      }
      return undefined
    },

    has: function (key) {
      for (let item of this.entries) {
        if (isEqual(item[0], key)) return true
      }
      return false
    },

    set: function (key, val) {
      for (let item of this.entries) {
        if (isEqual(item[0], key)) {
          item[1] = val
          return
        }
      }
      this.entries.push([key, val]) 
    },
  }

  function isEqual (self, other) {
    if (self === other) return true
    if (self !== self && other !== other) return true
    return  false
  }

  return MyMap
}()

var MySet = function () {
  function MySet (iter) {
    this.entries = []

    if (iter) {
      for (let key of iter) {
        this.add(key)
      }
    }
  }

  MySet.prototype = {
    get size() {
      return this.entries.length
    },

    clear: function () {
      this.entries = []
    },

    delete: function (key) {
      let ary = this.entries
      for (let i = 0; i < ary.length; i++) {
        if (isEqual(ary[i], key)) {
          this.entries.splice(i, 1)
          return true
        }
      }
      return false
    },

    has: function (key) {
      for (let item of this.entries) {
        if (isEqual(item, key)) return true
      }
      return false
    },

    add: function (key) {
      for (let item of this.entries) {
        if (isEqual(item, key)) return
      }
      this.entries.push(key) 
    }
  }

  function isEqual (self, other) {
    if (self === other) return true
    if (self !== self && other !== other) return true
    return  false
  }

  return MySet
}()

var MyArr = function () {
  MyArr = function (...args) {
    this.length = 0
    for (let val of args) this.push(val)
  }

  function addArray (pos, array, t) {
    // this function won't move other index of array
    for (let count = 0; count < array.length; pos++, count++) {
      t[pos] = array[count]
    }
    return pos
  }

  /**
   * @param  {number} start start index
   * @param  {number} deleteCount count
   * @param  {Object} t thisArg
   * @return {MyArr} return the deleted array
   */
  function _delete (start = 0, deleteCount = 1, t) {
    let res = t.slice(start, start + deleteCount)
    let len = t.length - deleteCount < start ? start : t.length - deleteCount
    let end = t.slice(start + deleteCount)
    let pos = start

    pos = addArray(pos, end, t)
    for (; pos < t.length; pos++) delete t[pos]
    
    t.length = len < 0 ? 0 : len
    return res
  }

  /**
   * @param  {number} start start index
   * @param  {*} value Array or others
   * @param  {Object} t thisArg
   * @param  {boolean} tag if true, add the items in array
   * @return {number} return the length of the array
   */
  function _add (start, value, t, tag = false) {
    // add items in array
    if (tag && isArray(value)) {
      let len = t.length + value.length
      let end = t.slice(start)
      let pos = start

      pos = addArray(pos, value, t)
      pos = addArray(pos, end, t)

      t.length = len
    // only add one element
    } else {
      for (let i = t.length - 1; i >= start; i--) t[i + 1] = t[i]
      t[start] = value
      t.length++
    }

    return t.length
  }

  function isArray (value) {
    return Object.prototype.toString.call(value) === '[object Array]' || value instanceof MyArr
  }

  MyArr.prototype = {
    push: function (val) {
      return _add(this.length, val, this)
    },

    pop: function () {
      return _delete(this.length - 1, 1, this)[0]
    },
    
    unshift: function (val) {
      return _add(0, val, this)
    },

    shift: function () {
      return _delete(0, 1, this)[0]
    },

    forEach: function (callback) {
      // TODO: thisArg
      for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this) === false) break
      }
    },

    forEachRight: function (callback) {
      for (let i = this.length - 1; i >= 0; i--) {
        let tag = callback(this[i], i, this)
        if (tag === false) break
      }
    },

    slice: function (begin = 0, end = this.length) {
      // TODO: 负值
      let res = new MyArr()
      for (let i = begin; i < end; i++) {
        if (this[i]) res.push(this[i])
      }
      return res
    },
    
    splice: function (start, deleteCount = 1, ...items) {
      // TODO: 负值
      let res = _delete(start, deleteCount, this)
      _add(start, items, this, true)
      return res
    },

    concat: function (...values) {
      for (let value of values) {
        if (isArray(value)) {
          let ary = new MyArr()
          for (let i = 0; i < value.length; i++) {
            ary.push(value[i])
          }
          _add(this.length, ary, this, true)
        } else {
          _add(this.length, value, this)
        }
      }
      return this
    },

    copyWith: function (target = 0, start = 0, end = this.length) {
      let period = this.slice(start, end)
      addArray(target, period, this)
      return this
    },

    every: function (callback, thisArg) {
      // thisArg
      for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this) === false) return false
      }
      return true
    },

    some: function (callback, thisArg) {
      // thisArg
      for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this) === true) return true
      }
      return false
    },

    fill: function (value, start = 0, end = this.length) {
      if (end > this.length) end = this.length
      for (let i = start; i < end; i++) {
        this[i] = value
      }
      return this
    },

    join: function (separator) {
      let str = ''
      if (this.length === 0) return str
      if (this.length === 1) return str + this[0]

      this.forEach((val, index, ary) => {
        str += val + separator
        return (index + 1) !== ary.length - 1
      })

      return str + this[this.length - 1]
    },

    reverse: function () {
      let denseIndex = new MyArr()
      let len = this.length
      denseIndex.length = this.length

      for (let index in this) {
        if (this.hasOwnProperty(index)) {
          denseIndex[len - 1 - index] = 1
        }
      }
      for (let i = 0; i < len / 2; i++) {
        let temp = this[i]
        this[i] = this[len - 1 - i]
        this[len - 1 - i] = temp
      }
      for (let i = 0; i < len; i++) {
        if (!denseIndex[i]) delete this[i]
      }

      return this
    },

  // prototype end
  }

  return MyArr
}()

var a = new MyArr(1,2,3,4,5,6,7,8,9)
console.log(a)


function initParamBy2 (first, second, i_f, i_s) {
  if (second === undefined) {
    if (first === undefined) second = i_s
    else second = first
    first = i_f
  }
  return [f, s]
}

function swap(arr, a, b) {
  var temp = arr[a]
  arr[a] = arr[b]
  arr[b] = temp
}

function personSort (ary, prop, prop2, start = 0 ,end = ary.length - 1) {
  if (end <= start) return

  var pivotIndex = Math.floor((end - start + 1) * Math.random()) + start
  var pivot = ary[pivotIndex]

  swap(ary, pivotIndex, end)

  for (var i = start - 1, j = start; j <= end; j++) {
    if (ary[j][prop] >= pivot[prop]) {
      if (ary[j][prop] === pivot[prop] && ary[j][prop2] < pivot[prop2]) continue
      i++
      swap(ary, i, j)
    }
  }

  personSort(ary, prop, prop2, start, i - 1)
  personSort(ary, prop, prop2, i + 1, end)

  return ary
}

var o = [
  {
    a: 1,
    b: 5
  },
  {
    a: 2,
    b: 8
  },
  {
    a: 2,
    b: 6
  },
  {
    a: 4,
    b: 8
  },
]

// console.log(personSort(o, 'a', 'b'))

 

function rowHeights (rows) {
  return rows.map(row => row.reduce((max, cell) => Math.max(max, cell.minHeight()), 0))
}

// map 只是用来创建一个长度为 rows[0].length 的数组
function colWidths (rows) {
  return rows[0].map((_, i) => rows.reduce((max, row) => Math.max(max, row[i].minWidth()), 0))
}

function drawTable (rows) {
  var heights = rowHeights(rows)
  var widths = colWidths(rows)

  function drawLine (blocks, lineNo) {
    return blocks.map(block => block[lineNo]).join(' ')
  }

  function drawRow (row, rowNum) {
    var blocks = row.map((cell, colNum) => cell.draw(widths[colNum], heights[rowNum]))
    return blocks[0].map((_, lineNo) => drawLine(blocks, lineNo)).join('\n')
  }

  return rows.map(drawRow).join('\n')
}

function repeat (str, times) {
  var res = ''
  for (var i = 0; i < times; i++) res += str
  return res
}

function TextCell (text) {
  this.text = text.split('\n')
}

TextCell.prototype.minWidth = function () {
  return this.text.reduce((width, line) => Math.max(width, line.length), 0)
}

TextCell.prototype.minHeight = function () {
  return this.text.length
}

TextCell.prototype.draw = function (width, height) {
  var res = []
  for (var i = 0; i < height; i++) {
    var line = this.text[i] || ''
    res.push(line + repeat(' ', width - line.length))
  }
  return res
}

function objectToText (ary) {
  var rows = []
  var map = new Map()
  var len = getLenth(ary)

  ary.forEach(obj => {
    var row = Array(len + 1).fill(new TextCell(''))
    for (var key in obj) {
      var i = getIndex(key)
      row[i] = new TextCell(String(obj[key]))
    }
    rows.push(row)
  })

  function getLenth (ary) {
    return ary.reduce((max, obj) => Math.max(max, Object.keys(obj).length), 0)
  }

  function getIndex (key) {
    if (map.has(key)) {
      return map.get(key)
    }
    else {
      var i = map.size
      map.set(key, i)
      return i
    }
  }

  return rows
}

function StretchCell (inner, width, height) {
  this.inner = inner
  this.width = width
  this.height = height
}

StretchCell.prototype.minWidth = function () {
  return Math.max(this.inner.minWidth(), this.width)
}

StretchCell.prototype.minHeight = function () {
  return Math.max(this.inner.minHeight(), this.height)
}

// var rows = []
// for (var i = 0; i < 5; i++) {
//   var row = []
//   for (var j = 0; j < 5; j++) {
//     if ((j + i) % 2 == 0) {
//       row.push(new TextCell('##'))
//     } else {
//       row.push(new TextCell('  '))
//     }
//   }
//   rows.push(row)
// }

// console.log(drawTable(rows))
// console.log(objectToText([{a:1}, {b: 2, c: 3}]))
// console.log(drawTable(objectToText([{a:'dasdasd'}, {b: 'rea', c: 3}])))
// console.table([{a:1}, {b: 2, c: 3}])

// function Vector (x, y) {
//   this.x = x
//   this.y = y
// }

// Vector.prototype.plus = function (other) {
//   return new Vector(this.x + other.x, this.y + other.y)
// }

// Vector.prototype.minus = function (other) {
//   return new Vector(this.x - other.x, this.y - other.y)
// }

// Object.defineProperty(Vector.prototype, 'length', {
//   get: function () {
//     return Math.sqrt(this.x ** 2 + this.y ** 2).toFixed(2)
//   }
// })

function testLinkedList () {
  var list = new ListNode(1)
  // add(10, list)
  // add(9, list)
  // add(8, list)
  // add(7, list)
  // add(6, list)
  add(5, list)
  add(4, list)
  add(3, list)
  add(2, list)
  // add(1, list)
  return list
}

var list = testLinkedList()
// console.log(sortedListToBST([-10,-3,0,5,9]))

// var kthSmallest = function(root, k) {
//   let arr = []
//   traverse(root)
  
//   return arr[k].val

//   function traverse() {
//     if (node) {
//       traverse(node.left)
//       arr.push(node)
//       traverse(node.right)
//     }
//   }
// };

// // console.log(zigzagLevelOrder([''], 3))

// function createTree() {
//   var tree1 = new TreeLinkNode(0)
//   var tree2 = new TreeLinkNode(3)
//   var tree3 = new TreeLinkNode(6)
//   var tree4 = new TreeLinkNode(2)
//   var tree5 = new TreeLinkNode(4)
//   var tree6 = new TreeLinkNode(6)
//   var tree7 = new TreeLinkNode(7)
//   var tree8 = new TreeNode(7)
//   var tree9 = new TreeNode(2)

//   // appendLeft(tree1, tree2)
//   appendRight(tree1, tree3)
//   // appendLeft(tree2, tree4)
//   // appendRight(tree2, tree5)
//   // appendLeft(tree3, tree6)
//   // appendRight(tree3, tree7)
//   // appendLeft(tree4, tree8)
//   // appendLeft(tree4, tree9)

//   return tree1
// }

// function TreeLinkNode(val) {
//   this.val = val;
//   this.left = this.right = this.next = null;
// }

// var tree = createTree()
// console.log(deleteNode(tree, 6))
