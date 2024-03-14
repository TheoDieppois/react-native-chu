import {View, Image, StyleSheet, Text} from 'react-native';
import SVG, { Circle, Line, Text as SvgText } from 'react-native-svg';
import Animated, {useSharedValue, useAnimatedProps, withTiming} from 'react-native-reanimated'
import {useEffect} from 'react';
import { AntDesign } from '@expo/vector-icons';

import React from 'react';
import Avatar from '../../shared/Avatar';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type RingProgressProps = {
  radius?: number;
  strokeWidth?: number;
  progress?: number;
}

const color = "";

const RingProgress = ({radius = 170, strokeWidth = 9, progress = 0.5}: RingProgressProps) => {
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;
  const numberOfLinesMain = 4;
  const numberOfLinesSub = 12;
  
  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(progress, {duration: 1500})
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDasharray: [circumference * fill.value, circumference]
  }))
  const linesMain = [];
  for (let i = 0; i < numberOfLinesMain; i++) {
    const angle = (i / numberOfLinesMain) * 2 * Math.PI;
    const x1 = radius + innerRadius * Math.cos(angle);
    const y1 = radius + innerRadius * Math.sin(angle);
    const x2 = radius + (innerRadius - 15) * Math.cos(angle);
    const y2 = radius + (innerRadius - 15) * Math.sin(angle);
    linesMain.push(
        <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth="2" /> 
    );
  }
  const linesSub = [];
  for (let k = 0; k < numberOfLinesSub; k++) {
    const angle = (k / numberOfLinesSub) * 2 * Math.PI;
    const x1 = radius + innerRadius * Math.cos(angle);
    const y1 = radius + innerRadius * Math.sin(angle);
    const x2 = radius + (innerRadius - 8) * Math.cos(angle);
    const y2 = radius + (innerRadius - 8) * Math.sin(angle);
    linesSub.push(
        <Line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9f9f9f" strokeWidth="1" /> 
    );
  }
  const numberOfText = 4;


  const textElements = [];

  for (let j = 0; j < numberOfText; j++) {
    const angle = (j / numberOfText) * 2 * Math.PI;
    let textX = radius + (innerRadius) * Math.cos(angle);
    let textY = radius + (innerRadius) * Math.sin(angle);

    let textValue;
    let fontWeight
    let fontSize = 16;
    let textShadowColor
    let textShadowOffset
    let textShadowRadius
    switch (j) {
      case 0:
        textValue = "2 500";
        textY= textY-10
        textX= textX-75
        break;
      case 1:
        textValue = "5 000";
        textY= textY-70
        textX= textX-20
        break;
      case 2:
        textValue = "7 500";
        textY= textY-10
        textX= textX+40
        break;
      case 3:
        textValue = "10 000";
        textY= textY+40
        textX= textX-30
        fontSize= 23
        fontWeight='bold'
        textShadowColor='rgba(0, 0, 0, 0.3)'
        textShadowOffset= {width: -1, height: 1}
        textShadowRadius= 50
        
        break;
      default:
        break;
    }

    textElements.push(
      <View key={j} style={{ position: 'absolute', left: textX, top: textY }}>
        <Text style={{ color: 'black', fontSize,fontWeight, textShadowColor, textShadowRadius, textShadowOffset  }}>{textValue}</Text>
      </View>
    );
  }
 
  

  return (
    <View style={{ width: radius * 2, height: radius * 2, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
      <SVG style={{ flex: 1, display: 'flex' }}>
        {/* Background */}
        <Circle
          r={innerRadius}
          cx={radius} 
          cy={radius} 
          fill="transparent"
          stroke="#9f9f9f"
          strokeWidth={strokeWidth}
          opacity={0.2}
        />
        {linesMain}
        {linesSub}
        {textElements}
        <View style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <View style={{
          backgroundColor:'white',
          borderRadius:200,
          width:'40%',
          height:'40%',
          shadowColor: "black",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity:  0.60,
          shadowRadius: 1.51,
          elevation: 10,
         }}>
          <Avatar />
        </View>
        </View>
        {/* Foreground */}
        <AnimatedCircle
          animatedProps={animatedProps}
          r={innerRadius}
          cx={radius}
          cy={radius}
          fill="transparent"
          stroke='#00B4EC'
          strokeWidth={strokeWidth}
          strokeDasharray={[circumference * progress, circumference]}
          strokeLinecap="round"
          rotation="-90"
          originX={radius}
          originY={radius}
        />
      </SVG>
    </View>
  );
}

export default RingProgress;
