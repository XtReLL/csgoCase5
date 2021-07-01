import { Injectable } from '@nestjs/common';
// import TradeOfferManager from "steam-tradeoffer-manager"
const TradeOfferManager = require('steam-tradeoffer-manager');

@Injectable()
export class TradeService {
  public tradeOfferManager: any;
  constructor(

  ) {
    this.tradeOfferManager = new TradeOfferManager({
      "domain": "example.com",
      "language": "en",
      "pollInterval": 5000
    })
  }

  
}

