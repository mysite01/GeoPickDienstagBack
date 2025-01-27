import * as QRCode from "qrcode";

// Generiert einen QR-Code als Einladungscode
export async function generateQAcode(): Promise<{ qrCodeDataUrl: string, uniqueCode: string, shareUrl:string }> {
    
    try {
        const uniqueCode = generateUniqueCode(); // Eindeutiger Code
        const inviteUrl = `${process.env.CORS_ORIGIN}/ReadQACode/${uniqueCode}`; // Einladung-URL 

        const shareUrl = `${process.env.CORS_ORIGIN}/${uniqueCode}?feature=shared`;
        // QR-Code aus der URL generieren
        const qrCodeDataUrl = await QRCode.toDataURL(inviteUrl);
        //console.log("QR-Code erfolgreich generiert:", inviteUrl);
        return {qrCodeDataUrl, uniqueCode, shareUrl};

    } catch (error) {
        console.error("Fehler beim Generieren des QR-Codes:", error);
        throw new Error("Fehler beim Generieren des QR-Codes");
    }
}


export function generateUniqueCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codeInvite = '';
    for (let i = 0; i < 6; i++) {
        codeInvite += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return codeInvite;
}
