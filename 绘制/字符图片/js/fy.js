const cvs = document.getElementById('canvas')
const cvs2 = document.getElementById('imgdata')
const btn = document.getElementById('btn')
const choose = document.getElementById('choose')
const char = document.getElementsByClassName('char')

// 拿到canvas上下文对象
const ctx = cvs.getContext('2d')
const ctx2 = cvs2.getContext('2d')

const string = "#&@%$w*+o?!;^,. "
const stringArr = string.split('')
// 使用一个img对象来读取图片
const img = new Image
// 设定区域默认宽高
let width = 1000
let height = 600
// canvas 初始宽高
cvs2.width = cvs.width = width
cvs2.height = cvs.height = height
// ---- 准备工作结束

for (let i = 0; i < char.length; i++) {
  // 初始化placeholder
  char[i].placeholder = stringArr[i]
  // 注册input事件
  char[i].oninput = function () {
    let val = char[i].value
    let s = ""
    switch (val.length) {
      case 0:
        s = string[i]
        break;

      case 1:
        s = this.value
        break;

      default:
        alert('只能输入一个字符')
        this.value = ""
        s = string[i]
        break;
    }
    stringArr[i] = this.placeholder = s
  }
}

// 点击btn --> 点击choose
btn.onclick = () => {choose.click()}

// choose 选择文件后  需要读取图片数据
choose.oninput = () => {
  // 创建文件读取对象
  const reader = new FileReader
  // 读取choose选择的图片 并转为base64
  reader.readAsDataURL(choose.files[0])
  // 读取完成后触发load事件  拿到结果
  reader.onload = () => {
    btn.innerText = '请稍后...'
    // 用img接受图片 然后传给canvas分析数据
    img.src = reader.result
  }
}

img.onload = () => {
  btn.innerText = '选择图片'
  // 拿到图片宽高比  传给canvas
  let scale = img.width / img.height
  cvs2.width = cvs.width = scale * height

  // 清空画布
  ctx.clearRect(0, 0, cvs.width, cvs.height)
  ctx2.clearRect(0, 0, cvs2.width, cvs2.height)
  // 把图片绘制在cvs2上分析数据
  ctx2.drawImage(img, 0, 0, cvs2.width, cvs2.height)
  // 拿到分析的数据  数据存在数据对象的data下
  let imgDataArr = ctx2.getImageData(0, 0, cvs2.width, cvs2.height).data
  // 
  
  for (let h = 0; h < cvs.height; h += 6) {
    for (let w = 0; w < cvs.width; w += 4) {
      // 拿到像素区域 index
      let idx = (w + cvs.width * h) * 4
      // 拿到红绿蓝值  用于计算灰度值
      let r = imgDataArr[idx]
      let g = imgDataArr[idx + 1]
      let b = imgDataArr[idx + 2]
      // 计算灰度值
      let gray = getGray(r, g, b)
      // 通过灰度值 计算灰度阶层
      let stairs = getStairs(gray)
      // 利用canvas根据 灰度阶层符号绘制图片
      ctx.fillText(stairs, w, h + 8)
    }
  }
}

function getGray(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

function getStairs (v) {
  let i = parseInt(v / 16)
  return stringArr[i]
}







