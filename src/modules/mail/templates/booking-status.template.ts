import { Booking } from 'src/modules/bookings/entities/booking.entity';
import dayjs from 'dayjs';

export const generateBookingStatusMail = (booking: Booking) => {
  const { user, accommodation, checkInDate, checkOutDate, totalPrice, status } =
    booking;
  const checkInDateStr = dayjs(checkInDate)
    .locale('uz')
    .format('dddd, MMMM D, YYYY');
  const checkOutDateStr = dayjs(checkOutDate)
    .locale('uz')
    .format('dddd, MMMM D, YYYY');

  const htmlContent = `
   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
  <div style="background-color: #007bff; color: white; text-align: center; padding: 15px;">
    <h2 style="margin: 0; font-size: 20px;">Booking Status Update</h2>
  </div>
  <div style="padding: 15px; color: #333;">
    <p style="margin: 0;">Dear <strong>${user.firstName}</strong>,</p>
    <p style="margin: 0;">Your booking at <strong>${accommodation.name}</strong> has been updated. Here are the details:</p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 0px; padding-top: 0">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1; font-weight: bold;">Accommodation</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${accommodation.name}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1; font-weight: bold;">Location</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${accommodation.location}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1; font-weight: bold;">Check-in</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${checkInDateStr}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1; font-weight: bold;">Check-out</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${checkOutDateStr}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1; font-weight: bold;">Total Price</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${totalPrice} USD</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1; font-weight: bold;">Status</td>
        <td style="padding: 8px; border: 1px solid #ddd; color: ${
          status === 'CANCELLED' ? 'red' : 'brown'
        };">${status}</td>
      </tr>
    </table>
    <p style="margin: 10px 0;">For any queries, please feel free to <a href="mailto:support@stayhub.com" style="color: #007bff; text-decoration: none;">contact us</a>.</p>
    <p style="margin: 0;">Warm regards,<br><strong>Stayhub Team</strong></p>
  </div>
  <div style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #666;">
    <p style="margin: 0;">Stayhub © 2024 | All rights reserved.</p>
  </div>
</div>

  `;

  return htmlContent;
};
