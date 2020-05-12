import React from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { BlurView } from 'expo-blur'
// import PropTypes from 'prop-types'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject
  },
  finder: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  },
  topLeftEdge: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  topRightEdge: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  bottomLeftEdge: {
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  bottomRightEdge: {
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  maskOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  maskInner: {
    backgroundColor: 'transparent',
    overflow: 'hidden'
  },
  maskRow: {
    width: '100%'
  },
  maskCenter: {
    display: 'flex',
    flexDirection: 'row'
  }
})

class BarcodeMask extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      edgeRadiusOffset: props.edgeRadius ? -Math.abs(props.edgeRadius / 1.2) : 0
    }
  }

  _applyMaskFrameStyle = () => {
    const { backgroundColor, outerMaskOpacity } = this.props
    return { backgroundColor, opacity: outerMaskOpacity, flex: 1 }
  }

  _renderEdge = edgePosition => {
    const {
      edgeWidth,
      edgeHeight,
      edgeColor,
      edgeBorderWidth,
      edgeRadius
    } = this.props
    const { edgeRadiusOffset } = this.state
    const defaultStyle = {
      width: edgeWidth,
      height: edgeHeight,
      borderColor: edgeColor
    }
    const edgeBorderStyle = {
      topRight: {
        borderRightWidth: edgeBorderWidth,
        borderTopWidth: edgeBorderWidth,
        borderTopRightRadius: edgeRadius,
        top: edgeRadiusOffset,
        right: edgeRadiusOffset
      },
      topLeft: {
        borderLeftWidth: edgeBorderWidth,
        borderTopWidth: edgeBorderWidth,
        borderTopLeftRadius: edgeRadius,
        top: edgeRadiusOffset,
        left: edgeRadiusOffset
      },
      bottomRight: {
        borderRightWidth: edgeBorderWidth,
        borderBottomWidth: edgeBorderWidth,
        borderBottomRightRadius: edgeRadius,
        bottom: edgeRadiusOffset,
        right: edgeRadiusOffset
      },
      bottomLeft: {
        borderLeftWidth: edgeBorderWidth,
        borderBottomWidth: edgeBorderWidth,
        borderBottomLeftRadius: edgeRadius,
        bottom: edgeRadiusOffset,
        left: edgeRadiusOffset
      }
    }
    return (
      <View
        style={[
          defaultStyle,
          styles[edgePosition + 'Edge'],
          edgeBorderStyle[edgePosition]
        ]}
      />
    )
  }

  render () {
    const { width, height, edgeBorderWidth } = this.props

    return (
      <View style={[styles.container]}>
        <View style={[styles.finder, { width, height }]}>
          {this._renderEdge('topLeft')}
          {this._renderEdge('topRight')}
          {this._renderEdge('bottomLeft')}
          {this._renderEdge('bottomRight')}
        </View>
        <View style={styles.maskOuter}>
          <View style={[styles.maskRow, this._applyMaskFrameStyle()]} />
          <View style={[{ height }, styles.maskCenter]}>
            <View style={[this._applyMaskFrameStyle()]} />
            <View
              style={[
                styles.maskInner,
                {
                  width,
                  height
                }
              ]}
            />
            <View style={[this._applyMaskFrameStyle()]} />
          </View>
          <View style={[styles.maskRow, this._applyMaskFrameStyle()]} />
        </View>
      </View>
    )
  }
}

const defaultProps = {
  width: 240,
  height: 240,
  edgeWidth: 40,
  edgeHeight: 40,
  edgeColor: 'white',
  edgeBorderWidth: 6,
  backgroundColor: 'rgb(0, 0, 0)',
  outerMaskOpacity: 0.5
}

BarcodeMask.defaultProps = defaultProps

export default BarcodeMask
