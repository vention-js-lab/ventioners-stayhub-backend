import { HttpException, HttpStatus } from '@nestjs/common';

export class MailSendingException extends HttpException {
  constructor(message = 'Failed to send email') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
