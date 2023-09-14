import { useNavigation } from '@react-navigation/native'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native'
import { auth, db } from '../config/firebase'
import { addDoc, collection } from 'firebase/firestore'


function Register() {
    const navigation = useNavigation();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isValidEmail, setIsValidEmail] = useState(true);

    const validateEmail = async () => {
        try {
            const response = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=7304332f7c2e4f3b996d1dc5c37b550e&email=${email}`)
            const data = await response.json()
            setIsValidEmail(data.valid)
            console.log(data.valid);

        } catch (error) {
            console.log(error);
            alert("Invalid email")

        }
    }



    const fetchPassword = async () => {

        try {
            const response = await fetch('https://www.psswrd.net/api/v1/password/?length=8&lower=1&upper=1&int=1&special=1');
            const data = await response.json()
            const generatedPassword = data
            //Do something with the password
            setPassword(generatedPassword)
            console.log(generatedPassword);
        } catch (error) {
            console.log(error);
        }
    }

    // const [genPass, setGenPass] = useState("")
    async function register() {
        validateEmail()
        createUserWithEmailAndPassword(auth, email, password.password || password)
            .then((userCredential) => {
                // User signed in successfully
                const user = userCredential.user;

                // Get the user's authentication token
                user.getIdToken()
                    .then((token) => {
                        const userData = {
                            "fields": {
                                "email": {
                                    "stringValue": `${email}`
                                },
                                "token": {
                                    "stringValue": `${token}`
                                }

                            }
                        }
                        // Include the authentication token in requests to your Firebase endpoints
                        const headers = {
                            'Authorization': `Bearer ${token}`
                        };
                        // Make authenticated requests to your Firebase endpoints using the headers
                        fetch("https://firestore.googleapis.com/v1/projects/journal-app-69873/databases/(default)/documents/users/", {

                            method: 'POST',
                            headers: {
                                ...headers,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(userData),
                        })
                            .then((response) => {
                                // Handle the response from the endpoint
                                console.log("User details added to Firestore successfully");
                            })
                            .catch((error) => {
                                // Handle any errors
                                console.log("Error adding user details to Firestore:", error);
                            });
                    });
            })
            .catch((error) => {
                console.error('Error creating user:', error);
                if (isValidEmail) {
                    alert("Invalid email")
                } else {
                    alert('password needs to have at least 8 characters')
                }
            })





        // createUserWithEmailAndPassword(auth, email, password.password || password)
        //     .then(async (userCredentials) => {
        //         const user = userCredentials.user
        //         if (userCredentials && user) {
        //             const docRef = await addDoc(collection(db, "users"), {
        //                 email: email
        //             })
        //         }
        //         alert("User Successfully registered");
        //         // alert("Email sent for verification")
        //         navigation.navigate('Home')
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     })



    }








    return (
        <SafeAreaView style={styles.main}>
            <Text style={styles.heading}>SignUp</Text>
            <Text>Do you have an account? <Pressable onPress={() => navigation.navigate('Login')}><Text style={styles.span}>SignIn</Text></Pressable></Text>
            <TextInput
                placeholder='Email Adress'
                // type="email"
                onChangeText={(event) => setEmail(event)}
                // onBlur={validateEmail}
                style={styles.loginInput}
            />
            <TextInput
                placeholder='Password'
                // type="password"
                style={styles.loginInput}
                onChangeText={(event) => setPassword(event)}
                value={password.password || password}
                editable={true}
            // secureTextEntry={true}
            />
            <TouchableOpacity onPress={fetchPassword} style={styles.generate}>
                <Text style={styles.span}>Generate Password</Text>
            </TouchableOpacity>
            <Pressable onPress={register} style={styles.loginButton} >
                <Text style={styles.loginText}>Sign Up</Text>
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
    },

    generate: {
        marginLeft: "auto",
        position: "relative",
        right: 70,
    }
})


export default Register