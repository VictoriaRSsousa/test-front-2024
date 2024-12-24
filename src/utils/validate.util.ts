import Usuario from "../models/usuario.model"; 

export function validateFields(user: Usuario): boolean { 
  if (!user.nome || user.nome.trim() === "") {
    return false;  
  }

  if (!user.matricula || user.matricula.trim() === "") {
    return false;  
  }

  if (!user.idade || user.idade < 18 || user.idade > 60) {
    return false;  
  }

  if (!user.cargo || user.cargo.trim() === "") {
    return false;  
  }

  if (user.tipo !== 1 && user.tipo !== 2) {
    return false;  
  }

  return true;
}
