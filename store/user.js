class User {
  scoreMax = 0;

  setScore(score) {
    this.scoreMax = score;
  }

  get getUser() {
    return {
      scoreMax: this.scoreMax,
    }
  }
}
const userStore = new User();

export { userStore }