// Libraries
import { AxiosInstance } from "axios";

// Domain
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { IGatewayAuthService } from "../../Domain/services/auth/IGatewayAuthService";
import { LoginUserDTO } from "../../Domain/DTOs/auth/LoginUserDTO";
import { AuthResponseType } from "../../Domain/types/auth/AuthResponse";
import { BrowserDataDTO } from "../../Domain/DTOs/auth/BrowserDataDTO";
import { OTPVerificationDTO } from "../../Domain/DTOs/auth/OTPVerificationDTO";
import { GoogleLoginDataDTO } from "../../Domain/DTOs/auth/GoogleLoginDataDTO";
import { GoogleAuthResponseType } from "../../Domain/types/auth/GoogleAuthResponseType";
import { Result } from "../../Domain/types/common/Result";

// Constants
import { AUTH_ROUTES } from "../../Constants/routes/auth/AuthRoutes";
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { SERVICES } from "../../Constants/services/Services";
import { API_ENDPOINTS } from "../../Constants/services/APIEndpoints";

// Infrastructure
import { makeAPICall } from "../../Infrastructure/axios/APIHelpers";
import { createAxiosClient } from "../../Infrastructure/axios/client/AxiosClientFactory";

/**
 * Makes API requests to the Auth Microservice.
 */
export class GatewayAuthService implements IGatewayAuthService {
    private readonly authClient: AxiosInstance;

    constructor(private readonly errorHandlingService: IErrorHandlingService) {
        this.authClient = createAxiosClient(API_ENDPOINTS.AUTH);
    }

    /**
     * Sends the login data to the auth microservice.
     * @param {LoginUserDTO} data - login data.
     * @returns {Promise<Result<AuthResponseType>>} - A promise that resolves to a Result object containing the auth response data.
     * - On success result contains the {@link AuthResponseType}
     * - On failure result contains an error message and status code.
     */
    async login(data: LoginUserDTO): Promise<Result<AuthResponseType>> {
        return await makeAPICall<AuthResponseType, LoginUserDTO>(this.authClient, this.errorHandlingService, {
            serviceName: SERVICES.AUTH,
            method: HTTP_METHODS.POST,
            url: AUTH_ROUTES.LOGIN,
            data: data
        });
    }

    /**
     * Sends the siem login data to the auth microservice.
     * @param {LoginUserDTO} data - login data.
     * @returns {Promise<Result<AuthResponseType>>} - A promise that resolves to a Result object containing the auth response data.
     * - On success result contains the {@link AuthResponseType}
     * - On failure result contains an error message and status code.
     */
    async siemLogin(data: LoginUserDTO): Promise<Result<AuthResponseType>> {
        return await makeAPICall<AuthResponseType, LoginUserDTO>(this.authClient, this.errorHandlingService, {
            serviceName: SERVICES.AUTH,
            method: HTTP_METHODS.POST,
            url: AUTH_ROUTES.SIEM_LOGIN,
            data: data
        });
    }

    /**
     * Requests the otp data verification from the auth microservice.
     * @param {OTPVerificationDTO} data - data needed for the verification of the otp.
     * @returns {Promise<Result<AuthResponseType>>} - A promise that resolves to a Result object containing the auth response data.
     * - On success result contains the {@link AuthResponseType}
     * - On failure result contains an error message and status code.
     */
    async verifyOtp(data: OTPVerificationDTO): Promise<Result<AuthResponseType>> {
        return await makeAPICall<AuthResponseType, OTPVerificationDTO>(this.authClient, this.errorHandlingService, {
            serviceName: SERVICES.AUTH,
            method: HTTP_METHODS.POST,
            url: AUTH_ROUTES.VERIFY_OTP,
            data: data
        });
    }

    /**
     * Sends the request for the new otp code to the auth microservice.
     * @param {BrowserDataDTO} data - browser data.
     * @returns {Promise<Result<AuthResponseType>>} - A promise that resolves to a Result object containing the auth response data.
     * - On success result contains the {@link AuthResponseType}
     * - On failure result contains an error message and status code.
     */
    async resendOtp(data: BrowserDataDTO): Promise<Result<AuthResponseType>> {
        return await makeAPICall<AuthResponseType, BrowserDataDTO>(this.authClient, this.errorHandlingService, {
            serviceName: SERVICES.AUTH,
            method: HTTP_METHODS.POST,
            url: AUTH_ROUTES.RESEND_OTP,
            data: data
        });
    }

    /**
     * Sends the google oauth login data to the auth microservice.
     * @param {GoogleLoginDataDTO} data - google oauth data.
     * @returns {Promise<Result<GoogleAuthResponseType>>} - A promise that resolves to a Result object containing the google oauth response data.
     * - On success result contains the {@link AuthResponseType}
     * - On failure result contains an error message and status code.
     */
    async googleAuth(data: GoogleLoginDataDTO): Promise<Result<GoogleAuthResponseType>> {
        return await makeAPICall<GoogleAuthResponseType, GoogleLoginDataDTO>(this.authClient, this.errorHandlingService, {
            serviceName: SERVICES.AUTH,
            method: HTTP_METHODS.POST,
            url: AUTH_ROUTES.GOOGLE_OAUTH,
            data: data
        });
    }

}