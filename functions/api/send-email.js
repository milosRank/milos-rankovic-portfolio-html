export async function onRequestPost({ request, env }) {
    try {
        const { name, email, phone, message } = await request.json();

        if (!name || !email || !message) {
            return new Response(
                JSON.stringify({ success: false, error: "Sva polja su obavezna." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const resendResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "Portfolio <noreply@sajtpomeri.com>",
                to: ["mrankovic310@gmail.com"],
                reply_to: email,
                subject: `Nova poruka od ${name}`,
                html: `
                    <h2>Nova poruka sa portfolio sajta</h2>
                    <p><strong>Ime:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Telefon:</strong> ${phone || "Nije naveden"}</p>
                    <p><strong>Poruka:</strong></p>
                    <p>${message.replace(/\n/g, "<br>")}</p>
                `,
            }),
        });

        const result = await resendResponse.json();

        if (!resendResponse.ok) {
            return new Response(
                JSON.stringify({ success: false, error: result.message || "Greška pri slanju." }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, id: result.id }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: "Server greška." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
