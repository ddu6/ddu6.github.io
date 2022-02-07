const consult = document.querySelector('#consult')
const consultCross = consult.querySelector('form').querySelector('img')
const more = document.querySelector('#more')
const moreCross = more.querySelector('form').querySelector('img')
const main = document.querySelector('main')
// const strength = document.querySelector('#strength')
const grid = document.querySelector('#strength-grid')
// const summarys = document.querySelectorAll('#history .summary')
// const rect = document.querySelector('#history-rect')
const footer = document.querySelector('footer')
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
    const tab = document.createElement('a')
    tab.href = `#${encodeURIComponent(part.id)}`
    tab.textContent = part.querySelector('h1').textContent
    footer.append(tab)
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
        if (i !== 0 && delta < -10 && part.scrollTop < 1) {
            rest = true
            footer.children[i - 1].click()
            setTimeout(() => {
                rest = false
            }, 1000)
        }
        if (i !== main.children.length - 1 && delta > 10 && part.scrollTop + visualViewport.height > part.scrollHeight - 1) {
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
for (const item of grid.children) {
    const cover = document.createElement('div')
    cover.classList.add('cover')
    item.prepend(cover)
    item.addEventListener('click', e => {
        e.stopPropagation()
        item.classList.toggle('show')
    })
}
// for (const summary of summarys) {
//     const point = summary.querySelector('.point')
//     const cover = document.createElement('div')
//     const container = summary.querySelector('.container')
//     const close = document.createElement('img')
//     cover.classList.add('cover')
//     close.src = new URL('icons/close.svg', import.meta.url).href
//     point.append(document.createElement('div'))
//     point.append(document.createElement('div'))
//     point.append(document.createElement('div'))
//     point.append(document.createElement('div'))
//     container.before(cover)
//     container.children[1].prepend(close)
//     const remove = e => {
//         e.stopPropagation()
//         summary.classList.remove('show')
//     }
//     cover.addEventListener('click', remove)
//     close.addEventListener('click', remove)
//     summary.addEventListener('click', e => {
//         e.stopPropagation()
//         summary.classList.add('show')
//     })
// }
addEventListener('click', e => {
    consult.classList.remove('show')
    more.classList.remove('show')
    for (const item of grid.children) {
        item.classList.remove('show')
    }
    // for (const summary of summarys) {
    //     summary.classList.remove('show')
    // }
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
            part.scrollIntoView({behavior: 'smooth', inline: 'start'})
            break
        }
        const id = decodeURIComponent(href.slice(1))
        const result = document.body.querySelector(`[id=${JSON.stringify(id)}]`)
        if (result !== null) {
            result.scrollTop = 0
            result.scrollIntoView({behavior: 'smooth', inline: 'start'})
        }
        break
    }
})
function update() {
    for (let i = 0; i < main.children.length; i++) {
        const part = main.children[i]
        const tab = footer.children[i]
        const {top, bottom} = part.getBoundingClientRect()
        if (top <= visualViewport.height / 2 && bottom >= visualViewport.height / 2) {
            part.classList.remove('fade')
            tab.style.opacity = '1'
            tab.style.color = 'seagreen'
            // if (i === 2) {
            //     const rightPercent = Math.max(0, 100 * part.scrollTop / (part.scrollHeight - visualViewport.height))
            //     rect.setAttribute('height', `${rightPercent}%`)
            //     if (rightPercent < 50) {
            //         part.classList.remove('gray')
            //     } else {
            //         part.classList.add('gray')
            //     }
            // }
            continue
        }
        part.classList.add('fade')
        tab.style.opacity = '.5'
        tab.style.color = 'lightgray'
    }
}
setTimeout(() => {
    update()
}, 500)
main.addEventListener('scroll', update)
addEventListener('resize', () => {
    const std = Math.round(main.scrollTop / visualViewport.height) * visualViewport.height
    if (Math.abs(std - main.scrollTop) > 1) {
        main.scrollTop = std
    } else {
        update()
    }
})