import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, SectionList, Dimensions } from 'react-native'
import Colors from '../constants/colors'
import TransactionCell from '../components/TransactionCell'
import moment from 'moment'
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import { Feather } from '@expo/vector-icons'
const screen = Dimensions.get('screen')
import LoadingCellPlaceholder from '../components/LoadingCellPlaceholder'

const renderItem = ({ item }) => {
  console.log('item: ', item.id)
  return <TransactionCell {...item} key={item.id} />
}

const extractKey = ({ id }) => id

const renderSectionHeader = ({ section }) => {
  return <Text style={styles.sectionHeader}>{section.title.toUpperCase()}</Text>
}

const TransactionsList = props => {
  const isLoading = useSelector(state => state.transactions.loading)

  let transactions = useSelector(state => state.transactions.history)

  let sorted = _.orderBy(
    transactions,
    tx => moment.unix(tx.timestamp, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD'),
    ['desc']
  )

  let transactionsByDate = _.groupBy(sorted, tx =>
    moment.unix(tx.timestamp, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD')
  )

  let sections = []

  for (let [date, transactions] of Object.entries(transactionsByDate)) {
    sections.push({
      id: date,
      title: moment(date, 'YYYY-MM-DD').format('MMMM DD'),
      data: transactions
    })
  }

  return (
    <SectionList
      sections={sections}
      renderItem={renderItem}
      keyExtractor={extractKey}
      renderSectionHeader={renderSectionHeader}
      ListHeaderComponent={props.ListHeaderComponent}
      ListEmptyComponent={() => (
        <>
          {isLoading ? (
            <View style={{ marginTop: 30 }}>
              <LoadingCellPlaceholder></LoadingCellPlaceholder>
            </View>
          ) : (
            <View
              style={{
                alignItems: 'center',
                marginVertical: screen.height / 20
              }}
            >
              <Text
                style={{
                  marginVertical: 5,
                  fontSize: 16,
                  color: Colors.Gray500
                }}
              >
                Transactions will appear here
              </Text>
            </View>
          )}
        </>
      )}
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
