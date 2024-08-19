import { mergeExchangeRates } from '@/utils/helpers';
import { createClient } from '@/utils/supabase/server';
import { format } from 'date-fns';
import { type NextRequest } from 'next/server';
import { promisify } from 'util';
import { parseString } from 'xml2js';

const bccrWsToken = process.env.BCCR_WS_TOKEN;
const parseXml = promisify(parseString);

// indicator: 317 buy, 318 sell
const getExchangeRates = async (
  indicator: 317 | 318,
  startDate: string,
  endDate: string,
) => {
  const url = `https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicosXML?Indicador=${indicator}&FechaInicio=${startDate}&FechaFinal=${endDate}&Nombre=Traxpal&SubNiveles=N&CorreoElectronico=dcolonv@gmail.com&Token=${bccrWsToken}`;

  const response = await fetch(url);
  const xmlData = await response.text();

  const result: any = await parseXml(xmlData);
  const xmlContent = result.string._;
  const parsedContent: any = await parseXml(xmlContent);

  return parsedContent.Datos_de_INGC011_CAT_INDICADORECONOMIC.INGC011_CAT_INDICADORECONOMIC.map(
    (item: any) => ({
      type: 'USD-CRC',
      date: item.DES_FECHA[0],
      value: parseFloat(item.NUM_VALOR[0]),
    }),
  );
};

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs

  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const currentDate = format(new Date(), 'dd/MM/yyyy');
  const startDate = currentDate;
  const endDate = currentDate;

  try {
    const buyRates = await getExchangeRates(317, startDate, endDate);
    const sellRates = await getExchangeRates(318, startDate, endDate);

    const exchangeRates = mergeExchangeRates(buyRates, sellRates);

    const supabase = createClient();

    // Store data in Supabase
    const { data, error } = await supabase
      .from('exchange_rates')
      .upsert(exchangeRates, {
        onConflict: 'type,date',
        ignoreDuplicates: false,
      });

    if (error) {
      console.log({ error });
      return new Response('Error upserting exchange rates:', {
        status: 500,
      });
    }

    return Response.json({
      message: 'Exchange rates updated successfully',
    });
  } catch (error) {
    return new Response('An error occurred', {
      status: 500,
    });
  }
}
