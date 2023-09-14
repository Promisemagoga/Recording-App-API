
import { useNavigation } from '@react-navigation/native';
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import * as React from 'react'
import { Pressable, SafeAreaView, StyleSheet, Text, View, Image, ScrollView, Modal, TextInput } from 'react-native'
import { auth, db } from '../config/firebase';
import { Audio } from 'expo-av';


function Recordings() {
    const [savedRecording, setSavedRecordings] = React.useState(null)
    const [updatedData, setUpdatedData] = React.useState([]);

    // const audioPlayer = new Audio('path/to/audio/file.mp3');

    const [sound, setSound] = React.useState(null);
    const [heading, setHeading] = React.useState("");


    React.useEffect(() => {
        getAudios()
    }, [])


    const getAudios = async () => {
        const response = await fetch(`https://firestore.googleapis.com/v1/projects/journal-app-69873/databases/(default)/documents/recordInfo/`)
        const data = await response.json()
        console.log(data);
        const filteredData = data.documents.filter(doc => doc.fields.userData.stringValue === auth.currentUser.email);
        setSavedRecordings(filteredData);
        console.log(filteredData);

    }

    const [isPlaying, setIsPlaying] = React.useState(false);


    const playSound = async (recordingUrl) => {
        try {
            if (isPlaying) {
                await sound.stopAsync();
            } else {
                const { sound } = await Audio.Sound.createAsync({ uri: recordingUrl });
                setSound(sound);
                await sound.playAsync();
            }
            setIsPlaying(!isPlaying);
        } catch (error) {
            console.log('Error playing sound', error);
        }
    };




    console.log(savedRecording);

    const navigation = useNavigation();


    function deleteFunc(id) {
        console.log(id);

        const stringId = id.split('/');
        const docId = stringId[stringId.length - 1]
        console.log(docId);
        fetch(`https://firestore.googleapis.com/v1/projects/journal-app-69873/databases/(default)/documents/recordInfo/${docId}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error deleting record");
                }
                return response.json();
            })
            .then(data => {
                console.log("Record deleted successfully");
                // Perform any additional actions after successfully deleting the record
            })
            .catch(error => {
                console.error(error);
                // Handle any errors that occurred during the deletion process
            });

    }




    const [isModalVisible, setIsModalVisible] = React.useState(false);

    const toggleModal = (data) => {
        setIsModalVisible(!isModalVisible);
        setUpdatedData(data);
    };


    const updateFunc = async () => {
        const documentId = updatedData.id

        const stringId = documentId.split('/');
        const docId = stringId[stringId.length - 1]
        console.log(docId);


        const data = {
            date: updatedData.date,
            recordingUrl: updatedData.recordingUrl,
            fileName: updatedData.fileName,
            recName: heading,
            duration: updatedData.duration
        }

       await fetch(`https://firestore.googleapis.com/v1/projects/journal-app-69873/databases/(default)/documents/recordInfo/${docId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(() => {
                if (!response.ok) {
                    throw new Error("Request failed");
                }
            }).catch((error) => {
                console.log(error);
            })
            return

    };
    // const docId = updatedData.id;

    // const data = {
    //     date: updatedData.date,
    //     recordingUrl: updatedData.recordingUrl,
    //     fileName: updatedData.fileName,
    //     recName: heading,
    //     duration: updatedData.duration
    // }

    // const docRef = doc(db, 'recordInfo', docId);
    // await updateDoc(docRef, data)
    //     .then(() => {
    //         console.log("Data successfully Updated");
    //         setIsModalVisible(false)
    //     })
    //     .catch((error) => {
    //         console.log("Error updating data:", error);
    //     })


    function logoutFunc() {
        auth.signOut()
        console.log("Successfully signed out");
        navigation.navigate("Login")

    }


    function handleChange(text) {
        setHeading(text)
    }

    // if(!savedRecording) return <View></View>

    return (
        <SafeAreaView style={styles.main}>
            <Text style={styles.heading}>My Journal</Text>
            <ScrollView style={styles.scroll}>
                <View style={styles.scrollCon}>
                    {savedRecording ? (
                        savedRecording.map((data, index) => (
                            <View style={[styles.card, styles.elevation]} key={index}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.textColor}>{data.fields.recName.stringValue}</Text>
                                    <Text style={styles.textColor}>{data.fields.date.stringValue}</Text>
                                </View>
                                <View style={styles.cardBottom}>

                                    <View>
                                        <Text style={styles.talkingText}>Your talking time</Text>
                                        <Text>{data.fields.duration.stringValue}</Text>
                                    </View>
                                    <View style={styles.buttons}>
                                        <Pressable onPress={() => playSound(data.fields.recordingUrl.stringValue)} style={styles.play}>
                                            <Text style={styles.textColor}>{isPlaying ? 'Pause' : 'Play'}</Text>
                                        </Pressable>
                                        <View style={styles.crudBtn}>
                                            <Pressable style={styles.crudButton} onPress={() => deleteFunc(data.name)}>
                                                <Text style={styles.crudText}>Delete</Text>
                                            </Pressable>
                                            <Pressable style={styles.crudButton} onPress={() => toggleModal(data)} >
                                                <Text style={styles.crudText} >Update</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text>No recordings found.</Text>
                    )}
                </View>
                <Modal visible={isModalVisible} >
                    <View style={styles.modal} >
                        <TextInput
                            placeholder="Enter heading..."
                            onChangeText={(text) => handleChange(text)}
                            style={styles.recordingHeading}
                        />
                        <Pressable onPress={updateFunc} style={styles.updatebtn}>
                            <Text style={styles.textColor}>Save Changes</Text>
                        </Pressable>
                    </View>
                </Modal>
            </ScrollView>
            <View style={styles.bottomNav}>
                <Pressable onPress={() => navigation.navigate('Recordings')}>
                    <Image source={require('../assets/waveSound.png')} style={styles.img} />
                </Pressable>
                <Pressable onPress={() => navigation.navigate('Home')}>
                    <Image source={require('../assets/microphone.png')} style={styles.img} />
                </Pressable>
                <Pressable onPress={logoutFunc}>
                    <Image source={require('../assets/logout.png')} style={styles.img} />
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
    },
    scroll: {
        width: "100%",
        flex: 1
    },
    heading: {
        marginTop: 50,
        padding: 20,
        fontSize: 30,
        fontWeight: "700"
    },

    card: {
        width: "80%",
        height: 250,
        marginTop: "auto",
        marginBottom: 20,
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        //     shadowColor: '#000',  
        //    elevation: 7, 
        borderRadius: 10

    },

    // elevation:{

    //     shadowColor: '#000',  
    //     elevation: 7, 
    // },

    cardHeader: {
        backgroundColor: "red",
        height: 100,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20
    },

    cardBottom: {
        marginBottom: "auto",
        height: 150,
        padding: 10,
        borderWidth: 2,
        borderColor: "red"
    },

    textColor: {
        color: "#ffffff"
    },


    bottomNav: {
        marginTop: "auto",
        display: 'flex',
        flexDirection: "row",
        // boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        width: "100%",
        justifyContent: "space-between",
        padding: 20
    },

    img: {
        width: 30,
        height: 30,
    },

    crudBtn: {
        display: "flex",
        flexDirection: "row",
        width: 130,
        justifyContent: "space-between",

    },

    buttons: {
        marginTop: "auto",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },

    play: {
        marginTop: "auto",
        backgroundColor: "red",
        width: 100,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20

    },

    updatebtn: {
        marginTop: 50,
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5
    },

    crudButton: {
        borderWidth: 1,
        borderColor: "red",
        padding: 5,
        borderRadius: 3


    },


    scrollCon: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    talkingText: {
        fontWeight: "500"
    },

    recordingHeading: {
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 50,
        borderWidth: 1,
        width: 250,
        height: 50

    },
    crudText: {
        color: "red"
    },

    modal: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"

    }

})

export default Recordings