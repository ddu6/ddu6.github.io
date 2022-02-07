const consult = document.querySelector('#consult')
const main = document.querySelector('main')
const strength = document.querySelector('#strength')
const grid = strength.querySelector('.grid')
const historyEle = document.querySelector('#history')
const summarys = historyEle.querySelectorAll('.summary')
const rect = historyEle.querySelector('#history-mask rect')
const footer = document.querySelector('footer')
addEventListener('click', e => {
    if (consult.classList.contains('show')) {
        consult.classList.remove('show')
        consult.classList.add('hide')
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
            part.scrollLeft = 0
            part.scrollIntoView({behavior: 'smooth', inline: 'start'})
            break
        }
        const id = decodeURIComponent(href.slice(1))
        const result = document.body.querySelector(`[id=${JSON.stringify(id)}]`)
        if (result !== null) {
            result.scrollLeft = 0
            result.scrollIntoView({behavior: 'smooth', inline: 'start'})
        }
        break
    }
})
consult.addEventListener('click', e => {
    e.stopPropagation()
    e.preventDefault()
    consult.classList.remove('hide')
    consult.classList.add('show')
})
let rest = false
for (let i = 0; i < main.children.length; i++) {
    const part = main.children[i]
    const tab = document.createElement('a')
    const line = document.createElement('div')
    tab.href = `#${encodeURIComponent(part.id)}`
    tab.textContent = part.querySelector('h1').textContent
    line.style.height = '1px'
    line.style.marginBottom = '.5em'
    footer.append(tab)
    tab.prepend(line)
    part.addEventListener('wheel', e => {
        if (i === 3) {
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
        if (i !== 0) {
            part.scrollBy(delta, 0)
            if (delta < -10 && part.scrollLeft < 1) {
                rest = true
                footer.children[i - 1].click()
                setTimeout(() => {
                    rest = false
                }, 1000)
            }
        }
        if (i !== main.children.length - 1 && delta > 10 && part.scrollLeft + visualViewport.width > part.scrollWidth - 1) {
            rest = true
            footer.children[i + 1].click()
            setTimeout(() => {
                rest = false
            }, 1000)
        }
    }, {passive: false})
    part.addEventListener('scroll', update)
    part.addEventListener('touchmove', update)
}
grid.addEventListener('pointerover', () => {
    strength.classList.add('dark')
})
grid.addEventListener('pointerout', () => {
    strength.classList.remove('dark')
})
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
    summary.addEventListener('click', e => {
        e.stopPropagation()
        e.preventDefault()
        summary.classList.add('show')
    })
}
function update() {
    for (let i = 0; i < main.children.length; i++) {
        const part = main.children[i]
        const tab = footer.children[i]
        const line = tab.children[0]
        const {left, right} = part.getBoundingClientRect()
        if (left <= visualViewport.width / 2 && right >= visualViewport.width / 2) {
            part.classList.remove('fade')
            tab.style.opacity = '1'
            if (i === 0) {
                line.style.background = 'goldenrod'
                continue
            }
            const percent = 100 * (visualViewport.width + part.scrollLeft) / part.scrollWidth
            const rightPercent = Math.max(0, 100 * part.scrollLeft / (part.scrollWidth - visualViewport.width))
            line.style.background = `linear-gradient(to right, goldenrod ${percent}%, lightgray ${percent}%)`
            if (i === 3) {
                rect.setAttribute('width', `${rightPercent}%`)
                if (rightPercent < 50) {
                    part.classList.remove('gray')
                } else {
                    part.classList.add('gray')
                }
            }
            continue
        }
        part.classList.add('fade')
        tab.style.opacity = '.5'
        line.style.background = 'lightgray'
    }
}
addEventListener('load', () => {
    update()
    setTimeout(() => {
        update()
    }, 1000)
})
main.addEventListener('scroll', update)
addEventListener('resize', () => {
    const std = Math.round(main.scrollLeft / visualViewport.width) * visualViewport.width
    if (Math.abs(std - main.scrollLeft) > 1) {
        main.scrollLeft = std
    } else {
        update()
    }
})