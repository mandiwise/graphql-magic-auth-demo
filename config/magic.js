import { Magic } from "@magic-sdk/admin";

export default new Magic(process.env.MAGIC_SECRET_KEY);
