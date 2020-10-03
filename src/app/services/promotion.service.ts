import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor() { }

  getPromotions(): Observable<Promotion[]> {

    return of(PROMOTIONS).pipe(delay(2000));
    // return new Promise(resolve=> {
    //   // Simulate server latency with 2 second delay
    //     setTimeout(() => resolve(PROMOTIONS), 2000);
    // });
  }

  getPromotion(id: string): Observable<Promotion> {

    return of(PROMOTIONS.filter((promo) => (promo.id === id))[0]).pipe(delay(2000));
    // return new Promise(resolve=> {
    //   // Simulate server latency with 2 second delay
    //     setTimeout(() => resolve(PROMOTIONS.filter((promo) => (promo.id === id))[0]), 2000);
    // });
  }

  getFeaturedPromotion(): Observable<Promotion> {
    
    return of(PROMOTIONS.filter((promotion) => promotion.featured)[0]).pipe(delay(2000));
    // return new Promise(resolve=> {
    //   // Simulate server latency with 2 second delay
    //     setTimeout(() => resolve(PROMOTIONS.filter((promotion) => promotion.featured)[0]), 2000);
    // })
    
  }
}