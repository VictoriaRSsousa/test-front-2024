export class AuthRequest {
    constructor(
        public senha?: string,
        public usuario?: string
    ) {}
}

export class AuthResponse { 
    constructor(
        public usuario?: string,
        public id?: string,
        public tipo?: number,
        public senha?: string
    ) {} 
}

export enum Tipo {
    Admin="Admin", Comum="Comum"
}