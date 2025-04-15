// app/api/stripe/route.ts

import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

interface LineItem {
  priceqty: number;
  image: { asset: { _ref: string; } }[];
  name: string;
  quantity: number;
}

interface SessionCreateParams {
  submit_type: 'pay';
  mode: 'payment';
  payment_method_types: any;
  billing_address_collection: 'auto' | 'required';
  shipping_options: { shipping_rate: string; }[];
  line_items: {
    price_data: {
      currency: string;
      product_data: {
        name: string;
      };
      unit_amount: number; // Amount in cents
    };
    adjustable_quantity: {
      enabled: boolean;
      minimum: number;
    };
    quantity: number;
  }[];
  success_url: string;
  cancel_url: string;
}

export async function POST(request: Request) {
  try {
    const { cartItems }: { cartItems: LineItem[] } = await request.json(); // Access cartItems from the request body

    const params: SessionCreateParams = {
      submit_type: 'pay',
      mode: 'payment',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      shipping_options: [
        { shipping_rate: 'shr_1RDjPiBxmjt1TEptvDEZ0mBR' }, // Ensure this shipping rate ID is correct
      ],
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: 'kes', // Use your currency code
          product_data: {
            name: item.name,
          },
          unit_amount: item.priceqty * 100, // Convert price to cents
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
        },
        quantity: item.quantity,
      })),
      success_url: `${request.url}/success`, // Adjust success URL
      cancel_url: `${request.url}?canceled=true`, // Adjust cancel URL
    };

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create(params);
    return new Response(JSON.stringify({ id: session.id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}