import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { WebView } from "react-native-webview";

export default function WebviewScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <WebView
        source={{ uri: "http://192.168.1.14:3000" }} // Use your computer's IP address
        style={{ flex: 1 }}
        startInLoadingState={true}
      />
    </SafeAreaView>
  );
}
