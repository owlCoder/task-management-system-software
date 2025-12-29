// Libraries
import axios, { AxiosInstance } from "axios";

// Domain
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { IGatewayAuthService } from "../../Domain/services/auth/IGatewayAuthService";
import { LoginUserDTO } from "../../Domain/DTOs/auth/LoginUserDTO";
import { AuthResponseType } from "../../Domain/types/auth/AuthResponse";
import { BrowserDataDTO } from "../../Domain/DTOs/auth/BrowserDataDTO";
import { OTPVerificationDTO } from "../../Domain/DTOs/auth/OTPVerificationDTO";
import { Result } from "../../Domain/types/common/Result";

// Constants
import { AUTH_ROUTES } from "../../Constants/routes/auth/AuthRoutes";
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { SERVICES } from "../../Constants/services/Services";
import { API_ENDPOINTS } from "../../Constants/services/APIEndpoints";

// Infrastructure
import { makeAPICall } from "../../Infrastructure/axios/APIHelpers";

/**
 * Makes API requests to the Auth Microservice.
 */
export class GatewayAuthService implements IGatewayAuthService {
    private readonly authClient: AxiosInstance;

    constructor(private readonly errorHandlingService: IErrorHandlingService) {
        this.authClient = axios.create({
            baseURL: API_ENDPOINTS.AUTH,
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
        });
    }

    /**
     * Sends the login data to the auth microservice.
     * @param {LoginUserDTO} data - login data.
     * @returns {Promise<Result<AuthResponseType>>} - A promise that resolves to a Result object containing the auth response data.
     * - On success:
     *     - `success`: A boolean indicating if the login attempt was successful.
     *     - `otp_required`: A boolean indicating if OTP is required for further authentication.
     *     - `session`: A session object if OTP is required, used for continuing the login process.
     *     - `token`: A JWT token if no OTP is required, used for authentication in future requests.
     *     - `message`: A message returned by the microservice with details about the login result.
     * - On failure:
     *     - The result contains an error message and status code.
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
     * Requests the otp data verification from the auth microservice.
     * @param {OTPVerificationDTO} otpData - otp data.
     * @returns {Promise<Result<AuthResponseType>>} - A promise that resolves to a Result object containing the auth response data.
     * - On success:
     *     - `success`: A boolean indicating if the login attempt was successful.
     *     - `token`: A JWT token if no OTP is required, used for authentication in future requests.
     *     - `message`: A message returned by the microservice with details about the login result.
     * - On failure:
     *     - The result contains an error message and status code.
     */
    async verifyOtp(otpData: OTPVerificationDTO): Promise<Result<AuthResponseType>> {
        return await makeAPICall<AuthResponseType, OTPVerificationDTO>(this.authClient, this.errorHandlingService, {
            serviceName: SERVICES.AUTH,
            method: HTTP_METHODS.POST,
            url: AUTH_ROUTES.VERIFY_OTP,
            data: otpData
        });
    }

    /**
     * Sends the request for the new otp code to the auth microservice.
     * @param {BrowserDataDTO} browserData - browser data.
     * @returns {Promise<Result<AuthResponseType>>} - A promise that resolves to a Result object containing the auth response data.
     * - On success:
     *     - `success`: A boolean indicating if the login attempt was successful.
     *     - `otp_required`: A boolean indicating if OTP is required for further authentication.
     *     - `session`: A session object if OTP is required, used for continuing the login process.
     *     - `token`: A JWT token if no OTP is required, used for authentication in future requests.
     *     - `message`: A message returned by the microservice with details about the login result.
     * - On failure:
     *     - The result contains an error message and status code.
     */
    async resendOtp(browserData: BrowserDataDTO): Promise<Result<AuthResponseType>> {
        return await makeAPICall<AuthResponseType, BrowserDataDTO>(this.authClient, this.errorHandlingService, {
            serviceName: SERVICES.AUTH,
            method: HTTP_METHODS.POST,
            url: AUTH_ROUTES.RESEND_OTP,
            data: browserData
        });
    }

}