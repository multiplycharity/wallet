import { formatAddress } from './src/helpers'

const main = async () => {
  const parsed = await formatAddress(
    '0x98075199fd8sb495a2b17a1b926fae8c59f5d8a25'
  )
  console.log('parsed: ', parsed)
}

main()
