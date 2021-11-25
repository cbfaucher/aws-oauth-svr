
class User {
    private _userId: string;
    private _fullName: string;
    private _password: string;

    constructor(userId: string, name: string, password: string) {
        this._userId = userId;
        this._fullName = name;
        this._password = password
    }

    get userId(): string {
        return this._userId;
    }

    get fullName(): string {
        return this._fullName;
    }

    get password(): string {
        return this._password;
    }
}