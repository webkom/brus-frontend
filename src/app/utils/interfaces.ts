import { BrusType } from "./constants";

export interface User {
  brusName: string;
  github: string;
  name: string;
  saldo: number;
  avatar: string;
}

export interface Member {
  name: string;
  full_name: string;
  birthday: string;
  joined: string;
  first_lego_commit: string;
  avatar: string;
  slack: string;
  phone_number: string;
  brus: string;
  github: string;
  duolingo: string;
  active: boolean;
  new: boolean;
  welcome_messages: string[];
  wireless_devices: {
    wifi: string[];
    bt: string[];
  };
  cards: {
    rfid: {
      mifare: any[];
      em4200: any[];
    };
  };
  authorized_keys: any[];
}

export interface BuyBrusRequest {
  brusType: BrusType;
  buyerBrusName: string;
  brusAmount: number;
}
