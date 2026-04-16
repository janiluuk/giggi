import type { SmsProvider } from "./provider";

export class MockSmsProvider implements SmsProvider {
  async sendVerificationCode(args: { toPhoneE164: string; message: string }) {
    console.log(`[mock-sms] to=${args.toPhoneE164} message="${args.message}"`);
    return { providerMessageId: "mock" };
  }
}

