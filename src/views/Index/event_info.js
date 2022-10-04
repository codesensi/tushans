export default {
    mounted() {
        //监听鼠标滚动
        window.addEventListener("wheel", (event) => {
            if (window.scrolllock) return;
            let fangxiang = Boolean(event.deltaY > 0);
            const drawer = document.querySelector(".drawer-main");
            if (fangxiang) {
                if (!this.drawer)
                    setTimeout(_ => {
                        drawer.style.overflowY = "scroll"
                    }, 200)
                this.drawer = true;
            } else {
                if (drawer.scrollTop !== 0) return;
                this.drawer = false;
                drawer.style.overflowY = "hidden"
            }
        })
        document.querySelector(".drawer-main").addEventListener('touchmove', (event) => {
            event.stopPropagation();
        }, {passive: false})

//监听面触摸滑动事件
        document.querySelector("#root").addEventListener("touchstart", (event) => {
            if (window.scrolllock) return
            let y = event.touches[0].clientY;
            this.touch = {
                y: y,
                time: new Date().getTime()
            }

        })
//页面滑动结束事件
        document.querySelector("#root").addEventListener("touchend", (event) => {
            if (window.scrolllock) return
            let y = event.changedTouches[0].clientY;
            let t = new Date().getTime();
            if (y === this.touch.y) {
                return false;
            }
            if (t - 300 < this.touch.time) {
                if (y + 100 < this.touch.y) {
                    this.drawer = true;
                } else if (y - 100 > this.touch.y) {
                    if (document.querySelector(".drawer-main").scrollTop !== 0) return;
                    this.drawer = false;
                }
            }
        })
//阻止冒泡
        document.querySelector("#root").addEventListener("touchmove", (e) => {
            e.stopPropagation();
            e.preventDefault()
        }, {passive: false})

        document.querySelector(".main-page").addEventListener("click", (event) => {
            if (this.drawer) {
                this.drawer = false
            }
        })
    }
}
