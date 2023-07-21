// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { AIRTABLE_APP_ID, AIRTABLE_PERSONAL_TOKEN, PRICE_OF_A_BEER_IN_CENTS, STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET } from "@/config";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";

const stripe = new Stripe(STRIPE_API_KEY, {
	apiVersion: "2022-11-15",
});

export const config = {
    api:{
        bodyParser:false
    }
}

async function insertToAirtable(name:string, message:string, ammount:string){
    const url =`https://api.airtable.com/v0/${AIRTABLE_APP_ID}/donations`

    const  response = await fetch(url, {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${AIRTABLE_PERSONAL_TOKEN}`
        },
        body: JSON.stringify({
            records:[
                {
                    fields:{
                        name, message, ammount
                    }
                }
            ]
        })
    })
    console.log("AIRTABLE FETCH RESPONCE --->", )
    return response.json();
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "HTTP method not allowed" });
	}

	const signature = req.headers["stripe-signature"] as string;

	if (!signature) {
		return res.status(400).json({ message: "missing signature" });
	}

	let event: Stripe.Event;
    const buf = await buffer(req) // convert into binary 
    try {
        event = stripe.webhooks.constructEvent(buf, signature, STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        console.error("Invalid signature", error)
        return res.status(400).json({ message: "Invalid signature" });
    }

    if(event.type !== "checkout.session.completed"){
        return res.status(400).json({message:"Invalid event type"})
    }

    const metadata = (event.data.object as {
        metadata:{name: string, message: string}
    }).metadata

    console.log("WEBBHOOK CALLED BY STRIPE AND RETURNED:",metadata)

    const amount = (event.data.object as {
        amount_total:number
    }).amount_total / 100 

    const airtableres = await insertToAirtable(metadata.name, metadata.message, String(amount))

    console.log("INSERT TO AIRTABLE RESPONCE =>",airtableres)
    return res.status(200).json({message:"Success"})
}
