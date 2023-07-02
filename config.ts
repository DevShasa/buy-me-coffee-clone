export const PRICE_OF_A_BEER_IN_CENTS = parseInt(process.env.NEXT_PUBLIC_DONATION_IN_CENTS || "500",10)
export const MAXIMUM_DONATION_IN_CENTS = parseInt(process.env.NEXT_PUBLIC_DONATION_IN_CENTS || "10000",10)
export const STRIPE_API_KEY = process.env.STRIPE_API_KEY as string