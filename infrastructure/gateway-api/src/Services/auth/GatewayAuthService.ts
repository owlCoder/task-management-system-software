// Libraries
import axios, { AxiosInstance } from "axios";

// Domain
import { IErrorHandlingService } from "../../Domain/services/common/IErrorHandlingService";
import { IGatewayAuthService } from "../../Domain/services/auth/IGatewayAuthService";
import { LoginUserDTO } from "../../Domain/DTOs/auth/LoginUserDTO";
import { RegistrationUserDTO } from "../../Domain/DTOs/auth/RegistrationUserDTO";
import { AuthResponseType } from "../../Domain/types/auth/AuthResponse";
import { BrowserDataDTO } from "../../Domain/DTOs/auth/BrowserDataDTO";
import { OTPVerificationDTO } from "../../Domain/DTOs/auth/OTPVerificationDTO";
import { Result } from "../../Domain/types/common/Result";

// Constants
import { AUTH_ROUTES } from "../../Constants/routes/auth/AuthRoutes";
import { HTTP_METHODS } from "../../Constants/common/HttpMethods";
import { SERVICES } from "../../Constants/services/Services";
import { API_ENDPOINTS } from "../../Constants/services/APIEndpoints";

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
        try {
            const response = await this.authClient.post<AuthResponseType>(AUTH_ROUTES.LOGIN, data);

            return {
                success: true,
                data: {
                    success: response.data.success,
                    otp_required: response.data.otp_required,
                    session: response.data.otp_required ? response.data.session : undefined,
                    token: !response.data.otp_required ? response.data.token : undefined,
                    message: response.data.message
                }
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.AUTH, HTTP_METHODS.POST, AUTH_ROUTES.LOGIN);
        }
    }
    
    /**
     * Sends the registration data to the auth microservice.
     * @param {RegistrationUserDTO} data - registration data.
     * @returns {Promise<Result<AuthResponseType>>} - A promise that resolves to a Result object containing the auth response data.
     * - On success:
     *     - `success`: A boolean indicating if the login attempt was successful.
     *     - `token`: A JWT token if no OTP is required, used for authentication in future requests.
     *     - `message`: A message returned by the microservice with details about the login result.
     * - On failure:
     *     - The result contains an error message and status code.
     */
    async register(data: RegistrationUserDTO): Promise<Result<AuthResponseType>> {
        try {
            const response = await this.authClient.post<AuthResponseType>(AUTH_ROUTES.REGISTER, data);

            return { 
                success: true, 
                data: {
                    success: response.data.success,
                    token: response.data.token,
                    message: response.data.message
                }
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.AUTH, HTTP_METHODS.POST, AUTH_ROUTES.REGISTER);
        }
    }

    /**
     * Sends the otp data to the auth microservice.
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
        try {
            const response = await this.authClient.post<AuthResponseType>(AUTH_ROUTES.VERIFY_OTP, otpData);

            return {
                success: true,
                data: {
                    success: response.data.success,
                    token: response.data.token,
                    message: response.data.message
                }
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.AUTH, HTTP_METHODS.POST, AUTH_ROUTES.VERIFY_OTP);
        }
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
        try {
            const response = await this.authClient.post<AuthResponseType>(AUTH_ROUTES.RESEND_OTP, browserData);

            return {
                success: true,
                data: {
                    success: response.data.success,
                    otp_required: response.data.otp_required,
                    session: response.data.otp_required ? response.data.session : undefined,
                    token: !response.data.otp_required ? response.data.token : undefined,
                    message: response.data.message
                }
            };
        } catch(error) {
            return this.errorHandlingService.handle(error, SERVICES.AUTH, HTTP_METHODS.POST, AUTH_ROUTES.RESEND_OTP);
        }
    }

}