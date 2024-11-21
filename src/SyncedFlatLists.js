import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";

const { width, height } = Dimensions.get("screen");
const IMAGE_SIZE = 80;
const SPACING = 8;

const SyncedFlatLists = () => {
  const [photos, setPhotos] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const topRef = useRef();
  const bottomRef = useRef();

  const scrollToActiveIndex = (index) => {
    setActiveIndex(index);
    topRef?.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });

    if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > width / 2) {
      bottomRef?.current?.scrollToOffset({
        offset: index * (IMAGE_SIZE + SPACING) - width / 2 + IMAGE_SIZE / 2,
        animated: true,
      });
    } else {
      bottomRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const apiKey =
          "AlV1RCnybGrfm1JfInOUH7HJmIs9Ib1LmxytV9EH23cXl8p3t4o5Xbyk";
        const response = await fetch(
          `https://api.pexels.com/v1/curated?per_page=30`,
          {
            headers: {
              Authorization: apiKey,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch photos");
        }

        const data = await response.json();
        setPhotos(data.photos);
      } catch (error) {
        console.error("Error fetching photos:", error.message);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={topRef}
        data={photos}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(ev) => {
          scrollToActiveIndex(
            Math.floor(ev.nativeEvent.contentOffset.x / width)
          );
        }}
        renderItem={({ item }) => {
          return (
            <View style={{ width, height }}>
              <Image
                source={{ uri: item.src.portrait }}
                style={[StyleSheet.absoluteFillObject]}
              />
            </View>
          );
        }}
      />
      <FlatList
        ref={bottomRef}
        data={photos}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ position: "absolute", bottom: IMAGE_SIZE }}
        contentContainerStyle={{ paddingHorizontal: SPACING }}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                scrollToActiveIndex(index);
              }}
            >
              <Image
                source={{ uri: item.src.portrait }}
                style={{
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                  marginRight: SPACING,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: activeIndex === index ? "#fff9" : "transparent",
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default SyncedFlatLists;
