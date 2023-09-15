
import React, { useState } from 'react'
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import { auth } from '../config/firebase'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';


function Login() {
    const navigation = useNavigation();
    const [email, setEmail] = useState("")
    const [passWord, setPassWord] = useState("")

    async function login() {
        // const token = await auth.currentUser.getIdToken()
        // console.log("token console:", token);
        try {
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBmb2s9p-XO4pJE1QBr5FrTxm7ov8LFtio',

                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: passWord,
                        returnSecureToken: true
                    })
                });
            // Handle the response
            const data = await response.json();
            console.log(data); // or do something else with the response
            if (response.ok) {
                const user = JSON.stringify(data);
                await AsyncStorage.setItem("user", user).then(()=>{
                    console.log("saved")
                })
                navigation.navigate("Home")
            }

            // navigation.navigate("Home")
        } catch (error) {
            if (error.code === "auth/user-not-found") {
                alert("No user found with this email")
            } else if (error.code === "auth/wrong-password") {
                alert("Incorrect password")
            } else {
                alert(error)

            }
        }



    }



    return (
        <SafeAreaView style={styles.main}><Text style={styles.heading}>SignIn</Text>
            <Text>Don't have an account? <Pressable onPress={() => navigation.navigate('Register')}><Text style={styles.span}>SignUp</Text></Pressable></Text>
            <TextInput
                placeholder='Email Adress'
                type="email"
                onChangeText={(event) => setEmail(event)}
                style={styles.loginInput}
            />
            <TextInput
                placeholder='Password'
                type="password"
                style={styles.loginInput}
                onChangeText={(event) => setPassWord(event)}
            />
            <Pressable onPress={login} style={styles.loginButton} >
                <Text style={styles.loginText}>Login</Text>
            </Pressable>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: 20,
        width: "100%",
    },

    loginInput: {
        borderWidth: 1,
        width: 300,
        height: 50,
        borderRadius: 5,
        paddingLeft: 10
    },

    loginButton: {
        marginTop: 20,
        width: 180,
        height: 35,
        backgroundColor: "#F7C5C2",
        borderRadius: 10
    },

    loginText: {
        color: "white",
        textAlign: "center",
        marginTop: "auto",
        marginBottom: "auto",
    },
    span: {
        color: "red"
    },

    heading: {
        fontSize: 38,
        marginBottom: 20
    }

})

export default Login