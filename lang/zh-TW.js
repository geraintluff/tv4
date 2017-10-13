(function (global) {
  var lang = {
    INVALID_TYPE: "無效類型：{type} (須為 {expected})",
    ENUM_MISMATCH: "{value} 並非可用值之一",
    ANY_OF_MISSING: "資料不符合任何 \"anyOf\" 模式",
    ONE_OF_MISSING: "資料不符合任何 \"oneOf\" 模式",
    ONE_OF_MULTIPLE: "資料同時符合第 {index1} 和第 {index2} 個 \"oneOf\" 模式",
    NOT_PASSED: "資料不應符合 \"not\" 模式",
    // Numeric errors
    NUMBER_MULTIPLE_OF: "數值 {value} 並非 {multipleOf} 的倍數",
    NUMBER_MINIMUM: "數值 {value} 必須是 {minimum} 或以上",
    NUMBER_MINIMUM_EXCLUSIVE: "數值 {value} 必須是 {minimum} 以上",
    NUMBER_MAXIMUM: "數值 {value} 必須是 {maximum} 或以下",
    NUMBER_MAXIMUM_EXCLUSIVE: "數值 {value} 必須是 {maximum} 以下",
    NUMBER_NOT_A_NUMBER: "{value} 並非數字",
    // String errors
    STRING_LENGTH_SHORT: "字串過短 ({length} 字), 最少 {minimum} 字",
    STRING_LENGTH_LONG: "字串過長 ({length} 字), 最多 {maximum} 字",
    STRING_PATTERN: "字串不符合表達式 {pattern}",
    // Object errors
    OBJECT_PROPERTIES_MINIMUM: "屬性不足 {minimum} 個 (現在 {propertyCount} 個)",
    OBJECT_PROPERTIES_MAXIMUM: "屬性超過 {maximum} 個 (現在 {propertyCount} 個)",
    OBJECT_REQUIRED: "缺少必要屬性: {key}",
    OBJECT_ADDITIONAL_PROPERTIES: "禁止額外屬性",
    OBJECT_DEPENDENCY_KEY: "{key} 須要屬性 {missing}",
    // Array errors
    ARRAY_LENGTH_SHORT: "陣列長度 {length} 不足 {minimum}",
    ARRAY_LENGTH_LONG: "陣列長度 {length} 超過 {maximum}",
    ARRAY_UNIQUE: "陣列元素 {match1} 和 {match2} 不能重複",
    ARRAY_ADDITIONAL_ITEMS: "禁止額外陣列元素",
    // Format errors
    FORMAT_CUSTOM: "自訂格式無效 ({message})",
    KEYWORD_CUSTOM: "自訂關鍵字 {key} 無效 ({message})",
    // Schema structure
    CIRCULAR_REFERENCE: "循環引用 ($refs): {urls}",
    // Non-standard validation options
    UNKNOWN_PROPERTY: "不明屬性 (不在 schema 中)"
  };

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['../tv4'], function(tv4) {
      tv4.addLanguage('zh-TW', lang);
      return tv4;
    });
  } else if (typeof module !== 'undefined' && module.exports){
    // CommonJS. Define export.
    var tv4 = require('../tv4');
    tv4.addLanguage('zh-TW', lang);
    module.exports = tv4;
  } else {
    // Browser globals
    global.tv4.addLanguage('zh-TW', lang);
  }
})(this);
