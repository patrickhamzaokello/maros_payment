"use server"
import { paymentService } from '@/lib/paymentService';
import { PaymentOrderRequest } from '@/types/payment-type';

export async function handlePaymentRequest(orderDetails: PaymentOrderRequest) {
    try {
        const credentials = {
            consumer_key: process.env.NEXT_PUBLIC_PESAPAL_CONSUMER_KEY ?? "",
            consumer_secret: process.env.NEXT_PUBLIC_PESAPAL_CONSUMER_SECRET ?? ""
        };
        console.log(credentials)

        if (!credentials.consumer_key || !credentials.consumer_secret) {
            return { success: false, error: 'Payment configuration error' };
        }

        // Remove the manual authentication call - let submitOrder handle it automatically
        // The fetchWithConfig method will handle authentication if needed
        const orderResponse = await paymentService.submitOrder(orderDetails, credentials);

        return {
            success: true,
            redirect_url: orderResponse.redirect_url,
        };
    } catch (error) {
        console.error('Payment API error:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Payment processing failed',
            status: 500 
        };
    }
}