// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { AIRTABLE_APP_ID, AIRTABLE_PERSONAL_TOKEN, } from "@/config";
import { AirtableRecord } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";



export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "GET") {
		return res.status(405).json({ message: "HTTP method not allowed" });
	}

    const responce = await fetch(`https://api.airtable.com/v0/${AIRTABLE_APP_ID}/donations?maxRecords=3&view=Grid%20view`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${AIRTABLE_PERSONAL_TOKEN}`
        },
    })

    const data = await responce.json() as AirtableRecord;

    return res.status(200).json(data.records)
}
