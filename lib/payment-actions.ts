"use server"
import { paymentService } from '@/lib/paymentService';
import { PaymentOrderRequest } from '@/types/payment-type';

export async function handlePaymentRequest(orderDetails: PaymentOrderRequest) {
    try {
        // Use server-side environment variables (without NEXT_PUBLIC_ prefix for security)
        const credentials = {
            consumer_key: process.env.NEXT_PUBLIC_PESAPAL_CONSUMER_KEY ?? "",
            consumer_secret: process.env.NEXT_PUBLIC_PESAPAL_CONSUMER_SECRET ?? ""
        };

        console.log('Environment check:', {
            hasConsumerKey: !!credentials.consumer_key,
            hasConsumerSecret: !!credentials.consumer_secret,
            keyLength: credentials.consumer_key.length,
            secretLength: credentials.consumer_secret.length
        });

        if (!credentials.consumer_key || !credentials.consumer_secret) {
            console.error('Missing payment credentials');
            return { 
                success: false, 
                error: 'Payment configuration error: Missing credentials' 
            };
        }

        console.log('Submitting order:', {
            orderId: orderDetails.id,
            amount: orderDetails.amount,
            currency: orderDetails.currency,
            description: orderDetails.description
        });

        // Submit the order - authentication will be handled automatically
        const orderResponse = await paymentService.submitOrder(orderDetails, credentials);

        console.log('Payment response:', {
            hasRedirectUrl: !!orderResponse.redirect_url,
            status: orderResponse.status || 'unknown'
        });

        return {
            success: true,
            redirect_url: orderResponse.redirect_url,
            order_tracking_id: orderResponse.order_tracking_id,
            merchant_reference: orderResponse.merchant_reference,
            status: orderResponse.status
        };
    } catch (error) {
        console.error('Payment API error details:', {
            error: error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });

        // Return more specific error messages
        if (error instanceof Error) {
            if (error.message.includes('Authentication failed')) {
                return { 
                    success: false, 
                    error: 'Payment authentication failed. Please check your payment configuration.',
                    status: 401 
                };
            }
            if (error.message.includes('timeout')) {
                return { 
                    success: false, 
                    error: 'Payment request timed out. Please try again.',
                    status: 408 
                };
            }
            return { 
                success: false, 
                error: `Payment processing failed: ${error.message}`,
                status: 500 
            };
        }
        
        return { 
            success: false, 
            error: 'An unexpected error occurred. Please try again.',
            status: 500 
        };
    }
}