function makeSlider(element, options={}) {
    element.classList.add('slider-wrapper')
    const container = document.createElement("div")
    container.classList.add('slide-container')
    const leftBtn = document.createElement("button")
    const rightBtn = document.createElement("button")
    leftBtn.innerText = "<"
    rightBtn.innerText = ">"
    leftBtn.classList.add('slider-btn')
    rightBtn.classList.add('slider-btn')
    container.append(...element.children)
    element.append(leftBtn, container, rightBtn)
    giveTranslateX(container)

    let busy

    for (const child of container.children) {
        child.addEventListener('transitionend', () => (busy = false))
    }
    
    setTimeout(() => animate(container, true), 10)

    const slider = {
        slideLeft () {
            if (busy) return
            busy = true
            const last = container.children[container.children.length - 1]
            container.insertBefore(last, container.firstElementChild)
            last.style.transform = `translateX(-100%)`
            setTimeout(() => giveTranslateX(container), 10)
        },
        slideRight () {
            if (busy) return
            busy = true
            const first = container.firstElementChild
            giveTranslateX(container, - 1)

            function reset() {
                animate(container, false)
                container.append(first)
                giveTranslateX(container)
                first.removeEventListener('transitionend', reset)
                setTimeout(() => animate(container, true), 10)
            }

            first.addEventListener('transitionend', reset)
        }
    }

    leftBtn.onclick = slider.slideLeft
    rightBtn.onclick = slider.slideRight

    if (options.autoplay) {
        if (options.defaultDirection == "left")
            setInterval(() => slider.slideLeft(), options.autoplay * 1000)
        else
            setInterval(() => slider.slideRight(), options.autoplay * 1000)
    }

    if (options.noButtons) {
        leftBtn.remove()
        rightBtn.remove()
    }

    if (options.buttonWhite) {
        leftBtn.classList.add("slider-btn-white")
        rightBtn.classList.add("slider-btn-white")
    }

    return slider
}

function animate(element, set) {
    for (const child of element.children) {
        if (set) child.classList.add('animate')
        else child.classList.remove('animate')
    }
}

function giveTranslateX(element, shift = 0) {
    [...element.children].forEach((child, i) => {
        child.classList.add('slide')
        child.style.transform = `translateX(${i + shift}00%)`
    })
}