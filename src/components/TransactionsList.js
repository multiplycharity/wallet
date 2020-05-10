import React from 'react'
import { StyleSheet, Text, View, SectionList } from 'react-native'
import Colors from '../constants/colors'
import TransactionCell from '../components/TransactionCell'
import moment from 'moment'
import _ from 'lodash'

const transactions = [
  { id: 0, title: 'Amir', timestamp: '2020-05-10 11:37', amount: '1' },
  { id: 1, title: 'James', timestamp: '2020-05-10 09:23', amount: '2' },
  {
    id: 2,
    title: 'Alice',
    timestamp: '2020-05-07 15:02',
    amount: '5',
    type: 'out'
  },
  { id: 4, title: 'Bob', timestamp: '2020-05-07 08:02', amount: '4' },
  { id: 5, title: 'Bob', timestamp: '2020-04-27 01:23', amount: '3' }
]

const groupedArray = _.groupBy(transactions, tx =>
  moment(tx.timestamp, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD')
)

let sections = []

for (let [key, value] of Object.entries(groupedArray)) {
  sections.push({
    id: key,
    title: moment(key, 'YYYY-MM-DD').format('MMMM DD'),
    data: value
  })
}

const renderItem = ({ item }) => {
  return (
    <TransactionCell
      {...item}
      imageUrl={`https://randomuser.me/api/portraits/med/men/${item.id}.jpg`}
    />
  )
}

const extractKey = ({ id }) => id

const renderSectionHeader = ({ section }) => {
  return <Text style={styles.sectionHeader}>{section.title.toUpperCase()}</Text>
}

const TransactionsList = () => {
  return (
    <SectionList
      style={{ marginTop: 20 }}
      sections={sections}
      renderItem={renderItem}
      keyExtractor={extractKey}
      renderSectionHeader={renderSectionHeader}
    ></SectionList>
  )
}

export default TransactionsList

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: Colors.Gray100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 5,
    fontSize: 12,
    color: Colors.Gray500,
    fontWeight: '600'
  }
})
