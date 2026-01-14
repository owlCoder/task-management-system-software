export type GoogleAuthResponseType = {
    success: boolean,
    message: string,
    google: {
        sub: string,
        email: string,
        name?: string,
        picture?: string,
    }
}