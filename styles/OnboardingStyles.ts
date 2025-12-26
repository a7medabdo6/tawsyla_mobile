import { StyleSheet } from "react-native";
import { COLORS, FONTS, SIZES } from "../constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  illustration: {
    height: SIZES.width * 0.76,
    width: SIZES.width * 0.76,
    position: "absolute",
    bottom: 360,
    top: 30,
  },
  ornament: {
    position: "absolute",
    bottom: 372,
    zIndex: -99,
    width: SIZES.width * 0.7,
  },
  titleContainer: {
    marginVertical: 18,
    alignItems: "center",
  },
  title: {
    ...FONTS.h2,
    color: "#212121",
    textAlign: "center",
  },
  subTitle: {
    ...FONTS.h3,
    color: "#212121",
    textAlign: "center",
    marginTop: 8,
  },
  description: {
    ...FONTS.body3,
    color: "#212121",
    textAlign: "center",
    marginBottom: 16,
  },
  dotsContainer: {
    marginBottom: 20,
    marginTop: 38,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: SIZES.sm_radius,
    borderTopRightRadius: SIZES.sm_radius,
    height: 360,
  },
  nextButton: {
    width: 100,
    marginBottom: SIZES.padding,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    // marginTop: 22,
  },
  skipButton: {
    width: 100,
    marginBottom: SIZES.padding,
    backgroundColor: "transparent",
    borderColor: COLORS.primary,
  },
});

export default styles;
