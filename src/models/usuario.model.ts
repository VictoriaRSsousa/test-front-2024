export default class Usuario {
    constructor(
        public id?: string,
        public nome?: string,
        public matricula?: string,
        public idade?: number,
        public cargo?: string,
        public tipo?: number, // 1 para admin, 2 para comum

    ){}
  }

