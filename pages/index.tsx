import { useState } from "react";
import { PRICE_OF_A_BEER_IN_CENTS, MAXIMUM_DONATION_IN_CENTS } from "@/config";
import Image from "next/image";
import { useRouter } from "next/router";
export default function Home() {
  const router = useRouter()
	const [beerQuantity, setbeerQuantity] = useState(1);
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState(null);

	const presets = [1, 3, 5];

  async function handleCheckout(){
    setError(null)
    const response = await fetch(`/api/checkout`, {
      method :"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        quantity: beerQuantity,
        name, 
        message
      })
    })

    const res = await response.json()

    if(res.url){
      router.push(res.url)
    }

    if(res.error){
      setError(res.error)
    }
  }

	return (
    // double container pattern in tailwind, for future reference
		<main className={"flex max-w-2xl mx-auto"}>
			<div className={"flex-1"}>
        <h2>Previous donations</h2>
      </div>
			<div>
				<h1>Buy me a beer</h1>
        {error && <div>{error}</div>}
        <div className={"flex items-center w-full mb-2"}>
          <span className={"mr-2"}>
            <Image src="/beer.svg" width="50" height="100" alt="beer"/>
          </span>
          <span className={"mr-2"} >
            X
          </span>
          {presets.map((preset) => {
            return (
              <button
                key={preset}
                onClick={() => setbeerQuantity(preset)}
                className={"bg-blue-500 text-white px-4 py-2 rounded mr-2"}
              >
                {preset}
              </button>
            );
          })}
          <input 
            type="number" 
            onChange={(e)=>setbeerQuantity(parseFloat(e.target.value))}
            value={beerQuantity}
            min={1}
            max={MAXIMUM_DONATION_IN_CENTS/PRICE_OF_A_BEER_IN_CENTS}
            className={"shadow rounded w-full border border-blue-500 p-2"}
          />
        </div>

        <div className={"mb-2 w-full"}>
          <label htmlFor="name" className={"block"}>Name (Optional)</label>
          <input 
            type="text"
            id="name"
            onChange ={(e)=> setName(e.target.value)}
            value={name}
            className={"shadow rounded w-full border border-blue-500 p-2"}
            placeholder="Your Name"
          />
        </div>
        <div className={"mb-2 w-full"}>
          <label htmlFor="message">Message (Optional)</label>
          <textarea 
            id="message"
            onChange ={(e)=> setMessage(e.target.value)}
            value={message}
            className={"shadow rounded w-full border border-blue-500 p-2"}
            placeholder="Thank you"
          />
        </div>
        <button 
          className={"bg-blue-500 shadow px-4 py-2 rounded text-white"}
          onClick={handleCheckout}
        >
          Donate ${beerQuantity * (PRICE_OF_A_BEER_IN_CENTS/100)}
        </button>
			</div>
		</main>
	);
}
