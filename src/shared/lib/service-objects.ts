export class ServiceError {
    type: ServiceErrorTypes;
    message:string;
    details?:string;

    constructor(type: ServiceErrorTypes, message: string, details?: string) {
        this.type = type;
        this.message = message;
        this.details = details;
    }
}
export class ServiceResult<T> {
    data?: T;
    error?: ServiceError;
    constructor(data?:T, error?:ServiceError) {
        this.data = data;
        this.error = error;
    }
    
    get success() {
        return !this.error
    };

    static success() {
        return new ServiceResult<void>();
    }

    static ok<T>(data:T) {
        return new ServiceResult<T>(data);
    }

    static fromJson<T>(jsonString:string) {
        return new ServiceResult<T>(JSON.parse(jsonString));
    }

    static fail<T>(error: ServiceError) {
        return new ServiceResult<T>(undefined, error);
    }
}