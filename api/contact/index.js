const { ConfidentialClientApplication } = require('@azure/msal-node');

const msalClient = new ConfidentialClientApplication({
  auth: {
    clientId: (process.env.MS_CLIENT_ID || '').trim(),
    authority: `https://login.microsoftonline.com/${(process.env.MS_TENANT_ID || '').trim()}`,
    clientSecret: (process.env.MS_CLIENT_SECRET || '').trim(),
  },
});

async function getGraphToken(){
  const result = await msalClient.acquireTokenByClientCredential({
    scopes: ['https://graph.microsoft.com/.default'],
  });
  return result.accessToken;
}

module.exports = async function (context, req) {
  const body = req.body || {};
  const { name, company, email, phone, companySize, message, origen, pagina, website } = body;

  if (website) {
    context.res = { status: 200, body: { ok: true } };
    return;
  }

  const clip = (v, n) => String(v == null ? '' : v).slice(0, n);

  if (!name || !company || !email || !message) {
    context.res = { status: 400, body: { error: 'Faltan campos requeridos.' } };
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    context.res = { status: 400, body: { error: 'Correo inválido.' } };
    return;
  }

  try {
    const senderMailbox = (process.env.MS_SENDER_MAILBOX || '').trim();
    const toAddress = (process.env.CONTACT_TO_ADDRESS || '').trim();

    if (!senderMailbox || !toAddress) {
      throw new Error('Faltan variables de entorno de Microsoft Graph.');
    }

    const accessToken = await getGraphToken();

    const bodyText = [
      `Nuevo lead desde cbits.mx`,
      ``,
      `Nombre: ${clip(name, 120)}`,
      `Empresa: ${clip(company, 120)}`,
      `Correo: ${clip(email, 160)}`,
      `Teléfono: ${clip(phone, 40) || 'No proporcionado'}`,
      `Tamaño de empresa: ${companySize || 'No especificado'}`,
      `Origen: ${clip(origen, 40) || 'Directo'}`,
      `Página: ${clip(pagina, 100) || 'No indicada'}`,
      ``,
      `Mensaje:`,
      clip(message, 3000),
    ].join('\n');

    const graphRes = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(senderMailbox)}/sendMail`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {
            subject: `Nuevo contacto desde el sitio — ${clip(company, 80)}`,
            body: { contentType: 'Text', content: bodyText },
            toRecipients: [{ emailAddress: { address: toAddress } }],
            replyTo: [{ emailAddress: { address: clip(email, 160), name: clip(name, 120) } }],
          },
          saveToSentItems: true,
        }),
      }
    );

    if (!graphRes.ok) {
      const errText = await graphRes.text();
      throw new Error(`Graph API error: ${graphRes.status} ${errText}`);
    }

    context.res = { status: 200, body: { ok: true } };
  } catch (err) {
    context.log.error('Error enviando correo:', err.message);
    context.res = { status: 500, body: { error: 'No se pudo enviar el mensaje.', detail: String(err.message).slice(0, 400) } };
  }
};
