import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, catchError, map, Observable, of, tap} from 'rxjs';

@Injectable({providedIn: 'root'})

export class FinanceService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _data1: BehaviorSubject<any> = new BehaviorSubject(null);
    private apiUrl = 'https://dt-test.post.kz/';

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }
    get data1$(): Observable<any>
    {
        return this._data1.asObservable();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(date: string = this.getCurrentDate()): Observable<any> {
        const url = `${this.apiUrl}transactions/statistic?date=${date}`;
        return this._httpClient.get(url).pipe(
            map((response: any) => {
                const parsedData = {
                    other: response.other,
                    successCount: response.successCount,
                    transactionCount: response.transactionCount,
                    waitingCount: response.waitingCount,
                };
                console.log(response)
                console.log(date)
                return parsedData;
            }),
            tap((parsedData: any) => {
                this._data.next(parsedData);
            }),
        );
    }
    
    // checkTransactionStatus(transactionId?: string): Observable<any> {
    //     const url = `${this.apiUrl}status/${transactionId}`;
    //     return this._httpClient.get(url).pipe(
    //         map((response: any) => {
    //             console.log(response)
    //             if (response.status === 200) {
    //                 const pardesdata={
    //                     idempotenceKey: response.idempotenceKey,
    //                     status: response.status,
    //                     dateReceive: response.dateReceive,
    //                 };
    //                 return pardesdata
    //             } else {
    //                 throw new Error('TRANSACTION IS NOT FOUND');
    //             }
    //         }),
           
    //         catchError((error) => {
    //             console.error('Error checking transaction status:', error);
    //             return of(null);
    //         })
    //     );
    // }
    checkTransactionStatus(transactionId?: string) {
        const url = `${this.apiUrl}status/${transactionId}`;
        return this._httpClient.get(url).pipe(
            catchError(error => {
                console.error('Error checking transaction status:', error);
                return of(null);
            })
        );
    }

    private getCurrentDate(): string {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
