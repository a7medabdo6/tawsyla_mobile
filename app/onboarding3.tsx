import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageContainer from "../components/PageContainer";
import DotsView from "../components/DotsView";
import Button from "../components/Button";
import Onboarding1Styles from "../styles/OnboardingStyles";
import { COLORS, illustrations } from "../constants";
import { useNavigation } from "expo-router";
import { Image } from "expo-image";
import { useLanguageContext } from "../contexts/LanguageContext";

type Nav = {
  navigate: (value: string) => void;
};

const Onboarding3 = () => {
  const { navigate } = useNavigation<Nav>();
  const [progress, setProgress] = useState(0);
  const { t, isRTL } = useLanguageContext();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 1) {
          clearInterval(intervalId);
          return prevProgress;
        }
        return prevProgress + 0.5;
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  // useEffect(() => {
  //   if (progress >= 1) {
  //     // Navigate to the onboarding4 screen
  //     navigate('onboarding4')
  //   }
  // }, [progress, navigate]);

  return (
    <SafeAreaView
      style={[Onboarding1Styles.container, { backgroundColor: COLORS.white }]}
    >
      <PageContainer>
        <View
          style={[
            Onboarding1Styles.contentContainer,
            { direction: isRTL ? "rtl" : "ltr" },
          ]}
        >
          <Image
            source={illustrations.onboarding2}
            contentFit="contain"
            style={Onboarding1Styles.illustration}
          />
          <View style={[Onboarding1Styles.buttonContainer]}>
            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "100%",
                padding: 22,
              }}
            >
              <View>
                <View style={Onboarding1Styles.titleContainer}>
                  <Text style={[Onboarding1Styles.title]}>
                    {t("onboarding.screen2.title")}
                  </Text>
                  <Text style={[Onboarding1Styles.subTitle]}>
                    {t("onboarding.screen2.subtitle")}
                  </Text>
                </View>

                <Text style={[Onboarding1Styles.description]}>
                  {t("onboarding.screen2.description")}
                </Text>
                <View style={Onboarding1Styles.dotsContainer}>
                  {<DotsView progress={1} numDots={4} />}
                </View>
              </View>
              <View style={Onboarding1Styles.buttonsContainer}>
                <Button
                  filled
                  title={t("onboarding.next")}
                  onPress={() => navigate("onboarding4")}
                  style={Onboarding1Styles.nextButton}
                />
                <Button
                  title={t("onboarding.skip")}
                  onPress={() => navigate("login")}
                  style={Onboarding1Styles.skipButton}
                />
              </View>
            </View>
          </View>
        </View>
      </PageContainer>
    </SafeAreaView>
  );
};

export default Onboarding3;
