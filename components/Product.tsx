import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons"; // You can also use other icon libraries
import { COLORS } from "@/constants";
import { useRouter } from "expo-router";
import { useAddToCart } from "@/data/useCart";
import { useAddFavourite, useDeleteFavourite } from "@/data/useFavourites";
import {
  getStoredCartProductIds,
  getStoredFavouriteProductIds,
} from "@/data/useAppStatus";
import { useAuthStatus } from "@/data";

// Global state to track which product has an open dropdown
let currentOpenDropdown: string | null = null;
const dropdownCallbacks: Map<string, () => void> = new Map();

const ProductCard = ({
  name,
  image,
  price,
  rating,
  style,
  varints,
  productId,
}: any) => {
  const router = useRouter();
  const { mutateAsync: addToCart, isPending } = useAddToCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [qty, setQty] = useState(0);
  const dropdownHeight = useRef(new Animated.Value(0)).current;
  const dropdownOpacity = useRef(new Animated.Value(0)).current;
  const dropdownTranslateY = useRef(new Animated.Value(-50)).current;
  const { data: authStatus, isLoading, refetch } = useAuthStatus();

  const { mutateAsync: addFav } = useAddFavourite();
  const { mutateAsync: delFav } = useDeleteFavourite();

  // Check initial cart and favourites status
  useEffect(() => {
    const checkStatus = async () => {
      if (productId) {
        const [cartIds, favIds] = await Promise.all([
          getStoredCartProductIds(),
          getStoredFavouriteProductIds(),
        ]);

        setIsAdded(cartIds.includes(productId));
        setIsFav(favIds.includes(productId));
      }
    };
    checkStatus();
  }, [productId]);

  // console.log(varints, "varints");
  const getFirstVariantPrice = (variants: any) => {
    if (Array.isArray(variants) && variants.length > 0 && variants[0].price) {
      return variants[0].price;
    }
    return price; // fallback to main price prop
  };

  const handleProductPress = () => {
    router.push({
      pathname: "/productdetails",
      params: {
        productId,
      },
    });
  };

  const closeDropdown = () => {
    setShowDropdown(false);
    Animated.parallel([
      // Animated.timing(dropdownHeight, {
      //   toValue: 0,
      //   duration: 200,
      //   useNativeDriver: false,
      // }),
      Animated.spring(dropdownTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(dropdownOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    // Register this product's close callback
    dropdownCallbacks.set(productId, closeDropdown);
    return () => {
      dropdownCallbacks.delete(productId);
    };
  }, [productId]);

  const toggleDropdown = () => {
    if (isAdded) return;
    
    // Close any other open dropdown
    if (currentOpenDropdown && currentOpenDropdown !== productId) {
      const closeOther = dropdownCallbacks.get(currentOpenDropdown);
      if (closeOther) closeOther();
    }

    const toValue = showDropdown ? 0 : 1;
    setShowDropdown(!showDropdown);

    if (!showDropdown) {
      currentOpenDropdown = productId;
    } else {
      currentOpenDropdown = null;
    }

    Animated.parallel([
      Animated.spring(dropdownTranslateY, {
    toValue: toValue === 1 ? 0 : -50, // slide down from above
    useNativeDriver: true,
    tension: 50,
    friction: 7,
  }),

      // Animated.spring(dropdownHeight, {
      //   toValue: toValue * 120,
      //   useNativeDriver: false,
      //   tension: 50,
      //   friction: 7,
      // }),
      Animated.timing(dropdownOpacity, {
        toValue: toValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAddToCart = async (quantity: number) => {
    console.log("handleAddToCart", quantity);

    try {
      const firstVariantId =
        Array.isArray(varints) && varints.length > 0
          ? varints[0]?.id
          : undefined;
      if (!productId || !firstVariantId) return;
      // console.log({
      //   productId,
      //   variantId: firstVariantId,
      //   quantity,
      // },"tttttttt");
      await addToCart({
        productId,
        variantId: firstVariantId,
        quantity,
      });
      
      
      // setIsAdded(true);
      // currentOpenDropdown = null;
      // closeDropdown();
    } catch (error: any) {
      console.log(error);
      if (error?.response?.status === 401) {
        // Redirect to login page when unauthorized
        router.push('/login');
      }
    }
  };

  const toggleFavourite = async () => {
    if (!productId) return;
    try {
      if (isFav) {
        await delFav(productId);
        setIsFav(false);
      } else {
        // console.log(productId,'productIdddddd');

        await addFav({ productId });
        setIsFav(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={[styles.card, style]}>
      <TouchableOpacity style={styles.heartIcon} onPress={toggleFavourite}>
        <AntDesign
          name={isFav ? "heart" : "hearto"}
          size={22}
          color={COLORS.primary}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={handleProductPress}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleProductPress}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">{name}</Text>
      </TouchableOpacity>

      <View style={styles.ratingContainer}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FontAwesome
            key={i}
            name="star"
            size={14}
            color={i + 1 < rating ? "#FFA500" : "#DDD"}
          />
        ))}
      </View>

      <Text style={styles.price}>{getFirstVariantPrice(varints)} ج.م</Text>
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={authStatus?.isAuthenticated ?        ()=>      handleAddToCart(1)
 :()=> router.push("/login")}
        disabled={isPending || isAdded}
      >
        <AntDesign name={isAdded ? "check" : "plus"} size={18} color="#fff" />
      </TouchableOpacity>

      {/* Dropdown Menu */}
      <Animated.View
        style={[
          styles.dropdown,
          {
            opacity: dropdownOpacity,
                transform: [{ translateY: dropdownTranslateY }],

          },
        ]}
        pointerEvents={showDropdown ? "auto" : "none"}
      >
        <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>  
            <TouchableOpacity
              onPress={() => {
                setQty(qty+1);
              handleAddToCart(qty+1);
            }}
            style={{backgroundColor:COLORS.primary,padding:5,borderRadius:50}}
      >
        <AntDesign name={ "plus"} size={18} color="#fff" />
      </TouchableOpacity>
      <Text style={{fontSize:16,fontWeight:"bold",color:COLORS.primary}}>{qty}</Text>
      <TouchableOpacity
      disabled={qty==0}
       onPress={() => {
                setQty(qty-1);
              handleAddToCart(qty-1);
            }}
            style={{backgroundColor:COLORS.primary,padding:5,borderRadius:50,opacity:qty==0?0.5:1}}
      >
        <AntDesign name={"minus"} size={18} color="#fff" />
      </TouchableOpacity>

          
        </View>
        
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "30%",
    height: 200,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingBottom: 10,
    paddingTop: 5,

    paddingHorizontal: 5,
    margin: 9,
    alignItems: "center",
    position: "relative",
    // elevation: 2,
    direction: "rtl",
    borderWidth: 1,
    borderColor: COLORS.paleGreenDark,
  },
  heartIcon: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 222222,
  },
  imageContainer: {
    backgroundColor: COLORS.paleGreen,
    // height: "50%",
    borderRadius: 16,

    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // elevation: 2,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: "90%",
    resizeMode: "contain",
    marginVertical: 5,
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.gray,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 5,
  },
  placeholderText: {
    fontSize: 12,
    color: COLORS.white,
    textAlign: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
    marginTop:3,
    // width: "100%",
    // paddingRight: 5,
    color: COLORS.black,
    // backgroundColor:"red",
    // textAlign:"left"
  },
  ratingContainer: {
    flexDirection: "row",
    marginVertical: 6,
    width: "100%",
    paddingRight: 5,
    display:"none"
  },
  price: {
    color: COLORS.primary,
    fontWeight: "bold",
    // marginBottom: 10,
    width: "100%",
    paddingRight: 5,
  },
  addButton: {
    backgroundColor:COLORS.primary,
    padding: 8,
    position: "absolute",
    bottom: 0,
    left: 0,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 16,
    zIndex: 10,
  },
  dropdown: {
    position: "absolute",
    bottom: -50,
    left: 0,
    backgroundColor: COLORS.white,
    zIndex: 99999999,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 130,
    paddingHorizontal:12,
    paddingVertical:8
  },
  dropdownTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.paleGreenDark,
    textAlign: "center",
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.paleGreen,
  },
  dropdownItemSelected: {
    backgroundColor: COLORS.paleGreen,
  },
  dropdownItemText: {
    fontSize: 14,
    color: COLORS.black,
    textAlign: "center",
  },
  dropdownItemTextSelected: {
    fontWeight: "bold",
    color: COLORS.primary,
  },
});

export default ProductCard;
