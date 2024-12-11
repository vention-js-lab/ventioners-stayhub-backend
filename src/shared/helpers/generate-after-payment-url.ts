interface GenerateAfterPaymentUrlParams {
  clientURL: string;
  success: boolean;
}

export const generateAfterPaymentUrl = ({
  clientURL,
  success,
}: GenerateAfterPaymentUrlParams) => {
  return `${clientURL}/payment?success=${success}`;
};
