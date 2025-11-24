import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Sarabun",
  fonts: [
    { src: "/fonts/Sarabun-Regular.ttf" }, // public/fonts/Sarabun-Regular.ttf
  ],
});

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Sarabun", fontSize: 14 },
  flexContainer: { display: "flex", flexDirection: "row", gap: 20 },
  heading: { fontSize: 20, fontWeight: "bold" },
  paragraph: { marginTop: 5 },
});

export const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.flexContainer}>
        <Text style={styles.heading}>รายงานข้อมูล</Text>
        <Text style={styles.paragraph}>ภาษาไทยทำงานได้ปกติ</Text>
        <Text style={styles.paragraph}>English text is also supported.</Text>
      </View>
    </Page>
  </Document>
);
