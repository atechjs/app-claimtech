import dayjs from "dayjs";

const LS_KEY = "claimot-user";

class AuthService {
  logout() {
    localStorage.removeItem(LS_KEY);
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem(LS_KEY));
  }

  getCurrentUserRole() {
    return this.getCurrentUser() ? this.getCurrentUser().ruolo : "";
  }

  getCurrentJwtToken() {
    return this.getCurrentUser() ? this.getCurrentUser().token : "";
  }

  utenteNonLoggato() {
    const userInfo = this.getCurrentUser();
    /*
    //Ottengo timestamp di creazione
    //Ci aggiungo 8 ore e verifico che sia prima del current timestamp
    //se qaggiungendoci 8 ore siamo a prima di adesso vuol dire che è scaduto
    const currentTimestamp = dayjs();
    if (
      userInfo === null ||
      userInfo === undefined ||
      userInfo.timestamp === null ||
      userInfo.timestamp === undefined
    )
      return true;
    const userInfoTimestamp = dayjs(userInfo.timestamp);
    const calculatedTimestamp = userInfoTimestamp.add(8, "hour");
    return calculatedTimestamp.isBefore(currentTimestamp);
    */
    return userInfo === undefined || userInfo === null;
  }

  saveInfo(infoLogin) {
    const currentTimestamp = dayjs();
    infoLogin = { ...infoLogin, timestamp: currentTimestamp };
    localStorage.setItem(LS_KEY, JSON.stringify(infoLogin));
  }
}
var authServ = new AuthService();
export default authServ;
