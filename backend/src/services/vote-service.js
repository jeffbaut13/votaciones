import { userRepository } from "../modules/user/user-repository.js";
import { voteRepository } from "../modules/vote/vote-repository.js";

export const voteService = {
  async submitVote({ userId, candidato }) {
    if (!["A", "B"].includes(candidato)) {
      throw new Error("Opcion de voto invalida.");
    }

    const user = await userRepository.findById(userId);
    if (!user) throw new Error("Usuario no encontrado.");
    if (user.estado === "ya_voto") throw new Error("El usuario ya voto.");
    if (user.estado !== "habilitado") throw new Error("El usuario no esta habilitado para votar.");

    await voteRepository.create({ candidato, modalidad: "web" });
    await userRepository.updateEstado(userId, "ya_voto", "web");

    return { message: "Voto registrado exitosamente." };
  },

  async markPresencial({ userId }) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("Usuario no encontrado.");
    if (user.estado === "ya_voto") throw new Error("El usuario ya voto.");
    if (user.estado !== "habilitado") throw new Error("El usuario no esta habilitado para votar.");

    // El voto fisico es secreto: se registra la participacion sin candidato
    await voteRepository.create({ candidato: null, modalidad: "presencial" });
    await userRepository.updateEstado(userId, "ya_voto", "presencial");

    return { message: "Participacion presencial registrada." };
  },

  async getSummary() {
    return voteRepository.getSummary();
  },
};
