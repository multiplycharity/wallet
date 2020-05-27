import React from 'react'

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
  Loader,
  Shine,
  ShineOverlay
} from 'rn-placeholder'

const LoadingCellPlaceholder = () => {
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

export default LoadingCellPlaceholder
