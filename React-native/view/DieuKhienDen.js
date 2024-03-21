import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';
import axios from 'axios';

init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    sync: {}
});
const options = {
    host: 'broker.emqx.io',
    port: 8083,
    path: '/thnhnguen1502',
    id: 'id_' + parseInt(Math.random() * 100000)
};
//
const client = new Paho.MQTT.Client(options.host, options.port, options.path);

const DieuKhienDen = ({ navigation, }) => {
    const [msg, setMsg] = useState("No message");
    const [statusLed, setStatusLed] = useState("off");
    useEffect(() => {
        //step 1 connect Mqtt broker
        connect();
        // step 3 handling when message arrived
        client.onMessageArrived = onMessageArrived;
    }, []);
    const connect = () => {
        client.connect({
            onSuccess: () => {
                console.log("connect MQTT broker ok!");
                //step 2 subscribe topic
                subscribeTopic(); // ledstatus
            },
            useSSL: false,
            timeout: 5,
            onFailure: () => {
                console.log("connect fail");
                connect();
                console.log("reconnect ...");
            },
        });
    };
    const publishTopic = (deviceStatus,pirStatus) => {
        const s = '{"message":"turn on/offled","name":"led","status":"'+deviceStatus+'","pir":"'+pirStatus+'"}';
        var message = new Paho.MQTT.Message(s);
        message.destinationName = "nguythanhnguyen/ledstatus";
        client.send(message);
    };
    const subscribeTopic = () => {
        client.subscribe("nguythanhnguyen/ledstatus", { qos: 0 });
    };
    const onMessageArrived = async (message) => {
        console.log("onMessageArrived:" + message.payloadString);
        setMsg(message.payloadString);
        const jsondata = JSON.parse(message.payloadString);
        console.log(jsondata.message);
        setStatusLed(jsondata.status);
    };
    const handleButtonOn = async () => {
        //connect();
        console.log("turn on led...");
        publishTopic("on","have object move");
    };
    const handleButtonOff = async () => {
        console.log("turn off led...");
        publishTopic("off","haven't object move");
    };
    return (
        <View style={styles.containerLedView}>
            <View style={styles.header}>
                <FontAwesome5 name="home" size={64} color="orange" />
                <Text style={styles.title}>Smart Home</Text>
                <Text style={styles.subTitle}>ON / OFF LIGHT</Text>
            </View>
            <View style={styles.main}>
                {statusLed == "on" ? (
                    <View style={styles.boxLightOn}>
                        <FontAwesome5 name="lightbulb" size={64} color="orange" />
                    </View>
                ) : (
                    <View style={styles.boxLightOff}>
                        <FontAwesome5 name="lightbulb" size={64} color="grey" />
                    </View>
                )}
                <View style={styles.controlGroup}>
                    <Pressable
                        style={[styles.btnOff, styles.btn]}
                        onPress={() => handleButtonOff()}
                    >
                        <Text style={styles.btnText}>OFF</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.btnOn, styles.btn]}
                        onPress={() => handleButtonOn()}
                    >
                        <Text style={styles.btnText}>ON</Text>
                    </Pressable>
                </View>
                <Text style={styles.subTitle}>{msg}</Text>
            </View>
        </View>
    );
};



export default DieuKhienDen;
const styles = StyleSheet.create({
    containerLedView: {
        flex: 1,
        backgroundColor: "#212121",
        padding: 15,
    },
    header: {
        alignItems: "center",
    },
    title: {
        fontSize: 40,
        fontStyle: "bold",
        color: "orange",
    },
    subTitle: {
        fontSize: 20,
        fontStyle: "bold",
        color: "white",
    },
    main: {
        flex: 5,
        marginTop: 30,
        alignItems: "center",
    },
    controlGroup: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    btn: {
        alignItems: "center",
        width: 100,
        marginBottom: 5,
        marginTop: 5,
        justifyContent: "center",
        marginRight: 15,
        padding: 15,
        borderRadius: 5,
    },
    btnOn: {
        backgroundColor: "blue",
    },
    btnOff: {
        backgroundColor: "red",
    },
    btnText: {
        color: "#FFFFFF",
    },
    img: {
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
    },
    footer: {},
    boxLightOff: {
        width: 100,
        height: 100,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: "grey",
        padding: 15,
        justifyContent:'center',
        alignItems:'center',
    },
    boxLightOn: {
        width: 100,
        height: 100,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: "orange",
        padding: 15,
        justifyContent:'center',
        alignItems:'center',
    },
})