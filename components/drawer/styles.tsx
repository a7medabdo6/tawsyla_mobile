import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
  },
  item: {
    marginVertical: 10,
  },
  title: {
    color: COLORS.black,
    fontWeight: "bold",
    fontSize: SIZES.h3,
    marginVertical: 5,
  },
  input: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: COLORS.primary,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  subtitle: {
    color: COLORS.gray,
    fontWeight: "700",
    fontSize: SIZES.h4,
  },
  category: {
    margin: 3,
    borderRadius: 15,
    borderWidth: 2,
    padding: 5,
    paddingHorizontal: 10,
  },
  text: {
    color: COLORS.black,
    fontSize: SIZES.h4,
  },
  line: {
    backgroundColor: COLORS.gray,
    height: 1,
    marginVertical: 10,
  },
  rowFilter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTxt: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: SIZES.h4,
  },
  searchContainer: {
    // paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    // backgroundColor: COLORS.paleGreen,
    backgroundColor: "#ccc",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: COLORS.paleGreenDark,
    borderWidth: 2,
    borderRadius: 14,
    // paddingHorizontal: 16,
    height: 48,
    width: "100%",
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.gray,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
    textAlign: "right",
  },
  filterButton: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    padding: 11,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    width: 16,
    height: 16,
    // tintColor: COLORS.gray,
  },
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    height: 36,
    width: 36,
    tintColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.black,
    marginHorizontal: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  clearButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "bold",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  sectionIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary,
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 5,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: COLORS.black,
    textAlign: "center",
  },
  categoryChipTextActive: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  checkmarkContainer: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  checkmarkIcon: {
    width: 12,
    height: 12,
    tintColor: COLORS.white,
  },
  priceContainer: {
    // flexDirection: "row",
    // alignItems: "center",
    gap: 12,
    direction: "ltr",
    marginHorizontal: 6,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  priceInput: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  priceSeparator: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  priceSeparatorText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  ratingContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginHorizontal: 6,
  },
  ratingChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  ratingChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  ratingChipText: {
    fontSize: 14,
    color: COLORS.black,
    textAlign: "center",
  },
  ratingChipTextActive: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  sortContainer: {
    gap: 8,
    marginHorizontal: 6,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  sortOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortOptionText: {
    fontSize: 14,
    color: COLORS.black,
  },
  sortOptionTextActive: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  checkIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.white,
  },
  bottomContainer: {
    // paddingHorizontal: 16,
    paddingVertical: 16,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  priceInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 14,
    color: COLORS.gray,
    marginRight: 8,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  star: {
    fontSize: 16,
    color: COLORS.gray,
    marginRight: 2,
  },
  starActive: {
    color: "#FFD700",
  },
  priceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    // marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pricePresets: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.paleGreen,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  presetText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "bold",
    textAlign: "center",
  },
  slider: {
    width: "100%", // Set the slider width to fit the screen
    // marginBottom: 20,
    // direction:"ltr",
    borderColor: COLORS.primary,
  },
  valueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  valueText: {
    fontSize: 16,
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 10, // Make the thumb circular
  },
  rail: {
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2, // Rounded rail
  },
  railSelected: {
    height: 4,
    backgroundColor: COLORS.primary, // Color for the selected rail
    borderRadius: 2, // Rounded selected rail
  },
  dropdownButtonStyle: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    fontSize: 16,
    color: COLORS.black,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  dropdownItemTxtStyle: {
    fontSize: 16,
    color: COLORS.black,
    marginRight: 8,
  },
});

export default styles;
