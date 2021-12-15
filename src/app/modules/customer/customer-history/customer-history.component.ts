import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CustomerService} from "../../../shared/services/customer.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-customer-history',
    templateUrl: './customer-history.component.html',
    styleUrls: ['./customer-history.component.scss']
})
export class CustomerHistoryComponent implements OnInit {
    customer_number: string;
    customer_histories: any;

    constructor(private router: Router, private customerService: CustomerService, private layoutService: LayoutUtilsService, private spinner: NgxSpinnerService) {
    }

    ngOnInit(): void {
        if (localStorage.getItem('CustomerNumber')) {
            this.customer_number = localStorage.getItem('CustomerNumber');
            localStorage.removeItem('CustomerNumber')
            this.getCustomerHistory();
        } else {
            this.router.navigate(['/dashboard']);
            this.layoutService.alertElement("No Customer Number given");
        }
    }

    private getCustomerHistory() {
        this.spinner.show();
        this.customerService.getCustomerHistory(this.customer_number).subscribe((response: any) => {
            this.spinner.hide();
            if (response.Success) {
                this.customer_histories = response.CustomerHistories;
            } else {
                this.layoutService.alertElement('', response.Message);
            }
        });
    }
}
