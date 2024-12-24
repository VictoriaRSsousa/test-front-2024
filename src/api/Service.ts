import axios from "axios";
import Usuario from "../models/usuario.model";
import { AuthRequest } from "../models/authenticate.model";



export class Service {

  static async getUsuarios(usuario:Usuario): Promise<any> {
    try {
      const response = await axios.get(`http://localhost:3000/usuarios`,{params:usuario});

      return response.data; 
    } catch (error) {
      throw error; 
    }
  }

  static async createUsuario(usuario: Usuario ): Promise<any> {
    try{
      const response =await axios.post('http://localhost:3000/usuarios',usuario)
      return response.data
    }catch(error){
      throw error; 
    }
   
  }

  static async updateUsuario(dados: Usuario): Promise<any> {
    try{
      const response = await axios.put(`http://localhost:3000/usuarios/${dados.id}`, dados)
      return response.data

    }catch(error){
      throw error; 
    }
  }

  static async deleteUsuario(id: string): Promise<any> {
    try{
      const response = await axios.delete(`http://localhost:3000/usuarios/${id}`)
      return response.data

    }catch(error){
      throw error; 
    }
  }
  static async login(dados:AuthRequest): Promise<any>{
    try{
      const response = await axios.get('http://localhost:3000/login',{params:dados})
      return response.data

    }catch(error){
      throw error; 
    }
  }
  static async getUsuarioByRegistration(registration:string){
    try{
      const response = await axios.get('http://localhost:3000/usuarios',{params:{matricula:registration}})
      return response.data
      
    }catch(error){
      throw error; 
    }
  }
}
