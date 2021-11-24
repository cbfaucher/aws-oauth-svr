
class User {
    private _userId: String;
    private _name: String;
    private _password: String;

    constructor(userId: String, name: String, password: String) {
        this._userId = userId;
        this._name = name;
        this._password = password
    }

    get userId(): String {
        return this._userId;
    }

    get name(): String {
        return this._name;
    }

    get password(): String {
        return this._password;
    }
}