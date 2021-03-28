import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css', '../app.component.css'],
})
export class TransactionComponent implements OnInit {
  constructor(private httpClient: HttpClient) {}

  //VARIABLES FOR STORING THE DATA
  dataOrig: any = [];
  dataList: any = [];
  dataListWithoutFilter: any = [];

  //VARIABLE FOR FILTERING DATA
  myFilter: string = '';

  //VARIABLES FOR SORTING
  nameSortMethod: string = 'asc';
  dateSortMethod: string = 'asc';
  amountSortMethod: string = 'asc';

  //VARIABLE FOR STARTING MONEY AMOUNT
  myAccountMoney: number = 5824.76;
  myMinBalance: number = -500;

  fromAccount: string = `Free Checking(4692) -$ ${this.myAccountMoney}`;
  toAccount: string = '';
  amount: number;


  //VARIABLES FOR SHOWING ARROW FILTER ICONS
  arrowUpDate:boolean=false;
  arrowDownDate:boolean=false;
  arrowUpBeneficiary:boolean=false;
  arrowDownBeneficiary:boolean=false;
  arrowUpAmount:boolean=false;
  arrowDownAmount:boolean=false;


  ngOnInit(): void {

    this.httpClient.get('assets/transactions.json').subscribe((data: any) => {
      this.dataOrig = data;
      this.dataList = this.dataOrig.data;
      this.dataListWithoutFilter = this.dataOrig.data;
    });
  }

  getDate(valueDate: string) {
    return moment(valueDate).format('MMM. DD YY');

    //UNCOMMENT IF YOU WANT TO INCLUDE THE YEAR
    //return moment(valueDate).format('YYYYMMDD');
  }

  getLogo(merchantName: string) {
    let logoPath = merchantName.toLowerCase().replace(/\s/g, '-');
    return `/assets/icons/${logoPath}.png`;
  }

  getBorderLeftColor(color: string) {
    return `border-left: 10px solid ${color}`;
    //style="border-left: 4px solid {{ dataItem.categoryCode }}"
  }

  validateMinAccountMoney(transferAmount) {
    if (this.myAccountMoney - transferAmount <= this.myMinBalance) {
      Swal.fire('Minimum Balance Exceeded', '', 'error');
      return false;
    }
    return true;
  }

  validateAmountGreaterThanZero(transferAmount){
    if(transferAmount <=0 || transferAmount == undefined || transferAmount == null){
      Swal.fire('Enter Valid Amount', '', 'error');
      return false;
    }
    return true;
  }

  confirmTransaction(toAccount,transferAmount) {
    Swal.fire({
      title: 'Do you want to process the transaction?',
      html:
      `Transfer Amount : ${transferAmount}<br>` +
      `To Account : ${toAccount}`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Process`,
      denyButtonText: `Don't Process`,
    }).then((result) => {
      if (result.isConfirmed) {
          let obj = this.dataOrig;

          obj['data'].push({
            categoryCode: '#12a580',
            dates: {
              valueDate: moment(),
            },
            transaction: {
              amountCurrency: {
                amount: transferAmount,
                currencyCode: 'EUR',
              },
              type: 'Salaries',
              creditDebitIndicator: 'CRDT',
            },
            merchant: {
              name: toAccount,
              accountNumber: 'SI64397745065188826',
            },
          });

          this.myAccountMoney = this.myAccountMoney - transferAmount;
          this.fromAccount = `Free Checking(4692) -$ ${this.myAccountMoney}`;
          this.toAccount = "";
          this.amount = undefined;
          this.turnOffSortFlags();
          this.sortResult('date');;
        Swal.fire('Transaction Processed!', '', 'success');
      } else if (result.isDenied) {
        Swal.fire('Transaction Cancelled', '', 'info');

      }
    })
  }

  submitData(toAccount, transferAmount) {
    const validTransferAmount: boolean = this.validateMinAccountMoney(transferAmount);
    const TransferAmountGreaterThanZero:boolean = this.validateAmountGreaterThanZero(transferAmount);

    if (validTransferAmount && TransferAmountGreaterThanZero) {
      this.confirmTransaction(toAccount,transferAmount);
    }
  }

  clearFilter(){
    this.myFilter = "";
    this.FilterFn();
  }

  FilterFn() {
    var myFilter = this.myFilter;

    this.dataList = this.dataListWithoutFilter.filter(function (el: any) {
      return (
        el.merchant.name
          .toString()
          .toLowerCase()
          .includes(myFilter.toString().trim().toLowerCase()) ||
        el.transaction.type
          .toString()
          .toLowerCase()
          .includes(myFilter.toString().trim().toLowerCase())
      );
    });
  }

  turnOffSortFlags(){
    this.arrowUpDate=false;
    this.arrowDownDate=false;
    this.arrowUpBeneficiary=false;
    this.arrowDownBeneficiary=false;
    this.arrowUpAmount=false;
    this.arrowDownAmount=false;
  }

  sortResult(prop: any) {
    let sortMethod:string="";

    switch(prop){
      case 'beneficiary':
        if(!this.arrowDownBeneficiary && !this.arrowUpBeneficiary){
          this.turnOffSortFlags();
          this.arrowDownBeneficiary = true;
          sortMethod = prop+"down";
        }else if(!this.arrowDownBeneficiary && this.arrowUpBeneficiary){
          this.turnOffSortFlags();
          this.arrowDownBeneficiary = true;
          sortMethod = prop+"down";
        }else if (this.arrowDownBeneficiary && !this.arrowUpBeneficiary){
          this.turnOffSortFlags();
          this.arrowUpBeneficiary = true;
          sortMethod = prop+"up";
        }
        break;
      case 'amount':
        if(!this.arrowDownAmount && !this.arrowUpAmount){
          this.turnOffSortFlags();
          this.arrowDownAmount = true;
          sortMethod = prop+"down";
        }else if(!this.arrowDownAmount && this.arrowUpAmount){
          this.turnOffSortFlags();
          this.arrowDownAmount = true;
          sortMethod = prop+"down";
        }else if (this.arrowDownAmount && !this.arrowUpAmount){
          this.turnOffSortFlags();
          this.arrowUpAmount = true;
          sortMethod = prop+"up";
        }
        break;
      case 'date':
        if(!this.arrowDownDate && !this.arrowUpDate){
          this.turnOffSortFlags();
          this.arrowDownDate = true;
          sortMethod = prop+"down";
        }else if(!this.arrowDownDate && this.arrowUpDate){
          this.turnOffSortFlags();
          this.arrowDownDate = true;
          sortMethod = prop+"down";
        }else if (this.arrowDownDate && !this.arrowUpDate){
          this.turnOffSortFlags();
          this.arrowUpDate = true;
          sortMethod = prop+"up";
        }
        break;
    }

    this.dataList = this.dataListWithoutFilter.sort(function (a, b) {
      switch (sortMethod) {
        case 'beneficiaryup':
          return (a.merchant.name>b.merchant.name)?1 : ((a.merchant.name<b.merchant.name) ?-1 :0);
        case 'beneficiarydown':
          return (b.merchant.name>a.merchant.name)?1 : ((b.merchant.name<a.merchant.name) ?-1 :0);
        case 'amountup':
          return parseFloat(a.transaction.amountCurrency.amount) - parseFloat(b.transaction.amountCurrency.amount);
        case 'amountdown':
          return parseFloat(b.transaction.amountCurrency.amount) - parseFloat(a.transaction.amountCurrency.amount);
        case 'dateup':
          return parseInt(moment(a.dates.valueDate).format('YYYYMMDD')) - parseInt(moment(b.dates.valueDate).format('YYYYMMDD'));
        case 'datedown':
          return parseInt(moment(b.dates.valueDate).format('YYYYMMDD')) - parseInt(moment(a.dates.valueDate).format('YYYYMMDD'));
      }
    });
  }
}
