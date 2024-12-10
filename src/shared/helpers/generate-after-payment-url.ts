interface GenerateAfterPaymentUrlParams {
  accommodationId: string;
  bookingId: string;
  success: boolean;
  clientURL: string;
}

export const generateAfterPaymentUrl = ({
  accommodationId,
  bookingId,
  success,
  clientURL,
}: GenerateAfterPaymentUrlParams) => {
  return `${clientURL}/property/${accommodationId}?success=${success}&bookingId=${bookingId}`;
};
