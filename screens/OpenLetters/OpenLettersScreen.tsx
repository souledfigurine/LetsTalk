import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import Font from "@/constants/Font";
import Spacing from "@/constants/Spacing";
import { Colors } from "@/constants/Colors";
import { FlatList } from "react-native";
import MainHeader from "@/components/MainHeader";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/route/setdirectory";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  Timestamp,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { database } from "@/firebaseconfig";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "OpenLetters">;

const OpenLettersScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [post, setPosts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const now = Timestamp.now();
    const oneDayAgo = Timestamp.fromMillis(
      now.toMillis() - 24 * 60 * 60 * 1000
    );

    const q = query(
      collection(database, "openLetterPosts"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MainHeader title={"Open Letters"} />
        <View style={styles.createButton}>
          <TouchableOpacity
            style={{ top: 10 }}
            onPress={() => {
              navigation.navigate("OpenLetterNewPost");
            }}
          >
            <EvilIcons name="pencil" size={60} color={Colors.text}></EvilIcons>
          </TouchableOpacity>
        </View>

        <View style={{ zIndex: 1 }}>
          <FlatList
            data={post}
            numColumns={2}
            contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
            columnWrapperStyle={{ gap: 10, paddingHorizontal: 10 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.container}
                  onPress={() => {
                    navigation.navigate("OpenLetterPost", {
                      post: item,
                    });
                  }}
                >
                  <View style={styles.content}>
                    <View style={styles.user}>
                      <Ionicons name="person-circle" size={20} color="black" />
                      <Text style={styles.username}> {item.Username} </Text>
                    </View>

                    <Text ellipsizeMode="tail" style={styles.title}>
                      {" "}
                      {item.title}{" "}
                    </Text>
                    <Text ellipsizeMode="tail" style={styles.body}>
                      {" "}
                      {item.body}{" "}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default OpenLettersScreen;

const numColumns = 2;
const screenWidth = Dimensions.get("window").width;
const horizontalPadding = 20; // paddingHorizontal in your FlatList container
const gapBetweenItems = 20; // gap in columnWrapperStyle

const itemWidth =
  (screenWidth - horizontalPadding * 2 - gapBetweenItems) / numColumns;
const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    color: Colors.darkText,
    fontFamily: Font["poppins-semiBold"],
    textAlign: "left",
    textAlignVertical: "center",
  },
  body: {
    fontSize: 11,
    color: Colors.darkText,
    fontFamily: Font["inter-medium"],
    textAlign: "left",
    textAlignVertical: "center",
    lineHeight: 17.5,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  container: {
    backgroundColor: Colors.lightPrimary,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
    flex: 1,
    borderRadius: 15,
    width: itemWidth,
    height: 200,
    marginLeft: 10,
  },
  content: {
    backgroundColor: Colors.lightPrimary,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
    flex: 1,
    borderRadius: 15,
    width: itemWidth,
    height: 200,

    padding: Spacing,
  },
  createButton: {
    position: "absolute",
    zIndex: 5,
    right: 50,
    bottom: 30,
    backgroundColor: Colors.lightyellow,
    borderRadius: 100,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowColor: Colors.text,
    elevation: 10,
    height: 80,
    width: 80,
    alignItems: "center",
    zIndex: 5,
  },
  user: {
    textAlign: "left",
    textAlignVertical: "center",
    paddingBottom: 1,
    marginHorizontal: Spacing,
    flexDirection: "row",
  },
  username: {
    fontSize: 13,
    color: Colors.darkText,
    fontFamily: Font["poppins-regular"],
    textAlign: "left",
    textAlignVertical: "center",
  },
});
