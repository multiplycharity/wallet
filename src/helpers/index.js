import { ethers } from 'ethers'
import { firestore } from '../config/firebase'

export const isEthereumAddress = address => {
  const regex = RegExp('^0x[a-fA-F0-9]{40}$')
  return regex.test(address)
}

export const formatWei = value => {
  return (ethers.utils.formatEther(value) * 100).toFixed(2).replace(/\.00$/, '')
}

export const formatAddress = address => {
  return ethers.utils.getAddress(address)
}

export const isEmailAddress = email => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const getUserByAddress = async address => {
  address = formatAddress(address)

  let docs = []

  const snapshot = await firestore
    .collection('users')
    .where('address', '==', address)
    .get()

  snapshot.docs.forEach(doc => {
    docs.push(doc.data())
  })

  if (docs.length !== 1) return null
  return docs[0]
}

export const getHexString = str => {
  if (!str.startsWith('0x')) return `0x${str}`
  return str
}
