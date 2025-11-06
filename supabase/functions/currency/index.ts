import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const amount = parseFloat(url.searchParams.get('amount') || '1');
    const from = url.searchParams.get('from')?.toUpperCase() || 'INR';
    const to = url.searchParams.get('to')?.toUpperCase() || 'USD';

    if (isNaN(amount) || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Valid amount is required' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const EXCHANGE_API_KEY = Deno.env.get('EXCHANGE_API_KEY');
    
    if (!EXCHANGE_API_KEY) {
      const mockRates: { [key: string]: number } = {
        'INR-USD': 0.012,
        'INR-EUR': 0.011,
        'USD-INR': 83.0,
        'EUR-INR': 90.0,
        'USD-EUR': 0.92,
        'EUR-USD': 1.09,
      };

      const rateKey = `${from}-${to}`;
      const rate = mockRates[rateKey] || 1;
      const convertedAmount = (amount * rate).toFixed(2);

      return new Response(
        JSON.stringify({
          from,
          to,
          amount,
          converted: parseFloat(convertedAmount),
          rate: rate.toFixed(4),
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const exchangeUrl = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/pair/${from}/${to}/${amount}`;
    const response = await fetch(exchangeUrl);
    
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Currency conversion failed' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({
        from: data.base_code,
        to: data.target_code,
        amount,
        converted: data.conversion_result,
        rate: data.conversion_rate.toFixed(4),
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});