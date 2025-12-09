export type ApplicationPaidInvoiceTax = {
    id: number;
    date: string;
    payment_identifier: string;
    sum: number;
    bank_identifier: string;
    application_id: number;
    tax: string;
}