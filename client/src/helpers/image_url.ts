const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL;

/**
 * Vraća pun URL za sliku projekta PREKO GATEWAY-a
 * @param imageFilename - Ime fajla slike (npr. "abc123-uuid.jpg")
 * @returns Pun URL do slike ili prazan string ako nema slike
 */
export function getProjectImageUrl(imageFilename: string | null | undefined): string {
    if (!imageFilename) {
        return '';
    }
    
    // Ako je već pun URL ili base64, vrati kao što jeste (backward compatibility)
    if (imageFilename.startsWith('http') || imageFilename.startsWith('data:')) {
        return imageFilename;
    }
    
    // Konstruiši URL preko Gateway-a
    // GATEWAY_URL je "http://localhost:4000/api/v1"
    // Treba nam "http://localhost:4000/api/v1/uploads/filename.jpg"
    return `${GATEWAY_URL}/uploads/${imageFilename}`;
}