import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    try {
        const info = await transporter.sendMail({
            from: `"Triton Web" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log("📧 Email sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        return null;
    }
}

export async function sendWelcomeEmail(to: string, name: string) {
    const subject = "¡Bienvenido a Triton Web!";
    const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #00bcd4;">¡Hola, ${name}!</h1>
      <p>Gracias por unirte a la comunidad <strong>Triton</strong>.</p>
      <p>Estamos emocionados de tenerte con nosotros. Ahora podrás inscribirte a eventos, comprar productos y gestionar tu perfil de deportista.</p>
      <br/>
      <p>Atentamente,</p>
      <p><strong>El equipo de Triton</strong></p>
    </div>
  `;
    return sendEmail({ to, subject, html });
}

export async function sendEventRegistrationEmail(
    to: string,
    name: string,
    eventName: string,
    details: { distance?: string; category?: string; transactionId: string }
) {
    const subject = `Inscripción Confirmada: ${eventName}`;
    const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4caf50;">¡Inscripción Exitosa!</h1>
      <p>Hola <strong>${name}</strong>,</p>
      <p>Tu inscripción al evento <strong>${eventName}</strong> ha sido confirmada.</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Distancia:</strong> ${details.distance || "N/A"}</p>
        <p><strong>Categoría:</strong> ${details.category || "N/A"}</p>
        <p><strong>Referencia de pago:</strong> ${details.transactionId}</p>
      </div>
      <p>Prepárate para dar lo mejor de ti.</p>
      <br/>
      <p>Atentamente,</p>
      <p><strong>El equipo de Triton</strong></p>
    </div>
  `;
    return sendEmail({ to, subject, html });
}

export async function sendOrderConfirmationEmail(
    to: string,
    name: string,
    orderId: string,
    products: { name: string; qty: number; price: number }[]
) {
    const subject = `Confirmación de Compra #${orderId.slice(-6)}`;

    const productRows = products
        .map(
            (p) =>
                `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${p.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${p.qty}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${p.price.toLocaleString()}</td>
        </tr>`
        )
        .join("");

    const total = products.reduce((acc, p) => acc + p.price * p.qty, 0);

    const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #ff9800;">¡Gracias por tu compra!</h1>
      <p>Hola <strong>${name}</strong>,</p>
      <p>Tu pedido ha sido recibido y procesado exitosamente.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; text-align: left;">Producto</th>
            <th style="padding: 8px; text-align: left;">Cant.</th>
            <th style="padding: 8px; text-align: left;">Precio</th>
          </tr>
        </thead>
        <tbody>
          ${productRows}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
            <td style="padding: 8px; font-weight: bold;">$${total.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
      
      <p>Te avisaremos cuando tu pedido sea enviado.</p>
      <br/>
      <p>Atentamente,</p>
      <p><strong>El equipo de Triton</strong></p>
    </div>
  `;
    return sendEmail({ to, subject, html });
}
