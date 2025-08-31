"use client";
import { jwtDecode } from "jwt-decode";
import { User } from "./type";


export class TokenSession {
  private token?: string;

  get value() {
    return this.token || "";
  }
  set value(token: string) {
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this.token = token;
  }
}

export const tokenSession = new TokenSession();

export class UserSession {
  private _user: User | null = null;

  get value(): User | null {
    return this._user;
  }

  setFromToken(token: string) {
    try {
      const decoded = jwtDecode<User>(token);
      this._user = decoded;
    } catch (error) {
      console.error("Invalid token", error);
      this._user = null;
    }
  }

  clear() {
    this._user = null;
  }
}

export const userSession = new UserSession();
