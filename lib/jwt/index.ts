import { IncomingHttpHeaders } from "http";
import * as jose from "jose";

export const getJWT = async () => {
  try {
    const ecPrivateKey = await jose.importPKCS8(
      process.env.PRIVATE_KEY!,
      process.env.PRIVATE_KEY_ALG!
    );

    const jwt = await new jose.SignJWT({ "com:rhino:claim": true })
      .setProtectedHeader({ alg: process.env.PRIVATE_KEY_ALG! })
      .setIssuedAt()
      .setIssuer(process.env.PRIVATE_KEY_ISSUER!)
      .setAudience(process.env.PRIVATE_KEY_AUDIENCE!)
      .setExpirationTime(process.env.PRIVATE_KEY_EXP_TIME!)
      .sign(ecPrivateKey);

    return jwt;
  } catch (error) {
    return null;
  }
};

export const authHeaders = async (headers: IncomingHttpHeaders) => {
  if (!headers || !headers.authorization) {
    return false;
  }

  try {
    const tkn = headers.authorization.replace("Bearer ", "");
    const pubKey = await jose.importSPKI(
      process.env.PUBLIC_KEY!,
      process.env.PUBLIC_KEY_ALG!
    );
    const { payload } = await jose.jwtVerify(tkn!, pubKey, {
      issuer: process.env.PUBLIC_KEY_ISSUER!,
      audience: process.env.PUBLIC_KEY_AUDIENCE!,
    });

    return !!payload.iat && !!payload.exp && payload.exp > payload.iat;
  } catch (error) {
    return false;
  }
};
