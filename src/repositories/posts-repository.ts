import { PostModel } from "../models/post-model";
import { ContentModel } from "../models/content-model";
import fs from "fs/promises";

let posts: PostModel[] = [];

const initializePosts = async () => {
    const database = await fs.readFile("./src/data/posts.json", "utf-8");
    posts = JSON.parse(database);
};

// Call initializePosts at module startup
initializePosts();

// const database: PostModel[] = [
//    {
//         id: 1,
//         title: "Bem-vindos à disciplina!",
//         content: "Olá alunos, sejam bem-vindos ao nosso curso. Estou animado para começarmos juntos.",
//         author: "Prof. Ana",
//         subject: "Matemática"
//     },
//     {
//         id: 2,
//         title: "Material de apoio",
//         content: "Disponibilizei o material de apoio na plataforma. Qualquer dúvida, estou à disposição.",
//         author: "Prof. Carlos",
//         subject: "História"
//     },
//     {
//         id: 3,
//         title: "Aviso sobre prova",
//         content: "A prova será realizada na próxima semana. Revisem os conteúdos das últimas aulas.",
//         author: "Prof. Beatriz",
//         subject: "Geografia"
//     },
//     {
//         id: 4,
//         title: "Dica de estudo",
//         content: "Recomendo que assistam ao vídeo complementar sobre o tema da aula de hoje.",
//         author: "Prof. Daniel",
//         subject: "Física"
//     },
//     {
//         id: 5,
//         title: "Feedback das atividades",
//         content: "Parabéns pelo empenho nas atividades! Continuem participando.",
//         author: "Prof. Fernanda",
//         subject: "Química"
//     }
// ]

export const findAllPosts = async (): Promise<PostModel[]> => {
    return posts;    
}

export const findPostById = async (id: number): Promise<PostModel | undefined> => {
    const post = posts.find(post => post.id === id);
    return post;
}
    
export const createPost = async (postData: PostModel) => {
   posts.push(postData);
}

export const deleteOnePost = async (idPost: number) =>{
    const index = posts.findIndex(p => p.id === idPost)
    if(index !== -1){
        posts.splice(index, 1)
        return true
    }
    return false

}

export const findAndModifyPost = async (idPost: number, content:ContentModel) => {
    const postIndex = posts.findIndex(p => p.id === idPost)

    if(postIndex !== -1){
        posts[postIndex].id,
        posts[postIndex].title = content.title,
        posts[postIndex].content = content.content,
        posts[postIndex].author,
        posts[postIndex].subject; // Assuming subject is updated with title for simplicity
        
    }

    return posts[postIndex];
}