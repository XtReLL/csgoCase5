
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface User {
    id?: string;
    username?: string;
    steamId?: string;
    avatar?: string;
    trade_url?: string;
    balance?: number;
}

export interface IQuery {
    user(id?: string): User | Promise<User>;
}

export interface IMutation {
    setTradeLink(link?: string): boolean | Promise<boolean>;
}
