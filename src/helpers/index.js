import { ethers } from 'ethers'
import { firestore } from '../config/firebase'

export const isEthereumAddress = address => {
  const regex = RegExp('^0x[a-fA-F0-9]{40}$')
  return regex.test(address)
}

export const formatWei = value => {
  return (ethers.utils.formatEther(value) * 100).toFixed(2).replace(/\.00$/, '')
}

export const formatFloat = value => {
  return +parseFloat(value).toFixed(2)
}

export const formatAddress = address => {
  return ethers.utils.getAddress(address)
}

export const isEmailAddress = email => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const getUserByAddress = async address => {
  // address = formatAddress(address)

  // let docs = []

  // const snapshot = await firestore
  //   .collection('users')
  //   .where('address', '==', address)
  //   .get()

  // snapshot.docs.forEach(doc => {
  //   docs.push(doc.data())
  // })

  // if (docs.length !== 1) return null
  // return docs[0]
  return null
}

export const getUserByEmail = async email => {
  let docs = []

  const snapshot = await firestore
    .collection('users')
    .where('email', '==', email)
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

export const sendPushNotification = async ({
  to,
  title = 'Title',
  body = 'Body',
  data = {}
}) => {
  const message = {
    to: to,
    sound: 'default',
    title: title,
    body: body,
    data: data,
    _displayInForeground: true
  }
  return fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  })
}

export const searchUser = async queryStr => {
  let docs = []

  if (queryStr) {
    const emails = await firestore
      .collection('users')
      .where('email', '>=', queryStr)
      .where('email', '<=', queryStr + '\uf8ff')
      .get()

    emails.docs.forEach(doc => {
      docs.push(doc.data())
    })

    if (isEthereumAddress(queryStr)) {
      const addresses = await firestore
        .collection('users')
        .where('address', '>=', queryStr)
        .where('address', '<=', queryStr + '\uf8ff')
        .get()

      addresses.docs.forEach(doc => {
        docs.push(doc.data())
      })
    }
  }

  return docs
}
