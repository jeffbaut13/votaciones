import { getDb } from "../../lib/firebase-admin.js";

const COLLECTION = "usuarios";

export const userRepository = {
  async findByEmailOrPhone(email, telefono) {
    const db = getDb();

    const byEmail = await db
      .collection(COLLECTION)
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!byEmail.empty) {
      const doc = byEmail.docs[0];
      return { id: doc.id, ...doc.data() };
    }

    const byPhone = await db
      .collection(COLLECTION)
      .where("telefono", "==", telefono)
      .limit(1)
      .get();

    if (!byPhone.empty) {
      const doc = byPhone.docs[0];
      return { id: doc.id, ...doc.data() };
    }

    return null;
  },

  async findById(userId) {
    const db = getDb();
    const doc = await db.collection(COLLECTION).doc(userId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async create({ nombre, email, telefono, otpHash, otpExpiresAt }) {
    const db = getDb();
    const docRef = await db.collection(COLLECTION).add({
      nombre,
      email,
      telefono,
      estado: "pendiente",
      otpHash,
      otpExpiresAt,
      createdAt: new Date(),
    });
    return { id: docRef.id };
  },

  async updateOtp(userId, { otpHash, otpExpiresAt }) {
    const db = getDb();
    await db.collection(COLLECTION).doc(userId).update({ otpHash, otpExpiresAt });
  },

  async updateEstado(userId, estado, modalidad = null) {
    const db = getDb();
    const data = { estado };
    if (modalidad) data.modalidad = modalidad;
    await db.collection(COLLECTION).doc(userId).update(data);
  },
};
