/**
 * EngiQuiz - Daily Challenge Helper
 */

const DailyChallenge = {
  getTodayDateString() {
    return new Date().toISOString().split("T")[0];
  },

  isCompletedToday() {
    if (typeof Storage === "undefined") return false;
    const daily = Storage.getDailyState();
    return daily && daily.completed && daily.date === this.getTodayDateString();
  },

  getTodayScore() {
    if (typeof Storage === "undefined") return null;
    const daily = Storage.getDailyState();
    return daily.completed ? `${daily.score}/${daily.total}` : null;
  }
};

if (typeof window !== "undefined") {
  window.DailyChallenge = DailyChallenge;
}
