export class CreateShadowpayPaymentDto {
  readonly steamId!: string;
  readonly userId!: number;
  readonly paymentId!: number;
  readonly signature!: any;
  readonly amount!: number;
  readonly tradeLink?: string;
}
