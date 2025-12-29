import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.grayscale100,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
  // Header Styles
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale200,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.tansparentPrimary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.black,
  },
  clearButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.tansparentPrimary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  clearButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontFamily: "bold",
  },
  
  // Filter Card Styles
  filterCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
  },
  filterCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale200,
  },
  filterIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.tansparentPrimary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  filterCardTitle: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.black,
  },
  
  // Search Bar Styles
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.grayscale100,
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 12,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.gray,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "regular",
    color: COLORS.black,
    textAlign: "right",
  },
  clearSearchButton: {
    padding: 4,
  },
  
  // Dropdown Styles
  dropdownButtonStyle: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.grayscale100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.black,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 14,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale200,
  },
  dropdownItemTxtStyle: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.black,
    marginRight: 8,
  },
  
  // Price Range Styles
  priceContainer: {
    gap: 12,
    direction: "ltr",
  },
  priceValueContainer: {
    backgroundColor: COLORS.grayscale100,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    minWidth: 100,
  },
  priceValueLabel: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.gray,
    marginBottom: 4,
  },
  priceValueText: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.black,
  },
  slider: {
    width: "100%",
    marginVertical: 10,
  },
  
  // Bottom Container Styles
  bottomContainer: {
    paddingVertical: 20,
    paddingBottom: 150,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "bold",
  },
  
  // Legacy Styles (kept for compatibility)
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
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    width: 16,
    height: 16,
  },
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerLogo: {
    height: 36,
    width: 36,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
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
});

export default styles;
