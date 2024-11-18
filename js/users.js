import { database, ref, get } from './firebase.js';

// Função que busca os usuários no Firebase
export function fetchUsers() {
    const dbRef = ref(database, 'usuarios/');
    return get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val();  // Retorna os dados dos usuários
        } else {
            console.log("Nenhum dado encontrado");
            return {};
        }
    }).catch((error) => {
        console.error("Erro ao buscar os dados:", error);
        return {};
    });
}
