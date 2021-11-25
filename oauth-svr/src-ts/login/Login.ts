
export class Login {
    private _userId: string;
    private _token: string;

    constructor(userId: string, token: string) {
        this._userId = userId;
        this._token = token;
    }

    get userId(): string {
        return this._userId;
    }

    get token(): string {
        return this._token;
    }
}