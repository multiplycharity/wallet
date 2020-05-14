import Reactotron from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'
import { AsyncStorage } from 'react-native'

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure()
  .useReactNative()
  .use(reactotronRedux())
  .connect()

export default reactotron
