import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { decodeBase64url } from 'src/app/byte-array-converter/base64url';

import { Identity, IdentityService } from '../../../authentication';
import { Email } from '../../classes/email/email';
import { decodeAndParseMimeMessage, MimeMessage, parseMimeMessage } from '../../classes/mime-message/mime-message';
import { GmailApiService } from '../gmail-api/gmail-api.service';
import { PgpService } from '../pgp/pgp.service';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  /**
   * Gets a list of identities which are sufficient to send emails via Google Mail.
   */
  public get senderIdentities(): Identity[] {
    return this.identityService.identities.filter(
      id => (id.scopes?.indexOf('https://www.googleapis.com/auth/gmail.send') ?? -1) >= 0 && id.claims.email,
    );
  }

  /**
   * Constructs a new Email Service instance.
   * @param identityService Identity Service instance.
   * @param http HTTP Client instance.
   */
  constructor(
    private readonly identityService: IdentityService,
    private readonly pgpService: PgpService,
    private readonly http: HttpClient,
    private readonly gmailApiService: GmailApiService,
  ) { }


  public async readEmail(mailIndex: number): Promise<MimeMessage|undefined>{

    // find the google identity to send
    var identity = this.identityService.identities.find(id => id.identityProvider.name === "Google")
    if(identity == undefined){
      return undefined;
    }

    let messages = await this.gmailApiService.listMails(identity);
    //todo: delete gmail API accessToken logging
    console.log(identity.accessToken);

    let message = await this.gmailApiService.getMessage(identity, messages[mailIndex].id);

    if(message?.raw === undefined){
      return undefined;
    }
    
    let emailMessage = decodeAndParseMimeMessage(message.raw);
    return emailMessage;
  }

  /**
   * Sends an email.
   * @param email Email to send.
   */
  public async sendEmail(email: Email): Promise<void> {
    const emailString = await email.toRawString();
    console.log(emailString);
    await this.gmailApiService.sendMail(email.sender, emailString);
  }

  
}
