const consult = document.querySelector('#consult')
const consultCross = consult.querySelector('form').querySelector('img')
const more = document.querySelector('#more')
const moreCross = more.querySelector('form').querySelector('img')
const main = document.querySelector('main')
const grid = document.querySelector('#strength').querySelector('.grid')
const historyEle = document.querySelector('#history')
const path = historyEle.querySelector('.path')
const mask = document.createElement('div')
const summarys = path.querySelectorAll('.summary')
const cover = document.createElement('div')
cover.classList.add('cover')
const footer = document.querySelector('footer')
path.prepend(mask)
addEventListener('click', e => {
    consult.classList.remove('show')
    more.classList.remove('show')
    for (const item of grid.children) {
        item.classList.remove('show')
    }
    for (const summary of summarys) {
        summary.classList.remove('show')
    }
    // fix #
    for (const target of e.composedPath()) {
        if (!(target instanceof HTMLAnchorElement)) {
            continue
        }
        const href = target.getAttribute('href')
        if (href === null || !href.startsWith('#')) {
            break
        }
        e.preventDefault()
        if (href.length === 1) {
            const part = main.children[0]
            part.scrollTop = 0
            part.scrollIntoView({inline: 'start'})
            break
        }
        const id = decodeURIComponent(href.slice(1))
        const result = document.body.querySelector(`[id=${JSON.stringify(id)}]`)
        if (result !== null) {
            result.scrollTop = 0
            result.scrollIntoView({inline: 'start'})
        }
        break
    }
})
consult.addEventListener('click', e => {
    e.stopPropagation()
    consult.classList.add('show')
})
consultCross.addEventListener('click', e => {
    e.stopPropagation()
    consult.classList.remove('show')
})
more.addEventListener('click', e => {
    e.stopPropagation()
    more.classList.add('show')
})
moreCross.addEventListener('click', e => {
    e.stopPropagation()
    more.classList.remove('show')
})
let rest = false
for (let i = 0; i < main.children.length; i++) {
    const part = main.children[i]
    const h = part.querySelector('h1')
    const tab = document.createElement('a')
    tab.href = `#${encodeURIComponent(part.id)}`
    tab.textContent = h.textContent
    footer.append(tab)
    function handleDelta(delta) {
        if (i !== 0 && delta < -10 && part.scrollTop < 2) {
            rest = true
            footer.children[i - 1].click()
            setTimeout(() => {
                rest = false
            }, 1000)
        }
        if (i !== main.children.length - 1 && delta > 10 && part.scrollTop + part.clientHeight > part.scrollHeight - 2) {
            rest = true
            footer.children[i + 1].click()
            setTimeout(() => {
                rest = false
            }, 1000)
        }
    }
    part.addEventListener('wheel', e => {
        if (i === 2) {
            for (const target of e.composedPath()) {
                if (target instanceof HTMLElement && target.classList.contains('container')) {
                    return
                }
            }
        }
        e.preventDefault()
        if (rest) {
            return
        }
        const delta = e.deltaX + e.deltaY
        part.scrollBy(0, delta)
        handleDelta(delta)
    }, {passive: false})
    part.addEventListener('scroll', update)
    let start
    part.addEventListener('touchstart', e => {
        if (e.touches.length > 0) {
            const touch = e.touches[0]
            start = touch.clientX + touch.clientY
        }
        fix()
    })
    part.addEventListener('touchmove', e => {
        update()
        if (rest || start === undefined || e.touches.length === 0) {
            return
        }
        if (i === 2) {
            for (const target of e.composedPath()) {
                if (target instanceof HTMLElement && target.classList.contains('container')) {
                    return
                }
            }
        }
        const touch = e.touches[0]
        handleDelta(start - touch.clientX - touch.clientY)
    })
    part.addEventListener('touchend', fix)
    h.addEventListener('click', e => {
        for (const target of e.composedPath()) {
            if (target === footer) {
                h.classList.remove('show')
                return
            }
        }
        e.stopPropagation()
        h.classList.toggle('show')
        h.prepend(cover)
        h.append(footer)
    })
}
for (const item of grid.children) {
    const cover = document.createElement('div')
    cover.classList.add('cover')
    item.prepend(cover)
    item.addEventListener('click', e => {
        e.stopPropagation()
        item.classList.toggle('show')
    })
}
for (const summary of summarys) {
    const point = summary.querySelector('.point')
    const cover = document.createElement('div')
    const container = summary.querySelector('.container')
    const close = document.createElement('img')
    cover.classList.add('cover')
    close.src = new URL('icons/close.svg', import.meta.url).href
    point.append(document.createElement('div'))
    point.append(document.createElement('div'))
    point.append(document.createElement('div'))
    point.append(document.createElement('div'))
    container.before(cover)
    container.children[1].prepend(close)
    const remove = e => {
        e.stopPropagation()
        summary.classList.remove('show')
    }
    cover.addEventListener('click', remove)
    close.addEventListener('click', remove)
    point.addEventListener('click', e => {
        e.stopPropagation()
        summary.classList.add('show')
    })
}
function update() {
    const {height} = main.getBoundingClientRect()
    for (let i = 0; i < main.children.length; i++) {
        const part = main.children[i]
        const tab = footer.children[i]
        const {top, bottom} = part.getBoundingClientRect()
        if (top <= height / 2 && bottom >= height / 2) {
            part.classList.remove('fade')
            tab.style.color = 'seagreen'
            if (i === 2) {
                const {height} = path.getBoundingClientRect()
                const rate = Math.max(0, part.scrollTop / (part.scrollHeight - height))
                mask.style.top = `${rate * height}px`
            }
            continue
        }
        part.classList.add('fade')
        tab.style.color = 'lightgray'
    }
}
addEventListener('load', () => {
    update()
    setTimeout(() => {
        update()
    }, 1000)
})
main.addEventListener('scroll', update)
function fix() {
    const {height} = main.getBoundingClientRect()
    const std = Math.round(main.scrollTop / height) * height
    if (Math.abs(std - main.scrollTop) > 1) {
        main.scrollTop = std
    } else {
        update()
    }
}
addEventListener('resize', fix)