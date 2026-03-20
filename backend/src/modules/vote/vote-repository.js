const state = {
  otpSessions: new Map(),
  votes: [],
};

function maskPhone(phone) {
  return phone.length < 4 ? phone : `${phone.slice(0, 3)}****${phone.slice(-2)}`;
}

export const voteRepository = {
  findVoteByPhone(phone) {
    return state.votes.find((vote) => vote.phone === phone) || null;
  },
  saveOtpSession(session) {
    state.otpSessions.set(session.requestId, session);
    return session;
  },
  findOtpSession(requestId) {
    return state.otpSessions.get(requestId) || null;
  },
  consumeOtpSession(requestId) {
    const session = state.otpSessions.get(requestId) || null;
    state.otpSessions.delete(requestId);
    return session;
  },
  saveVote(vote) {
    state.votes.push(vote);
    return vote;
  },
  getSummary() {
    return state.votes.reduce(
      (accumulator, vote) => ({
        ...accumulator,
        [vote.option]: accumulator[vote.option] + 1,
      }),
      { A: 0, B: 0 },
    );
  },
  getRecords() {
    return state.votes.map((vote) => ({
      id: vote.id,
      option: vote.option,
      createdAt: vote.createdAt,
      phoneMasked: maskPhone(vote.phone),
    }));
  },
};
