import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, SectionList, Dimensions } from 'react-native'
import Colors from '../constants/colors'
import TransactionCell from '../components/TransactionCell'
import moment from 'moment'
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import { Feather } from '@expo/vector-icons'
const screen = Dimensions.get('screen')

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
  Loader,
  Shine,
  ShineOverlay
} from 'rn-placeholder'
import { fetchTxsPending } from '../redux/txsReducer'

const LoadingCell = () => {
  return (
    <Placeholder
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
        paddingHorizontal: 10
      }}
      Left={PlaceholderMedia}
      Animation={ShineOverlay}
    >
      <PlaceholderLine style={{ marginVertical: 10 }} width={80} />
      <PlaceholderLine width={30} />
    </Placeholder>
  )
}

const renderItem = ({ item }) => {
  return (
    <TransactionCell
      {...item}
      // imageUrl={`https://randomuser.me/api/portraits/med/men/${1}.jpg`}
    />
  )
}

const extractKey = ({ id }) => id

const renderSectionHeader = ({ section }) => {
  return <Text style={styles.sectionHeader}>{section.title.toUpperCase()}</Text>
}

const TransactionsList = props => {
  const [renderPlaceholder, setRenderPlaceholder] = useState(true)
  const isLoading = useSelector(state => state.txs.pending)
  // const dispatch = useDispatch()
  // useEffect(() => {
  //   // const timer = setTimeout(() => {
  //   //   setRenderPlaceholder(false)
  //   // }, 2000)

  //   // return () => clearTimeout(timer)
  //   dispatch(fetchTxsPending())
  // }, [])

  let transactions = useSelector(state => state.txs.txs)

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
              <LoadingCell></LoadingCell>
              <LoadingCell></LoadingCell>
              <LoadingCell></LoadingCell>
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
