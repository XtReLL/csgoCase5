
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

export enum ItemRarity {
    classified = "classified",
    baseGrade = "baseGrade",
    consumerGrade = "consumerGrade",
    covert = "covert",
    exotic = "exotic",
    extraordinary = "extraordinary",
    highGrade = "highGrade",
    industrialGrade = "industrialGrade",
    milspecGrade = "milspecGrade",
    remarkable = "remarkable",
    restricted = "restricted"
}

export enum LiveDropType {
    CASE = "CASE"
}

export enum PaymentMethodType {
    FREE_KASSA = "FREE_KASSA"
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

export enum ReferallLevel {
    FIRST = "FIRST",
    SECOND = "SECOND",
    THIRD = "THIRD",
    FOURTH = "FOURTH",
    FIFTH = "FIFTH"
}

export enum AuthProviders {
    local = "local",
    steam = "steam",
    vk = "vk",
    google = "google"
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
    status?: CaseStatusType;
    discount?: number;
    icon?: string;
    bankPercent?: number;
    categories: string[];
}

export interface OpenCaseInput {
    id: string;
    count: number;
}

export interface AddItemsInCaseInput {
    caseId: string;
    itemsId: string[];
}

export interface UpdateCaseInput {
    id: string;
    name?: string;
    price?: number;
    rarirty?: CaseRarityType;
    status?: CaseStatusType;
    discount?: number;
    icon?: string;
    bankPercent?: number;
    categories?: string[];
}

export interface CreateCategoryInput {
    name: string;
}

export interface CreateGameCaseDto {
    caseId: string;
    userId: string;
    itemId: string;
}

export interface SearchGiveawayInput {
    type?: GiveawayType;
}

export interface CreateGiveawayInput {
    itemId: number;
    endDate?: Date;
    type?: GiveawayType;
}

export interface UpdateGiveawayInput {
    id: string;
    itemId?: number;
    endDate?: Date;
    type?: GiveawayType;
}

export interface Pagination {
    cursor?: string;
    direction: string;
    limit: number;
    offset?: number;
    sortColumn?: string;
}

export interface CreateLiveDropInput {
    userId: string;
    caseId?: string;
    itemId: string;
    price: number;
    type: LiveDropType;
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
    onMainPage?: boolean;
}

export interface UpdatePromocodeInput {
    id: string;
    name?: string;
    sum?: number;
    percent?: number;
    count?: number;
    endTime?: Date;
    onMainPage?: boolean;
}

export interface SearchUserInput {
    query?: string;
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
    openCase(openCaseInput: OpenCaseInput): Item[] | Promise<Item[]>;
    addItemsInCase(addItemsInCaseInput: AddItemsInCaseInput): CaseItems[] | Promise<CaseItems[]>;
    createGameCase(createGameCaseDto: CreateGameCaseDto): GameCase | Promise<GameCase>;
    createGiveaway(createGiveawayInput: CreateGiveawayInput): Giveaway | Promise<Giveaway>;
    updateGiveaway(updateGiveawayInput: UpdateGiveawayInput): Giveaway | Promise<Giveaway>;
    joinToGiveaway(id: string): GiveawayBet | Promise<GiveawayBet>;
    removeGiveaway(id: string): boolean | Promise<boolean>;
    sellItem(id: string): boolean | Promise<boolean>;
    createPayment(createPaymentInput: CreatePaymentInput): string | Promise<string>;
    createPromocode(createPromocodeInput: CreatePromocodeInput): Promocode | Promise<Promocode>;
    updatePromocode(updatePromocodeInput: UpdatePromocodeInput): Promocode | Promise<Promocode>;
    removePromocode(id: string): boolean | Promise<boolean>;
    usePromocode(code: string): boolean | Promise<boolean>;
    setReferallCode(code: string): ReferallCode | Promise<ReferallCode>;
    setTradeLink(link?: string): boolean | Promise<boolean>;
}

export interface Case {
    id: string;
    name?: string;
    price?: number;
    rarirty?: CaseRarityType;
    status?: CaseStatusType;
    discount?: number;
    icon?: string;
    bank?: number;
    bankPercent?: number;
    profit?: number;
    opened?: number;
    categories?: Category[];
    items?: Item[];
}

export interface CasesStats {
    opened?: number;
}

export interface CaseItems {
    caseId?: string;
    itemId?: string;
}

export interface CaseListData {
    data: Case[];
    pagination: CursorBasedPaginationData;
}

export interface IQuery {
    cases(pagination?: Pagination): CaseListData | Promise<CaseListData>;
    case(id: string): Case | Promise<Case>;
    casesStats(): CasesStats | Promise<CasesStats>;
    categories(pagination?: Pagination): CategoryListData | Promise<CategoryListData>;
    category(id: string): Category | Promise<Category>;
    giveaways(pagination?: Pagination, search?: SearchGiveawayInput): GiveawayListData | Promise<GiveawayListData>;
    giveaway(id: string): Giveaway | Promise<Giveaway>;
    promocodes(pagination?: Pagination): PromocodeListData | Promise<PromocodeListData>;
    promocode(id: string): Promocode | Promise<Promocode>;
    mainPromocode(): Promocode | Promise<Promocode>;
    user(id?: string): User | Promise<User>;
    users(search?: SearchUserInput, pagination?: Pagination): UsersListData | Promise<UsersListData>;
}

export interface Category {
    id: string;
    name?: string;
}

export interface CategoryListData {
    data: Category[];
    pagination: CursorBasedPaginationData;
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

export interface GiveawayListData {
    data: Giveaway[];
    pagination: CursorBasedPaginationData;
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

export interface InventoryListData {
    data: Inventory[];
    pagination: CursorBasedPaginationData;
}

export interface Item {
    id?: string;
    marketHashName?: string;
    iconUrl?: string;
    exterior?: string;
    rarity?: string;
    color?: string;
    price?: number;
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

export interface PromocodeListData {
    data: Promocode[];
    pagination: CursorBasedPaginationData;
}

export interface ReferallCode {
    id?: string;
    code?: string;
    userId?: number;
    level?: ReferallLevel;
}

export interface User {
    id?: string;
    username?: string;
    steamId?: string;
    avatar?: string;
    trade_url?: string;
    balance?: number;
    referallCode?: ReferallCode;
    inventory?: InventoryListData;
}

export interface UsersListData {
    data: User[];
    pagination: CursorBasedPaginationData;
}

export interface Withdraw {
    id: string;
}
