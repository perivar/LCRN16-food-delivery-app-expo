import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MapView, {
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';

import { IconButton } from '../../components';
import {
  COLORS,
  dummyData,
  FONTS,
  icons,
  images,
  SIZES,
} from '../../constants';
import { RootStackScreenProps } from '../../types';

const DeliveryMap = ({ navigation }: RootStackScreenProps<'Map'>) => {
  const mapView = React.useRef<MapView>();
  const [region, setRegion] = React.useState<Region>();
  const [toLoc, setToLoc] = React.useState<LatLng>();
  const [fromLoc, setFromLoc] = React.useState<LatLng>();
  const [angle, setAngle] = React.useState(0);

  const [isReady, setIsReady] = React.useState(false);
  const [duration, setDuration] = React.useState(0);

  React.useEffect(() => {
    let initialRegion: Region = {
      latitude: 58.85524552763719,
      longitude: 5.7201897059969475,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };

    let destination: LatLng = {
      latitude: 58.85524552763719,
      longitude: 5.7201897059969475,
    };

    setToLoc(destination);
    setFromLoc(dummyData.fromLocs[1]);

    setRegion(initialRegion);
  }, []);

  function renderMap() {
    return (
      <MapView
        ref={mapView}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}>
        {fromLoc && (
          <Marker
            key={'FromLoc'}
            coordinate={fromLoc}
            tracksViewChanges={false}
            // icon={icons.navigator1}
            rotation={angle}
            anchor={{ x: 0.5, y: 0.5 }}>
            <Image
              source={icons.navigator1}
              style={{ height: 32, width: 32 }}
            />
          </Marker>
        )}

        {toLoc && (
          <Marker
            key={'ToLoc'}
            coordinate={toLoc}
            tracksViewChanges={false}
            // icon={icons.location_pin}
            anchor={{ x: 0.5, y: 0.5 }}>
            <Image
              source={icons.location_pin}
              style={{ height: 32, width: 32 }}
            />
          </Marker>
        )}

        {/* <MapViewDirections
          origin={fromLoc}
          destination={toLoc}
          apikey={Constants.manifest.extra.apiKey}
          strokeWidth={5}
          strokeColor={COLORS.primary}
          optimizeWaypoints={true}
          onReady={result => {
            setDuration(Math.ceil(result.duration));

            if (!isReady) {
              // Fit the map based on the route
              mapView?.current?.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: SIZES.width * 0.1,
                  bottom: 400,
                  left: SIZES.width * 0.1,
                  top: SIZES.height * 0.1,
                },
              });

              // Reposition the navigator
              if (result.coordinates.length >= 2) {
                let calculatedAngle = utils.calculateAngle(result.coordinates);
                setAngle(calculatedAngle);
              }

              setIsReady(true);
            }
          }}
        /> */}
      </MapView>
    );
  }

  function renderHeaderButtons() {
    return (
      <>
        <IconButton
          icon={icons.back}
          containerStyle={{
            position: 'absolute',
            top: SIZES.padding * 2,
            left: SIZES.padding,
            ...styles.buttonStyle,
          }}
          iconStyle={{
            width: 20,
            height: 20,
            tintColor: COLORS.gray2,
          }}
          onPress={() => navigation.goBack()}
        />

        <View
          style={{
            position: 'absolute',
            top: SIZES.padding * 2,
            right: SIZES.padding,
          }}>
          <IconButton
            icon={icons.globe}
            containerStyle={{
              ...styles.buttonStyle,
            }}
            iconStyle={{
              width: 20,
              height: 20,
              tintColor: COLORS.gray,
            }}
            onPress={() => console.log('globe')}
          />
          <IconButton
            icon={icons.focus}
            containerStyle={{
              marginTop: SIZES.radius,
              ...styles.buttonStyle,
            }}
            iconStyle={{
              width: 20,
              height: 20,
              tintColor: COLORS.gray,
            }}
            onPress={() => console.log('focus')}
          />
        </View>
      </>
    );
  }

  function renderInfo() {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
        }}>
        {/* Linear Gradient */}
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={[COLORS.transparent, COLORS.lightGray1]}
          style={{
            position: 'absolute',
            top: -20,
            left: 0,
            right: 0,
            height: Platform.OS === 'ios' ? 200 : 50,
          }}
        />

        {/* Info Container */}
        <View
          style={{
            padding: SIZES.padding,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            backgroundColor: COLORS.white,
          }}>
          {/* Delivery Time */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={icons.clock}
              style={{
                width: 40,
                height: 40,
                tintColor: COLORS.black,
              }}
            />
            <View
              style={{
                marginLeft: SIZES.padding,
              }}>
              <Text style={{ color: COLORS.gray, ...FONTS.body4 }}>
                Your delivery time
              </Text>
              <Text style={{ ...FONTS.h3 }}>{duration} minutes</Text>
            </View>
          </View>

          {/* Address */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: SIZES.padding,
            }}>
            <Image
              source={icons.focus}
              style={{
                width: 40,
                height: 40,
                tintColor: COLORS.black,
              }}
            />
            <View
              style={{
                marginLeft: SIZES.padding,
              }}>
              <Text style={{ color: COLORS.gray, ...FONTS.body4 }}>
                Your Address
              </Text>
              <Text style={{ ...FONTS.h3 }}>88, Jin: Padungan, Kuchings</Text>
            </View>
          </View>

          {/* Delivery Man Details */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              height: 70,
              marginTop: SIZES.padding,
              borderRadius: SIZES.radius,
              paddingHorizontal: SIZES.radius,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.primary,
            }}>
            <Image
              source={images.profile}
              style={{
                width: 40,
                height: 40,
                borderRadius: 5,
              }}
            />
            <View
              style={{
                flex: 1,
                marginLeft: SIZES.radius,
              }}>
              <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                ByProgrammers
              </Text>
              <Text style={{ color: COLORS.white, ...FONTS.body4 }}>
                Delivery Man
              </Text>
            </View>

            <View
              style={{
                height: 40,
                width: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderRadius: 5,
                borderColor: COLORS.white,
                backgroundColor: COLORS.transparentWhite1,
              }}>
              <Image
                source={icons.call}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      {renderMap()}

      {/* Header Buttons */}
      {renderHeaderButtons()}

      {/* Footer / Info */}
      {renderInfo()}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray2,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default DeliveryMap;
