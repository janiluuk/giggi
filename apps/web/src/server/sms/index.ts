import type { SmsProvider } from "./provider";
import { MockSmsProvider } from "./mock";

export function getSmsProvider(): SmsProvider {
  const provider = process.env.SMS_PROVIDER ?? "mock";
  switch (provider) {
    case "mock":
      return new MockSmsProvider();
    default:
      return new MockSmsProvider();
  }
}

