import { createClient } from "redis";

export class RedisStore {
  constructor() {
    this.client = createClient();
  }

  async createUser(email, password) {
    await this.client.set("email", email);
    await this.client.set("password", password);

    email = await this.client.get("email");
    password = await this.client.get("password");

    return email && password;
  }

  async updateToken(token) {
    await this.client.set("token", token);
    token = await this.client.get("token");
    return !!token;
  }

  async getUser() {
    try {
      const email = await this.client.get("email");
      const password = await this.client.get("password");
      const token = await this.client.get("token");
      return {
        email,
        password,
        token,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getToken() {
    try {
      const token = await this.client.get("token");
      return token;
    } catch (error) {
      console.log(error);
    }
  }
}
