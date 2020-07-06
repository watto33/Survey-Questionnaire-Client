export interface Questionnaire {
  id: number;
  identifier: string;
  name: string;
  questions: [
    {
      question_type: string;
      identifier: string;
      headline: string;
      description: string;
      required: boolean;
      multiple: string;
      choices?: [
        {
          label: string;
          value: string;
          selected: boolean;
        }
      ];
    }
  ];
  description: string;
  Category_name_hyphenated: string;
}
