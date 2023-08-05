let DemoSnake = null
let score = document.querySelector('#score')
let restart = document.querySelector('#restart')
let stop = document.querySelector('#stop')
let conti = document.querySelector('#continue')
let mask = document.querySelector('#mask')
let exit = document.querySelector('#exit')
let beginbox = document.querySelector('#beginBox')
let container = document.querySelector(".container")
let snake = document.querySelector("#snake")
let info = document.querySelector(".info")
let up = document.querySelector("#upspeed")
let down = document.querySelector("#downspeed")
let grade = JSON.parse(localStorage.getItem('key'))
restart.onclick = function () {
    if (!DemoSnake.isStart) return
    DemoSnake.start()
}
stop.onclick = function () {
    if (DemoSnake.isStop || !DemoSnake.isStart) return
    DemoSnake.stop()
}
conti.onclick = function () {
    if (!DemoSnake.isStop || !DemoSnake.isStart) return
    DemoSnake.continue()
}
up.onclick = function () {
    DemoSnake.upspeed()
}
down.onclick = function () {
    DemoSnake.downspeed()
}
mask.onclick = function () {
    if (!DemoSnake.isStart) {
        beginbox.style.display = "none";
        container.style.display = "block";
        DemoSnake.start()
    } else {
        DemoSnake.continue()
    }
}
exit.onclick = function () {
    DemoSnake.isthink = true
    let chose = confirm("确定要退出游戏吗？")
    if (chose) {
        window.close()
    } else {
        DemoSnake.isthink = false
    }

}

// 大小为64 * 40
class GreedySnake {
    constructor() {
        this.canvas = document.querySelector('#snake')
        this.ctx = this.canvas.getContext('2d')
        this.maxX = 64          // 最大行
        this.maxY = 40          // 最大列
        this.itemWidth = 10     // 每个点的大小
        this.direction = 'right'// up down right left 方向
        this.speed = 150        // ms 速度
        this.isStop = false     // 是否暂停
        this.isOver = false     // 是否结束
        this.isStart = false    // 是否开始
        this.score = 0          // 分数
        this.timer = null       // 移动定时器
        this.j = 1
        this.canChange = true
        this.isthink = false

        this.grid = new Array()

        for (let i = 0; i < this.maxX; i++) {
            for (let j = 0; j < this.maxY; j++) {
                this.grid.push([i, j])
            }
        }

        this.drawGridLine()
        this.getDirection()
    }

    // 开始
    start() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
        if (!this.isStart) {
            this.isStart = true
        }
        this.score = 0
        this.speed = 150
        this.isStop = false
        this.isOver = false
        this.direction = 'right'
        this.createSnake()
        this.createFood()
        this.draw()
        this.move()
        info.style.display = "none"
        snake.style.opacity = 1
    }

    // 创建蛇主体
    createSnake() {
        this.snake = [
            [4, 25],
            [3, 25],
            [2, 25],
            [1, 25],
            [0, 25]
        ]
    }

    // 移动
    move() {
        if (this.isStop) return
        if (this.isthink) return

        let [x, y] = this.snake[0]
        switch (this.direction) {
            case 'left':
                x--
                break
            case 'right':
                x++
                break
            case 'up':
                y--
                break
            case 'down':
                y++
                break
        }

        // 如果下一步不是食物的位置
        if (x !== this.food[0] || y !== this.food[1]) {
            this.snake.pop()
        } else {
            this.createFood()
        }

        if (this.over([x, y])) {
            this.isOver = true
            info.style.display = 'block'
            info.innerHTML = '游戏失败'
            snake.style.opacity = 0.2
            return
        }
        if (this.completed()) {
            info.style.display = 'block'
            info.innerHTML = '恭喜您，游戏通关'
            snake.style.opacity = 0.2
            return
        }

        this.snake.unshift([x, y])

        this.draw()
        this.canChange = true
        this.timer = setTimeout(() => { this.move(); console.log(this.speed) }, this.speed)
    }

    // 暂停游戏
    stop() {
        if (this.isOver) return
        this.isStop = true
        info.style.display = 'block'
        info.innerHTML = '暂 停'
        snake.style.opacity = 0.2
    }

    // 继续游戏
    continue() {
        if (this.isOver) return
        this.isStop = false
        this.move()
        info.style.display = 'none'
        snake.style.opacity = 1
    }

    getDirection() {
        // 上38 下40 左37 右39 不能往相反的方向走
        document.onkeydown = e => {
            //alert(this.canChange)
            // 在贪吃蛇移动的间隔内不能连续改变两次方向
            if (!this.canChange) return
            switch (e.keyCode) {
                case 37:
                    if (this.direction !== 'right') {
                        this.direction = 'left'
                        this.canChange = false
                    }
                    break
                case 38:
                    if (this.direction !== 'down') {
                        this.direction = 'up'
                        this.canChange = false
                    }
                    break
                case 39:
                    if (this.direction !== 'left') {
                        this.direction = 'right'
                        this.canChange = false
                    }
                    break
                case 40:
                    if (this.direction !== 'up') {
                        this.direction = 'down'
                        this.canChange = false
                    }
                    break
                case 32:
                    // 空格暂停与继续
                    if (!this.isStop) {
                        this.stop()
                    } else {
                        this.continue()
                    }
                    break
            }
        }
    }
    createPos() {
        let [x, y] = this.grid[(Math.random() * this.grid.length) | 0]
        //console.log(x, y)
        for (let i = 0; i < this.snake.length; i++) {
            if (this.snake[i][0] == x && this.snake[i][1] == y) {
                /*console.log("fff" + x + y)*/
                return this.createPos()
            }
        }

        return [x, y]
    }
    //减速
    downspeed() {
        if (this.speed < 300) {
            this.speed += 30
        }
    }
    //加速
    upspeed() {
        if (this.speed > 30) {
            this.speed -= 30
        }
    }
    // 生成食物
    createFood() {
        this.food = this.createPos()
        // 更新分数
        if ((this.score) > grade) {
            grade = this.score
            localStorage.setItem('key', JSON.stringify(grade));
        }
        score.innerHTML = 'Score: ' + this.score++ + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp历史最高分: ' + grade
    }

    // 结束
    over([x, y]) {
        if (x < 0 || x >= this.maxX || y < 0 || y >= this.maxY) {
            return true
        }

        if (this.snake.some(v => v[0] === x && v[1] === y)) {
            return true
        }
    }

    // 完成
    completed() {
        if (this.snake.length == this.maxX * this.maxY) {
            return true
        }
    }

    // 网格线
    drawGridLine() {
        //横的网格线
        for (let i = 1; i < this.maxY; i++) {
            this.ctx.moveTo(0, i * this.itemWidth)
            this.ctx.lineTo(this.canvas.width, i * this.itemWidth)
        }
        //竖的网格线
        for (let i = 1; i < this.maxX; i++) {
            this.ctx.moveTo(i * this.itemWidth, 0)
            this.ctx.lineTo(i * this.itemWidth, this.canvas.height)
        }
        this.ctx.lineWidth = 1
        this.ctx.strokeStyle = '#bbb'
        this.ctx.stroke()
    }

    // 绘制
    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.drawGridLine()

        this.ctx.fillStyle = "#000"
        this.ctx.fillRect(
            this.food[0] * this.itemWidth + this.j,
            this.food[1] * this.itemWidth + this.j,
            this.itemWidth - this.j * 2,
            this.itemWidth - + this.j * 2
        )
        //变化大小
        this.j ^= 1

        this.ctx.fillStyle = "yellow"
        this.ctx.fillRect(
            this.snake[0][0] * this.itemWidth + 0.5,
            this.snake[0][1] * this.itemWidth + 0.5,
            this.itemWidth - 1,
            this.itemWidth - 1
        )
        this.ctx.fillStyle = "red"
        for (let i = 1; i < this.snake.length; i++) {
            this.ctx.fillRect(
                this.snake[i][0] * this.itemWidth + 0.5,
                this.snake[i][1] * this.itemWidth + 0.5,
                this.itemWidth - 1,
                this.itemWidth - 1
            )
        }
    }
}
DemoSnake = new GreedySnake()