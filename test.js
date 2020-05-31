const arr = [{ t: 1 }, { t: 45 }, { t: 94545 }, { t: 0 }]

const sorted = arr.sort((a, b) => (a.t > b.t ? 1 : -1))
console.log('sorted: ', sorted)
console.log('arr: ', arr)
