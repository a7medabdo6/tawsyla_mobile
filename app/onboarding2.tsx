import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Onboarding1Styles from "../styles/OnboardingStyles";
import { COLORS, illustrations } from "../constants";
import { useNavigation } from "expo-router";
import { Image } from "expo-image";
import PageContainer from "@/components/PageContainer";
import DotsView from "@/components/DotsView";
import Button from "@/components/Button";
import { useLanguageContext } from "../contexts/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";

type Nav = {
  navigate: (value: string) => void;
};

const Onboarding2 = () => {
  const [progress, setProgress] = useState(0);
  const { navigate } = useNavigation<Nav>();
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
  //     // Navigate to the onboarding3 screen
  //     navigate('onboarding3')
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
            source={illustrations.onboarding1}
            contentFit="contain"
            style={Onboarding1Styles.illustration}
          />
          <View style={Onboarding1Styles.buttonContainer}>
            {/* <LanguageSwitcher /> */}
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
                    {t("onboarding.screen1.title")}
                  </Text>
                  <Text style={[Onboarding1Styles.subTitle]}>
                    {t("onboarding.screen1.subtitle")}
                  </Text>
                </View>

                <Text style={[Onboarding1Styles.description]}>
                  {t("onboarding.screen1.description")}
                </Text>
                <View style={Onboarding1Styles.dotsContainer}>
                  {<DotsView progress={0} numDots={4} />}
                </View>
              </View>

              <View style={Onboarding1Styles.buttonsContainer}>
                <Button
                  filled
                  title={t("onboarding.next")}
                  onPress={() => navigate("onboarding3")}
                  style={Onboarding1Styles.nextButton}
                  textColor={COLORS.primary}
                />
                <Button
                  title={t("onboarding.skip")}
                  onPress={() => navigate("login")}
                  textColor={COLORS.primary}
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

export default Onboarding2;
