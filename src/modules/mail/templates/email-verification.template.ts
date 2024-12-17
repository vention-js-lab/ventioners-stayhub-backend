import { FOOTER_TEMPLATE } from './footer.template';
import { HEADER_TEMPLATE } from './header.template';

interface EmailVerificationProps {
  username: string;
  verificationLink: string;
  expirationMinutes: number;
}

export const generateEmailVerificationTemplate = ({
  username,
  verificationLink,
  expirationMinutes,
}: EmailVerificationProps) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - StayHub</title>
  <style>
    body {
      font-family: 'Inter', Arial, sans-serif;
      line-height: 1.6;
      color: #2D2D2D;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .logo-container {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }
    .logo-container svg {
      max-width: 200px;
      max-height: 60px;
    }
    .verification-box {
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      margin: 20px 0;
    }
    .verify-button {
      display: inline-block;
      background-color: #FF385C;
      color: white !important;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
  </style>
</head>
<body>
 ${HEADER_TEMPLATE}
  
  <div class="container">
    <div class="verification-box">
      <h1 style="color: #2D2D2D; margin-bottom: 16px;">Verify Your Email</h1>
      
      <p>Hi ${username},</p>
      
      <p>
        Thank you for signing up with StayHub. To complete your registration, 
        please verify your email address by clicking the button below:
      </p>
      
      <a href="${verificationLink}" class="verify-button" 
         style="display: inline-block; background-color: #FF385C; color: white !important; 
                text-decoration: none; padding: 12px 24px; border-radius: 6px; 
                font-weight: 600; margin: 20px 0;">
        Verify Email
      </a>
      
      <p>
        This link will expire in ${expirationMinutes} minutes. 
        If you didn't create an account, please ignore this email.
      </p>
      
      <p style="color: #6c757d; font-size: 0.9em;">
        If the button doesn't work, copy and paste this link into your browser:
        <br>
        <span style="word-break: break-all;">${verificationLink}</span>
      </p>
    </div>
  </div>
  
  ${FOOTER_TEMPLATE}
</body>
</html>
`;
