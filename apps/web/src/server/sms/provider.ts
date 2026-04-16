export type SmsSendResult = { providerMessageId?: string };

export interface SmsProvider {
  sendVerificationCode(args: { toPhoneE164: string; message: string }): Promise<SmsSendResult>;
}

