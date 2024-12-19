import { Booking } from 'src/modules/bookings/entities/booking.entity';
import dayjs from 'dayjs';

export const generatePaymentInvoiceMail = (booking: Booking) => {
  const issueDate = dayjs().format('MMMM D, YYYY');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
<div style="background-color: #007bff; color: white; text-align: center; padding: 15px;">
  <h2 style="margin: 0; font-size: 20px;">Booking Invoice</h2>
</div>
<div style="padding: 15px;">
  <p style="margin: 0;">Dear <strong>${booking.user.firstName}</strong>,</p>
  <p style="margin:  0;">Thank you for booking with Stayhub. Below are your invoice details:</p>
  <table style="width: 100%; border-collapse: collapse; margin-top: 0px; padding-top: 0">
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1; font-weight: bold;">Booking ID</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${booking.id}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1; font-weight: bold;">Accommodation</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${booking.accommodation.name}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1; font-weight: bold;">Issue Date</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${issueDate}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1; font-weight: bold;">Total Payment</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${booking.totalPrice} USD</td>
    </tr>
  </table>
  <p style="margin: 10px 0;">For any assistance, please <a href="mailto:support@stayhub.com" style="color: #007bff; text-decoration: none;">contact us</a>.</p>
  <p style="margin: 0;">Warm regards,<br><strong>Stayhub Team</strong></p>
</div>
<div style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #666;">
  <p style="margin: 0;">Stayhub © 2024 | All rights reserved.</p>
</div>
</div>

`;
  return htmlContent;
};
