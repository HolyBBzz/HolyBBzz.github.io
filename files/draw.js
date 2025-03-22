let board = document.querySelector('.board')
let pallete = document.getElementById('pallete')

let colors = document.querySelectorAll('input[name="color"]')
for (let color of colors) {
    color.addEventListener('change', (e) => {
        currentColor = e.target.value
    })
}

let currentColor = "@"
let ispaint = false
let columns = 20
let rows = 20
let size = 30

board.addEventListener("mousedown", () => ispaint = true)
board.addEventListener("mouseup", () => ispaint = false)

board.addEventListener("mouseleave", () => ispaint = false)
board.addEventListener("dragstart", (e) => e.preventDefault())

pallete.addEventListener("change", (e) => {
    console.log(e.target.value)
    currentColor = e.target.value
})

function saveToLocalStorage()
{
    const pixels = document.querySelectorAll(".pixel")
    const colors = Array.from(pixels).map(pixel => {
        return pixel.innerHTML
    })
    localStorage.setItem('pixelColors', JSON.stringify(colors))
}

function loadFromStorage()
{
    const colorsFromStorage = localStorage.getItem('pixelColors')

    if (colorsFromStorage)
    {
        const colors = JSON.parse(colorsFromStorage)
        const pixels = document.querySelectorAll(".pixel")
        pixels.forEach((pixel, index) => {
            if (colors[index])
            {
                pixel.innerHTML = colors[index]
            }
        })
    }
}

function generate(_columns, _rows, _size) {
    board.style.width = _columns * _size + (_columns - 1) + "px"
    board.style.height = _rows * _size + (_rows - 1) + "px"

    board.style.gridTemplateColumns = `repeat(${_columns}, 1fr)`
    board.style.gridTemplateRows = `repeat(${_rows}, 1fr)`

    for (let i = 0; i <= _columns * _rows; i++) {
        let pixel =  document.createElement('div')
        pixel.classList.add("pixel")
        pixel.classList.width = size + 'px'
        pixel.classList.height = size + 'px'
        pixel.setAttribute("data-index", 1)
        board.appendChild(pixel)
        pixel.addEventListener('mousedown', function() {
            pixel.innerHTML = currentColor
            saveToLocalStorage()
        })
        pixel.addEventListener("mouseover", function() {
            if (ispaint) {
                pixel.innerHTML = currentColor
                saveToLocalStorage()
            }
        })
    }
    loadFromStorage()
}

generate(columns, rows, size)

function saveImage() {
    const canvas = document.createElement('canvas')
    const boardRect = board.getBoundingClientRect()
    canvas.width = boardRect.width
    canvas.height = boardRect.height

    const ctx = canvas.getContext('2d')

    const pixels = document.querySelectorAll('.pixel')

    pixels.forEach(pixel => {
        const rect = pixel.getBoundingClientRect()
        const color = pixel.innerHTML
        ctx.fillStyle = 'black'
        ctx.fillRect(
            rect.left - boardRect.left,
            rect.top - boardRect.top,
            rect.width,
            rect.height
        )
        ctx.fillStyle = 'white'
        ctx.fillText(color, rect.left - boardRect.left, rect.top - boardRect.top)
    })

    const link = document.createElement('a')
    link.download = 'simbols.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
}
let savebtn = document.querySelector('button')

savebtn.addEventListener('click', saveImage)