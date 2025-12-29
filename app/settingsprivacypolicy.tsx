import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";
import Header from "../components/Header";
import { ScrollView } from "react-native-virtualized-view";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { useSettings } from "@/data/useSettings";
import HTMLView from 'react-native-htmlview';

// change the privacy data based on your data
const SettingsPrivacyPolicy = () => {
  const { t, isRTL } = useLanguageContext();
const { data } = useSettings();
  // console.log(data?.privacyPolicy);
  return (
    <SafeAreaView
      style={[
        styles.area,
        { backgroundColor: COLORS.white, direction: isRTL ? "rtl" : "ltr" },
      ]}
    >
      <Header
          title=" سياسة الخصوصية
"
        />
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        
        <ScrollView showsVerticalScrollIndicator={false} >
        <HTMLView
            value={data?.privacyPolicy}
            stylesheet={styles}
          />
        </ScrollView>
          {/* <View>
            <Text style={[styles.settingsTitle, { color: COLORS.black }]}>
              1. المعلومات التي نجمعها
            </Text>
            <Text style={[styles.body, { color: COLORS.greyscale900 }]}>
              عند استخدام التطبيق، قد نقوم بجمع المعلومات التالية:
            </Text>
            <Text style={[styles.body, { color: COLORS.greyscale900 }]}>
              رقم الهاتف
            </Text>
            <Text style={[styles.body, { color: COLORS.greyscale900 }]}>
              عنوان التوصيل
            </Text>
            <Text style={[styles.body, { color: COLORS.greyscale900 }]}>
              البريد الإلكتروني (إن وُجد)
            </Text>
            <Text style={[styles.body, { color: COLORS.greyscale900 }]}>
              الموقع الجغرافي (لتحديد موقع الطلب أو التوصيل)
            </Text>
            <Text style={[styles.body, { color: COLORS.greyscale900 }]}>
              بيانات الدفع (بطاقة الائتمان أو طرق الدفع الأخرى)
            </Text>
            <Text style={[styles.body, { color: COLORS.greyscale900 }]}>
              معلومات الجهاز (نظام التشغيل، نوع الجهاز، معرفات فريدة)
            </Text>
          </View>
          <View>
            <Text style={[styles.settingsTitle, { color: COLORS.black }]}>
              2. كيفية استخدام المعلومات
            </Text>
            <Text style={[styles.body, { color: COLORS.greyscale900 }]}>
              نستخدم المعلومات التي نجمعها من أجل:
            </Text>
            <Text style={[styles.body, { color: COLORS.greyscale900 }]}>
              معالجة الطلبات وتقديم خدمات التوصيل
            </Text>
            <Text style={[styles.body, { color: COLORS.greyscale900 }]}>
              التواصل معك بشأن طلباتك أو استفساراتك
            </Text>
            <Text style={[styles.body, { color: COLORS.greyscale900 }]}>
              تحسين جودة التطبيق وتجربة المستخدم
            </Text>
            <Text style={[styles.body, { color: COLORS.greyscale900 }]}>
              منع الأنشطة غير القانونية أو الاحتيالية
            </Text>
            <Text style={[styles.body, { color: COLORS.greyscale900 }]}>
              إرسال الإشعارات (في حال قمت بالموافقة عليها)
            </Text>
          </View>
          <View>
            <Text style={[styles.settingsTitle, { color: COLORS.black }]}>
              3. مشاركة المعلومات
            </Text>
            <Text style={[styles.body, { color: COLORS.greyscale900 }]}>
              نحن لا نبيع أو نشارك معلوماتك الشخصية مع أطراف ثالثة، إلا في
              الحالات التالية:
            </Text>
            <Text style={[styles.body, { color: COLORS.greyscale900 }]}>
              شركات التوصيل أو السائقين لتنفيذ الطلب
            </Text>
            <Text style={[styles.body, { color: COLORS.greyscale900 }]}>
              الامتثال للأنظمة والقوانين أو استجابةً لأوامر قضائية
            </Text>
            <Text style={[styles.body, { color: COLORS.greyscale900 }]}>
              مقدمي خدمات الدفع الآمن (مثل بوابات الدفع)
            </Text>
          </View> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  settingsTitle: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.black,
    marginVertical: 26,
  },
  body: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.black,
    marginTop: 4,
  },
});

export default SettingsPrivacyPolicy;
