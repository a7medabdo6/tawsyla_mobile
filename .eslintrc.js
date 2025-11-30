// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: "expo",
  ignorePatterns: ["/dist/*"],
  rules: {
    // تعطيل قواعد النقاط الفاصلة
    semi: "off",
    "@typescript-eslint/semi": "off",

    // تعطيل قواعد == vs ===
    eqeqeq: "off",

    // تعطيل قواعد الأخطاء الصارمة
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",

    // تعطيل قواعد React Hooks الصارمة (لكن احذر - قد تسبب مشاكل)
    "react-hooks/rules-of-hooks": "warn", // تحذير بدلاً من خطأ
    "react-hooks/exhaustive-deps": "warn",

    // تعطيل قواعد أخرى شائعة
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-console": "off",
    "prefer-const": "off",
  },
};
