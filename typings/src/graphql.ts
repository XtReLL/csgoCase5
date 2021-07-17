
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum InventoryStatus {
    AVAILABLE = "AVAILABLE"
}

export enum PromocodeType {
    SUM = "SUM",
    PERCENT = "PERCENT"
}

export interface UpdateConfigInput {
    id: string;
    dollarRate?: number;
    minSteamLvlForUsePromocode?: number;
    minPlayTimeInCSGOForUsePromocode?: number;
}

export interface Pagination {
    cursor?: string;
    direction: string;
    limit: number;
}

export interface CreatePromocodeInput {
    name: string;
    sum?: number;
    percent?: number;
    count?: number;
    endTime?: Date;
}

export interface UpdatePromocodeInput {
    id: string;
    name?: string;
    sum?: number;
    percent?: number;
    count?: number;
    endTime?: Date;
}

export interface Config {
    id: string;
    dollarRate?: number;
    minSteamLvlForUsePromocode?: number;
    minPlayTimeInCSGOForUsePromocode?: number;
}

export interface IMutation {
    updateConfig(updateConfigInput: UpdateConfigInput): Config | Promise<Config>;
    createPromocode(createPromocodeInput: CreatePromocodeInput): Promocode | Promise<Promocode>;
    updatePromocode(updatePromocodeInput: UpdatePromocodeInput): Promocode | Promise<Promocode>;
    removePromocode(id: string): boolean | Promise<boolean>;
    usePromocode(code: string): boolean | Promise<boolean>;
    setTradeLink(link?: string): boolean | Promise<boolean>;
}

export interface Inventory {
    id: string;
    userId?: number;
    itemId?: number;
    price?: number;
    status?: number;
}

export interface CursorBasedPaginationData {
    hasMore: boolean;
    cursor?: string;
    id: string;
}

export interface Promocode {
    id: string;
    name?: string;
    sum?: number;
    percent?: number;
    count?: number;
    endTime?: Date;
}

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
