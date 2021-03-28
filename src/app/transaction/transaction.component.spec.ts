import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionComponent } from './transaction.component';
import { HttpClient } from '@angular/common/http';

describe('TransactionComponent', () => {
  let component:TransactionComponent;
  let http:HttpClient;
  beforeEach(async() =>{
    component = new TransactionComponent(http);
  });

  it('Should Return Date Format MMM. DD YY',async() => {
    expect(component.getDate('2021-03-27')).toEqual('Mar. 27 21');
  });

  it('Should Return Path to .png replacing spaces to dash and all lowercase',async() => {
    expect(component.getLogo('Amazon Online Store')).toEqual('/assets/icons/amazon-online-store.png');
  });

  it('Should Return True if valid amount is entered',async() => {
    expect(component.validateAmountGreaterThanZero(50)).toEqual(true);
  });

  it('Should Return True if there is enough money in account',async() => {
    expect(component.validateMinAccountMoney(50)).toEqual(true);
  });
});
