
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

export enum GiveawayType {
    CUSTOM = "CUSTOM",
    DAILY = "DAILY",
    WEEKLY = "WEEKLY"
}

export enum InventoryStatus {
    AVAILABLE = "AVAILABLE"
}

export enum LiveDropType {
    CASE = "CASE"
}

export enum PaymentMethodType {
    LOCAL = "LOCAL"
}

export enum PaymentStatusType {
    PENDING = "PENDING",
    SUCCESSFUL = "SUCCESSFUL",
    REJECTED = "REJECTED"
}

export enum PromocodeType {
    SUM = "SUM",
    PERCENT = "PERCENT"
}

export enum WithdrawStatusType {
    PENDING = "PENDING",
    SUCCESSFUL = "SUCCESSFUL",
    REJECTED = "REJECTED"
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
    bankPercent?: number;
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
    bankPercent?: number;
}

export interface CreateGameCaseDto {
    caseId: string;
    userId: string;
    itemId: string;
}

export interface CreateGiveawayInput {
    itemId: number;
    endDate?: Date;
}

export interface UpdateGiveawayInput {
    id: string;
    itemId?: number;
    endDate?: Date;
}

export interface Pagination {
    cursor?: string;
    direction: string;
    limit: number;
    offset?: number;
}

export interface CreateLiveDropInput {
    userId: string;
    caseId?: string;
    itemId: string;
    price: number;
}

export interface CreatePaymentInput {
    method: PaymentMethodType;
    sum: number;
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
    createGiveaway(createGiveawayInput: CreateGiveawayInput): Giveaway | Promise<Giveaway>;
    updateGiveaway(updateGiveawayInput: UpdateGiveawayInput): Giveaway | Promise<Giveaway>;
    joinToGiveaway(id: string): GiveawayBet | Promise<GiveawayBet>;
    removeGiveaway(id: string): boolean | Promise<boolean>;
    sellItem(id: string): boolean | Promise<boolean>;
    createPayment(createPaymentInput: CreatePaymentInput): Payment | Promise<Payment>;
    createPromocode(createPromocodeInput: CreatePromocodeInput): Promocode | Promise<Promocode>;
    updatePromocode(updatePromocodeInput: UpdatePromocodeInput): Promocode | Promise<Promocode>;
    removePromocode(id: string): boolean | Promise<boolean>;
    usePromocode(code: string): boolean | Promise<boolean>;
    setTradeLink(link?: string): boolean | Promise<boolean>;
}

export interface Case {
    id: string;
}

export interface CaseListData {
    data: Case[];
    pagination: CursorBasedPaginationData;
}

export interface IQuery {
    cases(pagination?: Pagination): CaseListData | Promise<CaseListData>;
    case(id: string): Case | Promise<Case>;
    user(id?: string): User | Promise<User>;
}

export interface GameCase {
    id: string;
}

export interface Giveaway {
    id?: string;
    winner?: User;
    giveawayBet?: GiveawayBet;
    item?: Item;
}

export interface GiveawayBet {
    id?: string;
}

export interface Inventory {
    id: string;
    userId?: number;
    itemId?: number;
    price?: number;
    status?: number;
}

export interface Item {
    id?: string;
}

export interface CursorBasedPaginationData {
    hasMore: boolean;
    cursor?: string;
    id: string;
}

export interface LiveDrop {
    id: string;
}

export interface Payment {
    id?: string;
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

export interface Withdraw {
    id: string;
}
