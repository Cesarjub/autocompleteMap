import React, { useEffect, useRef } from 'react'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'

import * as Location from 'expo-location'

import { View, StyleSheet, ToastAndroid, Pressable } from 'react-native'

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { Icon } from 'react-native-elements'

import { GOOGLE_MAPS_API_KEY } from '../config'

const Autocomplete = () =>
{
    const ref = useRef()

    useEffect(() => {
    
        (async () => {
      
            const { status } = await Location.requestForegroundPermissionsAsync()

            if (status !== 'granted') 
            {
                showToast( 'Permisos denegados.' )
                setOrigin( { latitude: 20.97537, longitude: -89.61696 } )
                return
            }
      
            const location = await Location.getCurrentPositionAsync({})

            const coordinates = { latitude: location.coords.latitude, longitude: location.coords.longitude } 

            setOrigin( coordinates )

            const address = await Location.reverseGeocodeAsync( coordinates )

            ref.current?.setAddressText( address[0].district )

        })()

    }, [])

    const showToast = ( message = 'Error' ) => {
        ToastAndroid.show(message, ToastAndroid.SHORT)
    }

    const clearInput = () =>
    {
      ref.current?.clear()
    }

    const setLocation = ( coordinates ) =>
    {
        ( { lat, lng } = JSON.parse(coordinates) )

        setOrigin( { latitude: lat, longitude: lng } )
    }

    const [ origin, setOrigin ] = React.useState({
        latitude: 19.42847,
        longitude: -99.12766
    })

    return (

        <View style = { styles.container } >

            <MapView 
                provider = { PROVIDER_GOOGLE }
                style = { styles.map } 
                initialRegion = {{
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
            >
                <Marker 
                    coordinate = { origin }
                />
            </MapView>

            <View style = { styles.autocompleteContainer } >

                <Pressable style = { styles.clearButton } onPress = { clearInput } >
                    <Icon
                        name = 'close' 
                    />
                </Pressable>

                <GooglePlacesAutocomplete
                    ref = { ref }
                    placeholder = 'Ubicación'
                    minLength = { 3 } 
                    fetchDetails = { true }
                    onPress = { ( data, details = null ) => {
                        setLocation( JSON.stringify(details?.geometry?.location) )
                    }}
                    onFail = { ( error ) => showToast( error ) }
                    query = {{
                        key: GOOGLE_MAPS_API_KEY,
                        language: 'es',
                    }}
                    styles = { styles.autocomplete }
                />

            </View>

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    autocompleteContainer: {
        zIndex: 99999999999,
        flex: 0.5,
        marginTop: 40,
        padding: 15
    },
    autocomplete: {
        container: {
            flex: 1,
            marginTop: 4,
        },
        textInput: {
            backgroundColor: '#FFF',
            borderRadius: 16,
        },
        powered: {
            display: 'none',
        },
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -999999999
    },
    clearButton: {
        position: 'absolute',
        alignSelf: 'center',
        right: 20,
        top: 28,
        zIndex: 99999
    },
})

export default Autocomplete