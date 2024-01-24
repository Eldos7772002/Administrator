import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FinanceService } from 'app/modules/admin/dashboards/finance/finance.service';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import {catchError, of, Subject, takeUntil} from 'rxjs';
import {FormsModule} from "@angular/forms";
import { Subscription } from 'rxjs';

@Component({
    selector       : 'finance',
    templateUrl    : './finance.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule, NgApexchartsModule, MatTableModule, MatSortModule, NgClass, MatProgressBarModule, CurrencyPipe, DatePipe, FormsModule],
})
export class FinanceComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild('recentTransactionsTable', {read: MatSort}) recentTransactionsTableMatSort: MatSort;
    transactionId: string;
    transactionStatus: any;
    selectedDate: string;
    data: any;
    subscription: Subscription;
    accountBalanceOptions: ApexOptions;
    recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    recentTransactionsTableColumns: string[] = ['other', 'successCount', 'transactionCount', 'waitingCount'];
    recentTransactionsDataSource1: MatTableDataSource<any> = new MatTableDataSource();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private _financeService: FinanceService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        const currentDate = this.getCurrentDate();

        // Вызовите метод getData с текущей датой
        this._financeService.getData(currentDate).subscribe(
            (responseData) => {
                this.data = responseData;
                // Далее можете использовать this.data в вашем компоненте
            },
            (error) => {
                console.error('Error fetching data:', error);
            }
        );
    }

    checkTransactionStatus(): void {
        if (this.transactionId) {
            this._financeService.checkTransactionStatus(this.transactionId).subscribe(response => {
                this.data = response;
            });
        }
    }

    onDateChange(): void {
        this._financeService.getData(this.selectedDate || this.getCurrentDate())
            .pipe(
                takeUntil(this._unsubscribeAll),
                catchError((error) => {
                    console.error('Error fetching data:', error);
                    // Можно выполнить дополнительные действия при ошибке, например, показать сообщение пользователю
                    return of(null); // Возвращаем Observable, чтобы подписка не завершалась с ошибкой
                })
            )
            .subscribe((data) => {
                if (data) {
                    this.data = data;
                    this.recentTransactionsDataSource.data = data.recentTransactions;
                    this._prepareChartData();
                }
            });
    }

    private getCurrentDate(): string {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        // Make the data source sortable
        this.recentTransactionsDataSource.sort = this.recentTransactionsTableMatSort;
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void
    {
        // Account balance
        this.accountBalanceOptions = {
            chart  : {
                animations: {
                    speed           : 400,
                    animateGradually: {
                        enabled: false,
                    },
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                width     : '100%',
                height    : '100%',
                type      : 'area',
                sparkline : {
                    enabled: true,
                },
            },
            colors : ['#A3BFFA', '#667EEA'],
            fill   : {
                colors : ['#CED9FB', '#AECDFD'],
                opacity: 0.5,
                type   : 'solid',
            },
            series : this.data.accountBalance.series,
            stroke : {
                curve: 'straight',
                width: 2,
            },
            tooltip: {
                followCursor: true,
                theme       : 'dark',
                x           : {
                    format: 'MMM dd, yyyy',
                },
                y           : {
                    formatter: (value): string => value + '%',
                },
            },
            xaxis  : {
                type: 'datetime',
            },
        };
    }
}
