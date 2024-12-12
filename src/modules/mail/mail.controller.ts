import { Controller, Param, Post } from '@nestjs/common';
import { MailerService } from './mail.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('/:id')
  async sendMail(@Param('id') id: string) {
    return await this.mailerService.sendReviewMail(id);
  }
}
