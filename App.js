/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 /**
  * Get the actual image size
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImageEditor,
  Image,
  ImageStore,
  Slider,
  Dimensions,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import AspectRatio from 'image-aspect-ratio';

const imgPath = 'http://s1.picswalls.com/wallpapers/2015/09/20/best-dragon-ball-wallpaper_012628183_270.jpg';

const { height, width } = Dimensions.get('screen');

export default class App extends Component<{}> {
  constructor () {
    super();
    this.state = {
      uri: '',
      offsetX: '',
      imageSize: {},
      previewURI: '',
      cropWidth: 1,
      cropHeight: 1,
      xAxis: 0,
      yAxis: 0,
    }
    this.crop = this.crop.bind(this);
    this.getCoords = this.getCoords.bind(this);
    this.testing = 1;
    this.cropState = {
      x: 125,
      y: 127,
      height: 225,
      width: 118,
    };
  }

  crop(data) {
    ImageEditor.cropImage(
      imgPath,
      data,
      (resImg)=>{
        ImageStore.getBase64ForTag(resImg, (res)=>{
          this.setState({previewURI: res});
        }, (err)=>{
          console.log('ERR',err);
        });
      },
      (err)=>{
        console.log('ERROR',err);
      },
    );
  }

  componentDidMount() {
    Image.getSize(imgPath,(imgWidth, imgHeight)=>{
      this.setState({
        imageSize :{
          height: imgHeight,
          width: imgWidth,
        }
      });
    }, (err)=>{
      console.log(err);
    });
  }

  changeWidth(val) {
    this.setState({cropWidth: val});
  }
  changeHeight(val) {
    this.setState({cropHeight: val});
  }
  xAxis(val) {
    console.log(val);
    this.setState({xAxis: val});
  }
  yAxis(val) {
    this.setState({yAxis: val});
  }

  getCoords(e) {
    console.log(e.layout);
    this.cropState = {
      x: e.layout.x / 2,
      y: e.layout.y,
      height: e.layout.height,
      width: e.layout.width,
    };
  }

  getScreenSize(e) {
    // console.log('INIT SCREEN SIZE',e.layout);
  }

  getImageSize(e) {
    // console.log('IMAGE HEIGHT',e.layout);
  }

  render() {
    const { uri, imageSize, previewURI, cropWidth, cropHeight, xAxis, yAxis } = this.state;
    const preview = "data:image/jpeg;base64,"+previewURI;
    const dataImg = "data:image/jpeg;base64,"+uri;
    const cropRatioWidth = imageSize.width / AspectRatio.calculate(imageSize.width, imageSize.height, 414, 736).width;
    const cropRatioHeight = imageSize.height / AspectRatio.calculate(imageSize.width, imageSize.height, 414, 736).height;
    console.log(((AspectRatio.calculate(imageSize.width, imageSize.height, 414, 736).width - cropWidth) * xAxis) / cropWidth);
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
      }} onLayout={(e)=>{this.getScreenSize(e.nativeEvent)}}>
        <View style={{
          flex: 1,
          width: width,
          backgroundColor: '#000000',
          justifyContent: 'center',
          alignItems: 'center',
        }}>

          <View onLayout={(e)=>{this.getImageSize(e.nativeEvent)}}>
            <Image source={{uri: imgPath}} resizeMode='contain' ref='testing' style={{
              width: AspectRatio.calculate(imageSize.width, imageSize.height, 414, 736).width,
              height: AspectRatio.calculate(imageSize.width, imageSize.height, 414, 736).height,
            }}/>
          </View>

          <View style={{
            height: 150,
            width: 150,
            backgroundColor: 'rgba(0,0,0,0.8)',
            position: 'absolute',
            bottom: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
            {
              previewURI !== '' ?
                <Image source={{uri: preview}} resizeMode='contain' style={{
                  height: 150,
                  width: 150,
                  backgroundColor: 'gray'
                }}/>
              :
              null
            }
          </View>

          <View style={{
            height: cropHeight,
            width: cropWidth,
            position: 'absolute',
            left: xAxis, // MAKE SURE TO CAPTURE THE EXACT SIZE WHEN CROPPER IS MOVED
            top: yAxis + 167,
            flex: 1,
            borderColor: '#ffffff',
            borderWidth: 1,
          }} ref='cropper' onLayout={(e)=>{this.getCoords(e.nativeEvent)}}>

          </View>

        </View>

        <View style={{
          height: height * .08,
          width: width,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 5,
        }}>
          <TouchableOpacity style={{
            backgroundColor: 'blue',
            flex: 1,
            width: width * .98,
            justifyContent: 'center',
            alignItems: 'center',
          }} onPress={()=>{this.crop(
            {
              offset: {
                x: ((AspectRatio.calculate(imageSize.width, imageSize.height, 414, 736).width - cropWidth) * cropRatioWidth) + ((this.cropState.x + cropWidth) / cropWidth),
                y: (this.cropState.y + cropHeight) / cropHeight,
              },
              size: {
                width: (this.cropState.width * cropRatioWidth),
                height: this.cropState.height * cropRatioHeight,
              },
              displaySize: {
                width: imageSize.width,
                height: imageSize.height,
              },
              resizeMode: 'contain'
            }
          )}}>
            <View>
              <Text style={{color: '#ffffff', fontWeight: 'bold'}}>Crop</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{
          height: height * .15,
          width: width,
          paddingLeft: 10,
          paddingRight: 10
        }}>
          <ScrollView>
          <Text>Width:</Text>
          <Slider
            maximumValue={AspectRatio.calculate(imageSize.width, imageSize.height, 414, 736).width}
            minimumValue={1}
            onValueChange={(res)=>{
              this.changeWidth(res);
            }}
          />

          <Text>Height:</Text>
          <Slider
            maximumValue={AspectRatio.calculate(imageSize.width, imageSize.height, 414, 736).height}
            minimumValue={1}
            onValueChange={(res)=>{
              this.changeHeight(res);
            }}
          />

          <Text>X Axis:</Text>
          <Slider
            maximumValue={width - cropWidth}
            minimumValue={1}
            onValueChange={(res)=>{
              this.xAxis(res);
            }}
          />

          <Text>Y Axis:</Text>
          <Slider
            maximumValue={AspectRatio.calculate(imageSize.width, imageSize.height, 414, 736).height - cropHeight}
            minimumValue={1}
            onValueChange={(res)=>{
              this.yAxis(res);
            }}
          />
          </ScrollView>
        </View>
      </View>
    );
  }
}
