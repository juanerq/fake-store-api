export interface ValidateMissingRecordsById {
  records: { id: number }[];
  ids: number[];
  notFoundException?: boolean;
  customErrorMessage?: {
    singular: string;
    plural: string;
  };
  idListVariableName?: string;
}
