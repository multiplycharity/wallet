import React, { useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  SectionList,
  FlatList
} from 'react-native'
import Colors from '../constants/colors'
import Button from '../components/Button'
import ActivityCell from '../components/ActivityCell'
import moment from 'moment'
import _ from 'lodash'

// <ActivityCell
//   style={{}}
//   title='Pedro Gomes'
//   timestamp={1589101639}
//   amount='-$5'
//   imageUrl='https://randomuser.me/api/portraits/med/men/50.jpg'
// />
// <ActivityCell
//   style={{}}
//   title='Amir Jumaniyazov'
//   timestamp={1588636800}
//   amount='$20'
//   imageUrl='https://randomuser.me/api/portraits/med/men/20.jpg'
// />

const transactions = [
  { id: 0, title: 'Amir', timestamp: '2020-05-10 11:37', amount: '$1' },
  { id: 1, title: 'James', timestamp: '2020-05-10 09:23', amount: '$2' },
  { id: 2, title: 'Alice', timestamp: '2020-05-07 15:02', amount: '$5' },
  { id: 4, title: 'Bob', timestamp: '2020-05-07 08:02', amount: '$4' },
  { id: 5, title: 'Bob', timestamp: '2020-04-27 01:23', amount: '$5' }
]

const formatDate = item =>
  moment(item.timestamp, 'YYYY-MM-DD HH:mm').format('MMMM DD')

const groupedArray = _.groupBy(transactions, formatDate)

let sections = []

for (let [key, value] of Object.entries(groupedArray)) {
  sections.push({ id: key, title: moment., data: value })
}


const renderItem = ({ item }) => {
  return (
    <ActivityCell
      {...item}
      imageUrl={`https://randomuser.me/api/portraits/med/men/${item.id}.jpg`}
    />
  )
}

const extractKey = ({ id }) => id

const renderSectionHeader = ({ section }) => {
  return <Text style={styles.sectionHeader}>{section.title.toUpperCase()}</Text>
}

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' />
      <Text style={styles.balance}>$103.04</Text>
      <Text style={styles.balanceDescription}>Cash Balance</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 74
        }}
      >
        <Button title='Add Cash' style={{}}></Button>
        <Button title='Cash Out' style={{ marginLeft: 14 }}></Button>
      </View>

      <SectionList
        style={{ marginTop: 20 }}
        sections={sections}
        renderItem={renderItem}
        keyExtractor={extractKey}
        renderSectionHeader={renderSectionHeader}
      ></SectionList>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.White
  },
  balance: {
    marginTop: 144,
    fontSize: 48,
    fontWeight: '500'
  },
  balanceDescription: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.Gray500
  },
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
