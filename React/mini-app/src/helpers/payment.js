import { openInvoice, invoice, init } from '@telegram-apps/sdk';


export const payment = async (token, product='miningAccess') => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/paystars`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify({ product }),
        }
      );
      const data = await response.json();

      init();
      if (invoice.isSupported() && !invoice.isOpened()) {
        const url = await openInvoice(data.invoiceLink, 'url');
        console.log(url);
      } else {
        alert("Subscription not supported");
        
      }
}
