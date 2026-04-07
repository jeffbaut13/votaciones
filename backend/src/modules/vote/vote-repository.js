import { getDb } from "../../lib/firebase-admin.js";

const COLLECTION = "votos";

export const voteRepository = {
  async create({ candidato, modalidad }) {
    const db = getDb();
    await db.collection(COLLECTION).add({
      candidato: candidato ?? null,
      modalidad,
      createdAt: new Date(),
    });
  },

  async getSummary() {
    const db = getDb();
    const snapshot = await db.collection(COLLECTION).get();

    const result = { web: { A: 0, B: 0 }, presencial: 0, total: 0 };

    snapshot.forEach((doc) => {
      const { candidato, modalidad } = doc.data();
      result.total++;

      if (modalidad === "presencial") {
        result.presencial++;
      } else if (modalidad === "web") {
        if (candidato === "A" || candidato === "B") {
          result.web[candidato]++;
        }
      }
    });

    result.web.total = result.web.A + result.web.B;
    return result;
  },
};
