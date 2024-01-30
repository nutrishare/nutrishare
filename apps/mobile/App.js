import { CameraView, useCameraPermissions } from "expo-camera/next";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Modal,
} from "react-native";

export default function App() {
  if (Platform.OS === "android") {
    return AndroidCodeScanner();
  } else if (Platform.OS === "ios") {
    return IOSCodeScanner();
  }
}

function AndroidCodeScanner() {
  useCameraPermissions();
  const [barcode, setBarcode] = useState(null);
  const [scannerActive, setScannerActive] = useState(false);

  const onBarcodeScanned = (result) => {
    setBarcode(result.data);
    setScannerActive(false);
  };

  const launchScanner = () => {
    setScannerActive(true);
  };

  if (scannerActive) {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={scannerActive}
        onRequestClose={() => setScannerActive(false)}
      >
        <CameraView
          style={{ flex: 1, width: "100%" }}
          facing="back"
          barcodeScannerSettings={{
            barCodeTypes: ["qr", "upc_a", "upc_e", "ean13", "ean8"],
          }}
          onBarcodeScanned={onBarcodeScanned}
        />
      </Modal>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity style={styles.button} onPress={launchScanner}>
          <Text style={styles.text}>Scan Barcode</Text>
        </TouchableOpacity>
      </View>
      {barcode && <Text style={{ flex: 1, color: "black" }}>{barcode}</Text>}

      <StatusBar style="auto" />
    </View>
  );
}

function IOSCodeScanner() {
  const [barcode, setBarcode] = useState(null);

  const onBarcodeScanned = async (result) => {
    setBarcode(result.data);
    await CameraView.dismissScanner();
  };

  useEffect(() => {
    const subscription = CameraView.onModernBarcodeScanned(onBarcodeScanned);
    return subscription.remove;
  });

  const launchScanner = async () => {
    await CameraView.launchModernScanner({
      barCodeTypes: ["upca", "upce", "ean13", "ean8", "qr"],
      isGuidanceEnabled: true,
      isHighlightingEnabled: true,
      isPinchToZoomEnabled: true,
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity style={styles.button} onPress={launchScanner}>
          <Text style={styles.text}>Scan Barcode</Text>
        </TouchableOpacity>
      </View>
      {barcode && <Text style={{ flex: 1, color: "black" }}>{barcode}</Text>}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    color: "white",
    textAlign: "center",
  },
  button: {
    borderRadius: 4,
    padding: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
  },
});
