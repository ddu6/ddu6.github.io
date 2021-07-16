export function va(unit){
    const a=document.createElement('a')
    a.target='_blank'
    a.href=`https://ddu6.github.io/player/?src=${encodeURIComponent(`https://github.com/pku6/${unit.options['course-id']}/releases/download/v0.0.1/${unit.options.name}.mp4`)}`
    a.textContent=unit.options.name
    return a
}