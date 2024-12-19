import { Booking } from 'src/modules/bookings/entities/booking.entity';

export const generatePaymentReviewTemplate = (
  booking: Booking,
  reviewPageUrl: string,
) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #f9f9f9;">
  <div style="background-color: #007bff; color: white; text-align: center; padding: 20px;">
    <h2 style="margin: 0; font-size: 22px;">We Value Your Feedback</h2>
  </div>
  <div style="padding: 20px; color: #333;">
    <p style="margin: 0 0 10px;">Dear <strong>${booking.user.firstName}</strong>,</p>
    <p style="margin: 0 0 20px;">Thank you for staying at <strong>${booking.accommodation.name}</strong>. We hope you had a fantastic experience!</p>
    <p style="margin: 0 0 20px;">We would greatly appreciate it if you could take a moment to review your stay. Your feedback helps us improve!</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${reviewPageUrl}" style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: white; text-decoration: none; font-size: 14px; border-radius: 5px;">Leave a Review</a>
    </div>
    <p style="margin: 0;">Thank you for your time and support.</p>
    <p style="margin: 20px 0 0;">Warm regards,<br><strong>Stayhub Team</strong></p>
  </div>
  <div style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #666;">
    <p style="margin: 0;">Stayhub © 2024 | All rights reserved.</p>
  </div>
</div>

  `;

  return htmlContent;
};
