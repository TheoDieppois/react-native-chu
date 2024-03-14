import { supabase } from "../supabase/supabase";
import { loginStore } from "../../store/loginStore";

export const LoginService = {
  // méthode qui récupère les infos associés à un challenge et renvoi un objet qui les contient.
  getChallengeDataByUserId: async function (chuUserId) {
    try {
      // On récup la primary key associé à l'ID du user.
      const userInfos = await this.getUserId(chuUserId);

      //Si l'identifiant du user n'existe pas.
      if (userInfos.length === 0) {
        return false;
      }

      const userId = userInfos[0].id;

      let { data: challengeInfos, challengeError } = await supabase
        .from("user_challenge")
        .select("*, user(*), challenge(*)")
        .eq("user_id", userId);

      return challengeInfos;
    } catch (challengeError) {
      console.log("An error occured " + challengeError);
    }
  },
  getUserId: async function (chuUserId) {
    try {
      let { data: userInfos, userError } = await supabase
        .from("user")
        .select("*")
        .eq("chu_id", chuUserId);

      return userInfos;
    } catch (userError) {
      console.log("An error occured " + userError);
    }
  },
  getUserIdByPk: async function (pkId) {
    try {
      let { data: userInfos, userError } = await supabase
        .from("user")
        .select("*")
        .eq("id", pkId);

      return userInfos;
    } catch (userError) {
      console.log("An error occured " + userError);
    }
  },
  // méthode qui récupère l'unique Challenge Actif.
  getActiveChallenge: async function () {
    try {
      let { data: activeChallenge, error } = await supabase
        .from("challenge")
        .select("*")
        .eq("is_active", true);

      return activeChallenge;
    } catch (error) {
      console.log("An error occured " + error);
    }
  },
  getIfUserAlreadyLoggedOnce: async function (pkId) {
    try {
      const userInfos = await this.getUserIdByPk(pkId);

      return userInfos[0].already_logged_once;
    } catch (challengeError) {
      console.log("An error occured");
    }
  },
  updateUserAlreadyLoggedOnce: async function (pkId) {
    try {
      const { error } = await supabase
        .from("user")
        .update({ already_logged_once: true })
        .eq("id", pkId);
    } catch (error) {
      console.log("An error occured" + error);
    }
  },
};
