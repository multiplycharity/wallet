// // const arr = [{ t: 1 }, { t: 45 }, { t: 94545 }, { t: 0 }]

// // const sorted = arr.sort((a, b) => (a.t > b.t ? 1 : -1))
// // console.log('sorted: ', sorted)
// // console.log('arr: ', arr)

// const value = '70.66'

// const ethers = require('ethers')

// const txValue = ethers.utils
//   .parseUnits((parseFloat(value) / 100).toString())
//   .toString()

// console.log('txValue: ', txValue)

// const form = ethers.utils.formatEther(txValue)

// console.log('form: ', form)

// const wei = ethers.utils.parseUnits(form)
// console.log('wei: ', wei.toString())

const arr1 = [1, 2, 3]
const arr2 = [4, 5, 6]
const arr3 = [...arr2, ...arr1]
console.log('arr3: ', arr3)
