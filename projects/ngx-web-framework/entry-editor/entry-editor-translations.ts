export const ENTRY_EDITOR_TRANSLATIONS: Record<string, Record<string, Record<string, string>>> = {
  en: {
    ENTRY_EDITOR: {
      REQUIRED: '{{name}} is required',
      DAYS: 'Days',
      MIN_ERROR: 'Please enter a value higher than {{min}}',
      MAX_ERROR: 'Please enter a value lower than {{max}}',
      PATTERN_ERROR: 'Please make sure your input matches the pattern: {{regex}}',
      INVALID_VALUE: 'The entered value is invalid',
    },
  },
  de: {
    ENTRY_EDITOR: {
      REQUIRED: '{{name}} ist erforderlich',
      DAYS: 'Tage',
      MIN_ERROR: 'Bitte geben Sie einen Wert größer als {{min}} ein',
      MAX_ERROR: 'Bitte geben Sie einen Wert kleiner als {{max}} ein',
      PATTERN_ERROR: 'Bitte stellen Sie sicher, dass Ihre Eingabe dem Muster entspricht: {{regex}}',
      INVALID_VALUE: 'Der eingegebene Wert ist ungültig',
    },
  },
  it: {
    ENTRY_EDITOR: {
      REQUIRED: '{{name}} è obbligatorio',
      DAYS: 'Giorni',
      MIN_ERROR: 'Inserire un valore superiore a {{min}}',
      MAX_ERROR: 'Inserire un valore inferiore a {{max}}',
      PATTERN_ERROR: "Assicurarsi che l'input corrisponda al pattern: {{regex}}",
      INVALID_VALUE: 'Il valore inserito non è valido',
    },
  },
  zh: {
    ENTRY_EDITOR: {
      REQUIRED: '{{name}} 是必填项',
      DAYS: '天',
      MIN_ERROR: '请输入大于 {{min}} 的值',
      MAX_ERROR: '请输入小于 {{max}} 的值',
      PATTERN_ERROR: '请确保输入匹配以下模式：{{regex}}',
      INVALID_VALUE: '输入的值无效',
    },
  },
};
