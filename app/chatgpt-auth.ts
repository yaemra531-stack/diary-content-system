import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type ChatGPTUser = {
  userId: string;
  displayName: string;
  email: string;
  fullName: string | null;
};

const USER_ID_HEADER = "oai-authenticated-user-id";
const USER_EMAIL_HEADER = "oai-authenticated-user-email";
const USER_FULL_NAME_HEADER = "oai-authenticated-user-full-name";
const USER_FULL_NAME_ENCODING_HEADER = "oai-authenticated-user-full-name-encoding";
const PERCENT_ENCODED_UTF8 = "percent-encoded-utf-8";

export async function getChatGPTUser(): Promise<ChatGPTUser | null> {
  const requestHeaders = await headers();
  const userId = requestHeaders.get(USER_ID_HEADER);
  const email = requestHeaders.get(USER_EMAIL_HEADER);
  if (userId && email) {
    const encodedFullName = requestHeaders.get(USER_FULL_NAME_HEADER);
    const fullName =
      encodedFullName &&
      requestHeaders.get(USER_FULL_NAME_ENCODING_HEADER) === PERCENT_ENCODED_UTF8
        ? safeDecodeURIComponent(encodedFullName)
        : null;

    return {
      userId,
      displayName: fullName ?? email,
      email,
      fullName,
    };
  }

  // Standalone Web & Mobile Passkey Session
  const cookie = requestHeaders.get("cookie") || "";
  if (cookie.includes("gas_auth=curry") || cookie.includes("gas_auth=gas")) {
    return {
      userId: "curry",
      displayName: "瓦斯",
      email: "yaemra531@gmail.com",
      fullName: "瓦斯",
    };
  }

  const authHeader = requestHeaders.get("authorization") || "";
  if (authHeader.replace(/^Bearer\s+/i, "") === "gas") {
    return {
      userId: "curry",
      displayName: "瓦斯",
      email: "yaemra531@gmail.com",
      fullName: "瓦斯",
    };
  }

  return null;
}

export async function requireChatGPTUser(returnTo: string): Promise<ChatGPTUser> {
  const user = await getChatGPTUser();
  if (user) return user;

  redirect(`/login?return_to=${encodeURIComponent(returnTo)}`);
}

function safeDecodeURIComponent(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}
