
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum CaseRarityType {
    CUSTOM = "CUSTOM",
    CONSUMER = "CONSUMER",
    INDUSTRIAL = "INDUSTRIAL"
}

export enum CaseStatusType {
    ACTIVE = "ACTIVE",
    HIDE = "HIDE"
}

export enum GameType {
    CASE = "CASE"
}

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

export interface CreateCaseInput {
    name: string;
    price?: number;
    rarirty?: CaseRarityType;
    category?: string;
    status?: CaseStatusType;
    discount?: number;
    icon?: string;
}

export interface OpenCaseInput {
    id: string;
    count: number;
}

export interface UpdateCaseInput {
    id: string;
    name?: string;
    price?: number;
    rarirty?: CaseRarityType;
    category?: string;
    status?: CaseStatusType;
    discount?: number;
    icon?: string;
}

export interface CreateGameCaseDto {
    caseId: string;
    userId: string;
    itemId: string;
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
    createCase(createCaseInput: CreateCaseInput): Case | Promise<Case>;
    updateCase(updateCaseInput: UpdateCaseInput): Case | Promise<Case>;
    removeCase(id: string): boolean | Promise<boolean>;
    createGameCase(createGameCaseDto: CreateGameCaseDto): GameCase | Promise<GameCase>;
    createPromocode(createPromocodeInput: CreatePromocodeInput): Promocode | Promise<Promocode>;
    updatePromocode(updatePromocodeInput: UpdatePromocodeInput): Promocode | Promise<Promocode>;
    removePromocode(id: string): boolean | Promise<boolean>;
    usePromocode(code: string): boolean | Promise<boolean>;
    setTradeLink(link?: string): boolean | Promise<boolean>;
}

export interface Case {
    id: string;
}

export interface GameCase {
    id: string;
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
