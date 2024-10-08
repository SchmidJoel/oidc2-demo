import * as openpgp from 'openpgp';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Identity, IdentityService } from '../../../authentication';
import { Email } from '../../classes/email/email';
import { decodeAndParseMimeMessage, MimeMessage } from '../../classes/mime-message/mime-message';
import { GmailApiService } from '../gmail-api/gmail-api.service';
import { PgpService } from '../pgp/pgp.service';
import { AttachmentFile } from '../../classes/attachment-file/attachment-file';
import { E2ePopPgpOptions } from '../../types/e2e-pop-pgp-options.interface';

import * as jose from 'jose';

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
    private readonly gmailApiService: GmailApiService,
  ) { }


  /**
   * read i-th messate of the inbox-folder
   * @param mailIndex 
   * @param identity 
   * @returns 
   */
  public async readEmail(mailIndex: number, identity: Identity): Promise<MimeMessage|undefined>{
    let listMailsResult = await this.gmailApiService.listMails(identity);
    if(!listMailsResult){
      return undefined;
    }
    let message = await this.gmailApiService.getMessage(identity, listMailsResult.messages[mailIndex].id);

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
  public async sendEmail(email: Email, privateKey: openpgp.PrivateKey, passphrase: string, encrypted: boolean): Promise<boolean> {
    let emailString: string | undefined;
    
    if(encrypted){
      let encryptionKeys = this.pgpService.getEncryptionKeys(email.sender, email.receiver);
      if(encryptionKeys!== undefined){
        emailString = await email.toRawEncryptedMimeString(encryptionKeys, privateKey, passphrase);
      }
    }
    else{
      emailString = await email.toRawMimeString(privateKey, passphrase);
    }
    if(emailString !== undefined){
      let res = await this.gmailApiService.sendMail(email.sender, emailString);
      return res !== undefined;
    }
    return false;
  }  
}
